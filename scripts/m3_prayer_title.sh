#!/usr/bin/env bash
set -euo pipefail
cd ~/jirehfaith-frontend

# ---- i18n: add localized "Prayer for {{emotion}}" key ----
# EN
sed -i 's/"output.prayer": "Prayer",/"output.prayer": "Prayer",\
  "output.prayerFor": "Prayer for {{emotion}}",/' src/i18n/en.json

# ES
sed -i 's/"output.prayer": "Oración",/"output.prayer": "Oración",\
  "output.prayerFor": "Oración por {{emotion}}",/' src/i18n/es.json

# FR
sed -i 's/"output.prayer": "Prière",/"output.prayer": "Prière",\
  "output.prayerFor": "Prière pour {{emotion}}",/' src/i18n/fr.json

# PT
sed -i 's/"output.prayer": "Oração",/"output.prayer": "Oração",\
  "output.prayerFor": "Oração por {{emotion}}",/' src/i18n/pt.json

# ---- page.tsx: replace the outbox heading with localized title + icons ----
sed -i 's|<h2 className="text-xl font-medium">{t("output.prayer")}</h2>|<h2 className="text-xl font-medium flex items-center justify-center gap-2">\
{hasPrayer ? (\
  <><img src="/icons/praying-hands-gold.png" alt="" aria-hidden="true" className="h-6 w-6" />\
  {t("output.prayerFor").replace("{{emotion}}", labelForEmotion(emotion).toLocaleLowerCase(lang))}\
  <img src="/open-bible-gold.png" alt="" aria-hidden="true" className="h-6 w-6" /></>\
) : t("output.prayer")}\
</h2>|' src/app/page.tsx

echo "✅ Applied localized prayer title with icons."
