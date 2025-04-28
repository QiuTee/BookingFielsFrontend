import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RedirectIfAuthenticated({ children }) {
    const { isAuthenticated , loading} = useAuth();
    
    if (isAuthenticated) {
        return <Navigate to="/" replace />; 
    }
    
    return children; 
}