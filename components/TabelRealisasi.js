import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  editModalRealAtom,
  editIdModalRealAtom,
  deleteIdModalRealAtom,
  deleteModalRealAtom,
} from "../store/store";
import { useAtom } from "jotai";
import EditModalReal from "./EditModalReal";
import DeleteModalReal from "./DeleteModalReal";
export default function TabelRealisasi({
  sisa,
  realisasi,
  kegiatan,
  total,
  user,
}) {
  //initialize edit modal state
  const [isOpenEditReal, setIsOpenEditReal] = useAtom(editModalRealAtom);

  const [editIdReal, setEditIdReal] = useAtom(editIdModalRealAtom);

  //initializing modal state to trigger modal
  const [, setIsOpenRealDelete] = useAtom(deleteModalRealAtom);

  //getting id that wants to be deleted
  const [, setDeleteIdReal] = useAtom(deleteIdModalRealAtom);

  const sisaAnggaran = total;
  return (
    <>
      <div className="w-full mb-8 overflow-hidden rounded-lg shadow-xs ">
        <div className="w-full overflow-x-auto">
          <EditModalReal
            userData={user}
            sisaAnggaran={sisa}
            kegiatan={kegiatan}
          />

          <DeleteModalReal userData={user} />
          <table className="w-full whitespace-no-wrap">
            <thead>
              <tr className=" font-noto font-semibold tracking-wide text-center text-gray-700 uppercase border-b bg-gray-50">
                <td className="px-1 py-3">No.</td>
                <td className="px-4 py-3">Nama Kegiatan</td>
                <td className="px-4 py-3">Realisasi Anggaran</td>
                {user.jabatan === "pumk" ? (
                  <td className="px-4 py-3">Edit/Hapus Realisasi</td>
                ) : (
                  <></>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y font-noto ">
              {realisasi?.map((detailRealisasi, index) => {
                const sisaAnggaran = sisaAnggaran - detailRealisasi.realisasi;

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
                    {user.jabatan === "pumk" ? (
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => {
                            setEditIdReal(detailRealisasi.id);
                            setIsOpenEditReal(true);
                          }}
                          className="mx-2 p-2 text-sm bg-amber-300 rounded-md  text-gray-800 hover:bg-amber-400"
                        >
                          <FontAwesomeIcon icon={faEdit} className="mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setDeleteIdReal(detailRealisasi.id);
                            setIsOpenRealDelete(true);
                          }}
                          className="p-2 text-sm bg-red-400 rounded-md  text-white hover:bg-red-500"
                        >
                          <FontAwesomeIcon icon={faTrash} className="mr-1" />
                          Delete
                        </button>
                      </td>
                    ) : (
                      <></>
                    )}
                  </tr>
                );
              })}
              <tr className="text-gray-700">
                <td className="px-1 py-3"></td>
                <td className="px-4 py-3 text-center text-sm font-bold">
                  Total Realisasi
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold">
                  {total}
                </td>
                <td className="px-1 py-3"></td>
              </tr>
              <tr className="text-gray-700">
                <td className="px-1 py-3"></td>
                <td className="px-4 py-3 text-center text-sm font-bold">
                  Sisa
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold">
                  {sisa}
                </td>
                <td className="px-1 py-3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
