# SwapRunn Development Guide

## Architecture Overview

SwapRunn is a **hybrid mobile/web app** for vehicle delivery coordination between dealers, drivers, and swap coordinators. Built with React + TypeScript + Capacitor for cross-platform deployment.

### Core User Types & Routes
- **Dealers**: `/dealer/*` - Request drivers, manage deliveries
- **Drivers**: `/driver/*` - Accept jobs, track deliveries  
- **Swap Coordinators**: `/swap-coordinator/*` - Coordinate vehicle swaps between dealers

Authentication uses Supabase with role-based routing via `ProtectedRoute` component. User profiles are fetched via RPC `get_user_profile()` and cached in `useAuth` hook.

## Key Technical Patterns

### Mobile-First Architecture
- **Native features**: VIN scanning, camera, GPS, push notifications, biometrics
- **Platform detection**: `useMobileCapacitor()` hook determines native vs web context
- **Graceful degradation**: Web fallbacks for all mobile features (e.g., `WebVINScanner` vs native barcode scanner)

### VIN Scanning Workflow
The VIN scanning system demonstrates the hybrid approach:
```tsx
// Native: Uses @capacitor-mlkit/barcode-scanning
await vinScannerService.scanVINBarcode() 
// Web: Uses @zxing/browser with camera stream
<WebVINScanner onResult={handleVIN} />
```
Both paths decode VINs via NHTSA API and auto-populate vehicle forms.

### State Management Patterns
- **Auth**: `AuthProvider` with profile caching and retry logic
- **Forms**: React Hook Form with Zod validation
- **Real-time**: Supabase subscriptions for job updates
- **UI State**: Local state + React Query for server state

### Address Handling
Custom `AddressInput` component with standardized `AddressData` interface:
```tsx
interface AddressData { street: string; city: string; state: string; zip: string; }
```
Used consistently across dealer requests and delivery forms.

## Development Workflows

### Build Commands
```bash
npm run dev              # Web development server
npm run build           # Production build
npx cap sync ios        # Sync to iOS
npx cap open ios        # Open Xcode project
```

### Database Integration
- **Client**: `src/integrations/supabase/client.ts` (auto-generated)
- **Types**: `src/integrations/supabase/types.ts` (auto-generated)  
- **Auth pattern**: Always check `user` and `userProfile` before protected operations

### Component Organization
```
src/components/
├── ui/              # shadcn/ui components
├── dealer/          # Dealer-specific components (VINScanner, RequestForm)
├── driver/          # Driver-specific components  
├── swap-coordinator/ # Coordinator-specific components
└── [shared]/        # Cross-feature components (Header, Layout, etc.)
```

## Common Gotchas

### Mobile Platform Detection
Always check platform before using native features:
```tsx
const { isNative } = useMobileCapacitor();
if (isNative) {
  // Use Capacitor APIs
} else {
  // Use web APIs or show fallback
}
```

### Form State in Collapsible Sections
Forms use collapsible sections (`Collapsible` from radix-ui). State management via `openSections` object controls UI, separate from form data state.

### Authentication Flow
- Users without profiles get account setup UI
- Profile loading has retry logic with exponential backoff
- Always use `userProfile?.user_type` for role checks, not just `user`

## File Naming Conventions

- **Pages**: PascalCase (e.g., `DealerRequest.tsx`)
- **Components**: PascalCase with feature prefix when applicable (`WebVINScanner.tsx`)
- **Services**: camelCase with "Service" suffix (`vinScannerService.ts`)
- **Hooks**: camelCase with "use" prefix (`useMobileCapacitor.tsx`)

## Testing Context
The app is production-ready for iOS App Store submission. Focus on maintaining the established patterns and ensuring mobile/web compatibility when adding features.