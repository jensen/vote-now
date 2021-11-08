import { Fragment } from "react";
import classnames from "classnames";
import { useNavigate, useMatch } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { useAuth } from "context/auth";

const siteNavigation = [
  { label: "Projects", to: "/projects" },
  { label: "Rules", to: "/rules" },
  { label: "Awards", to: "/awards" },
  { label: "Admin", to: "/admin" },
];

const userNavigation = [
  {
    label: "Profile",
    to: "/profile",
  },
  {
    label: "Sign Out",
    to: "/logout",
  },
];

interface IHeaderLink {
  to: string;
  label: string;
}

const HeaderLink = (props: IHeaderLink) => {
  const navigate = useNavigate();
  const active = useMatch(props.to) !== null;

  return (
    <button
      className={classnames(" px-3 py-2 rounded-md text-sm font-medium", {
        "bg-gray-900 text-white": active === true,
        "text-gray-300 hover:bg-gray-700 hover:text-white": active === false,
      })}
      aria-current="page"
      onClick={() => navigate(props.to)}
    >
      {props.label}
    </button>
  );
};

interface IUserLink {
  to: string;
  label: string;
  className: string;
}

const UserLink = (props: IUserLink) => {
  const navigate = useNavigate();

  return (
    <button
      className={props.className}
      role="menuitem"
      tabIndex={-1}
      onClick={() => navigate(props.to)}
    >
      {props.label}
    </button>
  );
};

const Header = () => {
  const { user } = useAuth();

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    stroke="currentColor"
                    viewBox="0 0 512.451 512.451"
                    width="32"
                    height="32"
                  >
                    <g>
                      <path d="M464.984,280.798c30.15-30.742,47.241-72.261,47.241-115.572c0-90.981-74.019-165-165-165c-86.92,0-158.351,67.559-164.556,152.924c-5.779-0.608-11.601-0.924-17.444-0.924c-90.981,0-165,74.019-165,165   c0,43.312,17.09,84.83,47.241,115.572c-8.714,17.271-25.897,45.302-32.92,56.414L0,512.225h45.225   c30.062,0,58.682-13.015,78.496-35.267c13.498,3.499,27.414,5.267,41.504,5.267c44.685,0,86.525-17.573,117.815-49.481   c27.67-28.216,43.956-64.491,46.745-103.44c5.732,0.605,11.55,0.921,17.44,0.921c14.09,0,28.006-1.769,41.504-5.267   c19.814,22.252,48.434,35.267,78.496,35.267h45.226l-14.546-23.014C490.882,326.101,473.699,298.073,464.984,280.798z    M261.62,411.74c-25.602,26.108-59.835,40.486-96.396,40.486c-28.078,0-46.046-8.404-52.659-10.163l-6.421,8.92   c-12.28,17.061-31.171,28.125-51.764,30.677c9.497-15.881,20.836-35.755,25.152-46.957l3.735-9.692   c-2.332-3.046-53.044-37.632-53.044-107.785c0-74.439,60.561-135,135-135c6.045,0,12.06,0.404,18.008,1.196   c2.813,25.521,11.465,49.307,24.595,69.989l-42.603,42.603l-49.394-49.394l-21.213,21.213l49.394,49.394l-49.394,49.394   l21.213,21.213l49.394-49.394l49.394,49.394l21.213-21.213l-49.394-49.394l39.866-39.866   c19.806,21.343,45.174,37.449,73.777,45.992C298.609,356.642,285.143,387.752,261.62,411.74z M406.304,298.983l-6.421-8.92   c-6.463,1.718-24.576,10.163-52.659,10.163c-74.439,0-135-60.561-135-135s60.561-135,135-135s135,60.561,135,135   c0,70.124-50.713,104.74-53.044,107.785l3.735,9.692c4.316,11.202,15.655,31.076,25.152,46.957   C437.475,327.108,418.584,316.043,406.304,298.983z" />
                      <polygon points="411.618,124.619 332.225,204.012 282.831,154.619 261.618,175.832 332.225,246.439 432.831,145.832" />
                    </g>
                  </svg>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {siteNavigation.map(({ label, to }) => (
                      <HeaderLink to={to} label={label} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <button
                    type="button"
                    className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <Menu as="div" className="ml-3 relative">
                    <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user?.user_metadata.avatar_url}
                        alt="Avatar"
                      />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((link) => (
                          <Menu.Item key={link.label}>
                            {({ active }) => (
                              <button
                                className={classnames(
                                  active ? "bg-gray-100" : "",
                                  "flex w-full px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                {link.label}
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </header>
          </div>
          <Disclosure.Panel className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {siteNavigation.map(({ label, to }) => (
                <HeaderLink to={to} label={label} />
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user?.user_metadata.avatar_url}
                    alt="Avatar"
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">
                    {user?.user_metadata.full_name}
                  </div>
                </div>
                <button
                  type="button"
                  className="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-3 px-2 space-y-1">
                {userNavigation.map(({ label, to }) => (
                  <UserLink
                    to={to}
                    label={label}
                    className="block w-full px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                  />
                ))}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
