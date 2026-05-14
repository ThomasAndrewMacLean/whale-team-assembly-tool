import { configureStore } from "@reduxjs/toolkit";
import characterReducer, { setCharacters } from "@/store/characterSlice";
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

function makeStore() {
  return configureStore({ reducer: { characters: characterReducer } });
}

describe("characterSlice", () => {
  it("starts with an empty characters array", () => {
    const store = makeStore();
    expect(store.getState().characters.characters).toEqual([]);
  });

  it("sets characters from payload", () => {
    const store = makeStore();
    const chars = [base, { ...base, id: 2, name: "Leia Organa" }];
    store.dispatch(setCharacters(chars));
    expect(store.getState().characters.characters).toHaveLength(2);
  });

  it("replaces existing characters entirely on second dispatch", () => {
    const store = makeStore();
    store.dispatch(setCharacters([base]));
    store.dispatch(setCharacters([{ ...base, id: 99, name: "Yoda" }]));
    const state = store.getState().characters.characters;
    expect(state).toHaveLength(1);
    expect(state[0].name).toBe("Yoda");
  });

  it("accepts an empty array (clears characters)", () => {
    const store = makeStore();
    store.dispatch(setCharacters([base]));
    store.dispatch(setCharacters([]));
    expect(store.getState().characters.characters).toEqual([]);
  });
});
