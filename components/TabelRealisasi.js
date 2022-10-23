export default function TabelRealisasi({ realisasi, total }) {
  return (
    <>
      <div className="w-full mb-8 overflow-hidden rounded-lg shadow-xs ">
        <div className="w-full overflow-x-auto">
          <table className="w-full whitespace-no-wrap">
            <thead>
              <tr className=" font-noto font-semibold tracking-wide text-center text-gray-700 uppercase border-b bg-gray-50">
                <td className="px-1 py-3">No.</td>
                <td className="px-4 py-3">Nama Kegiatan</td>
                <td className="px-4 py-3">Realisasi Anggaran</td>
              </tr>
            </thead>
            <tbody className="bg-white divide-y font-noto ">
              {realisasi?.map((detailRealisasi, index) => {
                let nilaiRealisasi = new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(detailRealisasi.realisasi);
                return (
                  <tr className="text-gray-700" key={detailRealisasi.id}>
                    <td className="px-1 py-3 text-center text-sm">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-left text-sm">
                      {detailRealisasi.nama_kegiatan}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      {nilaiRealisasi}
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
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
