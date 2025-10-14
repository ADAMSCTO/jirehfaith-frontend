#!/usr/bin/env bash
set -euo pipefail
cd ~/jirehfaith-frontend

# 1) Replace the two <img> tags in the outbox header with Next <Image />
# praying hands
sed -i 's|<img src="/icons/praying-hands-gold.png" alt="" aria-hidden="true" className="h-6 w-6" />|<Image src="/icons/praying-hands-gold.png" alt="" aria-hidden="true" width={24} height={24} className="h-6 w-6" />|' src/app/page.tsx
# open bible
sed -i 's|<img src="/open-bible-gold.png" alt="" aria-hidden="true" className="h-6 w-6" />|<Image src="/open-bible-gold.png" alt="" aria-hidden="true" width={24} height={24} className="h-6 w-6" />|' src/app/page.tsx

# 2) Use fullPrayer in the Copy handler (remove unused-var + simplify)
# Replace the multiline writeText(...) block with writeText(fullPrayer)
sed -i '/await navigator.clipboard.writeText(/,/));/c\                    await navigator.clipboard.writeText(fullPrayer);' src/app/page.tsx

echo "Patched: Next <Image /> icons + Copy uses fullPrayer."
