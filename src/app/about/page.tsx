"use client";

export default function AboutPage() {
  return (
    <main
      className="p-4 max-w-3xl mx-auto prose prose-lg"
      style={{ color: "white" }}
    >
      <h1
        className="text-3xl font-bold mb-4"
        style={{ color: "var(--brand-gold)" }}
      >
        About JirehFaith
      </h1>

      <p style={{ color: "white" }}>
        At Jireh Faith, we believe that when life speaks — in joy, in sorrow, in
        fear, or in gratitude — the most powerful response comes from God’s Word.
      </p>

      <p style={{ color: "white" }}>
        Rooted in the promise of Jehovah Jireh — “The Lord will provide”
        (Genesis 22:14) — JirehFaith is a prayer companion designed to bring
        Scripture into your everyday circumstances. Whether you are seeking peace
        in moments of anxiety, strength in times of trial, or a voice of
        thanksgiving in seasons of blessing, JirehFaith helps guide your prayers
        through the living Word of God.
      </p>

      <h2
        className="text-2xl font-semibold mt-6"
        style={{ color: "var(--brand-gold)" }}
      >
        Our Mission
      </h2>
      <p style={{ color: "white" }}>
        To provide personalized, Scripture-based prayers that meet people where
        they are, offering comfort, encouragement, and hope — all while pointing
        back to the eternal faithfulness of God.
      </p>

      <h2
        className="text-2xl font-semibold mt-6"
        style={{ color: "var(--brand-gold)" }}
      >
        How It Works
      </h2>
      <ol className="list-decimal pl-6 space-y-2">
        <li>
          <strong style={{ color: "var(--brand-gold)" }}>Share Your Need:</strong>
          <span style={{ color: "white" }}> Select or describe your circumstance.</span>
        </li>
        <li>
          <strong style={{ color: "var(--brand-gold)" }}>Scripture Speaks:</strong>
          <span style={{ color: "white" }}> JirehFaith finds Bible passages that directly reflect your situation.</span>
        </li>
        <li>
          <strong style={{ color: "var(--brand-gold)" }}>Prayer is Formed:</strong>
          <span style={{ color: "white" }}> A heartfelt prayer is generated, rooted in the Word, shaped to inspire faith and trust in God’s provision.</span>
        </li>
      </ol>

      <p style={{ color: "white" }}>
        Every prayer includes a relevant Bible verse, so you not only receive
        encouragement but also deepen your walk with God through His Word.
      </p>

      <h2
        className="text-2xl font-semibold mt-6"
        style={{ color: "var(--brand-gold)" }}
      >
        What Makes JirehFaith Unique
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong style={{ color: "var(--brand-gold)" }}>Scripture First:</strong>
          <span style={{ color: "white" }}> Every prayer is anchored in the Bible.</span>
        </li>
        <li>
          <strong style={{ color: "var(--brand-gold)" }}>Emotionally Attuned:</strong>
          <span style={{ color: "white" }}> Through the Default Human Logic Layer (DHLL), prayers are shaped with sensitivity to real human emotions.</span>
        </li>
        <li>
          <strong style={{ color: "var(--brand-gold)" }}>Multi-Language:</strong>
          <span style={{ color: "white" }}> Available in English, French, Spanish, and Portuguese.</span>
        </li>
        <li>
          <strong style={{ color: "var(--brand-gold)" }}>Accessible for All:</strong>
          <span style={{ color: "white" }}> Free daily prayers, with subscriptions and donations helping sustain the mission.</span>
        </li>
      </ul>

      <h2
        className="text-2xl font-semibold mt-6"
        style={{ color: "var(--brand-gold)" }}
      >
        Our Vision
      </h2>
      <p style={{ color: "white" }}>
        We envision a world where no believer prays alone. With JirehFaith, every
        Christian can carry a source of Scripture-inspired prayer in their pocket
        — a reminder of God’s faithfulness, presence, and provision in every
        circumstance of life.
      </p>

      <h2
        className="text-2xl font-semibold mt-6"
        style={{ color: "var(--brand-gold)" }}
      >
        Our Ministry
      </h2>
      <p style={{ color: "white" }}>
        Please support our ministry through Donation or Subscription. Share the
        Scriptures with others!
      </p>

      <p className="mt-6 font-semibold" style={{ color: "white" }}>
        God’s Blessings be upon you always!
      </p>

      <div className="mt-8">
        <a
          href="/tech-info"
          className="inline-block rounded-lg border border-[var(--brand-gold)] px-4 py-2 text-[var(--brand-gold)] hover:bg-[var(--brand-gold)] hover:text-white transition"
        >
          Tech Info
        </a>
      </div>
    </main>
  );
}
