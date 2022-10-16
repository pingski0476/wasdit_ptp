import Link from "next/link";
import { useState } from "react";

function Sidebar() {
  const [toggle, setToggle] = useState(false);

  return (
    <aside className="h-screen z-20 hidden  w-64 md:block bg-white flex-shrink-0 ">
      <div className="py-4 text-gray-500 font-noto">
        <a className="ml-6 text-lg font-bold text-gray-800">Wasdit PTP</a>
        <ul className="mt-6">
          <Link href={"/dashboard"}>
            <li className="relative  mx-2">
              <button className="inline-flex items-center px-6 py-3 w-full rounded-md text-sm font-semibold text-gray-800 hover:text-gray-50 hover:bg-green-500   transition-colors">
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>

                <span className="ml-4">Dashboard</span>
              </button>
            </li>
          </Link>
        </ul>
        <ul>
          <li className="relative mx-2 ">
            <button
              onClick={toggle ? () => setToggle(false) : () => setToggle(true)}
              className="inline-flex px-6 py-3 hover:bg-green-500 rounded-md items-center w-full text-sm font-semibold transition-colors duration-150 text-gray-800 hover:text-gray-50"
              aria-controls="dropdown"
              data-collapse-toggle="dropdown"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              <span className="ml-4">Wasdit</span>
              <svg
                sidebar-toggle-item=""
                className="w-6 h-6 ml-3"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            {toggle ? (
              <ul>
                <li>
                  <a className="inline-flex items-center px-6 py-3 w-full rounded-md text-sm font-semibold text-gray-800 hover:text-gray-50 hover:bg-green-500   transition-colors">
                    <span class="ml-9">Wasdit Diseminasi</span>
                  </a>
                </li>
                <li>
                  <a className="inline-flex items-center px-6 py-3 w-full rounded-md text-sm font-semibold text-gray-800 hover:text-gray-50 hover:bg-green-500   transition-colors">
                    <span class="ml-9">Wasdit Tata Kelola</span>
                  </a>
                </li>
              </ul>
            ) : (
              <></>
            )}
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
