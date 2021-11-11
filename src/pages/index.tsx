import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

const Projects = React.lazy(() => import("pages/Projects"));
const Project = React.lazy(() => import("pages/Project"));

const Admin = React.lazy(() => import("pages/admin"));
const CreateProject = React.lazy(() => import("pages/admin/CreateProject"));
const EditProject = React.lazy(() => import("pages/admin/EditProject"));

interface IErrorFallback {
  error: Error;
  resetErrorBoundary: (...args: Array<unknown>) => void;
}
const ErrorFallback = ({ error, resetErrorBoundary }: IErrorFallback) => {
  return <button onClick={resetErrorBoundary}>Try again</button>;
};

const LoadingFallback = () => <div>Loading</div>;

const Page = (props: React.PropsWithChildren<unknown>) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Suspense fallback={<LoadingFallback />}>{props.children}</Suspense>
  </ErrorBoundary>
);

export const ProjectsPage = () => (
  <Page>
    <Routes>
      <Route path="" element={<Projects />} />
      <Route path=":id" element={<Project />} />
    </Routes>
  </Page>
);

export const AdminPage = () => (
  <Page>
    <div className="w-auto">
      <Routes>
        <Route path="" element={<Admin />} />
        <Route path="projects/new" element={<CreateProject />} />
        <Route path="projects/:id" element={<EditProject />} />
      </Routes>
    </div>
  </Page>
);
