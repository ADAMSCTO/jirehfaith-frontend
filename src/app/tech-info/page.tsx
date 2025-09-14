"use client";

export default function TechInfoPage() {
  return (
    <main
      className="p-4 max-w-3xl mx-auto prose prose-lg"
      style={{ color: "white" }}
    >
      <h1
        className="text-3xl font-bold mb-4"
        style={{ color: "var(--brand-gold)" }}
      >
        Technical Information
      </h1>
      <p>
        This page provides technical information and diagnostics about the
        JirehFaith application. These details are intended for developers and
        technical users.
      </p>

      <h2
        className="text-2xl font-semibold mt-6"
        style={{ color: "var(--brand-gold)" }}
      >
        Response Metrics
      </h2>
      <p>
        The application tracks how long each prayer composition request takes to
        process. Last response time and timestamp are stored locally in your
        browser.
      </p>

      <h2
        className="text-2xl font-semibold mt-6"
        style={{ color: "var(--brand-gold)" }}
      >
        System Info
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong style={{ color: "var(--brand-gold)" }}>Framework:</strong>{" "}
          Next.js (App Router)
        </li>
        <li>
          <strong style={{ color: "var(--brand-gold)" }}>Styling:</strong>{" "}
          Tailwind CSS + custom brand variables
        </li>
        <li>
          <strong style={{ color: "var(--brand-gold)" }}>
            State Management:
          </strong>{" "}
          React hooks with TanStack Query
        </li>
        <li>
          <strong style={{ color: "var(--brand-gold)" }}>Backend:</strong> DHLL
          API for context-aware prayer composition
        </li>
      </ul>

      <h2
        className="text-2xl font-semibold mt-6"
        style={{ color: "var(--brand-gold)" }}
      >
        Diagnostics
      </h2>
      <p>
        Future versions may display request/response logs and technical debugging
        panels here instead of the main prayer page.
      </p>
    </main>
  );
}
