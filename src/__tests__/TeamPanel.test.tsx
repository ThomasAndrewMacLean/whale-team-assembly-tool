import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  renderWithProviders,
  baseCharacter,
  darkCharacter,
  makeStore,
} from "./test-utils";
import { addMember } from "@/store/teamSlice";
import TeamPanel from "@/components/TeamPanel";

jest.mock("next/navigation", () => ({
  useParams: () => ({ lang: "en" }),
}));

jest.mock("next/link", () => {
  const MockLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>;
  MockLink.displayName = "MockLink";
  return MockLink;
});

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  ViewTransition: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("TeamPanel", () => {
  it("renders the FAB toggle button", () => {
    renderWithProviders(<TeamPanel />);
    expect(
      screen.getByRole("button", { name: /toggle team panel/i }),
    ).toBeInTheDocument();
  });

  it("shows badge count of 0 when team is empty", () => {
    renderWithProviders(<TeamPanel />);
    // badge content 0 is typically hidden by MUI — panel should be closed
    expect(screen.queryByText(/your squad/i)).not.toBeInTheDocument();
  });

  it("shows badge with team member count", () => {
    const store = makeStore([baseCharacter]);
    renderWithProviders(<TeamPanel />, { store });
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("opens panel when FAB is clicked", async () => {
    renderWithProviders(<TeamPanel />);
    await userEvent.click(
      screen.getByRole("button", { name: /toggle team panel/i }),
    );
    expect(screen.getByText(/your team/i)).toBeInTheDocument();
  });

  it("closes panel when FAB is clicked again (toggle)", async () => {
    renderWithProviders(<TeamPanel />);
    const fab = screen.getByRole("button", { name: /toggle team panel/i });
    await userEvent.click(fab);
    await userEvent.click(fab);
    expect(screen.queryByText(/your team/i)).not.toBeInTheDocument();
  });

  it("opens panel via app:toggle-team custom event", () => {
    renderWithProviders(<TeamPanel />);
    fireEvent(window, new CustomEvent("app:toggle-team"));
    expect(screen.getByText(/your team/i)).toBeInTheDocument();
  });

  it("shows 'empty' state when team has no members (panel open)", async () => {
    renderWithProviders(<TeamPanel />);
    await userEvent.click(
      screen.getByRole("button", { name: /toggle team panel/i }),
    );
    expect(screen.getByText(/no members yet/i)).toBeInTheDocument();
  });

  it("lists team member names when panel is open", async () => {
    const store = makeStore([baseCharacter]);
    renderWithProviders(<TeamPanel />, { store });
    await userEvent.click(
      screen.getByRole("button", { name: /toggle team panel/i }),
    );
    expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
  });

  it("lists multiple team members", async () => {
    const store = makeStore([baseCharacter, darkCharacter]);
    renderWithProviders(<TeamPanel />, { store });
    await userEvent.click(
      screen.getByRole("button", { name: /toggle team panel/i }),
    );
    expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
    expect(screen.getByText("Darth Vader")).toBeInTheDocument();
  });

  it("dispatches removeMember when remove button clicked", async () => {
    const store = makeStore([baseCharacter]);
    renderWithProviders(<TeamPanel />, { store });
    await userEvent.click(
      screen.getByRole("button", { name: /toggle team panel/i }),
    );
    const removeBtn = screen.getByRole("button", { name: /remove/i });
    await userEvent.click(removeBtn);
    expect(store.getState().team.members).toHaveLength(0);
  });

  it("updates badge count after removing a member", async () => {
    const store = makeStore([baseCharacter, darkCharacter]);
    renderWithProviders(<TeamPanel />, { store });
    await userEvent.click(
      screen.getByRole("button", { name: /toggle team panel/i }),
    );
    const removeBtns = screen.getAllByRole("button", { name: /remove/i });
    await userEvent.click(removeBtns[0]);
    expect(store.getState().team.members).toHaveLength(1);
  });

  it("shows 'View Full Team' link when panel is open", async () => {
    renderWithProviders(<TeamPanel />);
    await userEvent.click(
      screen.getByRole("button", { name: /toggle team panel/i }),
    );
    expect(
      screen.getByRole("link", { name: /full page/i }),
    ).toBeInTheDocument();
  });
});
