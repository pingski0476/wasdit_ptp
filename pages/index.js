import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import pocketbaseEs from "pocketbase";

export default function Home() {
  const client = new pocketbaseEs("http://127.0.0.1:8090/");

  const getWasdit = async () => {
    const response = await client.records.getFullList(
      "kegiatan_diseminasi",
      200,
      {
        sort: "+created",
      }
    );
    return response;
  };
  1;
  const getRealisasi = async () => {
    const res = await client.records.getFullList("realisasi_diseminasi", 200, {
      sort: "+created",
    });
    return res;
  };
  // get data from Kegiatan dan Realisasi Endpoint
  const { data: kegiatan, status: status_kegiatan } = useQuery(
    ["kegiatan"],
    getWasdit,
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const kegiatanId = kegiatan?.id;

  const { data: realisasi, status: status_realisasi } = useQuery(
    ["realisasi", kegiatanId],
    getRealisasi,
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  if (status_kegiatan == "loading") {
    return <div>Loading . . . .</div>;
  }
  return (
    <div>
      <Head>
        <title>Aplikasi Wasdit PTP</title>
      </Head>
      <main className="container w-full flex justify-center items-center">
        <table className="table-auto mt-4 ">
          {kegiatan.map((dataKegiatan) => {
            let nilai = new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(dataKegiatan.pagu_anggaran);

            const daftar = realisasi.filter((e) => {
              return e.kegiatan === dataKegiatan.id;
            });
            return (
              <>
                <thead
                  className="text-sm font-noto font-medium bg-slate-50"
                  key={dataKegiatan.id}
                >
                  <tr>
                    <th className="p-2">
                      <div className="text-center">{dataKegiatan.kode_mak}</div>
                    </th>
                    <th className="p-2">
                      <div className="text-left">{dataKegiatan.kegiatan}</div>
                    </th>
                    <th className="p-2">
                      <div className="text-right">{nilai}</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm font-noto">
                  {daftar.map((e, index) => {
                    let formatRealisasi = new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(e.realisasi);
                    return (
                      <tr key={e.id}>
                        <td className="p-2">
                          <div className="text-right">{index + 1}</div>
                        </td>
                        <td className="p-2">
                          <div className="text-left">{e.nama_kegiatan}</div>
                        </td>
                        <td className="p-2">
                          <div className="text-right">{formatRealisasi}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </>
            );
          })}
        </table>
      </main>
    </div>
  );
}
