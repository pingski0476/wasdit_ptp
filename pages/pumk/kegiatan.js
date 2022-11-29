import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Admin from "../../layout/Admin";
import { client, getUserState } from "../../components/Fetch";
import { useQuery, dehydrate, QueryClient } from "@tanstack/react-query";
import Head from "next/head";

export async function getServerSideProps() {
  const queryclient = new QueryClient();
  await queryclient.prefetchQuery(["users"], getUserState);
  return {
    props: {
      dehydratedState: dehydrate(queryclient),
    },
  };
}

const InputKegiatan = () => {
  //initialize form state, if this change to true then the form is reset
  const [safeToReset, setSafeToReset] = useState(false);

  //listen to user profile data which refer to their respective database
  const { data: userData } = useQuery(["users"]);

  const { data: nama_kegiatan } = useQuery;

  const { handleSubmit, register, reset } = useForm();

  const submitDataHandler = async (data) => {
    try {
      await client.records.create(`kegiatan_${userData?.kelompok}`, data);
      setSafeToReset(true);
    } catch (error) {
      console.log(error.message);
      console.log(error.response);
    }
  };

  useEffect(() => {
    if (safeToReset) {
      reset();
    }
    setSafeToReset(false);
  }, [safeToReset]);

  let kelompok = userData?.kelompok;
  return (
    <Admin>
      <Head>
        <title>Input Kegiatan</title>
        <link
          rel="icon"
          type="image/x-icon"
          href="../public/logo-kementan.svg"
        />
      </Head>
      <main className="container w-full flex flex-col justify-center items-center overflow-x-auto">
        <div className="w-full flex justify-start my-2 px-2 py-2">
          <h1 className="font-noto font-bold text-xl">Input Kegiatan</h1>
        </div>
        <div className="w-full flex-1 px-6">
          <form
            method="post"
            className="bg-white p-4 mx-auto"
            onSubmit={handleSubmit(submitDataHandler)}
          >
            <div className="flex flex-col">
              <label className="font-noto font-semibold">Kode MAK</label>
              <input
                type={"text"}
                className="form-input rounded-md my-2"
                name="kode_mak"
                {...register("kode_mak")}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-noto font-semibold">Kegiatan</label>
              <input
                type={"text"}
                className="form-input rounded-md my-2"
                name="kegiatan"
                {...register("kegiatan")}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-noto font-semibold">Pagu Anggaran</label>
              <input
                type={"number"}
                className="form-input rounded-md my-2"
                name="pagu_anggaran"
                {...register("pagu_anggaran")}
              />
            </div>
            <div className="flex flex-col mt-4 mb-4">
              <h3 className="font-noto font-semibold mb-2">
                Koordinator/Bagian
              </h3>
              <div className="flex items-center">
                <input
                  id="inline-radio"
                  type={"radio"}
                  name="koordinator"
                  value={userData?.kelompok}
                  defaultChecked={true}
                  className="form-radio w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500  focus:ring-2 "
                />
                <label
                  htmlFor="inline-radio"
                  className="ml-2 text-sm font-medium font-noto text-gray-900"
                >
                  {kelompok?.toUpperCase()}
                </label>
              </div>
            </div>
            <div className="flex flex-col mt-4 mb-4">
              <h3 className="font-noto font-semibold mb-2">Subkoordinator</h3>
              <div className="flex">
                <div className="flex items-center mr-4">
                  <input
                    id="inline-radio"
                    type={"radio"}
                    name="subkoordinator"
                    value={"tata_kelola"}
                    {...register("dalam_rangka")}
                    className="form-radio w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500  focus:ring-2 "
                  />
                  <label
                    htmlFor="inline-radio"
                    className="ml-2 text-sm font-medium text-gray-900"
                  >
                    Tata Kelola TI
                  </label>
                </div>
                <div className="flex items-center mr-4">
                  <input
                    id="inline-2-radio"
                    type={"radio"}
                    name="subkoordinator"
                    value={"diseminasi"}
                    {...register("dalam_rangka")}
                    className="form-radio w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500  focus:ring-2 "
                  />
                  <label
                    htmlFor="inline-2-radio"
                    className="ml-2 text-sm font-medium text-gray-900"
                  >
                    Diseminasi Informasi IPTEK Pertanian
                  </label>
                </div>
              </div>
            </div>

            <button
              className="w-24 py-2 bg-emerald-500 my-3 rounded-md font-noto font-semibold text-white hover:bg-emerald-600"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
      </main>
    </Admin>
  );
};

export default InputKegiatan;
