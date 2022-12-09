import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAtom } from "jotai";
import {
  editIdModalAtom,
  modalEditAtom,
  successModelAtom,
} from "../store/store";
import { useForm } from "react-hook-form";
import { client } from "./Fetch";

export default function EditModal({ userData }) {
  const [isOpenEdit, setIsOpenEdit] = useAtom(modalEditAtom);

  const [editId] = useAtom(editIdModalAtom);

  //initialize success modal
  const [, setIsOpenSuccess] = useAtom(successModelAtom);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm();

  let kelompok = userData?.kelompok;

  //function to reload the page when the data is sent
  const refreshPage = () => {
    window.location.reload();
  };

  const getSatuKegiatan = async () => {
    try {
      const response = await client.records.getOne(
        `kegiatan_${kelompok}`,
        editId
      );
      reset(response);
    } catch (error) {
      console.log(error.message);
    }
  };

  const updateHandler = async (data) => {
    try {
      await client.records.update(`kegiatan_${kelompok}`, editId, data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSatuKegiatan();
  }, [editId]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      setIsOpenEdit(false);
      setIsOpenSuccess(true);
      setTimeout(() => setIsOpenSuccess(false), 1500);
      refreshPage();
    }
  }, [isSubmitSuccessful]);

  return (
    <Transition appear show={isOpenEdit} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsOpenEdit(false)}
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
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all font-noto">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-bold text-center leading-6 text-gray-900"
                >
                  <h1>Edit Kegiatan</h1>
                </Dialog.Title>
                <form
                  method="post"
                  className="bg-white p-4 mx-auto"
                  onSubmit={handleSubmit(updateHandler)}
                >
                  <div className="flex flex-col">
                    <label className="font-noto font-semibold">Kode MAK</label>
                    <input
                      type={"text"}
                      className="form-input rounded-md my-2"
                      name="kode_mak"
                      {...register("kode_mak")}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-noto font-semibold">Kegiatan</label>
                    <input
                      type={"text"}
                      className="form-input rounded-md my-2"
                      name="kegiatan"
                      {...register("kegiatan")}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-noto font-semibold">
                      Pagu Anggaran
                    </label>
                    <input
                      type={"number"}
                      className="form-input rounded-md my-2"
                      name="pagu_anggaran"
                      {...register("pagu_anggaran")}
                    />
                  </div>
                  <div className="flex flex-col mt-4 mb-4">
                    <h3 className="font-noto font-semibold mb-2">
                      Koordinator/Bagian
                    </h3>
                    <div className="flex items-center">
                      <input
                        id="inline-radio"
                        type={"radio"}
                        name="koordinator"
                        value={userData?.kelompok}
                        defaultChecked={true}
                        {...register("koordinator")}
                        className="form-radio w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500  focus:ring-2 "
                      />
                      <label
                        htmlFor="inline-radio"
                        className="ml-2 text-sm font-medium font-noto text-gray-900"
                      >
                        {kelompok?.toUpperCase()}
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col mt-4 mb-4">
                    <h3 className="font-noto font-semibold mb-2">
                      Subkoordinator
                    </h3>
                    <div className="flex">
                      <div className="flex items-center mr-4">
                        <input
                          id="inline-radio"
                          type={"radio"}
                          name="subkoordinator"
                          value={"tata_kelola"}
                          {...register("subkoordinator")}
                          className="form-radio w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500  focus:ring-2 "
                        />
                        <label
                          htmlFor="inline-radio"
                          className="ml-2 text-sm font-medium text-gray-900"
                        >
                          Tata Kelola TI
                        </label>
                      </div>
                      <div className="flex items-center mr-4">
                        <input
                          id="inline-2-radio"
                          type={"radio"}
                          name="subkoordinator"
                          value={"diseminasi"}
                          {...register("subkoordinator")}
                          className="form-radio w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500  focus:ring-2 "
                        />
                        <label
                          htmlFor="inline-2-radio"
                          className="ml-2 text-sm font-medium text-gray-900"
                        >
                          Diseminasi Informasi IPTEK Pertanian
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex mt-4 w-48">
                    <button
                      className="w-24 py-2 mr-2 bg-emerald-500 my-3 rounded-md font-noto font-semibold text-white hover:bg-emerald-600"
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
