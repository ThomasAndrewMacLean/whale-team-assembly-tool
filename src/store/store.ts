import { configureStore } from "@reduxjs/toolkit";
import type { Middleware } from "@reduxjs/toolkit";
import characterReducer from "./characterSlice";
import teamReducer from "./teamSlice";
import { saveTeamState } from "./teamPersistence";

const teamPersistenceMiddleware: Middleware =
  (storeAPI) => (next) => (action) => {
    const result = next(action);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    saveTeamState((storeAPI.getState() as any).team);
    return result;
  };

// Factory — called once per client app mount inside StoreProvider.
// Never called at module level so localStorage is never read on the server.
export function makeStore() {
  return configureStore({
    reducer: {
      characters: characterReducer,
      team: teamReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(teamPersistenceMiddleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
