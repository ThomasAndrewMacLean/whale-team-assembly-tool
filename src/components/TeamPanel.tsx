"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeMember } from "@/store/teamSlice";
import styles from "./TeamPanel.module.css";

export default function TeamPanel() {
  const [open, setOpen] = useState(false);
  const team = useAppSelector((state) => state.team.members);
  const dispatch = useAppDispatch();

  return (
    <>
      <button
        className={styles.toggle}
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle team panel"
      >
        🛸 Team ({team.length}/5)
      </button>

      {open && (
        <aside className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.title}>Your Team</h2>
            <Link
              href="/team"
              className={styles.teamPageLink}
              onClick={() => setOpen(false)}
            >
              View full page →
            </Link>
          </div>
          {team.length === 0 ? (
            <p className={styles.empty}>
              No members yet. Open a character&apos;s detail page to add them.
            </p>
          ) : (
            <ul className={styles.list}>
              {team.map((member) => (
                <li key={member.id} className={styles.member}>
                  <div className={styles.memberImage}>
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="40px"
                      style={{ objectFit: "cover", objectPosition: "top" }}
                    />
                  </div>
                  <span className={styles.memberName}>{member.name}</span>
                  <button
                    className={styles.removeBtn}
                    onClick={() => dispatch(removeMember(member.id))}
                    aria-label={`Remove ${member.name}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>
      )}
    </>
  );
}
