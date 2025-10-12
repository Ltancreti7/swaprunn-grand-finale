# Auth hook (useAuth)

This project provides a React context hook at `src/hooks/useAuth.tsx`.

What it does

- Restores the current Supabase session on mount.
- Subscribes to `onAuthStateChange` to update session/user/profile live.
- Fetches a `profiles` row for the current user (if present) and exposes it as `userProfile`.
- Exposes `user`, `session`, `userProfile`, `loading`, and `signOut()` via `useAuth()`.

How to use

Wrap your app with the provider:

```tsx
import { AuthProvider } from '@/hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}
```

Running tests (local)

1. Install dev dependencies (if not installed):

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

2. Run tests:

```bash
npm test
```

Note: Vitest resolves the `@/` path alias using `vitest.config.ts`. If you run into import resolution errors, ensure `vitest.config.ts` exists in the repo root and includes the same alias mapping as `vite.config.ts`.

Linting

```bash
npx eslint src/hooks/useAuth.tsx src/components/AuthPage.tsx --no-ignore --max-warnings=0
```

Notes

- `userProfile` is returned as a generic object. If you have a known schema (e.g. `first_name`, `last_name`), consider adding a typed interface in `useAuth.tsx`.
