import { Navigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCurrentUser , getFieldBySlug } from '../../api/submission';
import AccessCheckLoading from '../loading/AccessCheckLoading';

export default function RequireOwnerAccess({ children }) {
  const { slug } = useParams();
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    async function checkAccess() {
      try {
        const user = await getCurrentUser();

        if(!slug){
          if (user.role !== 'owner' && user.role !== 'admin') {
            setAuthorized(false);
          } else {
            setAuthorized(true);
          }
          return; 
        }
        
        const field = await getFieldBySlug(slug)
        if (!field) {
          setAuthorized(false);
          return;
        }
        if (field.ownerId === parseInt(user.userId) || field.createdByAdminId === parseInt(user.userId) || user.role === 'admin') {
          setAuthorized(true);
        } else {
          console.log("Người dùng không phải là chủ sở hữu hoặc không có quyền truy cập");
          setAuthorized(false);
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra quyền:", error);
        setAuthorized(false);
      }
    }

    checkAccess();
  }, [slug]);

  if (authorized === null) return <AccessCheckLoading message="Đang kiểm tra quyền truy cập..." timeout={3000} />;
  if (!authorized) return <Navigate to="/login-owner" replace />;
  return children;
}
