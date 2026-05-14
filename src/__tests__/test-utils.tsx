/**
 * Shared test helpers: wraps components with MUI ThemeProvider,
 * Redux store, and DictionaryProvider.
 */
import React from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import DictionaryProvider from "@/components/DictionaryProvider";
import characterReducer from "@/store/characterSlice";
import teamReducer from "@/store/teamSlice";
import enDict from "@/i18n/dictionaries/en.json";
import type { Character } from "@/types";

const theme = createTheme({ palette: { mode: "dark" } });

export const baseCharacter: Character = {
  id: 1,
  name: "Luke Skywalker",
  gender: "male",
  wiki: "https://example.com",
  image: "/luke.jpg",
  species: "Human",
  eyeColor: "blue",
  skinColor: "fair",
  height: 172,
  mass: 77,
  homeworld: "Tatooine",
  born: -19,
  affiliations: ["Rebel Alliance", "Jedi Order"],
  formerAffiliations: [],
};

export const darkCharacter: Character = {
  ...baseCharacter,
  id: 2,
  name: "Darth Vader",
  affiliations: ["Galactic Empire"],
};

export function makeStore(preloadedTeam: Character[] = []) {
  return configureStore({
    reducer: { characters: characterReducer, team: teamReducer },
    preloadedState: {
      team: { members: preloadedTeam },
      characters: { characters: [] },
    },
  });
}

interface WrapperOptions extends RenderOptions {
  store?: ReturnType<typeof makeStore>;
}

export function renderWithProviders(
  ui: React.ReactElement,
  { store = makeStore(), ...renderOptions }: WrapperOptions = {},
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DictionaryProvider dict={enDict as never}>
            {children}
          </DictionaryProvider>
        </ThemeProvider>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
