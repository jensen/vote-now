import { Outlet } from "react-router-dom";
import Header from "components/Header";
import { ReactQueryDevtools } from "react-query/devtools";

const Layout = () => {
  return (
    <main className="h-full flex flex-col">
      <Header />
      <section className="flex-grow p-2">
        <Outlet />
      </section>
      <ReactQueryDevtools initialIsOpen />
    </main>
  );
};

export default Layout;
