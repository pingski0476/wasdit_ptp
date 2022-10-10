import Head from "next/head";
import Link from "next/link";
import { useKegiatan } from "../../components/Fetch";

export default function Dashboard() {
  const { data: kegiatan, status: status_kegiatan } = useKegiatan({
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (status_kegiatan === "loading") {
    return <div>Loading . . . .</div>;
  }

  if (status_kegiatan === "error") {
    return <div>{error_kegiatan}</div>;
  }
  return (
    <div>
      <Head>
        <title>Dashboard Wasdit PTP</title>
      </Head>

      <main className="container w-full flex justify-center items-center">
        <table className="table-auto mt-4 border-collapse border border-slate-400 ">
          <thead className="text-md font-noto">
            <tr className="bg-slate-100">
              <th className="p-2 border border-slate-400">
                <div className="text-center">Kode MAK</div>
              </th>
              <th className="p-2 border border-slate-400">
                <div className="text-center">Nama Kegiatan</div>
              </th>
              <th className="p-2 border border-slate-400">
                <div>Pagu Anggaran</div>
              </th>
              <th className="p-2 border border-slate-400">
                <div>Detail Kegiatan</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {kegiatan.map((dataKegiatan) => {
              let nilai = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(dataKegiatan.pagu_anggaran);
              return (
                <tr className="font-noto text-sm" key={dataKegiatan.id}>
                  <td className="p-2 border border-slate-400">
                    <div className="text-center">{dataKegiatan.kode_mak}</div>
                  </td>
                  <td className="p-2 border border-slate-400">
                    <div className="text-left">{dataKegiatan.kegiatan}</div>
                  </td>
                  <td className="p-2 border border-slate-400">
                    <div className="text-right">{nilai}</div>
                  </td>
                  <td className="p-2 border border-slate-400 flex justify-center">
                    <Link
                      href={`/dashboard/${dataKegiatan.id}`}
                      key={dataKegiatan.id}
                    >
                      <button className="p-2 bg-indigo-500 rounded-md font-semibold text-white hover:bg-indigo-700 ">
                        Details
                      </button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>
    </div>
  );
}
