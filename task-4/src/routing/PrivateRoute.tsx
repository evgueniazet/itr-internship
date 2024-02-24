import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

interface PrivateRouteProps {
  Component: React.ComponentType;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ Component }) => {
  const user = auth.currentUser;

  return user ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;