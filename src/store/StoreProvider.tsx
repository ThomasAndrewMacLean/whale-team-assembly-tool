"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "@/store/store";
import { loadTeamState } from "@/store/teamPersistence";
import { loadMembers } from "@/store/teamSlice";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  // Load persisted team after mount so server and client initial renders match.
  useEffect(() => {
    const saved = loadTeamState();
    if (saved && saved.members.length > 0) {
      storeRef.current!.dispatch(loadMembers(saved.members));
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
