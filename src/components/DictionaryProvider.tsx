"use client";

import { createContext, useContext } from "react";
import type { Dictionary } from "@/i18n/config";

const DictionaryContext = createContext<Dictionary | null>(null);

export function useDictionary(): Dictionary {
  const ctx = useContext(DictionaryContext);
  if (!ctx)
    throw new Error("useDictionary must be used within DictionaryProvider");
  return ctx;
}

export default function DictionaryProvider({
  dict,
  children,
}: {
  dict: Dictionary;
  children: React.ReactNode;
}) {
  return (
    <DictionaryContext.Provider value={dict}>
      {children}
    </DictionaryContext.Provider>
  );
}
