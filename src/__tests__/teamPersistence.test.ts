import { configureStore } from "@reduxjs/toolkit";
import teamReducer, { addMember, removeMember, loadMembers } from "@/store/teamSlice";
import {
  loadTeamState,
  saveTeamState,
  isValidTeamState,
} from "@/store/teamPersistence";
import type { Middleware } from "@reduxjs/toolkit";
import type { Character } from "@/types";

const base: Character = {
  id: 1,
  name: "Luke Skywalker",
  gender: "male",
  wiki: "",
  image: "",
  species: "Human",
  eyeColor: "blue",
  skinColor: "fair",
  affiliations: [],
  formerAffiliations: [],
};

function makeChar(id: number, name = `Character ${id}`): Character {
  return { ...base, id, name };
}

const STORAGE_KEY = "sw-team";

beforeEach(() => {
  localStorage.clear();
});

// ─── isValidTeamState ─────────────────────────────────────────────────────────

describe("isValidTeamState", () => {
  it("returns true for a valid empty members array", () => {
    expect(isValidTeamState({ members: [] })).toBe(true);
  });

  it("returns true for valid members with id+name", () => {
    expect(isValidTeamState({ members: [makeChar(1)] })).toBe(true);
  });

  it("returns false for null", () => {
    expect(isValidTeamState(null)).toBe(false);
  });

  it("returns false for a plain string", () => {
    expect(isValidTeamState("bad")).toBe(false);
  });

  it("returns false when members is not an array", () => {
    expect(isValidTeamState({ members: "oops" })).toBe(false);
  });

  it("returns false when a member has no id", () => {
    expect(isValidTeamState({ members: [{ name: "Luke" }] })).toBe(false);
  });

  it("returns false when a member has a non-numeric id", () => {
    expect(isValidTeamState({ members: [{ id: "1", name: "Luke" }] })).toBe(
      false,
    );
  });

  it("returns false when a member has no name", () => {
    expect(isValidTeamState({ members: [{ id: 1 }] })).toBe(false);
  });

  it("returns false when members property is missing entirely", () => {
    expect(isValidTeamState({})).toBe(false);
  });
});

// ─── loadTeamState ────────────────────────────────────────────────────────────

describe("loadTeamState", () => {
  it("returns undefined when localStorage is empty", () => {
    expect(loadTeamState()).toBeUndefined();
  });

  it("returns the parsed state for valid stored data", () => {
    const state = { members: [makeChar(1), makeChar(2)] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    expect(loadTeamState()).toEqual(state);
  });

  it("returns undefined for corrupted JSON", () => {
    localStorage.setItem(STORAGE_KEY, "{this is not json}}");
    expect(loadTeamState()).toBeUndefined();
  });

  it("returns undefined for valid JSON but wrong shape (root is array)", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([1, 2, 3]));
    expect(loadTeamState()).toBeUndefined();
  });

  it("returns undefined when members contains corrupt entries", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ members: [{ id: "bad", name: 42 }] }),
    );
    expect(loadTeamState()).toBeUndefined();
  });

  it("returns undefined for an empty string in localStorage", () => {
    localStorage.setItem(STORAGE_KEY, "");
    // JSON.parse("") throws — should not propagate
    expect(loadTeamState()).toBeUndefined();
  });

  it("returns undefined when stored value is null JSON", () => {
    localStorage.setItem(STORAGE_KEY, "null");
    expect(loadTeamState()).toBeUndefined();
  });

  it("ignores extra unknown fields on members (graceful forward-compat)", () => {
    const state = { members: [{ ...makeChar(1), unknownField: "x" }] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    const loaded = loadTeamState();
    expect(loaded?.members[0].id).toBe(1);
  });
});

// ─── saveTeamState ────────────────────────────────────────────────────────────

describe("saveTeamState", () => {
  it("writes the state to localStorage as JSON", () => {
    const state = { members: [makeChar(3)] };
    saveTeamState(state);
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!)).toEqual(state);
  });

  it("overwrites a previous value", () => {
    saveTeamState({ members: [makeChar(1)] });
    saveTeamState({ members: [makeChar(2)] });
    const loaded = loadTeamState();
    expect(loaded?.members).toHaveLength(1);
    expect(loaded?.members[0].id).toBe(2);
  });

  it("does not throw when localStorage.setItem throws (quota exceeded)", () => {
    const original = localStorage.setItem.bind(localStorage);
    jest.spyOn(Storage.prototype, "setItem").mockImplementationOnce(() => {
      throw new DOMException("QuotaExceededError");
    });
    expect(() => saveTeamState({ members: [] })).not.toThrow();
    jest.restoreAllMocks();
  });
});

// ─── middleware integration ───────────────────────────────────────────────────

describe("team persistence middleware integration", () => {
  function makeStoreWithPersistence() {
    const persistMiddleware: Middleware = (api) => (next) => (action) => {
      const result = next(action);
      saveTeamState(api.getState().team);
      return result;
    };
    return configureStore({
      reducer: { team: teamReducer },
      middleware: (getDefault) => getDefault().concat(persistMiddleware),
    });
  }

  it("saves to localStorage after addMember dispatch", () => {
    const store = makeStoreWithPersistence();
    store.dispatch(addMember(makeChar(7)));
    const saved = loadTeamState();
    expect(saved?.members).toHaveLength(1);
    expect(saved?.members[0].id).toBe(7);
  });

  it("saves updated state after removeMember dispatch", () => {
    const store = makeStoreWithPersistence();
    store.dispatch(addMember(makeChar(7)));
    store.dispatch(addMember(makeChar(8)));
    store.dispatch(removeMember(7));
    const saved = loadTeamState();
    expect(saved?.members).toHaveLength(1);
    expect(saved?.members[0].id).toBe(8);
  });

  it("loads persisted state via loadMembers dispatch (StoreProvider pattern)", () => {
    // Simulate page refresh: data is in localStorage, StoreProvider dispatches loadMembers after mount
    saveTeamState({ members: [makeChar(99)] });
    const freshStore = configureStore({ reducer: { team: teamReducer } });
    const saved = loadTeamState();
    if (saved && saved.members.length > 0) {
      freshStore.dispatch(loadMembers(saved.members));
    }
    expect(freshStore.getState().team.members[0].id).toBe(99);
  });

  it("starts with empty team when localStorage is corrupt on hydration", () => {
    localStorage.setItem(STORAGE_KEY, "CORRUPTED");
    const freshStore = configureStore({ reducer: { team: teamReducer } });
    const saved = loadTeamState(); // returns undefined
    if (saved && saved.members.length > 0) {
      freshStore.dispatch(loadMembers(saved.members));
    }
    expect(freshStore.getState().team.members).toHaveLength(0);
  });
});
