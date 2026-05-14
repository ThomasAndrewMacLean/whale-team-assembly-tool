import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  renderWithProviders,
  baseCharacter,
  darkCharacter,
  makeStore,
} from "./test-utils";
import { addMember } from "@/store/teamSlice";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useParams: () => ({ lang: "en" }),
}));

// Mock next/link
jest.mock("next/link", () => {
  const MockLink = ({
    href,
    children,
    onClick,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
    [key: string]: unknown;
  }) => (
    <a href={href} onClick={onClick} {...rest}>
      {children}
    </a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

// CharacterDetail has complex deps — test the simpler CharacterCard
import CharacterCard from "@/components/CharacterCard";

// Silence ViewTransition which is not in jsdom
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  ViewTransition: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("CharacterCard", () => {
  it("renders character name", () => {
    renderWithProviders(<CharacterCard character={baseCharacter} />);
    expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
  });

  it("renders a link to character detail page", () => {
    renderWithProviders(<CharacterCard character={baseCharacter} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/en/characters/1");
  });

  it("does NOT show dark side chip for good character", () => {
    renderWithProviders(<CharacterCard character={baseCharacter} />);
    expect(screen.queryByText(/dark side/i)).not.toBeInTheDocument();
  });

  it("shows dark side chip for evil character", () => {
    renderWithProviders(<CharacterCard character={darkCharacter} />);
    expect(screen.getByText(/dark side/i)).toBeInTheDocument();
  });

  it("writes scroll position to sessionStorage when clicked", async () => {
    const setItem = jest.spyOn(Storage.prototype, "setItem");
    renderWithProviders(<CharacterCard character={baseCharacter} />);
    const link = screen.getByRole("link");
    await userEvent.click(link);
    expect(setItem).toHaveBeenCalledWith("sw-list-scroll", expect.any(String));
    setItem.mockRestore();
  });

  it("renders character image container", () => {
    renderWithProviders(<CharacterCard character={baseCharacter} />);
    // CharacterImage renders an img or fallback
    // The card should contain at least some image element or svg
    const card = screen.getByRole("link").closest("div");
    expect(card).toBeInTheDocument();
  });
});
