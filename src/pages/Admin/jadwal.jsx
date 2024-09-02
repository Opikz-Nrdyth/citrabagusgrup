import { Button, Dropdown, Input, List, Popup } from "semantic-ui-react";
import "../../assets/Style/Admin/jadwal.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import FormJadwal from "../../assets/Components/Admin/formJadwal";
import TabelJadwal from "../../assets/Components/Admin/tabelJadwal";
import { FloatingLabel, Form } from "react-bootstrap";

export const StateContext = React.createContext();

const Jadwal = ({ setLoading }) => {
  const [inputDay, setinputDay] = useState("");
  const [inputClock, setinputClock] = useState("");
  const [Options, setOption] = useState([]);
  const [dataJadwal, setDataJadwal] = useState([]);
  const [inputJadwal, setinputJadwal] = useState({
    kelas: "",
    jumlahSiswa: "",
    mapel: "",
    tentor: "",
    ruang: "",
    jumlahKursi: "",
  });
  const [Colabs, setColabs] = useState(1);
  const [btnKirim, setBtnKirim] = useState("Kirim");
  const [idUpdate, setIdUpdate] = useState("");
  const width = window.screen.width;

  useEffect(() => {
    document.body.style.overflowY = "scroll";
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setLoading(true);
    axios({
      method: "get",
      url: `${import.meta.env.VITE_BASEURL}/jadwal.php?jadwalAll`,
      responseType: "json",
    })
      .then(function (response) {
        setOption(response.data);
      })
      .catch((err) => {
        Swal.fire({
          title: err,
          icon: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // SetDay
  const dayOption = Options.map((item) => item.hari_tanggal) // membuat array baru dari properti hari_tanggal
    .filter((value, index, self) => self.indexOf(value) === index) // menghapus duplikasi dengan filter
    .map((value, index) => ({ key: index, text: value, value })); // membuat array baru dari objek dengan properti key, text, dan value

  const addDay = (e, { value }) => {
    const dataBaru = {
      id: Options.length + 1,
      hari_tanggal: value,
      jam: "",
      kelas: "",
      mapel: "",
      pengajar: "",
      ruangan: "",
    };

    setOption([...Options, dataBaru]); // menggunakan spread operator untuk menyalin array
    setinputDay(value);
  };

  const setDay = (e, { value }) => {
    setinputDay(value);
  };

  // Set Clock
  const clockOption = Options.map((item) => item.jam) // membuat array baru dari properti jam
    .filter((value, index, self) => self.indexOf(value) === index) // menghapus duplikasi dengan filter
    .map((value, index) => ({ key: index, text: value, value })); // membuat array baru dari objek dengan properti key, text, dan value

  const addClock = (e, { value }) => {
    const dataBaru = {
      id: Options.length + 1,
      hari_tanggal: "",
      jam: value,
      kelas: "",
      mapel: "",
      pengajar: "",
      ruangan: "",
    };

    setOption([...Options, dataBaru]); // menggunakan spread operator untuk menyalin array
    setinputClock(value);
  };

  const setClock = (e, { value }) => {
    setinputClock(value);
  };

  const submitData = () => {
    setLoading(true);
    axios({
      method: "get",
      url: `${
        import.meta.env.VITE_BASEURL
      }/jadwal.php?jadwal&tanggal=${inputDay}&jam=${inputClock}`, // menggunakan template literals untuk menyederhanakan URL
      responseType: "json",
    })
      .then(function (response) {
        setDataJadwal(response.data);
      })
      .catch((err) => {
        Swal.fire({
          title: err,
          icon: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-element-admin">
      <div className="m-2 inputData" align={width < 450 ? "center" : ""}>
        <Dropdown
          options={dayOption}
          placeholder="Pilih Tanggal"
          search
          selection
          className={width < 450 ? "me-2 mb-2" : "me-2"}
          allowAdditions
          onAddItem={addDay}
          onChange={setDay}
        />
        <Dropdown
          options={clockOption}
          placeholder="Pilih Jam"
          search
          selection
          allowAdditions
          className={width < 450 ? "me-2 mb-2" : "me-2"}
          onAddItem={addClock}
          onChange={setClock}
        />
        {width < 450 ? <br /> : ""}
        <Button color="teal" onClick={submitData}>
          Submit
        </Button>
      </div>
      {dataJadwal == "" ? (
        ""
      ) : (
        <>
          <StateContext.Provider
            value={{
              inputJadwal,
              setinputJadwal,
              Colabs,
              setColabs,
              btnKirim,
              setBtnKirim,
              idUpdate,
              setIdUpdate,
            }}
          >
            <FormJadwal
              setLoading={setLoading}
              day={inputDay}
              clock={inputClock}
            />
          </StateContext.Provider>
          <p
            className="fs-4 p-2 mt-2 fw-bolder mb-0 bg-warning rounded-2"
            align="center"
          >
            Jadwal Hari {dataJadwal.Hari}
          </p>
          <StateContext.Provider
            value={{
              inputJadwal,
              setinputJadwal,
              Colabs,
              setColabs,
              btnKirim,
              setBtnKirim,
              idUpdate,
              setIdUpdate,
            }}
          >
            <TabelJadwal day={inputDay} />
          </StateContext.Provider>
        </>
      )}
    </div>
  );
};
export default Jadwal;
