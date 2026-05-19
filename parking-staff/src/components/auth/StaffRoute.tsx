import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { canAccessStaffApp, getStaffUser } from '../../utils/auth';

interface StaffRouteProps {
  children: React.ReactNode;
}

export default function StaffRoute({ children }: StaffRouteProps) {
  const navigate = useNavigate();
  const user = getStaffUser();
  const allowed = Boolean(localStorage.getItem('staff_token') && canAccessStaffApp(user));

  useEffect(() => {
    if (!localStorage.getItem('staff_token')) {
      navigate('/login', { replace: true });
      return;
    }
    if (!canAccessStaffApp(user)) {
      navigate('/login', { replace: true, state: { error: 'Tài khoản không có quyền nhân viên.' } });
    }
  }, [navigate, user]);

  if (!allowed) return null;
  return <>{children}</>;
}
