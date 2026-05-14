import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Character } from "@/types";

const MAX_TEAM_SIZE = 5;

interface TeamState {
  members: Character[];
}

const initialState: TeamState = {
  members: [],
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    addMember(state, action: PayloadAction<Character>) {
      if (
        state.members.length < MAX_TEAM_SIZE &&
        !state.members.some((m) => m.id === action.payload.id)
      ) {
        state.members.push(action.payload);
      }
    },
    removeMember(state, action: PayloadAction<number>) {
      state.members = state.members.filter((m) => m.id !== action.payload);
    },
    loadMembers(state, action: PayloadAction<Character[]>) {
      state.members = action.payload;
    },
  },
});

export const { addMember, removeMember, loadMembers } = teamSlice.actions;
export default teamSlice.reducer;
