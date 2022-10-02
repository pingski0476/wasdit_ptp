import { useKegiatan } from "../../components/Fetch";
import { useForm } from "react-hook-form";
import { useState, useMemo } from "react";
import { Combobox } from "@headlessui/react";

const InputWasdit = () => {
  const { data: nama_kegiatan } = useKegiatan({
    refethOnWindowFocus: false,
  });

  const [selectedData, setSelectedData] = useState(nama_kegiatan[0]);
  const [search, setSearch] = useState("");

  const kegiatanFiltered = useMemo(
    () =>
      nama_kegiatan?.filter((keg) => {
        return keg.kegiatan.toLowerCase().includes(search.toLowerCase());
      }),
    [search, nama_kegiatan]
  );
  return (
    <main
      className="container w-full
     bg-slate-100 mx-auto"
    >
      <div className="w-2/6 flex justify-center items-center h-screen flex-col gap-y-4">
        <h1 className="text-center text-xl font-noto mt-4">Input Realisasi</h1>
        <form method="post" className="bg-white p-4">
          <div className="flex flex-col">
            <label>Induk Kegiatan</label>
            <Combobox value={selectedData} onChange={setSelectedData(search)}>
              <Combobox.Input
                onChange={(e) => setSearch(e.target.value)}
                displayValue={(kegiatan) => kegiatan.kegiatan}
              />
              <Combobox.Options>
                {kegiatanFiltered.map((kegiatan) => {
                  return (
                    <Combobox.Option key={kegiatan.id} value={kegiatan.id}>
                      {({ active, selected }) => (
                        <li
                          className={`${
                            active
                              ? "bg-blue-500 text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          {kegiatan.kegiatan}({kegiatan.kode_mak})
                        </li>
                      )}
                    </Combobox.Option>
                  );
                })}
              </Combobox.Options>
            </Combobox>
          </div>
          <div className="flex flex-col">
            <label>Nama Kegiatan</label>
            <input type={"text"} className="form-input rounded-md" />
          </div>
          <div className="flex flex-col mt-3">
            <label>Realisasi</label>
            <input type={"number"} className="form-input rounded-md" />
          </div>
        </form>
      </div>
    </main>
  );
};

export default InputWasdit;
