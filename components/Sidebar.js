import Link from "next/link";
import { useState } from "react";
import { dehydrate, useQuery, QueryClient } from "@tanstack/react-query";
import { getUserState } from "./Fetch";

export async function getServerSideProps() {
  const queryclient = new QueryClient();
  await queryclient.prefetchQuery(["users"], getUserState);
  return {
    props: {
      dehydratedState: dehydrate(queryclient),
    },
  };
}

function Sidebar() {
  const [toggleDashboard, setToggleDashboard] = useState(false);
  const [toggleWasdit, setToggleWasdit] = useState(false);
  const [toggleKegiatan, setToggleKegiatan] = useState(false);

  const { data: userData } = useQuery(["users"], getUserState);

  return (
    <aside className="h-screen overflow-y-auto sticky top-0 z-20 hidden w-64 md:block bg-emerald-500 flex-shrink-0 ">
      <div className="py-4 text-gray-500 font-noto">
        <a className="ml-6 text-lg font-bold text-white">Wasdit PTP</a>
        <ul className="mt-6">
          <Link href={`/${userData?.jabatan}`}>
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
      </div>
    </aside>
  );
}

export default Sidebar;
