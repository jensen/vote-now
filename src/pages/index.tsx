import React, { Suspense } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

const Projects = React.lazy(() => import("pages/Projects"));
const Project = React.lazy(() => import("pages/Project"));

const Admin = React.lazy(() => import("pages/admin"));
const ProjectForm = React.lazy(() => import("pages/admin/ProjectForm"));

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

export const ProjectPage = () => (
  <Page>
    <Project />
  </Page>
);

export const ProjectsPage = () => (
  <Page>
    <Projects />
  </Page>
);

export const AdminPage = () => (
  <Page>
    <div className="w-auto">
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="projects/new" element={<ProjectForm />} />
        <Route path="projects/:id" element={<ProjectForm />} />
      </Routes>
    </div>
  </Page>
);
