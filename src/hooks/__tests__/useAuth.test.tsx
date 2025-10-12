import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

// Mock the Supabase client module. Create mock functions inside the factory
// so they are available when Vitest hoists the mock call.
vi.mock('@/integrations/supabase/client', () => {
  const getSession = vi.fn();
  const onAuthStateChange = vi.fn();
  const signOut = vi.fn();
  const from = vi.fn();

  return {
    supabase: {
      auth: {
        getSession,
        onAuthStateChange,
        signOut,
      },
      from,
    },
  };
});

// Import the hook and the mocked supabase implementation
import { AuthProvider, useAuth } from '../useAuth';
import { supabase } from '@/integrations/supabase/client';

test('restores session and fetches profile', async () => {
  // Setup mock implementations for this test
  (supabase.auth.getSession as any).mockResolvedValue({ data: { session: { user: { id: 'user1' } } } });
  (supabase.from as any).mockReturnValue({ 
    select: () => ({ 
      eq: () => ({ 
        single: async () => ({ data: { first_name: 'Luke' } }) 
      }) 
    }) 
  });
  (supabase.auth.onAuthStateChange as any).mockImplementation((cb: any) => ({ 
    data: { subscription: { unsubscribe: () => {} } } 
  }));

  function Child() {
    const { loading, userProfile } = useAuth();
    return (
      <div>
        <div>{loading ? 'loading' : 'ready'}</div>
        <div data-testid="name">{(userProfile as any)?.first_name ?? 'no-name'}</div>
      </div>
    );
  }

  render(
    <AuthProvider>
      <Child />
    </AuthProvider>
  );

  await waitFor(() => expect(screen.getByText('ready')).toBeInTheDocument());
  expect(screen.getByTestId('name').textContent).toBe('Luke');
  expect((supabase.auth.getSession as any)).toHaveBeenCalled();
  expect((supabase.from as any)).toHaveBeenCalled();
});

test('signOut calls supabase and clears user', async () => {
  // Setup mock implementations for this test
  (supabase.auth.signOut as any).mockResolvedValue({});
  (supabase.auth.getSession as any).mockResolvedValue({ data: { session: { user: { id: 'user2' } } } });
  (supabase.from as any).mockReturnValue({ 
    select: () => ({ 
      eq: () => ({ 
        single: async () => ({ data: { first_name: 'Ann' } }) 
      }) 
    }) 
  });
  (supabase.auth.onAuthStateChange as any).mockImplementation((cb: any) => ({ 
    data: { subscription: { unsubscribe: () => {} } } 
  }));

  function Child() {
    const { user, loading, signOut } = useAuth();
    return (
      <div>
        <div>{loading ? 'loading' : user ? 'signed-in' : 'signed-out'}</div>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  render(
    <AuthProvider>
      <Child />
    </AuthProvider>
  );

  // wait for initial restore
  await waitFor(() => expect(screen.getByText('signed-in')).toBeInTheDocument());

  // click sign out
  fireEvent.click(screen.getByText('Sign out'));

  await waitFor(() => expect((supabase.auth.signOut as any)).toHaveBeenCalled());
  await waitFor(() => expect(screen.getByText('signed-out')).toBeInTheDocument());
});
