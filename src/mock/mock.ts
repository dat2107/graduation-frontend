import { createServer } from 'miragejs';
import { signInUserData } from './data/authData';
import authFakeApi from '@/mock/fakeApi/authFakeApi';
import vocabularyFakeApi from '@/mock/fakeApi/vocabularyFakeApi';
import quizFakeApi from '@/mock/fakeApi/quizFakeApi';
import appConfig from '@/configs/app.config';

const { apiPrefix } = appConfig;

export function mockServer() {
  return createServer({
    seeds(server) {
      server.db.loadData({
        signInUserData,
      });
    },
    routes() {
      this.urlPrefix = '';
      this.namespace = '';

      // ── Register specific mock handlers FIRST ─────────────────────────────
      authFakeApi(this, apiPrefix);
      vocabularyFakeApi(this, apiPrefix);
      quizFakeApi(this, apiPrefix);

      // ── Passthrough: external URLs và requests không được mock ────────────
      this.passthrough((request) => {
        const isExternal = request.url.startsWith('http');
        const isResource = request.url.startsWith('data:text');
        return isExternal || isResource;
      });
      this.passthrough(); // catch-all: pass remaining to real server
    },
  });
}
