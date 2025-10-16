# SwapRunn AI Guide
## Orientation
- SwapRunn is a hybrid React + TypeScript + Capacitor app for dealers, drivers, swap coordinators; web + native share the same bundle via `src/App.tsx` router.
- Routes live in `src/pages`; guard everything behind `<ProtectedRoute>` with `requiredUserType` using `useAuth` profile (RPC `get_user_profile`). Always wait for `profileLoading` to clear before gating features.
## Auth & State
- `AuthProvider` in `src/hooks/useAuth.tsx` caches profiles, dedups fetches, retries; call `useAuth()` and respect `profileLoading` and `loading`.
- Wrap Supabase writes with `supabaseService` when possible; it handles assignments, tracking tokens, and throws `JOB_ALREADY_TAKEN` when concurrency is violated.
## Data Access
- Real-time updates go through `useEnhancedRealTime` (presence + toast) and `useDriverNotifications` (channels + SMS fallback). Subscribe via `supabase.channel` instead of manual polling.
- For distance + VIN, use services: `distanceService.calculateDistance()` invokes the `calculate-distance` edge function then falls back to heuristics; `vinScannerService` picks native scanner vs `WebVINScanner` as a web fallback.
- `driver-data.ts` and `mockStore.ts` ship with `USE_MOCK_DATA = true`; flip only when backing APIs exist so UI placeholders stay functional.
## Mobile vs Web
- Feature-gate with `useMobileCapacitor()`; `MobileApp` kicks off push registration + haptics for native builds while browser paths fall back to `notificationService`.
- When adding camera/geo features, provide a Capacitor path in `src/services/*` and a matching web component fallback (pattern used by VIN scanner, notifications, geolocation).
## UI Patterns
- Layout uses global `<Header />` + `<MobileApp>` wrapper; shared shells live in `src/components`, with shadcn primitives under `src/components/ui`.
- Forms mix React Hook Form + Zod and controlled state; keep UI chrome like `openSections` separate from submission payloads, as in `DealerRequest`.
- Addresses should pass through `AddressInput`/`AddressData`; it loads Google Places via the `google-maps-config` edge function and normalizes state/zip.
## Supabase & Edge
- Public client sits in `src/integrations/supabase/client.ts`; select helpers use `.single()`/`.maybeSingle()` with console logging—match that style for new queries.
- Edge functions under `supabase/functions/*` cover notifications, SMS, distance, billing. Call them with `supabase.functions.invoke(...)` (see `DealerRequest`, `smsService`, `distanceService`).
- Job workflows expect `jobs` + `assignments` rows; prefer `supabaseService` helpers for create/accept/clock-in flows to keep statuses in sync.
## Build & Tooling
- `npm run dev` for Vite dev server, `npm run build` for production, `npm run lint` before commits; mobile builds require `npx cap sync ios` followed by `npx cap open ios`.
- Path alias `@/` resolves to `src/`; Tailwind config in `tailwind.config.ts` backs the design system alongside shadcn UI tokens.
- Cypress is installed but unused; manual QA via the dev server + native build is the current expectation.
## Gotchas
- `ProtectedRoute` sends users without profiles to setup; ensure dealer/driver onboarding writes profile rows to avoid dead loops.
- Supabase RPCs (`get_user_profile`, `get_open_jobs_for_drivers`, `get_job_by_tracking_token`) power most data; update RPCs and client code together when changing shape.
- Notifications span web (`notificationService` + `smsService`) and native (`mobileNotificationService`); update both when altering alert payloads.