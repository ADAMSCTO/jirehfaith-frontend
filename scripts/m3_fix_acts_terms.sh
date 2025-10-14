#!/usr/bin/env bash
set -euo pipefail
cd ~/jirehfaith-frontend

# --- FR ---
# Adoration: Adoration
sed -i 's/"acts\.adoration": *"[^"]*"/"acts.adoration": "Adoration"/' src/i18n/fr.json
# Confession: Confession
sed -i 's/"acts\.confession": *"[^"]*"/"acts.confession": "Confession"/' src/i18n/fr.json
# Thanksgiving: action de graces
sed -i 's/"acts\.thanksgiving": *"[^"]*"/"acts.thanksgiving": "action de graces"/' src/i18n/fr.json
# Supplication: supplication
sed -i 's/"acts\.supplication": *"[^"]*"/"acts.supplication": "supplication"/' src/i18n/fr.json
# Yielding: se rendre
sed -i 's/"acts\.yielding": *"[^"]*"/"acts.yielding": "se rendre"/' src/i18n/fr.json
# (keep yielding_listening as-is or adjust if you want)

# --- ES ---
# Adoration: Adoración
sed -i 's/"acts\.adoration": *"[^"]*"/"acts.adoration": "Adoración"/' src/i18n/es.json
# Confession: Confesión
sed -i 's/"acts\.confession": *"[^"]*"/"acts.confession": "Confesión"/' src/i18n/es.json
# Thanksgiving: Acción de gracias
sed -i 's/"acts\.thanksgiving": *"[^"]*"/"acts.thanksgiving": "Acción de gracias"/' src/i18n/es.json
# Supplication: Súplica
sed -i 's/"acts\.supplication": *"[^"]*"/"acts.supplication": "Súplica"/' src/i18n/es.json
# Yielding: Entregarse
sed -i 's/"acts\.yielding": *"[^"]*"/"acts.yielding": "Entregarse"/' src/i18n/es.json

# --- PT ---
# Adoration: Adorar
sed -i 's/"acts\.adoration": *"[^"]*"/"acts.adoration": "Adorar"/' src/i18n/pt.json
# Confession: Confissão
sed -i 's/"acts\.confession": *"[^"]*"/"acts.confession": "Confissão"/' src/i18n/pt.json
# Thanksgiving: Ação de Graças
sed -i 's/"acts\.thanksgiving": *"[^"]*"/"acts.thanksgiving": "Ação de Graças"/' src/i18n/pt.json
# Supplication: Súplica
sed -i 's/"acts\.supplication": *"[^"]*"/"acts.supplication": "Súplica"/' src/i18n/pt.json
# Yielding: render-se
sed -i 's/"acts\.yielding": *"[^"]*"/"acts.yielding": "render-se"/' src/i18n/pt.json

echo "ACTS-Y titles updated for FR/ES/PT per your list."
