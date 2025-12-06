import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth';

export default function ProtectedRoute({ children }) {
    return authService.isAuthenticated() ? children : <Navigate to="/login" replace />;
}
