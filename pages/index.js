import Head from "next/head";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { client, getUserState } from "../components/Fetch";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { errorAtom } from "../store/store";
import { useAtom } from "jotai";
import Alert from "../components/Alert";

export async function getServerSideProps() {
  const queryclient = new QueryClient();
  await queryclient.prefetchQuery(["users"], getUserState);
  return {
    props: {
      dehydratedState: dehydrate(queryclient),
    },
  };
}

export default function Home() {
  //inisialisasi router untuk force routing saat sudah login
  const router = useRouter();

  //show error on login failure
  const [showError, setShowError] = useAtom(errorAtom);

  //const set error message props
  const [error, setError] = useState("");

  //listen to userprofile data that refer to their database
  const { data: userData } = useQuery(["users"], getUserState);

  //inisialisasi fungsi form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //inisialisasi fungsi untuk login
  const loginHandler = async (data) => {
    try {
      await client.users.authViaEmail(data.username, data.password);
    } catch (error) {
      setShowError(true);
      setError(error.message);
    }
  };

  //untuk membaca kondisi state user jika sudah login diarahkan ke /dashboard
  useEffect(() => {
    if (client.authStore.token) {
      if (userData) {
        router.push(`/${userData.jabatan}`);
      }
    }
  }, [client.authStore.token, router, userData]);

  return (
    <>
      <Head>
        <title>Login Wasdit PTP</title>
        <link
          rel="icon"
          type="image/x-icon"
          href="../public/logo-kementan.svg"
        />
      </Head>
      <main className="w-full bg-green-100 h-screen flex justify-center items-center ">
        <div className="w-96 bg-white  h-fit shadow-md rounded-lg px-8 py-6">
          {showError ? <Alert message={error} /> : <></>}
          <div className="w-full">
            <h1 className="font-bold font-noto text-2xl text-center mb-4">
              Login
            </h1>
          </div>
          <form method="post" onSubmit={handleSubmit(loginHandler)}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold font-noto mb-2 ">
                Username
              </label>
              <input
                name="username"
                type="text"
                {...register("username")}
                className="shadow appearance-none border rounded-md w-full px-2 py-3 text-gray-800 leading-tight focus:outline-none focus:shadow-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold font-noto mb-2 ">
                Password
              </label>
              <input
                name="password"
                type="password"
                {...register("password")}
                className="shadow appearance-none border rounded-md w-full px-2 py-3 text-gray-800 leading-tight focus:outline-none focus:shadow-none"
              />
            </div>
            <div className="w-full flex justify-center items-center mt-2">
              <button className="w-2/5 bg-blue-500 px-2 py-3 rounded-lg font-noto font-bold text-white hover:bg-blue-600 hover:shadow-md">
                Sign In
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
