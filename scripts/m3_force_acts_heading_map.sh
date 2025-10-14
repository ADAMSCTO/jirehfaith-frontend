#!/usr/bin/env bash
set -euo pipefail
cd ~/jirehfaith-frontend

# -- Ensure ES/FR/PT acts keys match your exact wording (idempotent) --
sed -i 's/"acts\.adoration": *"[^"]*"/"acts.adoration": "Adoración"/' src/i18n/es.json
sed -i 's/"acts\.confession": *"[^"]*"/"acts.confession": "Confesión"/' src/i18n/es.json
sed -i 's/"acts\.thanksgiving": *"[^"]*"/"acts.thanksgiving": "Acción de gracias"/' src/i18n/es.json
sed -i 's/"acts\.supplication": *"[^"]*"/"acts.supplication": "Súplica"/' src/i18n/es.json
sed -i 's/"acts\.yielding": *"[^"]*"/"acts.yielding": "Entregarse"/' src/i18n/es.json

sed -i 's/"acts\.adoration": *"[^"]*"/"acts.adoration": "Adoration"/' src/i18n/fr.json
sed -i 's/"acts\.confession": *"[^"]*"/"acts.confession": "Confession"/' src/i18n/fr.json
sed -i 's/"acts\.thanksgiving": *"[^"]*"/"acts.thanksgiving": "action de graces"/' src/i18n/fr.json
sed -i 's/"acts\.supplication": *"[^"]*"/"acts.supplication": "supplication"/' src/i18n/fr.json
sed -i 's/"acts\.yielding": *"[^"]*"/"acts.yielding": "se rendre"/' src/i18n/fr.json

sed -i 's/"acts\.adoration": *"[^"]*"/"acts.adoration": "Adorar"/' src/i18n/pt.json
sed -i 's/"acts\.confession": *"[^"]*"/"acts.confession": "Confissão"/' src/i18n/pt.json
sed -i 's/"acts\.thanksgiving": *"[^"]*"/"acts.thanksgiving": "Ação de Graças"/' src/i18n/pt.json
sed -i 's/"acts\.supplication": *"[^"]*"/"acts.supplication": "Súplica"/' src/i18n/pt.json
sed -i 's/"acts\.yielding": *"[^"]*"/"acts.yielding": "render-se"/' src/i18n/pt.json

# -- Harden sectionLabel(): if raw English slips through, force-map to localized key --
perl -0777 -pe 's|function sectionLabel\(title: string, lang: Lang\): string \{[\s\S]*?\}\s*|function sectionLabel(title: string, lang: Lang): string {\n  const raw = String(title || \"\");\n  // Normalize (strip accents, punctuation, collapse spaces, lower)\n  const nfd = (raw as any).normalize ? raw.normalize(\"NFD\") : raw;\n  const lower = nfd.toLowerCase().replace(/[\\u0300-\\u036f]/g, \"\");\n  const cleaned = lower.replace(/[:\\.,;!\\?()\\[\\]{}]/g, \"\").replace(/\\s*\\/\\s*/g, \"/\").trim();\n  const key = cleaned.replace(/[\\/\\-\\s]+/g, \"_\");\n\n  // Primary map from normalized key\n  const map: Record<string, string> = {\n    adoration: \"acts.adoration\",\n    confession: \"acts.confession\",\n    thanksgiving: \"acts.thanksgiving\",\n    supplication: \"acts.supplication\",\n    yielding: \"acts.yielding\",\n    yielding_listening: \"acts.yielding_listening\",\n  };\n\n  let tkey = map[key];\n\n  // Secondary fallback: raw English labels commonly sent by backend (with/without colon)\n  if (!tkey) {\n    const rawTrim = raw.replace(/[:\\s]+$/, \"\").trim();\n    const rawLc = rawTrim.toLowerCase();\n    if (rawLc === \"adoration\") tkey = \"acts.adoration\";\n    else if (rawLc === \"confession\") tkey = \"acts.confession\";\n    else if (rawLc === \"thanksgiving\") tkey = \"acts.thanksgiving\";\n    else if (rawLc === \"supplication\") tkey = \"acts.supplication\";\n    else if (rawLc === \"yielding\") tkey = \"acts.yielding\";\n  }\n\n  if (tkey) {\n    const val = t(tkey, lang);\n    if (val !== tkey) return val;\n  }\n  // fallback: prettify whatever we received\n  return raw ? raw.replace(/[_-]+/g, \" \").replace(/\\b\\w/g, (m) => m.toUpperCase()) : raw;\n}\n|s' -i src/app/page.tsx

# Ensure render & copy paths actually use sectionLabel()\nsed -i 's/{prettyTitle(String(s.title))}/{sectionLabel(String(s.title), lang)}/' src/app/page.tsx\nsed -i 's/`\\$\\{prettyTitle(String(s.title))\\}\\\\n\\$\\{s.content\\}`/`\\$\\{sectionLabel(String(s.title), lang)\\}\\\\n\\$\\{s.content\\}`/g' src/app/page.tsx\n\necho \"Hardened ACTS-Y heading mapping and ensured locale keys match your wording.\"\n```

3) run it, rebuild, dev
```bash
bash scripts/m3_force_acts_heading_map.sh
npm run build
npm run dev
