import { Server } from 'miragejs';

// Auth APIs are connected to the real backend — no mock handlers needed.
// Requests to /api/auth/* fall through to this.passthrough() in mock.ts.
export default function authFakeApi(_server: Server, _apiPrefix: string) {
  // intentionally empty
}
