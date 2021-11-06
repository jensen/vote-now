import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import AuthProvider, { useAuth } from "context/auth";

import Layout from "components/layouts/Layout";
import Login from "pages/Login";
import Projects from "pages/Projects";
import Admin from "pages/Admin";

export const VerifyAuthenticated = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

export const VerifyAdmin = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

const Router = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route
            path="projects"
            element={
              <VerifyAuthenticated>
                <Projects />
              </VerifyAuthenticated>
            }
          />
          <Route
            path="admin"
            element={
              <VerifyAdmin>
                <Admin />
              </VerifyAdmin>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default Router;
