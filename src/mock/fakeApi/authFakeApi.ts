import { Server, Response } from 'miragejs';

export default function authFakeApi(server: Server, apiPrefix: string) {
  server.post(`${apiPrefix}/users/sign-in`, (schema, { requestBody }) => {
    const { username: email, password } = JSON.parse(requestBody);
    const user = schema.db.signInUserData.findBy({
      email,
      password,
    });
    if (user) {
      return user;
    }
    return new Response(
      401,
      { some: 'header' },
      { message: 'Invalid email or password!' }
    );
  });

  server.post(`${apiPrefix}/sign-out`, () => true);
}
