import { useAuth } from '../../hooks/useAuth';

export default function RequireRole({ roles = [], children }) {
  const { user } = useAuth();
  const hasRole = user && roles.includes(user.role);
  return hasRole ? children : null;
}
