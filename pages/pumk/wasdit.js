import { useForm } from "react-hook-form";
import { useState, useEffect, useMemo } from "react";
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

const InputWasdit = () => {
  //inisialisasi state form, jika sudah true maka akan di reset
  const [safeToReset, setSafeToReset] = useState(false);

  //inisialisasi fungsi filter untuk kegiatan
  const [filter, setFilter] = useState("");

  //listen to userprofile data that refer to their database
  const { data: userData } = useQuery(["users"], getUserState);

  //data kegiatan fetching function initialization
  const getKegiatan = async () => {
    const res = await client.records.getFullList(
      `kegiatan_${userData?.kelompok}`,
      400
    );
    return res;
  };

  //data fetching and caching
  const { data: dataKegiatan } = useQuery(["kegiatan"], getKegiatan, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!userData,
  });

  //initialize useForm hook
  const { handleSubmit, register, reset } = useForm();

  //initialize submit function
  const submitDataHandler = async (data) => {
    try {
      await client.records.create(`realisasi_${userData?.kelompok}`, data);
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

  //kegiatan filtering function, select using radio button
  const nama_kegiatan = useMemo(
    () => dataKegiatan?.filter((k) => k.subkoordinator === filter),
    [filter]
  );

  return (
    <Admin>
      <Head>
        <title>Input Wasdit</title>
        <link
          rel="icon"
          type="image/x-icon"
          href="../public/logo-kementan.svg"
        />
      </Head>

      <main className="container w-full flex flex-col justify-center items-center overflow-x-auto">
        <div className="w-full flex justify-start my-2 px-2 py-2">
          <h1 className="font-noto font-bold text-xl">Input Realisasi</h1>
        </div>
        <div className="w-full flex-1 px-6">
          <form
            method="post"
            className="bg-white p-4 mx-auto"
            onSubmit={handleSubmit(submitDataHandler)}
          >
            <div className="flex flex-col mt-4 mb-4">
              <h3 className="font-noto font-semibold mb-2">Dalam Rangka</h3>
              <div className="flex">
                <div className="flex items-center mr-4">
                  <input
                    id="inline-radio"
                    onClick={() => setFilter("tata_kelola")}
                    type={"radio"}
                    name="dalam_rangka"
                    value={"tata_kelola"}
                    {...register("dalam_rangka")}
                    className="form-radio w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500  focus:ring-2 "
                  />
                  <label
                    for="inline-radio"
                    className="ml-2 text-sm font-medium text-gray-900"
                  >
                    Tata Kelola TI
                  </label>
                </div>
                <div className="flex items-center mr-4">
                  <input
                    id="inline-2-radio"
                    onClick={() => setFilter("diseminasi")}
                    type={"radio"}
                    name="dalam_rangka"
                    value={"diseminasi"}
                    {...register("dalam_rangka")}
                    className="form-radio w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500  focus:ring-2 "
                  />
                  <label
                    for="inline-2-radio"
                    className="ml-2 text-sm font-medium text-gray-900"
                  >
                    Diseminasi Informasi IPTEK Pertanian
                  </label>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="font-noto font-semibold">Induk Kegiatan</label>
              <select
                className="form-select px-4 py-3 rounded-md my-3"
                name="kegiatan"
                {...register("kegiatan")}
              >
                <option value={"none"} defaultValue disabled>
                  Pilih Kegiatan
                </option>
                {nama_kegiatan?.map((kegiatan) => {
                  return (
                    <option key={kegiatan.id} value={kegiatan.id}>
                      {kegiatan.kegiatan}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-noto font-semibold ">Nama Kegiatan</label>
              <textarea
                type={"text"}
                className="form-input rounded-md my-2"
                name="nama_kegiatan"
                {...register("nama_kegiatan")}
              />
            </div>
            <div className="flex flex-col mt-3">
              <label className="font-noto font-semibold ">Realisasi</label>
              <input
                type={"number"}
                className="form-input rounded-md my-2"
                name="realisasi"
                {...register("realisasi")}
              />
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

export default InputWasdit;
