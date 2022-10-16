import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { useRealisasi } from "../../components/Fetch";
import pocketbaseEs from "pocketbase";
import { useEffect, useState } from "react";
import Admin from "../../layout/Admin";
import TabelRealisasi from "../../components/TabelRealisasi";

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

  const nilaiRealisasi = realisasiKegiatan.map((item) => {
    return item.realisasi;
  });

  const totalRealisasi = nilaiRealisasi.reduce(
    (accu, value) => accu + value,
    0
  );

  let formatRealisasi = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(totalRealisasi);
  return (
    <Admin>
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
