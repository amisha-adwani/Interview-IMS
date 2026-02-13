import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productsReducer from '../features/products/productsSlice';
import movementsReducer from '../features/movements/movementsSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    movements: movementsReducer,
    dashboard: dashboardReducer,
  },
});
