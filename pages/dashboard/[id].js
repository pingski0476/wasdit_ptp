import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { useRealisasi } from "../../components/Fetch";
import pocketbaseEs from "pocketbase";
import { useEffect, useState } from "react";

const DetailsKegiatan = () => {
  const [id, setId] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  const client = new pocketbaseEs("http://127.0.0.1:8090/");

  const getNamaKegiatan = async () => {
    const namaResponse = await client.records.getOne(
      "kegiatan_diseminasi",
      `${id}`
    );
    return namaResponse;
  };

  const { data: nama_kegiatan, status: status_nama } = useQuery(
    ["nama_kegiatan"],
    getNamaKegiatan,
    {
      refetchOnWindowFocus: false,
      enabled: !!id,
    }
  );

  const { data: realisasi, status: status_realisasi } = useRealisasi({
    refetchOnWindowFocus: false,
    enabled: !!id,
  });

  if (status_nama === "loading") {
    return <div>Loading . . .</div>;
  }

  const realisasiKegiatan = realisasi.filter((r) => {
    return r.kegiatan === id;
  });

  return (
    <main>
      <div className="w-full text-center my-4">
        <h2 className="font-noto font-semibold text-2xl">
          {`${nama_kegiatan.kegiatan} (${nama_kegiatan.kode_mak})`}
        </h2>
      </div>
      <table className="table-auto w-full border-collapse border border-slate-400">
        <thead>
          <tr className="font-noto font-normal text-md bg-teal-100">
            <th className="p-2 border border-slate-400">
              <div className="text-center">No.</div>
            </th>
            <th className="p-2 border border-slate-400">
              <div className="text-center">Nama Kegiatan</div>
            </th>
            <th className="p-2 border border-slate-400">
              <div className="text-center">Realisasi</div>
            </th>
          </tr>
        </thead>
        <tbody className="font-noto font-normal text-sm">
          {realisasiKegiatan.map((listRealisasi, index) => {
            const nilaiRealisasi = new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(listRealisasi.realisasi);
            return (
              <tr key={listRealisasi.id}>
                <td className="p-2 border border-slate-400">
                  <div className="text-center">{index + 1}</div>
                </td>
                <td className="p-2 border border-slate-400">
                  <div className="text-left">{listRealisasi.nama_kegiatan}</div>
                </td>
                <td className="p-2 border border-slate-400">
                  <div className="text-right">{nilaiRealisasi}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
};

export default DetailsKegiatan;
