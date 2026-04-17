export type LoginPayload = {
  email: string;
  password: string;
};

export function loginPayload(
  userType: 'admin' | 'user' = 'admin',  
  overrides: Partial<LoginPayload> = {}
): LoginPayload {
  if (userType === 'admin') {
    return {
      email: process.env.ADMIN_EMAIL || 'admin@qaplayground.test',
      password: process.env.ADMIN_PASSWORD || 'Admin123!',
      ...overrides
    };
  }

  return {
    email: process.env.USER_EMAIL || 'user@qaplayground.tes',
    password: process.env.USER_PASSWORD || 'User123!',
    ...overrides
  };
}