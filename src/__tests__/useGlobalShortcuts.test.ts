import { renderHook, act } from "@testing-library/react";
import useGlobalShortcuts from "@/hooks/useGlobalShortcuts";

function fireKey(key: string, options: KeyboardEventInit = {}) {
  act(() => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key, bubbles: true, ...options }),
    );
  });
}

describe("useGlobalShortcuts", () => {
  it("calls onToggleTeam when 't' is pressed (not in input)", () => {
    const onToggleTeam = jest.fn();
    renderHook(() => useGlobalShortcuts({ onToggleTeam }));
    fireKey("t");
    expect(onToggleTeam).toHaveBeenCalledTimes(1);
  });

  it("calls onToggleTeam when 'T' (uppercase) is pressed", () => {
    const onToggleTeam = jest.fn();
    renderHook(() => useGlobalShortcuts({ onToggleTeam }));
    fireKey("T");
    expect(onToggleTeam).toHaveBeenCalledTimes(1);
  });

  it("calls onShowShortcuts when '?' is pressed", () => {
    const onShowShortcuts = jest.fn();
    renderHook(() => useGlobalShortcuts({ onShowShortcuts }));
    fireKey("?");
    expect(onShowShortcuts).toHaveBeenCalledTimes(1);
  });

  it("dispatches app:focus-search when '/' is pressed", () => {
    const handler = jest.fn();
    window.addEventListener("app:focus-search", handler);
    renderHook(() => useGlobalShortcuts());
    fireKey("/");
    expect(handler).toHaveBeenCalledTimes(1);
    window.removeEventListener("app:focus-search", handler);
  });

  it("does NOT call onToggleTeam when 't' is pressed in an input", () => {
    const onToggleTeam = jest.fn();
    renderHook(() => useGlobalShortcuts({ onToggleTeam }));

    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    act(() => {
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "t", bubbles: true }),
      );
    });

    expect(onToggleTeam).not.toHaveBeenCalled();
    document.body.removeChild(input);
  });

  it("does NOT call onToggleTeam when 't' pressed with Ctrl", () => {
    const onToggleTeam = jest.fn();
    renderHook(() => useGlobalShortcuts({ onToggleTeam }));
    fireKey("t", { ctrlKey: true });
    expect(onToggleTeam).not.toHaveBeenCalled();
  });

  it("does NOT call onToggleTeam when 't' pressed with Meta", () => {
    const onToggleTeam = jest.fn();
    renderHook(() => useGlobalShortcuts({ onToggleTeam }));
    fireKey("t", { metaKey: true });
    expect(onToggleTeam).not.toHaveBeenCalled();
  });

  it("calls onShowShortcuts even when pressed inside an input (always active)", () => {
    const onShowShortcuts = jest.fn();
    renderHook(() => useGlobalShortcuts({ onShowShortcuts }));

    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    act(() => {
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "?", bubbles: true }),
      );
    });

    expect(onShowShortcuts).toHaveBeenCalledTimes(1);
    document.body.removeChild(input);
  });

  it("does NOT dispatch app:focus-search when '/' is pressed inside input", () => {
    const handler = jest.fn();
    window.addEventListener("app:focus-search", handler);
    renderHook(() => useGlobalShortcuts());

    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    act(() => {
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "/", bubbles: true }),
      );
    });

    expect(handler).not.toHaveBeenCalled();
    window.removeEventListener("app:focus-search", handler);
    document.body.removeChild(input);
  });

  it("cleans up event listener on unmount", () => {
    const onToggleTeam = jest.fn();
    const { unmount } = renderHook(() => useGlobalShortcuts({ onToggleTeam }));
    unmount();
    fireKey("t");
    expect(onToggleTeam).not.toHaveBeenCalled();
  });

  it("works with no options (does not throw)", () => {
    expect(() => {
      const { unmount } = renderHook(() => useGlobalShortcuts());
      fireKey("t");
      fireKey("?");
      fireKey("/");
      unmount();
    }).not.toThrow();
  });

  it("does not fire '/' shortcut with Ctrl modifier", () => {
    const handler = jest.fn();
    window.addEventListener("app:focus-search", handler);
    renderHook(() => useGlobalShortcuts());
    fireKey("/", { ctrlKey: true });
    expect(handler).not.toHaveBeenCalled();
    window.removeEventListener("app:focus-search", handler);
  });

  it("ignores keypresses from contentEditable elements", () => {
    const onToggleTeam = jest.fn();
    renderHook(() => useGlobalShortcuts({ onToggleTeam }));

    const div = document.createElement("div");
    document.body.appendChild(div);
    div.setAttribute("contenteditable", "true");
    // jsdom doesn't fully compute isContentEditable from the attribute; set explicitly
    Object.defineProperty(div, "isContentEditable", {
      value: true,
      configurable: true,
    });
    div.focus();

    act(() => {
      div.dispatchEvent(
        new KeyboardEvent("keydown", { key: "t", bubbles: true }),
      );
    });

    expect(onToggleTeam).not.toHaveBeenCalled();
    document.body.removeChild(div);
  });
});
