export const authKeys = {
  all: () => ["auth"] as const,
  currentUser: () => ["auth", "me"] as const,
};
