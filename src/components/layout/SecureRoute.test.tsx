import { initializeSession } from '@/states/sessionStore';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { claims, tokenFor } from '@/test/fixtures';
import SecureRoute from './SecureRoute';

const renderRoute = (token: string | null, type: 'USER' | 'ADMIN' = 'USER', navigation?: string) => {
  if (token) localStorage.setItem('jwt-access-token', token);
  initializeSession();
  const childRendered = vi.fn();
  const Protected = () => { childRendered(); return <p>Protected content</p>; };
  render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route path='/protected' element={<SecureRoute type={type} navigation={navigation}><Protected /></SecureRoute>} />
        <Route path='/auth/signin' element={<p>User sign in</p>} />
        <Route path='/admin/auth/signin' element={<p>Admin sign in</p>} />
        <Route path='/custom' element={<p>Custom sign in</p>} />
      </Routes>
    </MemoryRouter>
  );
  return childRendered;
};

describe('protected routes', () => {
  it.each([
    null, 'garbage', tokenFor({}),
    tokenFor().split('.').slice(0, 2).join('.'),
    `invalid.${tokenFor().split('.')[1]}.signature`,
    `${btoa(JSON.stringify({ alg: 'none' }))}.${tokenFor().split('.')[1]}.signature`,
    ...[
      { exp: undefined }, { exp: '9999999999' },
      { sub: '1junk' }, { sub: '0' }, { sub: '-1' }, { sub: '9007199254740992' }, { sub: 1 },
      { username: undefined }, { username: ' ' }, { email: undefined }, { role: 'UNKNOWN' },
    ].map((override) => tokenFor({ ...claims, ...override })),
  ])('never mounts protected children for invalid session %s', (token) => {
    const childRendered = renderRoute(token);
    expect(childRendered).not.toHaveBeenCalled();
    expect(screen.getByText('User sign in')).toBeInTheDocument();
  });

  it('allows a valid ordinary user', () => {
    renderRoute(tokenFor());
    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  it('rejects an ordinary user on the admin route without mounting children', () => {
    expect(renderRoute(tokenFor(), 'ADMIN')).not.toHaveBeenCalled();
    expect(screen.getByText('Admin sign in')).toBeInTheDocument();
  });

  it('allows an admin on the admin route', () => {
    renderRoute(tokenFor({ ...claims, role: 'ADMIN' }), 'ADMIN');
    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  it('preserves custom redirect destinations', () => {
    renderRoute(null, 'ADMIN', '/custom');
    expect(screen.getByText('Custom sign in')).toBeInTheDocument();
  });
});
