import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Character } from "@/types";

interface CharacterState {
  characters: Character[];
}

const initialState: CharacterState = {
  characters: [],
};

const characterSlice = createSlice({
  name: "characters",
  initialState,
  reducers: {
    setCharacters(state, action: PayloadAction<Character[]>) {
      state.characters = action.payload;
    },
  },
});

export const { setCharacters } = characterSlice.actions;
export default characterSlice.reducer;
