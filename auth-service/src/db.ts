export type User = {
  id: string;
  email: string;
  passwordHash: string;
};

export const users: Record<string, User> = {};
