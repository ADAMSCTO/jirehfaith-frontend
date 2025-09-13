// src/lib/text/tone.ts
export type ToneVariant = "gentle" | "bold" | "comfort" | "hope";

type Pack = {
  openers: string[];
  verbs: string[];
  closers: string[];
};

const TONES: Record<ToneVariant, Pack> = {
  gentle: {
    openers: [
      "Father, we come before You",
      "Lord, we draw near to You",
      "God of mercy, we look to You"
    ],
    verbs: [
      "guide",
      "comfort",
      "steady",
      "strengthen",
      "surround",
      "renew",
      "lift"
    ],
    closers: [
      "in Jesus’ name. Amen.",
      "through Christ our Lord. Amen.",
      "we trust Your care. Amen."
    ]
  },
  comfort: {
    openers: [
      "Father of compassion",
      "God of all comfort",
      "Shepherd of our souls"
    ],
    verbs: [
      "heal",
      "hold",
      "carry",
      "console",
      "reassure",
      "restore"
    ],
    closers: [
      "for You are near to the brokenhearted. Amen.",
      "let Your peace guard our hearts. Amen.",
      "let Your presence be our rest. Amen."
    ]
  },
  bold: {
    openers: [
      "Mighty God",
      "Lord of Hosts",
      "Faithful King"
    ],
    verbs: [
      "empower",
      "embolden",
      "fortify",
      "establish",
      "secure",
      "advance"
    ],
    closers: [
      "we stand firm in Your strength. Amen.",
      "we will not fear, for You are with us. Amen.",
      "make us courageous and steadfast. Amen."
    ]
  },
  hope: {
    openers: [
      "God of hope",
      "Father who renews",
      "Lord who makes all things new"
    ],
    verbs: [
      "awaken",
      "brighten",
      "revive",
      "refresh",
      "spark",
      "encourage"
    ],
    closers: [
      "fill us with joy and peace in believing. Amen.",
      "let hope rise within us by Your Spirit. Amen.",
      "lead us forward with holy expectation. Amen."
    ]
  }
};

export function getTonePack(t: ToneVariant | undefined): Pack {
  const key = (t || "gentle") as ToneVariant;
  return TONES[key];
}
