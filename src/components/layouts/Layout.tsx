import { Outlet } from "react-router-dom";
import Header from "components/Header";
import { ReactQueryDevtools } from "react-query/devtools";

const Layout = () => {
  return (
    <main className="min-h-full">
      <Header />
      <section>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Outlet />
          </div>
        </div>
      </section>
      <ReactQueryDevtools initialIsOpen />
    </main>
  );
};

export default Layout;
