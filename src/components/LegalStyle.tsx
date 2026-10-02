"use client";

type LegalStyleProps = {
  mode?: "dark" | "light";
  accent?: string;
};

export default function LegalStyle({
  mode = "dark",
  accent = "#df900b",
}: LegalStyleProps) {
  const isDark = mode === "dark";

  const styles = `
    .legal-container {
      background: ${isDark ? "#0b1020" : "#ffffff"};
      color: ${isDark ? "#e5e7eb" : "#1f2937"};
      line-height: 1.7;
      font-family: sans-serif;
      font-size: 16px;
    }

    .legal-container h1 {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid ${accent}40;
      color: ${accent};
    }

    .legal-container h2 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-top: 2.5rem;
      margin-bottom: 1rem;
      color: ${accent};
    }

    .legal-container h3 {
      font-size: 1.1rem;
      font-weight: 700;
      margin-top: 1.5rem;
      margin-bottom: 0.8rem;
      color: ${isDark ? "#d8b4fe" : "#6d28d9"};
    }

    .legal-container p {
      margin-bottom: 1.2rem;
      text-align: justify;
    }

    .legal-container ul {
      margin-bottom: 1.2rem;
      padding-left: 1.5rem;
      list-style-type: disc;
    }

    .legal-container li {
      margin-bottom: 0.65rem;
    }

    .legal-container table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0 2rem 0;
      overflow: hidden;
      border-radius: 12px;
      border: 1px solid ${accent}33;
      background: ${isDark ? "#11172a" : "#f8f5ff"};
    }

    .legal-container thead {
      background-color: ${accent}22;
    }

    .legal-container th {
      padding: 14px 16px;
      text-align: left;
      font-weight: 700;
      color: ${isDark ? "#f5f3ff" : "#4c1d95"};
      border: 1px solid ${accent}33;
    }

    .legal-container td {
      padding: 14px 16px;
      border: 1px solid ${accent}33;
      vertical-align: top;
    }

    .legal-container tbody tr:nth-child(even) {
      background-color: ${isDark ? "#0f1526" : "#faf7ff"};
    }

    .legal-container tbody tr:hover {
      background-color: ${accent}14;
      transition: background-color 0.2s ease;
    }

    .legal-container a {
      color: ${accent};
      text-decoration: underline;
      word-break: break-word;
    }

    .legal-container strong {
      font-weight: 700;
    }

    .legal-container hr {
      border: none;
      border-top: 1px solid ${accent}33;
      margin: 2rem 0;
    }

    @media (max-width: 768px) {
      .legal-container {
        font-size: 15px;
      }

      .legal-container h1 {
        font-size: 2rem;
      }

      .legal-container h2 {
        font-size: 1.3rem;
      }

      .legal-container table {
        display: block;
        overflow-x: auto;
        white-space: nowrap;
      }

      .legal-container th,
      .legal-container td {
        min-width: 180px;
      }
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: styles }} />;
}