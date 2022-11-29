import Head from "next/head";
import { client, getUserState } from "../../components/Fetch";
import TabelAnggaran from "../../components/TabelAnggaran";
import Card from "../../components/Card";
import Admin from "../../layout/Admin";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { useAtom } from "jotai";
import AddModal from "../../components/AddModal";
import { modalAddAtom } from "../../store/store";

export async function getServerSideProps() {
  const queryclient = new QueryClient();
  await queryclient.prefetchQuery(["users"], getUserState);
  return {
    props: {
      dehydratedState: dehydrate(queryclient),
    },
  };
}

export default function Pumk() {
  //router initialization
  const router = useRouter();

  //listen to userprofile data that refer to their database
  const { data: userData } = useQuery(["users"], getUserState);

  //defining atom for modal state to add kegiatan
  const [, setIsOpenAdd] = useAtom(modalAddAtom);

  //listening user state if has login they can continue, if not they will back to login screen
  useEffect(() => {
    if (client.authStore.token) {
      if (userData?.jabatan === "pumk") {
        router.push("/pumk");
      }
      if (userData?.jabatan === "koordinator") {
        router.push("/koordinator");
      }
      if (userData?.jabatan === "subkoordinator") {
        router.push("/subkoordinator");
      }
    } else {
      router.push("/");
    }
  }, [client.authStore.token]);

  //get data kegiatan
  const getWasdit = async () => {
    const res = await client.records.getFullList(
      `kegiatan_${userData?.kelompok}`,
      400
    );
    return res;
  };

  const getRealisasiKegiatan = async () => {
    const resRealisasi = await client.records.getFullList(
      `realisasi_${userData?.kelompok}`,
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
    return <div>Loading . . . .</div>;
  }

  if (status_kegiatan === "error") {
    return <div>{error_kegiatan}</div>;
  }

  //splitting anggaran into two subcoordinators
  const kegiatanSubkoord1 = kegiatan.filter((k1) => {
    return k1.subkoordinator === userData.kegiatan1;
  });

  const kegiatanSubkoord2 = kegiatan.filter((k2) => {
    return k2.subkoordinator === userData.kegiatan2;
  });

  const anggaranSubkoord1 = kegiatanSubkoord1.map((item) => {
    return item.pagu_anggaran;
  });

  const anggaranSubkoord2 = kegiatanSubkoord2.map((item) => {
    return item.pagu_anggaran;
  });

  const totalAnggaran1 = anggaranSubkoord1?.reduce(
    (accu, value) => accu + value,
    0
  );

  const totalAnggaran2 = anggaranSubkoord2?.reduce(
    (accu, value) => accu + value,
    0
  );

  //splitting realisasi into two subcoordinators
  const realisasiSubkoord1 = realisasi?.filter((r1) => {
    return r1.dalam_rangka === userData.kegiatan1;
  });

  const realisasiSubkoord2 = realisasi?.filter((r2) => {
    return r2.dalam_rangka === userData.kegiatan2;
  });

  const realisasi1 = realisasiSubkoord1?.map((real) => {
    return real.realisasi;
  });

  const realisasi2 = realisasiSubkoord2?.map((real) => {
    return real.realisasi;
  });

  const totalRealiasi1 = realisasi1?.reduce((accu, value) => accu + value, 0);

  const totalRealiasi2 = realisasi2?.reduce((accu, value) => accu + value, 0);

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
  let formatRealisasi1 = new Intl.NumberFormat("default", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(totalRealiasi1 / totalAnggaran1);

  let formatRealisasi2 = new Intl.NumberFormat("default", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(totalRealiasi2 / totalAnggaran2);

  let formatRealisasi = new Intl.NumberFormat("default", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(totalRealisasiAnggaran / totalAnggaran);

  let formatRealisasiRupiah1 = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(totalRealiasi1);

  let formatRealisasiRupiah2 = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(totalRealiasi2);

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
        </Head>

        <main className="container w-full flex flex-col justify-center items-center overflow-x-auto">
          <div className="w-full flex justify-start my-2 px-2 py-2">
            <h1 className="font-noto font-bold text-xl">Dashboard</h1>
          </div>

          <AddModal userData={userData} />
          <div className="w-full flex gap-5 justify-start my-2 px-2 py-2">
            <Card title={"Realisasi Bidang (%)"} total={formatRealisasi} />
            <Card
              title={"Realisasi Bidang (Rp.)"}
              total={formatRealisasiRupiah}
            />
            <Card
              title={"Realisasi Tata Kelola TI (%)"}
              total={formatRealisasi1}
            />
            <Card
              title={"Realisasi Tata Kelola TI (Rp.)"}
              total={formatRealisasiRupiah1}
            />
            <Card title={"Realisasi Diseminasi (%)"} total={formatRealisasi2} />
            <Card
              title={"Realisasi Diseminasi (Rp.)"}
              total={formatRealisasiRupiah2}
            />
          </div>
          {userData?.jabatan === "pumk" ? (
            <div className="w-full flex justify-start my-2 px-2 py-2">
              <button
                onClick={() => setIsOpenAdd(true)}
                className="px-2 py-2 bg-blue-500 text-white font-noto rounded-md hover:bg-blue-600"
              >
                <FontAwesomeIcon icon={faCirclePlus} className="mr-1" />
                Tambah Kegiatan
              </button>
            </div>
          ) : (
            <></>
          )}

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
