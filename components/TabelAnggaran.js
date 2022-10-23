import Link from "next/link";
import React from "react";

export default function TabelAnggaran({
  kegiatan,
  realisasi,
  total,
  totalrealisasi,
}) {
  return (
    <>
      <div className=" bg-white w-full mb-8 overflow-hidden rounded-lg shadow-xs ">
        <div className="w-full overflow-x-auto">
          <table className="w-full whitespace-no-wrap">
            <thead>
              <tr className=" font-noto font-semibold tracking-wide text-center text-gray-700 uppercase border-b bg-white">
                <td className="px-1 py-3">Kode MAK</td>
                <td className="px-4 py-3">Nama Kegiatan</td>
                <td className="px-4 py-3">Pagu Anggaran</td>
                <td className="px-4 py-3">Detail Kegiatan</td>
              </tr>
            </thead>
            <tbody className="bg-white divide-y font-noto ">
              {kegiatan?.map((dataKegiatan) => {
                let nilai = new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(dataKegiatan.pagu_anggaran);
                return (
                  <tr className="text-gray-700" key={dataKegiatan.id}>
                    <td className="px-1 py-3 text-center text-sm">
                      {dataKegiatan.kode_mak}
                    </td>
                    <td className="px-4 py-3 text-left text-sm">
                      {dataKegiatan.kegiatan}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">{nilai}</td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={`/subkoordinator/${dataKegiatan.id}`}
                        key={dataKegiatan.id}
                      >
                        <button className="p-2 text-sm bg-emerald-500 rounded-md  text-white hover:bg-emerald-600">
                          {" "}
                          Details
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
              <tr className="text-gray-700">
                <td className="px-1 py-3"></td>
                <td className="px-4 py-3 text-center text-sm font-bold">
                  Total
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold">
                  {total}
                </td>
                <td className="px-4 py-3 text-center text-sm font-bold">
                  {totalrealisasi}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
