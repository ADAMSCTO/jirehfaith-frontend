#!/usr/bin/env bash
set -euo pipefail
cd ~/jirehfaith-frontend

# --- 1) Set EXACT ACTS-Y titles per your list ---

# FR
sed -i 's/"acts\.adoration": *"[^"]*"/"acts.adoration": "Adoration"/' src/i18n/fr.json
sed -i 's/"acts\.confession": *"[^"]*"/"acts.confession": "Confession"/' src/i18n/fr.json
sed -i 's/"acts\.thanksgiving": *"[^"]*"/"acts.thanksgiving": "action de graces"/' src/i18n/fr.json
sed -i 's/"acts\.supplication": *"[^"]*"/"acts.supplication": "supplication"/' src/i18n/fr.json
sed -i 's/"acts\.yielding": *"[^"]*"/"acts.yielding": "se rendre"/' src/i18n/fr.json

# ES
sed -i 's/"acts\.adoration": *"[^"]*"/"acts.adoration": "Adoración"/' src/i18n/es.json
sed -i 's/"acts\.confession": *"[^"]*"/"acts.confession": "Confesión"/' src/i18n/es.json
sed -i 's/"acts\.thanksgiving": *"[^"]*"/"acts.thanksgiving": "Acción de gracias"/' src/i18n/es.json
sed -i 's/"acts\.supplication": *"[^"]*"/"acts.supplication": "Súplica"/' src/i18n/es.json
sed -i 's/"acts\.yielding": *"[^"]*"/"acts.yielding": "Entregarse"/' src/i18n/es.json

# PT
sed -i 's/"acts\.adoration": *"[^"]*"/"acts.adoration": "Adorar"/' src/i18n/pt.json
sed -i 's/"acts\.confession": *"[^"]*"/"acts.confession": "Confissão"/' src/i18n/pt.json
sed -i 's/"acts\.thanksgiving": *"[^"]*"/"acts.thanksgiving": "Ação de Graças"/' src/i18n/pt.json
sed -i 's/"acts\.supplication": *"[^"]*"/"acts.supplication": "Súplica"/' src/i18n/pt.json
sed -i 's/"acts\.yielding": *"[^"]*"/"acts.yielding": "render-se"/' src/i18n/pt.json

# --- 2) Harden sectionLabel() to normalize punctuation/accents and map reliably ---

# Insert or replace sectionLabel() with a robust normalizer
if grep -q "function sectionLabel(title: string, lang: Lang)" src/app/page.tsx; then
  # Replace function body
  perl -0777 -pe 's|function sectionLabel\(title: string, lang: Lang\)\s*\{[\s\S]*?\}\s*|function sectionLabel(title: string, lang: Lang): string {\n  const raw = String(title || \"\");\n  const nfd = (raw as any).normalize ? raw.normalize(\"NFD\") : raw;\n  const key = nfd\n    .toLowerCase()\n    .replace(/[\\u0300-\\u036f]/g, \"\")   // strip diacritics\n    .replace(/[:\\.,;!\\?()\\[\\]{}]/g, \"\") // drop punctuation\n    .replace(/\\s*\\/\\s*/g, \"/\")        // normalize slashes\n    .replace(/[\\/\\-\\s]+/g, \"_\")       // to underscores\n    .trim();\n\n  const map: Record<string, string> = {\n    adoration: \"acts.adoration\",\n    confession: \"acts.confession\",\n    thanksgiving: \"acts.thanksgiving\",\n    supplication: \"acts.supplication\",\n    yielding: \"acts.yielding\",\n    yielding_listening: \"acts.yielding_listening\",\n  };\n\n  const tkey = map[key as keyof typeof map];\n  if (tkey) {\n    const val = t(tkey, lang);\n    if (val !== tkey) return val;\n  }\n  // fallback: prettify whatever we received\n  return raw ? raw.replace(/[_-]+/g, \" \").replace(/\\b\\w/g, (m) => m.toUpperCase()) : raw;\n}\n|s' -i src/app/page.tsx
else
  # Insert before STOPGAP_EMOTIONS
  awk '\nBEGIN{inserted=0}\n/const STOPGAP_EMOTIONS = \\[/ && !inserted {\n  print \"/** Localized ACTS-Y section titles (robust) */\";\n  print \"function sectionLabel(title: string, lang: Lang): string {\";\n  print \"  const raw = String(title || \\\"\\\");\";\n  print \"  const nfd = (raw as any).normalize ? raw.normalize(\\\"NFD\\\") : raw;\";\n  print \"  const key = nfd\";\n  print \"    .toLowerCase()\";\n  print \"    .replace(/[\\\\u0300-\\\\u036f]/g, \\\"\\\")\";\n  print \"    .replace(/[:\\\\.,;!\\\\?()\\\\[\\\\]{}]/g, \\\"\\\")\";\n  print \"    .replace(/\\\\s*\\\\/\\\\s*/g, \\\"/\\\")\";\n  print \"    .replace(/[\\\\/\\\\-\\\\s]+/g, \\\"_\\\")\";\n  print \"    .trim();\";\n  print \"  const map: Record<string,string> = {\";\n  print \"    adoration: \\\"acts.adoration\\\",\";\n  print \"    confession: \\\"acts.confession\\\",\";\n  print \"    thanksgiving: \\\"acts.thanksgiving\\\",\";\n  print \"    supplication: \\\"acts.supplication\\\",\";\n  print \"    yielding: \\\"acts.yielding\\\",\";\n  print \"    yielding_listening: \\\"acts.yielding_listening\\\",\";\n  print \"  };\";\n  print \"  const tkey = map[key as keyof typeof map];\";\n  print \"  if (tkey) { const val = t(tkey, lang); if (val !== tkey) return val; }\";\n  print \"  return raw ? raw.replace(/[_-]+/g, \\\" \\\").replace(/\\\\b\\\\w/g, (m) => m.toUpperCase()) : raw;\";\n  print \"}\";\n  print \"\";\n  inserted=1;\n}\n{ print }\n' src/app/page.tsx > src/app/page.tsx.tmp && mv src/app/page.tsx.tmp src/app/page.tsx\nfi\n\n# Ensure render & copy paths use sectionLabel()\nsed -i 's/{prettyTitle(String(s.title))}/{sectionLabel(String(s.title), lang)}/' src/app/page.tsx\nsed -i 's/`\\$\\{prettyTitle(String(s.title))\\}\\\\n\\$\\{s.content\\}`/`\\$\\{sectionLabel(String(s.title), lang)\\}\\\\n\\$\\{s.content\\}`/g' src/app/page.tsx\n\necho \"Done: ACTS-Y titles updated in locales + robust sectionLabel mapping.\"\n```\n\nRun it, then rebuild & run:\n\n```bash\nbash scripts/m3_acts_titles_final.sh\nnpm run build\nnpm run dev\n```\n\nOpen **incognito** at `http://127.0.0.1:3000`, switch to **ES / FR / PT**, compose a prayer, and the section titles should now match exactly what you specified:\n\n- **FR**: Adoration / Confession / action de graces / supplication / se rendre  \n- **ES**: Adoración / Confesión / Acción de gracias / Súplica / Entregarse  \n- **PT**: Adorar / Confissão / Ação de Graças / Súplica / render-se\n\nIf any single heading still shows English, tell me which one and which language, and I’ll target that exact key.
