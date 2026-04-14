export type LoginPayload = {
  email: string;
  password: string;
};

export function loginPayload(
  overrides: Partial<LoginPayload> = {}
): LoginPayload {
  return {
    email: process.env.ADMIN_EMAIL || 'admin@qaplayground.test1',
    password: process.env.ADMIN_PASSWORD || 'Admin123!1',
    ...overrides
  };
}