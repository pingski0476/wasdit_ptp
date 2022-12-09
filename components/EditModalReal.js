import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAtom } from "jotai";
import {
  editModalRealAtom,
  editIdModalRealAtom,
  successModelAtom,
} from "../store/store";
import { useForm } from "react-hook-form";
import { client } from "./Fetch";

export default function EditModalReal({ userData, kegiatan, sisaAnggaran }) {
  //setting modal state to instantiate the modal
  const [isOpenEditReal, setIsOpenEditReal] = useAtom(editModalRealAtom);

  //initialize success modal
  const [, setIsOpenSuccess] = useAtom(successModelAtom);

  //setting modal id that is clicked
  const [editIdReal] = useAtom(editIdModalRealAtom);

  const kelompok = userData?.kelompok;

  //form hook initialization
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm();

  //function to reload the page when the data is sent
  const refreshPage = () => {
    window.location.reload();
  };

  const getSatuRealisasi = async () => {
    try {
      const response = await client.records.getOne(
        `realisasi_${kelompok}`,
        editIdReal
      );
      reset(response);
    } catch (error) {
      console.log(error.message);
    }
  };

  //update handler function initialization
  const updateHandler = async (data) => {
    try {
      await client.records.update(`realisasi_${kelompok}`, editIdReal, data);
      alert("Success");
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getSatuRealisasi();
  }, [editIdReal]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      setIsOpenEditReal(false);
      setIsOpenSuccess(true);
      setTimeout(() => setIsOpenSuccess(false), 1500);
      refreshPage();
    }
  });

  return (
    <Transition appear show={isOpenEditReal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsOpenEditReal(false)}
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all font-noto">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-bold text-center leading-6 text-gray-900"
                >
                  <h1>Edit Realisasi</h1>
                </Dialog.Title>
                <form
                  method="post"
                  className="bg-white p-4 mx-auto"
                  onSubmit={handleSubmit(updateHandler)}
                >
                  <div className="flex flex-col mt-4 mb-4">
                    <div className="flex  items-center my-4">
                      <label
                        htmlFor="sisa"
                        className="font-noto font-semibold mr-4"
                      >
                        Sisa Anggaran :
                      </label>
                      <p>{sisaAnggaran}</p>
                    </div>
                    <h3 className="font-noto font-semibold mb-2">
                      Dalam Rangka
                    </h3>
                    <div className="flex">
                      <div className="flex items-center mr-4">
                        <input
                          id="inline-radio"
                          type={"radio"}
                          defaultChecked={true}
                          name="dalam_rangka"
                          value={kegiatan.subkoordinator}
                          {...register("dalam_rangka")}
                          className="form-radio w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500  focus:ring-2 "
                        />
                        <label
                          for="inline-radio"
                          className="ml-2 text-sm font-medium text-gray-900"
                        >
                          {kegiatan.subkoordinator === "tata_kelola"
                            ? "Tata Kelola TI"
                            : "Diseminasi"}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="font-noto font-semibold">
                      Induk Kegiatan
                    </label>
                    <select
                      className="form-select px-4 py-3 rounded-md my-3"
                      name="kegiatan"
                      {...register("kegiatan")}
                    >
                      <option value={"none"} defaultValue disabled>
                        Pilih Kegiatan
                      </option>
                      <option value={kegiatan.id}>{kegiatan.kegiatan}</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="font-noto font-semibold">
                      Nama Kegiatan
                    </label>
                    <textarea
                      type={"text"}
                      className="form-input rounded-md my-2"
                      name="nama_kegiatan"
                      {...register("nama_kegiatan")}
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <label className="font-noto font-semibold ">
                      Realisasi
                    </label>
                    <input
                      type={"number"}
                      className="form-input rounded-md my-2"
                      name="realisasi"
                      {...register("realisasi")}
                    />
                  </div>

                  <button
                    className="w-24 py-2 bg-emerald-500 my-3 rounded-md font-noto font-semibold text-white hover:bg-emerald-600"
                    type="submit"
                  >
                    Submit
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
