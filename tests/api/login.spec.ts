import { login } from '../../src/api/endpoints/functions';
import { test } from '../../src/core/fixtures/api.fixtures';
import { loginPayload } from '../../src/api/payloads/login.payload';


test('Admin login @smoke @regression', async ({ api }) => {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error('Missing admin credentials in .env');
  }
  
  const result = await login(api, {
    body: loginPayload({email: "asd"}),
    statusCode: 200,
  });
});