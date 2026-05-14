"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { useAppDispatch } from "@/store/hooks";
import { setCharacters } from "@/store/characterSlice";
import CharacterCard from "./CharacterCard";
import SearchBar from "./SearchBar";
import { fuzzyFilter } from "@/lib/fuzzy";
import type { Character } from "@/types";

const PAGE_SIZE_OPTIONS = [12, 24, 48] as const;
type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

interface Props {
  characters: Character[];
}

export default function CharacterGrid({ characters }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [pageSize, setPageSize] = useState<PageSize>(12);

  // Query is kept in the URL (?q=...) so back navigation restores it
  const query = searchParams.get("q") ?? "";

  // Read page from URL (?page=N), default 1
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const pushPage = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newPage === 1) {
        params.delete("page");
      } else {
        params.set("page", String(newPage));
      }
      const qs = params.toString();
      const newUrl = qs ? `${pathname}?${qs}` : pathname;
      // Remember the list position so the detail page back-button can restore it
      sessionStorage.setItem("sw-list-return", newUrl);
      router.replace(newUrl, { scroll: false });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [router, pathname, searchParams],
  );

  // Also persist on first render (covers page load without any navigation)
  useEffect(() => {
    const qs = searchParams.toString();
    sessionStorage.setItem(
      "sw-list-return",
      qs ? `${pathname}?${qs}` : pathname,
    );
  }, [pathname, searchParams]);

  // Restore scroll position when returning from a detail page
  useEffect(() => {
    const saved = sessionStorage.getItem("sw-list-scroll");
    if (saved) {
      sessionStorage.removeItem("sw-list-scroll");
      requestAnimationFrame(() =>
        window.scrollTo({ top: Number(saved), behavior: "instant" }),
      );
    }
  }, []);

  useEffect(() => {
    dispatch(setCharacters(characters));
  }, [dispatch, characters]);

  const filtered = useMemo(
    () => fuzzyFilter(characters, query, (c) => c.name),
    [characters, query],
  );

  const pageCount = Math.ceil(filtered.length / pageSize);
  const safePage = Math.min(page, pageCount || 1);
  const pageItems = filtered.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  function handleQueryChange(newQuery: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (newQuery) {
      params.set("q", newQuery);
    } else {
      params.delete("q");
    }
    params.delete("page");
    const qs = params.toString();
    const newUrl = qs ? `${pathname}?${qs}` : pathname;
    sessionStorage.setItem("sw-list-return", newUrl);
    router.replace(newUrl, { scroll: false });
  }

  function handlePageSizeChange(newSize: PageSize) {
    setPageSize(newSize);
    pushPage(1);
  }

  return (
    <>
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <SearchBar value={query} onChange={handleQueryChange} />
        </Box>
        <FormControl size="small" sx={{ minWidth: 90, flexShrink: 0 }}>
          <Select
            value={pageSize}
            onChange={(e) =>
              handlePageSizeChange(Number(e.target.value) as PageSize)
            }
            aria-label="Items per page"
            displayEmpty
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <MenuItem key={n} value={n}>
                {n} / page
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {filtered.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
          No characters found for &ldquo;{query}&rdquo;
        </Typography>
      ) : (
        <>
          <Grid
            container
            spacing={2}
            component="ul"
            aria-label="Character list"
            sx={{ listStyle: "none", p: 0, m: 0 }}
          >
            {pageItems.map((character, index) => (
              <Grid
                key={character.id}
                size={{ xs: 6, sm: 4, md: 3, lg: 2 }}
                component="li"
              >
                <CharacterCard character={character} priority={index < 6} />
              </Grid>
            ))}
          </Grid>

          {pageCount > 1 && (
            <Box
              sx={{ display: "flex", justifyContent: "center", pt: 4, pb: 2 }}
            >
              <Pagination
                count={pageCount}
                page={safePage}
                onChange={(_, value) => pushPage(value)}
                color="primary"
                shape="rounded"
                siblingCount={1}
              />
            </Box>
          )}
        </>
      )}
    </>
  );
}
