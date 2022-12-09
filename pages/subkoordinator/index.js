import Head from "next/head";
import TabelAnggaran from "../../components/TabelAnggaran";
import Card from "../../components/Card";
import Admin from "../../layout/Admin";
import { getUserState, client } from "../../components/Fetch";
import { useQuery, dehydrate, QueryClient } from "@tanstack/react-query";
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

export default function Dashboard() {
  //router initialization
  const router = useRouter();

  //listen to userprofile data that refer to their database
  const { data: userData } = useQuery(["users"], getUserState);

  //listening user state if has login they can continue, if not they will back to login screen
  useEffect(() => {
    if (client.authStore.token) {
      if (userData?.jabatan === "subkoordinator") {
        router.push("/subkoordinator");
      }
      if (userData?.jabatan === "koordinator") {
        router.push("/koordinator");
      }
      if (userData?.jabatan === "pumk") {
        router.push("/pumk");
      }
    } else {
      router.push("/");
    }
  }, [client.authStore.token]);

  //inisialisasi fungsi fetching data kegiatan dari database
  const getWasdit = async () => {
    const res = await client.records.getFullList(
      `kegiatan_${userData?.kelompok}`,
      400
    );
    return res;
  };

  //inisialisasi fungsi fetching data realisasi dari database
  const getRealisasiKegiatan = async () => {
    const resRealisasi = await client.records.getFullList(
      `realisasi_${userData?.kelompok}`,
      200
    );
    return resRealisasi;
  };

  // fungsi fetching data kegiatan dan disimpan di cache
  const {
    data: dataKegiatan,
    status: status_kegiatan,
    error: error_kegiatan,
  } = useQuery(["kegiatan"], getWasdit, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!userData,
  });

  // fungsi fetching data realisasi dan disimpan di cache
  const { data: dataRealisasi } = useQuery(
    ["realisasi"],
    getRealisasiKegiatan,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: !!userData,
    }
  );

  if (status_kegiatan === "loading") {
    return <LoadingScreen />;
  }

  if (status_kegiatan === "error") {
    return <div>{error_kegiatan}</div>;
  }
  //filtering anggaran berdasar kegiatan
  const kegiatan = dataKegiatan.filter((k) => {
    return k.subkoordinator === userData?.name;
  });

  //filtering realisasi berdasar kegiatan
  const realisasi = dataRealisasi?.filter((r) => {
    return r.dalam_rangka === userData?.name;
  });

  //inputting pagu anggaran into a new array
  const anggaran = kegiatan.map((item) => {
    return item.pagu_anggaran;
  });

  //inputing realisasi into a new array
  const totalRealisasi = realisasi?.map((real) => {
    return real.realisasi;
  });

  //calculating total anggaran kegiatan
  const totalAnggaran = anggaran?.reduce(
    (accumulator, value) => accumulator + value,
    0
  );

  //calculating total realisasi
  const totalRealisasiAnggaran = totalRealisasi?.reduce(
    (accumulator, value) => accumulator + value,
    0
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

  //formating data into currency format
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
          <h1 className="font-noto font-bold text-xl my-6">
            Kegiatan{" "}
            {userData?.name === "tata_kelola"
              ? "Tata Kelola TI"
              : "Diseminasi Informasi IPTEK Pertanian"}
          </h1>
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
