import { createServer } from 'miragejs';
import vocabularyFakeApi from '@/mock/fakeApi/vocabularyFakeApi';
import quizFakeApi from '@/mock/fakeApi/quizFakeApi';
import appConfig from '@/configs/app.config';

const { apiPrefix } = appConfig;

export function mockServer() {
  return createServer({
    routes() {
      this.urlPrefix = '';
      this.namespace = '';

      // ── Passthrough: real API routes (connected to backend) ─────────────
      this.passthrough('/api/auth/**');
      this.passthrough('/api/users/**');
      this.passthrough('/api/admin/**');

      // ── Register mock handlers for routes NOT yet connected ────────────
      vocabularyFakeApi(this, apiPrefix);
      quizFakeApi(this, apiPrefix);

      // ── Catch-all: pass remaining to real server ───────────────────────
      this.passthrough();
    },
  });
}
