import "../../Style/landing-page.css";
import "../../Style/jadwal-tentor.css";

import { useEffect, useRef, useState } from "react";
import { Button, Dropdown, Input } from "semantic-ui-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Swal from "sweetalert2";

const TabelJadwalTentor = () => {
  const [date, setDate] = useState({
    bulan: "",
    tahun: "",
  });
  const [dataJadwal, setDataJadwal] = useState([]);
  const [listTentor, setListTentor] = useState([]);
  let [jumlahItem, setJumlahItem] = useState(3);
  let [listKelas, setListKelas] = useState([]);
  let componentPDF = useRef();
  let MaxView = [
    {
      key: 1,
      text: 1,
      value: 1,
    },
    {
      key: 2,
      text: 2,
      value: 2,
    },
    {
      key: 3,
      text: 3,
      value: 3,
    },
    {
      key: 4,
      text: 4,
      value: 4,
    },
    {
      key: 5,
      text: 5,
      value: 5,
    },
  ];
  const navigate = useNavigate();

  function Today() {
    const newdate = new Date();
    let month = newdate.getMonth() + 1;
    let year = newdate.getFullYear();
    let DateData = { ...date };
    DateData.bulan = month;
    DateData.tahun = year;
    setDate(DateData);

    if (window.screen.width < 450) {
      setJumlahItem(3);
    }
  }

  function actionButton(value) {
    if (value == "next") {
      let DateData = { ...date };
      if (DateData.bulan == 12) {
        DateData.bulan = "1";
        DateData.tahun = parseInt(DateData.tahun) + 1;
      } else {
        DateData.bulan = parseInt(DateData.bulan) + 1;
        DateData.tahun = DateData.tahun;
      }
      setDate(DateData);
    }
    if (value == "prev") {
      let DateData = { ...date };
      if (DateData.bulan == "01" || DateData.bulan == 1) {
        DateData.bulan = "12";
        DateData.tahun = parseInt(DateData.tahun) - 1;
      } else {
        DateData.bulan = parseInt(DateData.bulan) - 1;
        DateData.tahun = DateData.tahun;
      }
      setDate(DateData);
    }
  }

  function setBulanToInd(bulan, tahun) {
    let namaBulan = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    let namaBulanInd = namaBulan[bulan - 1];
    let tanggalInd = `${namaBulanInd}, ${tahun}`;
    return tanggalInd;
  }

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: `Jadwal ${setBulanToInd(date.bulan, date.tahun)}`,
    onAfterPrint: () =>
      Swal.fire({
        title: "Berhasil Menyimpan PDF",
        icon: "success",
      }),
  });
  useEffect(() => {
    Today();
    axios({
      method: "get",
      url: `${import.meta.env.VITE_BASEURL}/jadwal.php?listKelas`,
      responseType: "json",
    })
      .then(function (response) {
        const data = response.data.map((item) => {
          return {
            key: item.kelas + " " + item.tipeKelas,
            text: item.kelas + " " + item.tipeKelas,
            value: item.kelas + " " + item.tipeKelas,
          };
        });
        setListKelas(data);
      })
      .catch((err) => {
        Swal.fire({
          title: err,
          icon: "error",
        });
      });

    axios({
      method: "get",
      url: `${import.meta.env.VITE_BASEURL}/jadwal.php?readPengajar`,
      responseType: "json",
    })
      .then(function (response) {
        const dataTentor = response.data.map((item) => {
          return {
            key: item.nama,
            text: item.nama,
            value: item.nama,
          };
        });
        setListTentor(dataTentor);
      })
      .catch((err) => {
        Swal.fire({
          title: err,
          icon: "error",
        });
      });
  }, []);

  useEffect(() => {
    if (date.bulan != "") {
      let URL = `${import.meta.env.VITE_BASEURL}/calander.php?bulan=${
        date.bulan
      }&tahun=${date.tahun}`;
      let pathName = window.location.pathname;
      pathName = pathName.split("/");
      if (pathName.length == 4) {
        URL = `${import.meta.env.VITE_BASEURL}/calander.php?bulan=${
          date.bulan
        }&tahun=${date.tahun}&${pathName[2]}=${pathName[3]}`;
      }
      axios({
        method: "get",
        url: URL,
        responseType: "json",
      })
        .then(function (response) {
          setDataJadwal(response.data.Data);
        })
        .catch((err) => {
          Swal.fire({
            title: err,
            icon: "error",
          });
        });
    }
  });

  const setTentor = (e, { value }) => {
    navigate(`/jadwal_tentor/tentor/${value}`);
    let inputKelas = document.querySelector(".kelas-input .divider");
    inputKelas.classList.add("default");
    inputKelas.innerText = "Pilih Kelas";

    let inputTentor = document.querySelector(".tentor-input .divider");
    inputTentor.classList.remove("default");
    inputTentor.innerText = value;
  };

  const setKelas = (e, { value }) => {
    navigate(`/jadwal_tentor/kelas/${value}`);

    let inputKelas = document.querySelector(".kelas-input .divider");
    inputKelas.classList.remove("default");
    inputKelas.innerText = value;

    let inputTentor = document.querySelector(".tentor-input .divider");
    inputTentor.classList.add("default");
    inputTentor.innerText = "Pilih Tentor";
  };

  const setJumlahView = (e, { value }) => {
    setJumlahItem(value);
  };

  let width = window.screen.width;
  return (
    <div className="content-jadwal-tentor">
      <div className="heading row border p-2 pt-3 bg-white-secondary  ">
        <div
          className={width < 450 ? "col-12 display-flex" : "col-8 display-flex"}
        >
          <Button onClick={Today}>Today</Button>
          <Button.Group className="me-2">
            <Button
              onClick={() => {
                actionButton("prev");
              }}
            >
              <i className="fa-solid fa-caret-left"></i>
            </Button>
            <Button.Or />
            <Button
              onClick={() => {
                actionButton("next");
              }}
            >
              <i className="fa-solid fa-caret-right"></i>
            </Button>
          </Button.Group>
          <Button onClick={generatePDF}>Export PDF</Button>
          {width < 450 ? (
            ""
          ) : (
            <Input
              placeholder="Jumlah Tampil Item"
              className="bg-grey"
              label={{ icon: "list" }}
              labelPosition="left corner"
              onChange={setJumlahView}
            />
          )}
        </div>
        <div
          className={
            width < 450 ? "col-12 display-flex mt-2" : "col-4 display-flex"
          }
        >
          <Dropdown
            className="border w-50 me-1 bg-grey kelas-input"
            placeholder="Pilih Kelas"
            fluid
            search
            selection
            options={listKelas}
            onChange={setKelas}
          />
          <Dropdown
            className="border w-50 bg-grey tentor-input"
            placeholder="Pilih Tentor"
            fluid
            search
            selection
            options={listTentor}
            onChange={setTentor}
          />
        </div>
      </div>
      <div ref={componentPDF} style={{ width: "100%" }}>
        <div
          className="text-bulan border fs-5 fw-bolder pt-2 pb-1 bg-info"
          align="center"
        >
          <i className="fa-solid fa-calendar"></i>{" "}
          {setBulanToInd(date.bulan, date.tahun)}
        </div>
        <div className="overflow">
          <div className="content-schedule">
            <div className="header-table row bg-info">
              <div className="col-2 border text-center fw-bolder p-2 ">
                Senin
              </div>
              <div className="col-2 border text-center fw-bolder p-2">
                Selasa
              </div>
              <div className="col-2 border text-center fw-bolder p-2">Rabu</div>
              <div className="col-2 border text-center fw-bolder p-2">
                Kamis
              </div>
              <div className="col-2 border text-center fw-bolder p-2">
                Jumat
              </div>
              <div className="col-2 border text-center fw-bolder p-2">
                Sabtu
              </div>
            </div>
            <div className="h-fit">
              <div className="content-table row">
                {dataJadwal
                  .filter((item) => item.Hari != "Minggu")
                  .map((item, index) => (
                    <div
                      className={
                        item.Tipe == "now"
                          ? "col-2 border fw-bolder p-2 bg-primary text-white"
                          : "col-2 border fw-bolder p-2"
                      }
                      key={index}
                    >
                      <p
                        className={
                          item.Tipe == "curr" || item.Tipe == "now"
                            ? "tanggal"
                            : "tanggal text-secondary fw-light"
                        }
                      >
                        {item.Tanggal}
                      </p>
                      <div className="schedule fw-normal col-tanggal">
                        {item.Schedule.slice(0, jumlahItem).map(
                          (schedule, i) => (
                            <div className="text-dark p-1" key={i}>
                              <b className="fw-bolder">{schedule.jam}</b>
                              {` / ${schedule.kelas} / ${schedule.mapel} / ${schedule.pengajar} / ${schedule.ruangan}`}
                            </div>
                          )
                        )}
                        {item.Schedule.length > jumlahItem ? (
                          <button
                            className="fw-bolder btn btn-sm w-100 btn-secondary"
                            onClick={() =>
                              navigate(
                                `/jadwal_tentor/view/${item.Tanggal}-${date.bulan}-${date.tahun}`
                              )
                            }
                          >
                            Other ...
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  ))}

                <p className="mb-1"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabelJadwalTentor;
