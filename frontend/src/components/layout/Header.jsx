import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const dispatch = useDispatch();
  const { user } = useAuth();

  return (
    <header className="bg-slate-800 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <Link to="/" className="text-xl font-bold text-white">
            IMS
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-slate-300 hover:text-white">Dashboard</Link>
            <Link to="/products" className="text-slate-300 hover:text-white">Products</Link>
            <Link to="/movements" className="text-slate-300 hover:text-white">Movements</Link>
            <span className="text-slate-400 text-sm">{user?.email}</span>
            <span className="text-slate-500 text-xs uppercase">{user?.role}</span>
            <button
              onClick={() => dispatch(logout())}
              className="text-slate-400 hover:text-white text-sm"
            >
              Logout
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
