import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { client } from "./Fetch";
import { useAtom } from "jotai";
import { deleteModalAtom, modalDeleteAtom } from "../store/store";

export default function DeleteModal({ userData }) {
  //initializing modal state to trigger modal
  const [isOpenDelete, setIsOpenDelete] = useAtom(modalDeleteAtom);

  //getting id that wants to be deleted
  const [deleteId] = useAtom(deleteModalAtom);

  //initializing delete function
  const deleteHandler = async () => {
    try {
      await client.records.delete(`kegiatan_${userData.kelompok}`, deleteId);
      setIsOpenDelete(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  console.log(deleteId);
  return (
    <Transition appear show={isOpenDelete} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsOpenDelete(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xs transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all font-noto">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-bold text-center leading-6 text-gray-900"
                >
                  <h1 className="font-noto text-xl font-medium">
                    Hapus Kegiatan
                  </h1>
                </Dialog.Title>
                <Dialog.Description>
                  <div className="font-noto font-normal text-center text-sm my-3">
                    <p>Yakin ingin menghapus kegiatan?</p>
                  </div>
                </Dialog.Description>
                <div className="mt-5 flex mx-auto">
                  <div className="mx-auto">
                    <button
                      onClick={() => deleteHandler()}
                      className="bg-red-400 p-2 text-sm rounded-md text-white hover:bg-red-500 mx-2"
                    >
                      Hapus
                    </button>
                    <button
                      onClick={() => setIsOpenDelete(false)}
                      className="bg-emerald-500 p-2 text-sm rounded-md text-white hover:bg-emerald-600 mx-2"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
