import { useRouter } from "next/router";
import { useQuery, QueryClient, dehydrate } from "@tanstack/react-query";
import { client, getUserState } from "../../components/Fetch";
import { useEffect, useState } from "react";
import Admin from "../../layout/Admin";
import TabelRealisasi from "../../components/TabelRealisasi";
import LoadingScreen from "../../components/LoadingScreen";
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

const DetailsKegiatan = () => {
  //inisialisasi variabel untuk menyimpan id kegiatan
  const [id, setId] = useState("");

  //inisialisasi fungsi untuk membaca query parameter
  const router = useRouter();

  //fungsi membaca query parameter
  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  //get user global state for database profiling
  const { data: userData } = useQuery(["users"], getUserState);

  //fetching data berdasarkan id subkegiatan
  const getNamaKegiatan = async () => {
    const namaResponse = await client.records.getOne(
      `kegiatan_${userData.kelompok}`,
      `${id}`
    );
    return namaResponse;
  };

  //fetching realisasi berdasarkan id subkegiatan
  const getRealisasiKegiatan = async () => {
    const resRealisasi = await client.records.getFullList(
      `realisasi_${userData.kelompok}`,
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

  let formatRealisasi = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(totalRealisasi);
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
        </div>
        <TabelRealisasi realisasi={realisasiKegiatan} total={formatRealisasi} />
      </main>
    </Admin>
  );
};

export default DetailsKegiatan;
