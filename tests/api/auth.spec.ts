import { login, logout, me } from '../../src/api/endpoints/functions';
import { test } from '../../src/core/fixtures/api.fixtures';
import { loginPayload } from '../../src/api/payloads/login.payload';
import { expect } from '@playwright/test';


test('Admin login happy path @smoke @regression @login', async ({ api }) => {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error('Missing admin credentials in .env');
  }

  const result = await login(api, {
    body: loginPayload(),
    statusCode: 200,
  });

  expect(result.body.message).toBe('Login successful');
  
  const resultMe = await me(api, {
    statusCode: 200, 
  });

  const eTag = resultMe.response.headers()['etag'] || resultMe.response.headers()['ETag'];

  expect(eTag).toBeTruthy();

  await me(api, {
    statusCode: 304,
    header: {
      'If-None-Match': eTag,
    },
  });

  expect(result.body.user).toStrictEqual(resultMe.body);
});

test('Admin logout @smoke @regression @logout', async ({ api }) => {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error('Missing admin credentials in .env');
  }

  const result = await logout(api, {
    statusCode: 200,
  });

  expect(result.body.message).toBe('Logged out successfully');
});

test('Admin login with invalid email @negative @regression @login', async ({ api }) => {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error('Missing admin credentials in .env');
  }

  const result = await login(api, {
    body: loginPayload('admin', { email: "InvalidEmail" }),
    statusCode: 400,
  });

  let errorMessage = '';

  try {
    const parsed = JSON.parse(result.body.message);
    errorMessage = parsed?.[0]?.message;
  } catch (e) {
    console.error('Failed to parse message', e);
  }

  expect(errorMessage).toBe('Invalid email');
});

test('Admin login with invalid password @negative @regression @login', async ({ api }) => {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error('Missing admin credentials in .env');
  }

  const result = await login(api, {
    body: loginPayload('admin', { password: "incorrectPass" }),
    statusCode: 401,
  });

  const message = result.body.message;

  expect(message).toBe('Invalid email or password');
});

test('Admin login with different user password @negative @regression @login', async ({ api }) => {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error('Missing admin credentials in .env');
  }

  const result = await login(api, {
    body: loginPayload('admin', { password: process.env.USER_PASSWORD || 'User123!' }),
    statusCode: 401,
  });

  const message = result.body.message;

  expect(message).toBe('Invalid email or password');
});
