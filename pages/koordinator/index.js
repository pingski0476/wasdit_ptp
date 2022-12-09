import Head from "next/head";
import { client, getUserState } from "../../components/Fetch";
import TabelAnggaran from "../../components/TabelAnggaran";
import Card from "../../components/Card";
import Admin from "../../layout/Admin";
import { dehydrate, useQuery, QueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/router";
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

export default function Koordinator() {
  //router initialization
  const router = useRouter();

  //listen to userprofile data that refer to their database
  const { data: userData } = useQuery(["users"], getUserState);

  //listening user state if has login they can continue, if not they will back to login screen
  useEffect(() => {
    if (client.authStore.token) {
      if (userData?.jabatan === "koordinator") {
        router.push("/koordinator");
      }
      if (userData?.jabatan === "subkoordinator") {
        router.push("/subkoordinator");
      }
      if (userData?.jabatan === "pumk") {
        router.push("/pumk");
      }
    } else {
      router.push("/");
    }
  }, [userData]);

  //get data kegiatan
  const getWasdit = async () => {
    const res = await client.records.getFullList(
      `kegiatan_${userData?.name}`,
      400
    );
    return res;
  };

  const getRealisasiKegiatan = async () => {
    const resRealisasi = await client.records.getFullList(
      `realisasi_${userData?.name}`,
      200
    );
    return resRealisasi;
  };

  const {
    data: kegiatan,
    status: status_kegiatan,
    error: error_kegiatan,
  } = useQuery(["kegiatan"], getWasdit, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!userData,
  });

  const { data: realisasi } = useQuery(["realisasi"], getRealisasiKegiatan, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!userData,
  });

  if (status_kegiatan === "loading") {
    return <LoadingScreen />;
  }

  if (status_kegiatan === "error") {
    return <div>{error_kegiatan}</div>;
  }

  //inputting pagu anggaran into a new array
  const anggaran = kegiatan.map((item) => {
    return item?.pagu_anggaran;
  });

  //inputing realisasi into a new array
  const totalRealisasi = realisasi?.map((real) => {
    return real?.realisasi;
  });

  //calculating total anggaran kegiatan
  const totalAnggaran = anggaran.reduce(
    (accumulator, value) => accumulator + value
  );

  //calculating total realisasi
  const totalRealisasiAnggaran = totalRealisasi?.reduce(
    (accumulator, value) => accumulator + value
  );

  //formatting data into percentage format
  let formatRealisasi = new Intl.NumberFormat("default", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(totalRealisasiAnggaran / totalAnggaran);

  //formating data into currency format
  let formatAnggaran = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(totalAnggaran);

  let formatRealisasiRupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(totalRealisasiAnggaran);

  return (
    <Admin>
      <div>
        <Head>
          <title>Dashboard Wasdit PTP</title>
          <link
            rel="icon"
            type="image/x-icon"
            href='../../public/favicon.ico'
          />
        </Head>

        <main className="container w-full flex flex-col justify-center items-center overflow-x-auto">
          <div className="w-full flex justify-start my-2 px-2 py-2">
            <h1 className="font-noto font-bold text-xl">Dashboard</h1>
          </div>
          <div className="w-full flex gap-10 justify-start my-2 px-2 py-2">
            <Card title={"Realisasi Anggaran (%)"} total={formatRealisasi} />
            <Card
              title={"Realisasi Anggaran (Rp.)"}
              total={formatRealisasiRupiah}
            />
          </div>
          <TabelAnggaran
            kegiatan={kegiatan}
            realisasi={realisasi}
            total={formatAnggaran}
            totalrealisasi={formatRealisasi}
            user={userData}
          />
        </main>
      </div>
    </Admin>
  );
}
