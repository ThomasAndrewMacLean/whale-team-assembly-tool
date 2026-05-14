import styles from "@/components/CharacterDetail.module.css";

export default function Loading() {
  return (
    <main className={styles.container}>
      <div
        style={{
          display: "inline-block",
          width: "120px",
          height: "16px",
          background: "#1f2937",
          borderRadius: "4px",
          marginBottom: "2rem",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <div className={styles.layout}>
        <div
          style={{
            aspectRatio: "3/4",
            background: "#1f2937",
            borderRadius: "16px",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[240, 160, 120, 180, 140].map((w, i) => (
            <div
              key={i}
              style={{
                height: i === 0 ? "2.5rem" : "1rem",
                width: `${w}px`,
                background: "#1f2937",
                borderRadius: "6px",
                animation: `pulse 1.5s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
