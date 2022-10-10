import { Menu, Transition } from "@headlessui/react";

function Navbar() {
  return (
    <div className="flex flex-col flex-1 w-full">
      <header className="z-10 py-4 bg-white shadow-md">
        <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600">
          {/* Search Input */}
          <div className="flex justify-center flex-1 lg:mr-32">
            <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
              <div className="absolute inset-y-0 flex items-center pl-2">
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type={"text"}
                className="w-full pl-8 pr-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md  focus:placeholder-gray-500 focus:bg-white focus:border-purple-300 focus:outline-none focus:shadow-outline-purple form-input"
              />
            </div>
          </div>
          <ul className="flex items-center flex-shrink-0">
            <li className="relative">
              <div className="fixed to-16 w-56 text-right">
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                    Profile
                  </Menu.Button>
                  <Menu.Items>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          className={`${active && "bg-blue-500"}`}
                          href="/account-settings"
                        >
                          Logout
                        </a>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </div>
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
}

export default Navbar;
