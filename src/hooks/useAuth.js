import { useSelector, useDispatch } from 'react-redux';
import { clearAuthData } from '../store/slices/authSlice';

/**
 * Custom hook to use auth state and actions
 * Provides easy access to authentication data and logout functionality
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const { token, user, isAuthenticated, loading, error } = useSelector(state => state.auth);

  const logout = () => {
    dispatch(clearAuthData());
  };

  return {
    token,
    user,
    isAuthenticated,
    loading,
    error,
    logout,
  };
};

export default useAuth;
