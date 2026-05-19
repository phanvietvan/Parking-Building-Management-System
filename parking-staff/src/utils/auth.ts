export interface StaffUser {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role?: string | number;
}

export function getStaffUser(): StaffUser | null {
  try {
    const raw = localStorage.getItem('staff_user');
    return raw ? (JSON.parse(raw) as StaffUser) : null;
  } catch {
    return null;
  }
}

export function getStaffDisplayName(user?: StaffUser | null): string {
  const u = user ?? getStaffUser();
  if (!u) return 'Nhân viên';
  if (u.firstName || u.lastName) {
    return `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim();
  }
  return u.username || u.email;
}

export function isStaffRole(role?: string | number): boolean {
  if (role === 'Admin' || role === 'admin' || role === 2 || role === '2') return true;
  if (role === 'Staff' || role === 'staff' || role === 1 || role === '1') return true;
  return false;
}

export function canAccessStaffApp(user?: StaffUser | null): boolean {
  const u = user ?? getStaffUser();
  return Boolean(u && isStaffRole(u.role));
}

export function clearStaffSession(): void {
  localStorage.removeItem('staff_token');
  localStorage.removeItem('staff_user');
}

export function saveStaffSession(accessToken: string, user: StaffUser): void {
  localStorage.setItem('staff_token', accessToken);
  localStorage.setItem('staff_user', JSON.stringify(user));
}
