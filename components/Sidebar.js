import Link from "next/link";
import { useState } from "react";
import { useUserProfile } from "./Fetch";

function Sidebar() {
  const [toggleDashboard, setToggleDashboard] = useState(false);
  const [toggleWasdit, setToggleWasdit] = useState(false);
  const [toggleKegiatan, setToggleKegiatan] = useState(false);

  const { data: userData } = useUserProfile();
  // const toggleDash = () => {
  //   if(toggleDashboard){

  //   }
  // };

  return (
    <aside className="h-screen overflow-y-auto sticky top-0 z-20 hidden w-64 md:block bg-emerald-500 flex-shrink-0 ">
      <div className="py-4 text-gray-500 font-noto">
        <a className="ml-6 text-lg font-bold text-white">Wasdit PTP</a>
        <ul className="mt-6">
          <Link href={"/subkoordinator"}>
            <li className="relative  mx-2">
              <button
                onClick={
                  toggleDashboard
                    ? () => setToggleDashboard(false)
                    : () => setToggleDashboard(true)
                }
                className={`${
                  toggleDashboard
                    ? "text-gray-800 bg-white"
                    : "text-white hover:text-gray-800 hover:bg-white"
                } inline-flex items-center px-6 py-3 w-full rounded-md text-sm font-semibold transition-colors `}
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
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>

                <span className="ml-4">Dashboard</span>
              </button>
            </li>
          </Link>
        </ul>
        {userData?.jabatan === "pumk" ? (
          <ul>
            <li className="relative mx-2 ">
              <button
                // onClick={toggleDashboard ? () => toggle() : () => setToggle(true)}
                className="inline-flex px-6 py-3 rounded-md items-center w-full text-sm font-semibold transition-colors duration-150 text-white hover:text-gray-800 hover:bg-white"
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
                <span className="ml-4">Input Kegiatan</span>
              </button>
            </li>
            <li className="relative mx-2 ">
              <button
                // onClick={toggle ? () => setToggle(false) : () => setToggle(true)}
                className="inline-flex px-6 py-3 rounded-md items-center w-full text-sm font-semibold transition-colors duration-150 text-white hover:text-gray-800 hover:bg-white"
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
                <span className="ml-4">Input Wasdit</span>
              </button>
            </li>
          </ul>
        ) : (
          <></>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
