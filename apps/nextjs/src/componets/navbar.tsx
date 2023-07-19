import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import React, { useState } from "react";

interface NavbarProps {
  links: Array<string>;
  linkNames: Array<string>;
}

export const Navbar: React.FC<NavbarProps> = (props) => {
  const { isSignedIn } = useAuth();
  const [expand, setExpand] = useState<boolean>(false);

  return (
    <>
      <nav className="border-gray-200 bg-white dark:bg-gray-900">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
          <a href="https://flowbite.com" className="flex items-center">
            <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
              Scheduler
            </span>
          </a>
          <div className="flex items-center ">
            {isSignedIn && (
              <>
                <p className="text-sm  text-blue-600 hover:underline dark:text-blue-500">
                  Logged In
                </p>
              </>
            )}
            {!isSignedIn && (
              <p className=" hover:text-materialUI-LightOnSecondary dark:hover:text-materialUI-DarkTertiary  text-materialUI-LightOnPrimary dark:text-materialUI-DarkOnPrimary mx-auto mt-4 mr-4 block self-center p-1 hover:font-bold md:mt-0  md:inline-block">
                <Link
                  className="text-sm text-blue-600 hover:underline dark:text-blue-500"
                  href="/sign-in"
                >
                  Sign In
                </Link>
              </p>
            )}
          </div>
        </div>
      </nav>
      <nav className="bg-gray-50 dark:bg-gray-700">
        <div className="mx-auto max-w-screen-xl px-4 py-3">
          <div className="flex items-center">
            <ul className="mt-0 mr-6 flex flex-row space-x-8 text-sm font-medium">
              {props.links.map((link: any, index: number) => {
                return (
                  <li>
                    <a
                      href={link}
                      className="text-gray-900 hover:underline dark:text-white"
                      aria-current="page"
                    >
                      {props.linkNames[index]}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
      {/* <nav className="relative top-0 left-0 z-20 h-[10vh] w-full border-b  border-gray-200 bg-white pb-4 dark:border-gray-600 dark:bg-gray-900">
        <div className="float-left mx-auto flex h-16 max-w-screen-xl flex-wrap items-center justify-between p-4">
          <a href="/" className="flex items-center">
            <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
              Scheduler
            </span>
          </a>
        </div>
        <div className="float-right block p-3 md:hidden">
          <button
            data-collapse-toggle="navbar-dropdown"
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
            aria-controls="navbar-dropdown"
            aria-expanded="false"
            onClick={() => setExpand(!expand)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-5 w-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div className="block w-full flex-grow md:flex md:w-auto md:items-center">
          {expand ? (
            <>
              <div className="block text-sm md:hidden md:flex-grow">
                {props.links.map((link: any, index: number) => {
                  return (
                    <Link
                      href={link}
                      className="block text-white hover:font-bold sm:pb-4 sm:pt-4 md:inline-block md:bg-transparent md:px-4  "
                      key={index.toString()}
                    >
                      {props.linkNames[index]}
                    </Link>
                  );
                })}
                {isSignedIn && (
                  <>
                    <p className="hover:text-materialUI-LightOnSecondary dark:hover:text-materialUI-DarkTertiary text-materialUI-LightOnPrimary dark:text-materialUI-DarkOnPrimary mt-4 mr-4 block p-1 hover:font-bold md:mt-0  md:inline-block">
                      Logged In
                    </p>
                  </>
                )}
                {!isSignedIn && (
                  <p className="hover:text-materialUI-LightOnSecondary dark:hover:text-materialUI-DarkTertiary text-materialUI-LightOnPrimary dark:text-materialUI-DarkOnPrimary mt-4 mr-4 block p-1 hover:font-bold md:mt-0  md:inline-block">
                    <Link
                      className="inline-block text-white hover:font-bold sm:pb-4 sm:pt-4 md:inline-block md:bg-transparent md:px-4 "
                      href="/sign-in"
                    >
                      Sign In
                    </Link>
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div></div>
            </>
          )}
          <div className="hidden text-sm md:block md:flex-grow">
            {props.links.map((link: any, index: number) => {
              return (
                <Link
                  href={link}
                  className="inline-block text-white hover:font-bold sm:pb-4 sm:pt-4 md:inline-block md:bg-transparent md:px-4 "
                  key={index.toString()}
                >
                  {props.linkNames[index]}
                </Link>
              );
            })}

            {isSignedIn && (
              <>
                <p className="hover:text-materialUI-LightOnSecondary dark:hover:text-materialUI-DarkTertiary text-materialUI-LightOnPrimary dark:text-materialUI-DarkOnPrimary mt-4 mr-4 block p-1 hover:font-bold md:mt-0  md:inline-block">
                  Logged In
                </p>
              </>
            )}
            {!isSignedIn && (
              <p className="hover:text-materialUI-LightOnSecondary dark:hover:text-materialUI-DarkTertiary text-materialUI-LightOnPrimary dark:text-materialUI-DarkOnPrimary mt-4 mr-4 block p-1 hover:font-bold md:mt-0  md:inline-block">
                <Link
                  className="inline-block text-white hover:font-bold sm:pb-4 sm:pt-4 md:inline-block md:bg-transparent md:px-4 "
                  href="/sign-in"
                >
                  Sign In
                </Link>
              </p>
            )}
          </div>
        </div>
      </nav> */}
    </>
  );
};

export default Navbar;
