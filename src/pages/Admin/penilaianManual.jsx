import axios from "axios";
import { useEffect, useState } from "react";
import { Dropdown } from "semantic-ui-react";
import Swal from "sweetalert2";
import "../../assets/Style/universal.css";

const PenilaianManual = ({ setLoading }) => {
  const Width = window.screen.width;
  const [searchSiswa, setSearchSiswa] = useState([]);
  const [searchUjian, setSearchUjian] = useState([]);
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [selectedUjian, setSelectedUjian] = useState(null);
  const [data, setData] = useState([]);
  const [checkedStates, setCheckedStates] = useState({});
  const [tipePenilaian, setTipePenilaian] = useState("manual");
  const [kirimData, setKirimData] = useState({
    nama_ujian: "",
    mapel: "",
    kelas: "",
    nama_siswa: "",
    username: "",
    tipeKelas: "",
    checkedStates: {},
  });
  const [directory, setDirectory] = useState({
    dir: "",
    file: "",
  });

  const fetchData = () => {
    let siswa = selectedSiswa.split("~");
    let ujian = selectedUjian.split("~");

    let namaSiswa = siswa[0];
    namaSiswa = namaSiswa.trim();
    namaSiswa = namaSiswa.replaceAll(" ", "_").replaceAll("'", "`");
    const kelas = siswa[1];
    let nama_ujian = ujian[0];
    nama_ujian = nama_ujian.replaceAll(" ", "_");
    let mapel = ujian[1];
    mapel = mapel.replaceAll(" ", "_");
    const kelasUjian = ujian[2];

    if (kelas == kelasUjian) {
      let formData = new FormData();
      formData.append("ujian", nama_ujian);
      formData.append("mapel", mapel);
      formData.append("kelas", kelas);
      formData.append("nama", namaSiswa);
      setLoading(true);
      axios({
        method: "post",
        url: `${import.meta.env.VITE_BASEURL}/ujian.php?read_soal&jawaban`,
        data: formData,
        responseType: "json",
      })
        .then((response) => {
          setData(response.data);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      Swal.fire({
        title: "Perhatikan kelas siswa dan ujian",
        icon: "error",
      });
    }
  };

  const fetchSiswa = (search) => {
    axios({
      method: "get",
      url: `${
        import.meta.env.VITE_BASEURL
      }/siswa.php?read&page=1&search=${search}`,
      responseType: "json",
    }).then((response) => {
      const newData = [];
      const siswaData = response.data.data;
      siswaData.forEach((siswa) => {
        let dataSiswa = `${siswa.nama.trim()}~${siswa.kelas}~${
          siswa.tipeKelas
        }~${siswa.username}`;

        let text = `${siswa.nama.trim()} (${siswa.kelas} ${siswa.tipeKelas})`;

        newData.push({
          key: siswa.username,
          value: dataSiswa,
          icon: "user circle",
          text: text,
        });
      });
      setSearchSiswa(newData);
    });
  };

  const handleSearchChange = (e, { searchQuery }) => {
    fetchSiswa(searchQuery);
  };

  const fetchUjian = (search) => {
    axios({
      method: "get",
      url: `${
        import.meta.env.VITE_BASEURL
      }/ujian.php?read_ujian&search=${search}`,
      responseType: "json",
    }).then((response) => {
      const newData = [];
      const siswaData = response.data;
      siswaData.forEach((ujian) => {
        newData.push({
          key: ujian.id,
          value: `${ujian.nama_ujian}~${ujian.mapel}~${ujian.kelas}`,
          icon: "file alternate",
          text: `${ujian.nama_ujian} ${ujian.mapel} (${ujian.kelas})`,
        });
      });
      setSearchUjian(newData);
    });
  };

  const handleSearchUjian = (e, { searchQuery }) => {
    fetchUjian(searchQuery);
  };

  const handleDropdownChange = (e, { value }) => {
    setSelectedSiswa(value);
  };

  const handleDropdownUjian = (e, { value }) => {
    setSelectedUjian(value);
  };

  async function ChangeItem(number, tipe) {
    const item = data.find((item) => item.Number === number);
    let Benar = false;

    if (tipe === "esay") {
      let formData = new FormData();
      formData.append("kunci", item.Kunci);
      formData.append("jawaban", item.Jawaban);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASEURL}/system_ujian.php?validasiJawaban`,
          formData,
          {
            responseType: "json",
          }
        );

        if (response.data === "benar") {
          Benar = true;
        }
      } catch (error) {
        console.error("Error occurred:", error);
      }
    } else {
      Benar = item.Kunci === item.Jawaban;
    }

    return Benar;
  }

  useEffect(() => {
    async function fetchData() {
      const checkedStatesCopy = {};
      for (const item of data) {
        const result = await ChangeItem(item.Number, item.tipe);
        checkedStatesCopy[item.Number] = result;
      }
      setCheckedStates(checkedStatesCopy);
    }
    fetchData();
  }, [data]);

  useEffect(() => {
    if (Object.keys(checkedStates).length !== 0) {
      let siswa = selectedSiswa.split("~");
      let ujian = selectedUjian.split("~");

      let namaSiswa = siswa[0];
      namaSiswa = namaSiswa.trim();
      namaSiswa = namaSiswa.replaceAll(" ", "_").replaceAll("'", "`");

      const kelas = siswa[1];

      const tipeKelas = siswa[2];

      const username = siswa[3];

      let nama_ujian = ujian[0];
      nama_ujian = nama_ujian.replaceAll(" ", "_");

      let mapel = ujian[1];
      mapel = mapel.replaceAll(" ", "_");

      const kelasUjian = ujian[2];

      const directory = `${nama_ujian}_${mapel}_${kelas}`;

      setDirectory((prevState) => ({ ...prevState, file: namaSiswa }));
      setDirectory((prevState) => ({ ...prevState, dir: directory }));

      setKirimData((prevData) => ({
        ...prevData,
        nama_ujian: nama_ujian,
        mapel: mapel,
        kelas: kelas,
        tipeKelas: tipeKelas,
        username: username,
        nama_siswa: namaSiswa,

        checkedStates: checkedStates,
      }));
    }
  }, [checkedStates]);

  const handleCheckboxChange = (number) => {
    setCheckedStates((prevState) => ({
      ...prevState,
      [number]: !prevState[number],
    }));
  };

  const sendDataToServer = async () => {
    if (tipePenilaian == "manual") {
      try {
        const response = await axios.post(
          `${
            import.meta.env.VITE_BASEURL
          }/system_ujian.php?update_nilai_manual`,
          { kirimData }
        );

        if (response.data == "Berhasil") {
          Swal.fire({
            title: "Berhasil",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            title: response.data,
            icon: "error",
          });
        }
      } catch (error) {
        console.error("Error occurred while sending data to server:", error);
      }
    } else {
      let formData = new FormData();
      formData.append("kirim_jawaban", "");
      formData.append("admin", "");
      formData.append("nama_ujian", kirimData.nama_ujian);
      formData.append("mapel", kirimData.mapel);
      formData.append("kelas", kirimData.kelas);
      formData.append("tipeKelas", kirimData.tipeKelas);
      formData.append("nama_siswa", kirimData.nama_siswa);
      formData.append("username", kirimData.username);
      const kirim = await axios.post(
        `${import.meta.env.VITE_BASEURL}/system_ujian.php`,
        formData
      );

      if (kirim.data == "Berhasil") {
        Swal.fire({
          icon: "success",
          title: "Berhasil mengirim jawaban",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          navigate("loby_ujian");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: kirim.data,
          text: "Mohon beritau panitia ujian untuk pembenahan",
        }).then((result) => {
          if (result.isConfirmed) {
            if (waktuHabis) {
              AlertTampil();
            }
          }
        });
      }
    }
  };

  function updateJawaban(no, jawaban) {
    let formData = new FormData();
    formData.append("edit_jawaban", "");
    formData.append("No", no);
    formData.append("Jawaban", jawaban);
    formData.append("dir", directory.dir);
    formData.append("file", directory.file);

    axios({
      method: "post",
      url: `${import.meta.env.VITE_BASEURL}/system_ujian.php`,
      data: formData,
      responseType: "json",
    })
      .then((response) => {
        if (response.data == "Berhasil") {
          fetchData();
        }
      })
      .catch((error) => {
        console.error("Error updating answer:", error);
      });
  }

  return (
    <div>
      <div className="row">
        <div className={Width < 450 ? "col-10 mb-2" : "col-3"}>
          <Dropdown
            placeholder="Cari Siswa"
            fluid
            search
            selection
            options={searchSiswa}
            onSearchChange={handleSearchChange}
            onChange={handleDropdownChange}
          />
        </div>
        <div className={Width < 450 ? "col-10 mb-2" : "col-3"}>
          <Dropdown
            placeholder="Cari Ujian"
            fluid
            search
            selection
            options={searchUjian}
            onSearchChange={handleSearchUjian}
            onChange={handleDropdownUjian}
          />
        </div>
        <div className={Width < 450 ? "col-10" : "col-3"}>
          <button className="btn btn-success" onClick={fetchData}>
            Search <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>

      <div className="mt-3 mb-3 p-3 w-fit rounded-2 bg-info-subtle">
        <input
          type="radio"
          name="pilihan"
          id="otomatis"
          checked={tipePenilaian == "otomatis"}
          onChange={() => {
            setTipePenilaian("otomatis");
          }}
        />
        <label htmlFor="otomatis" className="ms-2">
          Penilaian Otomatis
        </label>
        <input
          type="radio"
          name="pilihan"
          id="manual"
          className="ms-3"
          checked={tipePenilaian == "manual"}
          onChange={() => {
            setTipePenilaian("manual");
          }}
        />
        <label htmlFor="manual" className="ms-2">
          Penilaian Manual
        </label>
      </div>

      <div>
        {data.map((item, index) => (
          <div key={index} className="mb-3">
            <span className="me-3">
              {tipePenilaian == "manual" ? (
                <input
                  key={item.Number}
                  type="checkbox"
                  name="benar"
                  checked={checkedStates[item.Number]}
                  onChange={() => handleCheckboxChange(item.Number)}
                />
              ) : null}
              {` ${item.Number}`}
            </span>
            {item.tipe == "esay" ? (
              <span>
                <textarea
                  name={`number-${item.Number}`}
                  cols="30"
                  rows="5"
                  value={item.Jawaban}
                  id={`jawaban-${item.Number}`}
                  disabled={tipePenilaian == "manual"}
                ></textarea>
                {tipePenilaian == "otomatis" ? (
                  <button
                    className="btn btn-success w-15 ms-2 mb-2"
                    onClick={() => {
                      const newValue = document.getElementById(
                        `jawaban-${item.Number}`
                      ).value;
                      updateJawaban(item.Number, newValue);
                    }}
                  >
                    kirim jawaban soal ini
                  </button>
                ) : null}
              </span>
            ) : (
              <span>
                <input
                  type="radio"
                  name={`number-${item.Number}`}
                  id={`number-${item.Number}-A`}
                  checked={item.Jawaban == "A"}
                  disabled={tipePenilaian == "manual"}
                  onChange={() => {
                    updateJawaban(item.Number, "A");
                  }}
                />
                <label htmlFor={`number-${item.Number}-A`} className="ms-1">
                  A
                </label>

                <input
                  type="radio"
                  name={`number-${item.Number}`}
                  id={`number-${item.Number}-B`}
                  className="ms-3"
                  checked={item.Jawaban == "B"}
                  disabled={tipePenilaian == "manual"}
                  onChange={() => {
                    updateJawaban(item.Number, "B");
                  }}
                />
                <label htmlFor={`number-${item.Number}-B`} className="ms-1">
                  B
                </label>

                <input
                  type="radio"
                  name={`number-${item.Number}`}
                  id={`number-${item.Number}-C`}
                  className="ms-3"
                  checked={item.Jawaban == "C"}
                  disabled={tipePenilaian == "manual"}
                  onChange={() => {
                    updateJawaban(item.Number, "C");
                  }}
                />
                <label htmlFor={`number-${item.Number}-C`} className="ms-1">
                  C
                </label>

                <input
                  type="radio"
                  name={`number-${item.Number}`}
                  id={`number-${item.Number}-D`}
                  className="ms-3"
                  checked={item.Jawaban == "D"}
                  disabled={tipePenilaian == "manual"}
                  onChange={() => {
                    updateJawaban(item.Number, "D");
                  }}
                />
                <label htmlFor={`number-${item.Number}-D`} className="ms-1">
                  D
                </label>

                {item.E != "" ? (
                  <span>
                    <input
                      type="radio"
                      name={`number-${item.Number}`}
                      id={`number-${item.Number}-E`}
                      className="ms-3"
                      checked={item.Jawaban == "E"}
                      disabled={tipePenilaian == "manual"}
                      onChange={() => {
                        updateJawaban(item.Number, "E");
                      }}
                    />
                    <label htmlFor={`number-${item.Number}-E`} className="ms-1">
                      E
                    </label>
                  </span>
                ) : null}
              </span>
            )}

            <span className="ms-4 fw-bolder">Kunci: {item.Kunci}</span>
          </div>
        ))}
      </div>

      {data.length > 0 ? (
        <button
          className="btn btn-success mb-4 w-40"
          onClick={sendDataToServer}
        >
          {tipePenilaian == "manual" ? "Nilai Manual" : "Nilai Otomatis"}
        </button>
      ) : null}
    </div>
  );
};
export default PenilaianManual;
