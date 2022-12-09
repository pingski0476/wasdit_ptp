import { useRouter } from "next/router";
import { useQuery, QueryClient, dehydrate } from "@tanstack/react-query";
import { client, getUserState } from "../../components/Fetch";
import { useEffect, useState } from "react";
import Admin from "../../layout/Admin";
import TabelRealisasi from "../../components/TabelRealisasi";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { useAtom } from "jotai";
import { addModalRealAtom } from "../../store/store";
import AddModalReal from "../../components/AddModalReal";
import LoadingScreen from "../../components/LoadingScreen";

export async function getServerSideProps() {
  const queryclient = new QueryClient();
  await queryclient.prefetchQuery(["users"], getUserState);
  return {
    props: {
      dehydratedState: dehydrate(queryclient),
    },
  };
}

const DetailsKegiatan = () => {
  const [id, setId] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  //get user global state for database profiling
  const { data: userData } = useQuery(["users"], getUserState);

  //setting add modal state
  const [, setIsOpenAddReal] = useAtom(addModalRealAtom);

  const getNamaKegiatan = async () => {
    const namaResponse = await client.records.getOne(
      `kegiatan_${userData?.kelompok}`,
      `${id}`
    );
    return namaResponse;
  };

  const getRealisasiKegiatan = async () => {
    const resRealisasi = await client.records.getFullList(
      `realisasi_${userData?.kelompok}`,
      200
    );
    return resRealisasi;
  };

  const { data: nama_kegiatan, status: status_nama } = useQuery(
    ["nama_kegiatan"],
    getNamaKegiatan,
    {
      refetchOnWindowFocus: false,
      enabled: !!id,
    }
  );

  const { data: realisasi, status: status_realisasi } = useQuery(
    ["realisasi"],
    getRealisasiKegiatan,
    {
      refetchOnWindowFocus: false,
      enabled: !!userData,
    }
  );

  if (status_nama === "loading") {
    return <LoadingScreen />;
  }

  const realisasiKegiatan = realisasi?.filter((r) => {
    return r.kegiatan === id;
  });

  const nilaiRealisasi = realisasiKegiatan?.map((item) => {
    return item.realisasi;
  });

  const totalRealisasi = nilaiRealisasi?.reduce(
    (accu, value) => accu + value,
    0
  );

  const sisaAnggaran = nama_kegiatan?.pagu_anggaran - totalRealisasi;

  let formatRealisasi = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(totalRealisasi);

  let formatSisa = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(sisaAnggaran);
  return (
    <Admin>
      <Head>
        <title>Realisasi {nama_kegiatan.kegiatan}</title>
        <link
          rel="icon"
          type="image/x-icon"
          href='../../public/favicon.ico'
        />
      </Head>
      <main>
        <div className="w-full text-center my-4">
          <h2 className="font-noto font-semibold text-2xl">
            {`${nama_kegiatan.kegiatan} (${nama_kegiatan.kode_mak})`}
          </h2>
          <AddModalReal
            user={userData}
            kegiatan={nama_kegiatan}
            sisaAnggaran={formatSisa}
          />
        </div>
        {userData?.jabatan === "pumk" ? (
          <div className="w-full flex justify-start my-2 px-2 py-2">
            <button
              onClick={() => setIsOpenAddReal(true)}
              className="px-2 py-2 text-sm bg-blue-500 text-white font-noto rounded-md hover:bg-blue-600"
            >
              <FontAwesomeIcon icon={faCirclePlus} className="mr-2" />
              Input Realisasi
            </button>
          </div>
        ) : (
          <></>
        )}
        <TabelRealisasi
          realisasi={realisasiKegiatan}
          user={userData}
          kegiatan={nama_kegiatan}
          total={formatRealisasi}
          sisa={formatSisa}
        />
      </main>
    </Admin>
  );
};

export default DetailsKegiatan;
