import { useAtom } from "jotai";
import Head from "next/head";
import { useKegiatan, client } from "../../components/Fetch";
import TabelAnggaran from "../../components/TabelAnggaran";
import Admin from "../../layout/Admin";
import { userAtom } from "../../store/store";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  // const { data: kegiatan, status: status_kegiatan } = useKegiatan({
  //   refetchOnMount: false,
  //   refetchOnWindowFocus: false,
  // });

  const [userData] = useAtom(userAtom);
  console.log(userData);

  const getWasdit = async () => {
    const res = await client.records.getFullList(
      `kegiatan_${userData.name}`,
      400
    );
    return res;
  };

  const { data: kegiatan, status: status_kegiatan } = useQuery(
    ["datakegiatan"],
    getWasdit,
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  if (status_kegiatan === "loading") {
    return <div>Loading . . . .</div>;
  }

  if (status_kegiatan === "error") {
    return <div>{error_kegiatan}</div>;
  }

  const anggaran = kegiatan.map((item) => {
    return item.pagu_anggaran;
  });

  const totalAnggaran = anggaran.reduce(
    (accumulator, value) => accumulator + value
  );

  let formatAnggaran = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(totalAnggaran);
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
          <TabelAnggaran kegiatan={kegiatan} total={formatAnggaran} />
        </main>
      </div>
    </Admin>
  );
}
