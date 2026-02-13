import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  return {
    user,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    isViewer: user?.role === 'viewer' || user?.role === 'admin',
  };
};
