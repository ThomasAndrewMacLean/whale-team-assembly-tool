import { configureStore } from "@reduxjs/toolkit";
import teamReducer, { addMember, removeMember } from "@/store/teamSlice";
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

function makeStore() {
  return configureStore({ reducer: { team: teamReducer } });
}

describe("teamSlice", () => {
  describe("addMember", () => {
    it("adds a character to an empty team", () => {
      const store = makeStore();
      store.dispatch(addMember(makeChar(1)));
      expect(store.getState().team.members).toHaveLength(1);
      expect(store.getState().team.members[0].id).toBe(1);
    });

    it("does not add the same character twice (dedup by id)", () => {
      const store = makeStore();
      store.dispatch(addMember(makeChar(1)));
      store.dispatch(addMember(makeChar(1)));
      expect(store.getState().team.members).toHaveLength(1);
    });

    it("allows different characters with same name", () => {
      const store = makeStore();
      store.dispatch(addMember(makeChar(1, "Clone A")));
      store.dispatch(addMember(makeChar(2, "Clone A")));
      expect(store.getState().team.members).toHaveLength(2);
    });

    it("enforces MAX_TEAM_SIZE of 5", () => {
      const store = makeStore();
      for (let i = 1; i <= 6; i++) {
        store.dispatch(addMember(makeChar(i)));
      }
      expect(store.getState().team.members).toHaveLength(5);
    });

    it("6th member is silently dropped — team stays at 5", () => {
      const store = makeStore();
      for (let i = 1; i <= 6; i++) {
        store.dispatch(addMember(makeChar(i)));
      }
      const ids = store.getState().team.members.map((m) => m.id);
      expect(ids).not.toContain(6);
    });

    it("preserves insertion order", () => {
      const store = makeStore();
      store.dispatch(addMember(makeChar(3)));
      store.dispatch(addMember(makeChar(1)));
      store.dispatch(addMember(makeChar(2)));
      const ids = store.getState().team.members.map((m) => m.id);
      expect(ids).toEqual([3, 1, 2]);
    });

    it("can fill to exactly 5 members", () => {
      const store = makeStore();
      for (let i = 1; i <= 5; i++) {
        store.dispatch(addMember(makeChar(i)));
      }
      expect(store.getState().team.members).toHaveLength(5);
    });
  });

  describe("removeMember", () => {
    it("removes a member by id", () => {
      const store = makeStore();
      store.dispatch(addMember(makeChar(1)));
      store.dispatch(addMember(makeChar(2)));
      store.dispatch(removeMember(1));
      expect(store.getState().team.members).toHaveLength(1);
      expect(store.getState().team.members[0].id).toBe(2);
    });

    it("does nothing when id not found", () => {
      const store = makeStore();
      store.dispatch(addMember(makeChar(1)));
      store.dispatch(removeMember(999));
      expect(store.getState().team.members).toHaveLength(1);
    });

    it("removes from a full team, allowing a new member to be added", () => {
      const store = makeStore();
      for (let i = 1; i <= 5; i++) store.dispatch(addMember(makeChar(i)));
      store.dispatch(removeMember(1));
      store.dispatch(addMember(makeChar(6)));
      expect(store.getState().team.members).toHaveLength(5);
      expect(store.getState().team.members.some((m) => m.id === 6)).toBe(true);
    });

    it("can remove all members one by one", () => {
      const store = makeStore();
      for (let i = 1; i <= 3; i++) store.dispatch(addMember(makeChar(i)));
      for (let i = 1; i <= 3; i++) store.dispatch(removeMember(i));
      expect(store.getState().team.members).toHaveLength(0);
    });

    it("removing from empty team is a no-op", () => {
      const store = makeStore();
      expect(() => store.dispatch(removeMember(1))).not.toThrow();
      expect(store.getState().team.members).toHaveLength(0);
    });
  });

  describe("initial state", () => {
    it("starts with an empty team", () => {
      const store = makeStore();
      expect(store.getState().team.members).toEqual([]);
    });
  });
});
