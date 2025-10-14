#!/usr/bin/env bash
set -euo pipefail
cd ~/jirehfaith-frontend

# Ensure locale is preloaded whenever language changes.

# Patch Header.tsx: onLangChange => preloadCurrentLang() + setLangState(l)
sed -i 's/const unsub = onLangChange((l) => setLangState(l));/const unsub = onLangChange((l) => {\n    preloadCurrentLang();\n    setLangState(l);\n  });/' src/components/Header.tsx

# Patch page.tsx: onLangChange => preloadCurrentLang() + setLangState(l)
sed -i 's/const unsub = onLangChange((l: Lang) => setLang(l as "en" | "es" | "fr" | "pt"));/const unsub = onLangChange((l: Lang) => {\n      preloadCurrentLang();\n      setLang(l as "en" | "es" | "fr" | "pt");\n    });/' src/app/page.tsx || true
sed -i 's/const unsub = onLangChange((l: Lang) => setLangState(l));/const unsub = onLangChange((l: Lang) => {\n      preloadCurrentLang();\n      setLangState(l);\n    });/' src/app/page.tsx || true

echo "Patched: preloadCurrentLang() now runs on language change (Header & page)."
