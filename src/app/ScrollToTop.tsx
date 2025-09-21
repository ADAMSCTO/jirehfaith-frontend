'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const doScrollTop = () => {
      try {
        // Try all possible scroll targets
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
        document.scrollingElement?.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
        document.body?.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      } catch {
        window.scrollTo(0, 0);
      }
      // Second pass in case WebView delays layout
      requestAnimationFrame(() => {
        try {
          window.scrollTo(0, 0);
          document.scrollingElement?.scrollTo(0, 0);
          document.body?.scrollTo(0, 0);
        } catch {}
      });
    };

    doScrollTop();

    // Extra: catch clicks on <a href="/"> when already on "/"
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const link = target.closest('a[href="/"]') as HTMLAnchorElement | null;
      if (link && pathname === '/') {
        e.preventDefault();
        doScrollTop();
      }
    };
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [pathname, searchParams]);

  return null;
}
