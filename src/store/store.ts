import { configureStore } from "@reduxjs/toolkit";
import type { Middleware } from "@reduxjs/toolkit";
import characterReducer from "./characterSlice";
import teamReducer from "./teamSlice";
import { loadTeamState, saveTeamState } from "./teamPersistence";

const teamPersistenceMiddleware: Middleware =
  (storeAPI) => (next) => (action) => {
    const result = next(action);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    saveTeamState((storeAPI.getState() as any).team);
    return result;
  };

const preloadedTeam = loadTeamState();

export const store = configureStore({
  reducer: {
    characters: characterReducer,
    team: teamReducer,
  },
  preloadedState: preloadedTeam ? { team: preloadedTeam } : undefined,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(teamPersistenceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
