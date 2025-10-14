#!/usr/bin/env bash
set -euo pipefail
cd ~/jirehfaith-frontend

echo "== Verify ACTS keys =="
grep -nE '"acts\.(adoration|confession|thanksgiving|supplication|yielding)"' src/i18n/*.json || true

add_section_label_helper() {
  local file="$1"
  # If helper already exists, replace its body with the robust version
  if grep -q "function sectionLabel(title: string, lang: Lang)" "$file"; then
    perl -0777 -pe 's|function sectionLabel\(title: string, lang: Lang\): string \{[\s\S]*?\}\s*|function sectionLabel(title: string, lang: Lang): string {\n  const raw = String(title || \"\");\n  // Normalize (strip accents, punctuation, collapse spaces, lower)\n  const nfd = (raw as any).normalize ? raw.normalize(\"NFD\") : raw;\n  const lower = nfd.toLowerCase().replace(/[\\u0300-\\u036f]/g, \"\");\n  const cleaned = lower.replace(/[:\\.,;!\\?()\\[\\]{}]/g, \"\").replace(/\\s*\\/\\s*/g, \"/\").trim();\n  const key = cleaned.replace(/[\\/\\-\\s]+/g, \"_\");\n\n  // Primary map from normalized key\n  const map: Record<string, string> = {\n    adoration: \"acts.adoration\",\n    confession: \"acts.confession\",\n    thanksgiving: \"acts.thanksgiving\",\n    supplication: \"acts.supplication\",\n    yielding: \"acts.yielding\",\n    yielding_listening: \"acts.yielding_listening\",\n  };\n\n  let tkey = map[key];\n\n  // Secondary fallback: raw English labels commonly sent by backend (with/without colon)\n  if (!tkey) {\n    const rawTrim = raw.replace(/[:\\s]+$/, \"\").trim();\n    const rawLc = rawTrim.toLowerCase();\n    if (rawLc === \"adoration\") tkey = \"acts.adoration\";\n    else if (rawLc === \"confession\") tkey = \"acts.confession\";\n    else if (rawLc === \"thanksgiving\") tkey = \"acts.thanksgiving\";\n    else if (rawLc === \"supplication\") tkey = \"acts.supplication\";\n    else if (rawLc === \"yielding\") tkey = \"acts.yielding\";\n  }\n\n  if (tkey) {\n    const val = t(tkey, lang);\n    if (val !== tkey) return val;\n  }\n  // fallback: prettify whatever we received\n  return raw ? raw.replace(/[_-]+/g, \" \").replace(/\\b\\w/g, (m) => m.toUpperCase()) : raw;\n}\n|s' -i "$file"
  else
    # Insert helper before STOPGAP_EMOTIONS block
    awk '\nBEGIN{inserted=0}\n/const STOPGAP_EMOTIONS = \\[/ && !inserted {\n  print \"/** Localized ACTS-Y section titles (robust) */\";\n  print \"function sectionLabel(title: string, lang: Lang): string {\";\n  print \"  const raw = String(title || \\\"\\\");\";\n  print \"  const nfd = (raw as any).normalize ? raw.normalize(\\\"NFD\\\") : raw;\";\n  print \"  const lower = nfd.toLowerCase().replace(/[\\\\u0300-\\\\u036f]/g, \\\"\\\");\";\n  print \"  const cleaned = lower.replace(/[:\\\\.,;!\\\\?()\\\\[\\\\]{}]/g, \\\"\\\").replace(/\\\\s*\\\\/\\\\s*/g, \\\"/\\\").trim();\";\n  print \"  const key = cleaned.replace(/[\\\\/\\\\-\\\\s]+/g, \\\"_\\\");\";\n  print \"  const map: Record<string,string> = {\";\n  print \"    adoration: \\\"acts.adoration\\\",\";\n  print \"    confession: \\\"acts.confession\\\",\";\n  print \"    thanksgiving: \\\"acts.thanksgiving\\\",\";\n  print \"    supplication: \\\"acts.supplication\\\",\";\n  print \"    yielding: \\\"acts.yielding\\\",\";\n  print \"    yielding_listening: \\\"acts.yielding_listening\\\",\";\n  print \"  };\";\n  print \"  let tkey = map[key];\";\n  print \"  if (!tkey) { const rawTrim = raw.replace(/[:\\\\s]+$/, \\\"\\\").trim(); const rawLc = rawTrim.toLowerCase(); if (rawLc === \\\"adoration\\\") tkey = \\\"acts.adoration\\\"; else if (rawLc === \\\"confession\\\") tkey = \\\"acts.confession\\\"; else if (rawLc === \\\"thanksgiving\\\") tkey = \\\"acts.thanksgiving\\\"; else if (rawLc === \\\"supplication\\\") tkey = \\\"acts.supplication\\\"; else if (rawLc === \\\"yielding\\\") tkey = \\\"acts.yielding\\\"; }\";\n  print \"  if (tkey) { const val = t(tkey, lang); if (val !== tkey) return val; }\";\n  print \"  return raw ? raw.replace(/[_-]+/g, \\\" \\\").replace(/\\\\b\\\\w/g, (m) => m.toUpperCase()) : raw;\";\n  print \"}\";\n  print \"\";\n  inserted=1;\n}\n{ print }\n' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
  fi
}

patch_render_to_use_section_label() {
  local file="$1"
  # Replace visible section title
  sed -i 's/{prettyTitle(String(s.title))}/{sectionLabel(String(s.title), lang)}/' "$file" || true
  # Replace in copied text builders
  sed -i 's/`\\$\\{prettyTitle(String(s.title))\\}\\\\n\\$\\{s.content\\}`/`\\$\\{sectionLabel(String(s.title), lang)\\}\\\\n\\$\\{s.content\\}`/g' "$file" || true
}

# Apply to main page
add_section_label_helper "src/app/page.tsx"
patch_render_to_use_section_label "src/app/page.tsx"

# Apply to /jf page if it exists
if [ -f src/app/jf/page.tsx ]; then
  # Ensure imports have t and Lang
  if ! grep -q 't, type Lang' src/app/jf/page.tsx; then
    sed -i 's@from "@/lib/i18n";@from "@/lib/i18n";@' src/app/jf/page.tsx
  fi
  add_section_label_helper "src/app/jf/page.tsx"
  patch_render_to_use_section_label "src/app/jf/page.tsx"
fi

echo "Patched: robust ACTS mapping on both pages."
