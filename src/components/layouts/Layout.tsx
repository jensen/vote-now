import { Outlet } from "react-router-dom";
import Header from "components/Header";
import { ReactQueryDevtools } from "react-query/devtools";

const Layout = () => {
  return (
    <main className="min-h-full">
      <Header />
      <section>
        <Outlet />
      </section>
      <ReactQueryDevtools initialIsOpen />
    </main>
  );
};

export default Layout;
