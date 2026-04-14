import { login } from '../../src/api/endpoints/functions';
import { test } from '../../src/core/fixtures/api.fixtures';


test('Admin login @smoke @regression', async ({ api }) => {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error('Missing admin credentials in .env');
  }
  
  const result = await login(api, {
    body: {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    },
    statusCode: 200,
  });
});