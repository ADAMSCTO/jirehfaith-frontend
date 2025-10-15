import DOMPurify from "isomorphic-dompurify";
/** Minimal safe sanitizer for rendering trusted snippets */
export function sanitize(html: string) {
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}
