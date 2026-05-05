import { createServer } from 'miragejs';

export function mockServer() {
  return createServer({
    routes() {
      this.urlPrefix = '';
      this.namespace = '';

      // ── All routes passthrough to real backend API ─────────────────────
      this.passthrough();
    },
  });
}
