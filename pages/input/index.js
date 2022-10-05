import { useKegiatan } from "../../components/Fetch";
import { useForm } from "react-hook-form";
import pocketbaseEs from "pocketbase";
import { useState, useEffect } from "react";

const InputWasdit = () => {
  const client = new pocketbaseEs("http://127.0.0.1:8090/");
  const [safeToReset, setSafeToReset] = useState(false);

  const { data: nama_kegiatan } = useKegiatan({
    refethOnWindowFocus: false,
  });

  const { handleSubmit, register, reset } = useForm();

  const submitDataHandler = async (data) => {
    try {
      await client.records.create("realisasi_diseminasi", data);
      setSafeToReset(true);
    } catch (error) {
      console.log(error.message);
      console.log(error.response);
    }
  };

  useEffect(() => {
    if (safeToReset) {
      reset();
    }
    setSafeToReset(false);
  }, [safeToReset]);

  return (
    <main
      className="container w-full
     bg-slate-100 flex justify-center items-center"
    >
      <div className="w-2/6 flex flex-col gap-y-4">
        <h1 className="text-center text-xl font-noto mt-4">Input Realisasi</h1>
        <form
          method="post"
          className="bg-white p-4 mx-auto"
          onSubmit={handleSubmit(submitDataHandler)}
        >
          <div className="flex flex-col">
            <label>Nama Kegiatan</label>
            <input
              type={"text"}
              className="form-input rounded-md"
              name="nama_kegiatan"
              {...register("nama_kegiatan")}
            />
          </div>
          <div className="flex flex-col mt-3">
            <label>Realisasi</label>
            <input
              type={"number"}
              className="form-input rounded-md"
              name="realisaasi"
              {...register("realisasi")}
            />
          </div>
          <div className="flex flex-col">
            <label>Induk Kegiatan</label>
            <select
              className="form-select px-4 py-3 rounded-full"
              name="kegiatan"
              {...register("kegiatan")}
            >
              <option value={"none"} defaultValue disabled>
                Pilih Kegiatan
              </option>
              {nama_kegiatan?.map((kegiatan) => {
                return (
                  <option key={kegiatan.id} value={kegiatan.id}>
                    {kegiatan.kegiatan}
                  </option>
                );
              })}
            </select>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </main>
  );
};

export default InputWasdit;
