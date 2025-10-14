#!/usr/bin/env bash
set -euo pipefail
cd ~/jirehfaith-frontend

add_acts_block() {
  local file="$1"
  local block="$2"
  # If acts.adoration already exists, skip
  if grep -q '"acts\.adoration"' "$file"; then
    echo "acts.* already present in $file"
    return
  fi
  # Insert before the final closing brace
  awk -v blk="$block" '
    BEGIN{done=0}
    /}\s*$/ && !done { sub(/}\s*$/, ",\n" blk "\n}"); done=1 }
    { print }
  ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
  echo "Added acts.* to $file"
}

# ---- Locale blocks ----
EN_BLOCK='"acts.adoration": "Adoration",
  "acts.confession": "Confession",
  "acts.thanksgiving": "Thanksgiving",
  "acts.supplication": "Supplication",
  "acts.yielding": "Yielding",
  "acts.yielding_listening": "Yielding / Listening"'

ES_BLOCK='"acts.adoration": "Adoración",
  "acts.confession": "Confesión",
  "acts.thanksgiving": "Acción de Gracias",
  "acts.supplication": "Súplica",
  "acts.yielding": "Entrega",
  "acts.yielding_listening": "Entrega / Escucha"'

FR_BLOCK='"acts.adoration": "Adoration",
  "acts.confession": "Confession",
  "acts.thanksgiving": "Actions de grâce",
  "acts.supplication": "Supplication",
  "acts.yielding": "Abandon",
  "acts.yielding_listening": "Abandon / Écoute"'

PT_BLOCK='"acts.adoration": "Adoração",
  "acts.confession": "Confissão",
  "acts.thanksgiving": "Ações de Graças",
  "acts.supplication": "Súplica",
  "acts.yielding": "Entrega",
  "acts.yielding_listening": "Entrega / Escuta"'

add_acts_block "src/i18n/en.json" "$EN_BLOCK"
add_acts_block "src/i18n/es.json" "$ES_BLOCK"
add_acts_block "src/i18n/fr.json" "$FR_BLOCK"
add_acts_block "src/i18n/pt.json" "$PT_BLOCK"

# ---- page.tsx: add sectionLabel() and use it ----
# Add helper after labelForEmotion()
if ! grep -q "function sectionLabel(title: string, lang: Lang)" src/app/page.tsx; then
  perl -0777 -pe 's|(function labelForEmotion\(id: string\): string \{[\s\S]*?\}\n)|$&\n/** Localized ACTS-Y section titles */\nfunction sectionLabel(title: string, lang: Lang): string {\n  const raw = String(title || \"\");\n  const key = raw.toLowerCase().replace(/[\\s/-]+/g, \"_\");\n  const map: Record<string,string> = {\n    \"adoration\": \"acts.adoration\",\n    \"confession\": \"acts.confession\",\n    \"thanksgiving\": \"acts.thanksgiving\",\n    \"supplication\": \"acts.supplication\",\n    \"yielding\": \"acts.yielding\",\n    \"yielding_listening\": \"acts.yielding_listening\"\n  };\n  const tkey = map[key];\n  if (tkey) {\n    const val = t(tkey, lang);\n    if (val !== tkey) return val;\n  }\n  return raw ? raw.replace(/[_-]+/g, \" \").replace(/\\b\\w/g, (m) => m.toUpperCase()) : raw;\n}\n|s' -i src/app/page.tsx
  echo "Inserted sectionLabel() helper."
fi

# Replace displayed section title
sed -i 's/{prettyTitle(String(s.title))}/{sectionLabel(String(s.title), lang)}/' src/app/page.tsx

# Replace copy/full text builder to use localized section titles
sed -i 's/`\${prettyTitle(String(s.title))}\\n\${s.content}`/`\${sectionLabel(String(s.title), lang)}\\n\${s.content}`/g' src/app/page.tsx

echo "Patched section title rendering to use localized ACTS-Y labels."
