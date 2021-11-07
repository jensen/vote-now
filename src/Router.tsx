import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { QueryClient, QueryClientProvider } from "react-query";
import AuthProvider, { useAuth } from "context/auth";

import Layout from "components/layouts/Layout";
import Login from "pages/Login";

import { ProjectsPage, ProjectPage, AdminPage } from "pages";

import { fetchProjects } from "services/projects";

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

  return children;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      suspense: true,
      staleTime: Infinity,
    },
  },
});

queryClient.prefetchQuery("projects", fetchProjects as any);

const Router = () => (
  <BrowserRouter>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/*" element={<Layout />}>
            <Route path="login" element={<Login />} />
            <Route
              path="projects"
              element={
                <VerifyAuthenticated>
                  <ProjectsPage />
                </VerifyAuthenticated>
              }
            />
            <Route
              path="projects/:id"
              element={
                <VerifyAuthenticated>
                  <ProjectPage />
                </VerifyAuthenticated>
              }
            />
            <Route
              path="admin/*"
              element={
                <VerifyAdmin>
                  <AdminPage />
                </VerifyAdmin>
              }
            />
          </Route>
        </Routes>
      </QueryClientProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default Router;
