// Minimal browser shim for '@supabase/node-fetch'
// Maps to the native Fetch API available in modern browsers.

export default function fetchShim(input: RequestInfo, init?: RequestInit) {
  return fetch(input as any, init as any);
}

// Re-export browser built-ins so named imports keep working.
const g: any = globalThis as any;
export const Headers: typeof window.Headers = g.Headers;
export const Request: typeof window.Request = g.Request;
export const Response: typeof window.Response = g.Response;

// Provide a minimal FetchError export to satisfy consumers if referenced.
export class FetchError extends Error {
  type?: string;
  code?: string;
  constructor(message?: string) {
    super(message);
    this.name = 'FetchError';
  }
}
