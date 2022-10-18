import { useQuery } from "@tanstack/react-query";
import pocketbaseEs from "pocketbase";

export const client = new pocketbaseEs("http://127.0.0.1:8090/");

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

const getRealisasi = async () => {
  const res = await client.records.getFullList("realisasi_diseminasi", 200);
  return res;
};
// Fungsi Fetch Data Kegiatan
export const useKegiatan = () => useQuery(["kegiatan"], getWasdit);

//Fungsi Fetch Data Realisasi
export const useRealisasi = () => useQuery(["realisasi"], getRealisasi);
