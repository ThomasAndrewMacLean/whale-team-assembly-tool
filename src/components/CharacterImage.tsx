"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import type { ComponentProps } from "react";
import { generateCharacterPlaceholder } from "@/lib/characterPlaceholder";

type Props = Omit<ComponentProps<typeof Image>, "onError">;

export default function CharacterImage({ src, alt, style, ...props }: Props) {
  const [errored, setErrored] = useState(false);

  // Generate once per name — same name always produces the same SVG data URI
  const placeholder = useMemo(
    () => generateCharacterPlaceholder(alt as string),
    [alt]
  );

  if (errored) {
    // Use a plain img so Next.js Image optimisation doesn't interfere with the data URI
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={placeholder}
        alt={alt as string}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          ...style,
        }}
      />
    );
  }

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      style={style}
      onError={() => setErrored(true)}
    />
  );
}
