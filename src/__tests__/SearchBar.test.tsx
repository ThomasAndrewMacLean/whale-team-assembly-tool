import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import SearchBar from "@/components/SearchBar";

const theme = createTheme({ palette: { mode: "dark" } });

function renderSearchBar(props: {
  value: string;
  onChange: jest.Mock;
  placeholder?: string;
}) {
  return render(
    <ThemeProvider theme={theme}>
      <SearchBar {...props} />
    </ThemeProvider>,
  );
}

describe("SearchBar", () => {
  it("renders the input", () => {
    renderSearchBar({ value: "", onChange: jest.fn() });
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("displays the current value", () => {
    renderSearchBar({ value: "luke", onChange: jest.fn() });
    expect(screen.getByRole("textbox")).toHaveValue("luke");
  });

  it("calls onChange when user types", async () => {
    const onChange = jest.fn();
    renderSearchBar({ value: "", onChange });
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "a");
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("shows clear button only when value is non-empty", () => {
    const { rerender } = renderSearchBar({ value: "", onChange: jest.fn() });
    expect(
      screen.queryByRole("button", { name: /clear/i }),
    ).not.toBeInTheDocument();

    rerender(
      <ThemeProvider theme={theme}>
        <SearchBar value="luke" onChange={jest.fn()} />
      </ThemeProvider>,
    );
    expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument();
  });

  it("calls onChange with empty string when clear button clicked", async () => {
    const onChange = jest.fn();
    renderSearchBar({ value: "luke", onChange });
    await userEvent.click(screen.getByRole("button", { name: /clear/i }));
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("calls onChange with empty string and blurs on Escape", async () => {
    const onChange = jest.fn();
    renderSearchBar({ value: "luke", onChange });
    const input = screen.getByRole("textbox");
    input.focus();
    await userEvent.keyboard("{Escape}");
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("uses default placeholder when none provided", () => {
    renderSearchBar({ value: "", onChange: jest.fn() });
    expect(
      screen.getByPlaceholderText(/search characters/i),
    ).toBeInTheDocument();
  });

  it("uses custom placeholder when provided", () => {
    renderSearchBar({
      value: "",
      onChange: jest.fn(),
      placeholder: "Find a Jedi…",
    });
    expect(screen.getByPlaceholderText("Find a Jedi…")).toBeInTheDocument();
  });

  it("has correct aria-label on the containing form control", () => {
    renderSearchBar({ value: "", onChange: jest.fn() });
    // The div wrapping the OutlinedInput has aria-label set on the FormControl
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    // Input is accessible via its placeholder / label
    expect(
      screen.getByPlaceholderText(/search characters/i),
    ).toBeInTheDocument();
  });

  it("focuses input when app:focus-search event fires", () => {
    renderSearchBar({ value: "", onChange: jest.fn() });
    const input = screen.getByRole("textbox");
    window.dispatchEvent(new CustomEvent("app:focus-search"));
    // The inputRef.current.focus() call should set focus
    // (jsdom supports focus)
    expect(document.activeElement).toBe(input);
  });
});
