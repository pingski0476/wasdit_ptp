import Link from "next/link";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useAtom } from "jotai";
import {
  deleteModalAtom,
  editIdModalAtom,
  modalDeleteAtom,
  modalEditAtom,
} from "../store/store";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";

export default function TabelAnggaran({
  kegiatan,
  realisasi,
  total,
  totalrealisasi,
  user,
}) {
  //setting modal state function to trigger edit modal
  const [, setIsOpenEdit] = useAtom(modalEditAtom);
  //setting modal state function to trigger delete modal
  const [, setIsOpenDelete] = useAtom(modalDeleteAtom);

  //setting modal id that wants to be edited
  const [, setEditId] = useAtom(editIdModalAtom);
  //setting modal id that wants to be deleted
  const [, setDeleteId] = useAtom(deleteModalAtom);

  return (
    <>
      <EditModal userData={user} />
      <DeleteModal userData={user} />
      <div className=" bg-white w-full mb-8 overflow-hidden rounded-lg shadow-xs ">
        <div className="w-full overflow-x-auto">
          <table className="w-full whitespace-no-wrap">
            <thead>
              <tr className=" font-noto font-semibold tracking-wide text-center text-gray-700 uppercase border-b bg-white">
                <td className="px-1 py-3">Kode MAK</td>
                <td className="px-4 py-3">Nama Kegiatan</td>
                <td className="px-4 py-3">Pagu Anggaran</td>
                <td className="px-4 py-3">Detail Kegiatan</td>
                {user.jabatan === "pumk" ? (
                  <td className="px-4 py-3">Edit/Hapus Kegiatan</td>
                ) : (
                  <></>
                )}
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
                        href={`/${user?.jabatan}/${dataKegiatan.id}`}
                        key={dataKegiatan.id}
                      >
                        <button className="p-2 text-sm bg-emerald-500 rounded-md  text-white hover:bg-emerald-600">
                          {" "}
                          Details
                        </button>
                      </Link>
                    </td>
                    {user.jabatan === "pumk" ? (
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => {
                            //setting kegiatan id to get data
                            setEditId(dataKegiatan.id);

                            //setting edit modal state to true to call the modal
                            setIsOpenEdit(true);
                          }}
                          className="mx-2 p-2 text-sm bg-amber-300 rounded-md  text-gray-800 hover:bg-amber-400"
                        >
                          <FontAwesomeIcon icon={faEdit} className="mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            //setting delete id
                            setDeleteId(dataKegiatan.id);
                            //setting delete modal state to true to call the modal
                            setIsOpenDelete(true);
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
