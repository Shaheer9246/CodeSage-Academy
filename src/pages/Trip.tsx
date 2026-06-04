import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

/**
 * Trip is a guest-mode entry. It redirects to /dashboard?guest=1 which
 * renders the real dashboard in read-only guest mode.
 */
const Trip = () => {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useUser();

  useEffect(() => {
    if (loading) return;
    if (isLoggedIn) navigate('/dashboard', { replace: true });
    else navigate('/dashboard?guest=1', { replace: true });
  }, [isLoggedIn, loading, navigate]);

  return null;
};

export default Trip;
