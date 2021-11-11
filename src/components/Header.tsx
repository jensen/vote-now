import { Fragment } from "react";
import classnames from "classnames";
import { useMatch, Link } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { useAuth } from "context/auth";
import { DiscordLoginButton } from "./LoginButton";
import Logo from "components/Logo";

const siteNavigation = [{ label: "Projects", to: "/projects" }];

const userNavigation = [
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
  const active = useMatch(props.to) !== null;

  return (
    <Link
      className={classnames(" px-3 py-2 rounded-md text-sm font-medium", {
        "bg-gray-900 text-white": active === true,
        "text-gray-300 hover:bg-gray-700 hover:text-white": active === false,
      })}
      aria-current="page"
      to={props.to}
    >
      {props.label}
    </Link>
  );
};

interface IUserLink {
  to: string;
  label: string;
  className: string;
}

const UserLink = (props: IUserLink) => (
  <Link className={props.className} role="menuitem" tabIndex={-1} to={props.to}>
    {props.label}
  </Link>
);

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
                  <Link to="/">
                    <Logo />
                  </Link>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {siteNavigation.map(({ label, to }) => (
                      <HeaderLink key={label} to={to} label={label} />
                    ))}
                  </div>
                </div>
              </div>
              {user ? (
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
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
                                <Link
                                  className={classnames(
                                    active ? "bg-gray-100" : "",
                                    "flex w-full px-4 py-2 text-sm text-gray-700"
                                  )}
                                  to="/logout"
                                >
                                  {link.label}
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              ) : (
                <DiscordLoginButton />
              )}
              {user && (
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
              )}
            </header>
          </div>
          <Disclosure.Panel className="md:hidden">
            {({ close }) => (
              <>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {siteNavigation.map(({ label, to }) => (
                    <HeaderLink key={label} to={to} label={label} />
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
                  </div>
                  <div className="mt-3 px-2 space-y-1">
                    {userNavigation.map(({ label, to }) => (
                      <div onClick={() => close()}>
                        <UserLink
                          key={label}
                          to={to}
                          label={label}
                          className="block w-full px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
