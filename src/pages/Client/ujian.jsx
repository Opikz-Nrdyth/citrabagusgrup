import { Container, Form } from "react-bootstrap";
import "../../assets/Style/Client/ujian.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
const Ujian = ({ setLoading, dataSiswa }) => {
  const navigate = useNavigate();
  const Width = window.screen.width;
  const [displayNumber, setDisplayNumber] = useState(false);
  const [data, setData] = useState([]);
  const [selisihJam, setSelisihJam] = useState("");
  const [selisihMenit, setSelisihMenit] = useState("");
  const [selisihDetik, setSelisihDetik] = useState("");
  const [waktuSelesai, setWaktuSelesai] = useState(false);
  const [dataJawaban, setDataJawaban] = useState([]);

  const audioRef = useRef(null);
  const dumAudioRef = useRef(null);

  const UrlParams = new URLSearchParams(document.location.search);
  const Get_Ujian = UrlParams.get("ujian");
  const Get_Mapel = UrlParams.get("mapel");
  const Get_Kelas = UrlParams.get("kelas");
  const [timeEnd, setTimeEnd] = useState({ hari: "", jam: "" });
  const [timeStart, setTimeStart] = useState({ hari: "", jam: "" });
  const [directory, setDirectory] = useState({
    dir: "",
    file: "",
  });
  const [waktuHabis, setWaktuHabis] = useState(false);

  const fetchData = async () => {
    try {
      document.body.style.overflowY = "scroll";
      let namaSiswa = "";
      let jumlahSoal = 0;

      for (const siswa of dataSiswa) {
        let formData = new FormData();
        formData.append("ujian", Get_Ujian);
        formData.append("mapel", Get_Mapel);
        formData.append("kelas", siswa.kelas);

        const response = await axios.post(
          `${import.meta.env.VITE_BASEURL}/ujian.php?read_soal`,
          formData
        );

        setData(response.data);
        jumlahSoal = response.data.length;

        // Setelah mendapatkan data siswa, lanjutkan dengan proses berikutnya
        await processAfterFetch(jumlahSoal);
      }

      backupJawaban(dataSiswa[0].nama);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const processAfterFetch = async (jumlahSoal) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BASEURL
        }/ujian.php?read_ujian&search=${Get_Ujian}`
      );

      for (const ujian of response.data) {
        if (
          ujian.nama_ujian == Get_Ujian &&
          ujian.mapel == Get_Mapel &&
          ujian.kelas == Get_Kelas
        ) {
          setTimeStart((prevState) => ({ ...prevState, jam: ujian.jam_mulai }));
          setTimeStart((prevState) => ({ ...prevState, hari: ujian.tanggal }));
          setTimeEnd((prevState) => ({ ...prevState, jam: ujian.jam_selesai }));
          setTimeEnd((prevState) => ({ ...prevState, hari: ujian.tanggal }));
          const nama_ujian = ujian.nama_ujian.replaceAll(" ", "_");
          const mapel = ujian.mapel.replaceAll(" ", "_");
          const dir = `${nama_ujian}_${mapel}_${ujian.kelas}`;
          setDirectory((prevState) => ({ ...prevState, dir }));
          let newName = dataSiswa[0].nama.trim();
          newName = newName.replaceAll(" ", "_");
          newName = newName.replaceAll("'", "`");
          setDirectory((prevState) => ({ ...prevState, file: newName }));

          await cekDirectory(dir, dataSiswa[0].nama, jumlahSoal);
        }
      }
    } catch (error) {
      console.error("Error processing data after fetch:", error);
      setLoading(false);
    }
  };

  const cekDirectory = async (dir, nama, jumlahSoal) => {
    setLoading(true);
    try {
      let newName = nama.trim();
      newName = newName.replaceAll(" ", "_");
      newName = newName.replaceAll("'", "`");
      let formData = new FormData();
      formData.append("read_jawaban", "");
      formData.append("dir", dir);
      formData.append("file", newName);
      formData.append("jumlah_soal", jumlahSoal);

      const res = await axios.post(
        `${import.meta.env.VITE_BASEURL}/system_ujian.php`,
        formData
      );

      if (res.data.length == 0 || res.data == null) {
        Swal.fire({
          icon: "error",
          title: response.data,
          text: "Mohon beritau panitia ujian untuk pembenahan",
        });
      } else {
        setDataJawaban(res.data);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching directory:", error);
      Swal.fire({
        icon: "error",
        title: "Error pada jawaban anda",
        text: `Mohon beritau panitia ujian untuk pembenahan \n ${error}`,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Width < 450) {
      setDisplayNumber(true);
    }
    setLoading(true);
    fetchData();
  }, [dataSiswa]);

  useEffect(() => {
    if (timeStart.jam != "") {
      DetectedJam(timeStart.jam, timeStart.hari);
    }
    const interval = setInterval(() => {
      var waktuPertama = new Date();

      let endTime = timeEnd.jam.split(":");
      let endDay = timeEnd.hari.split("-");
      var waktuKedua = new Date();
      waktuKedua.setHours(endTime[0]);
      waktuKedua.setMinutes(endTime[1]);
      waktuKedua.setSeconds(0);

      if (waktuPertama > waktuKedua) {
        setWaktuSelesai(true);
        clearInterval(interval);
        audioRef.current.play();
        setWaktuHabis(true);
        AlertTampil();
        return;
      } else {
        setWaktuSelesai(false);
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setWaktuHabis(false);
      }

      // Tanggal Mulai
      if (timeEnd.hari != "" && timeEnd.jam != "") {
        const date = new Date();
        const startTime = timeStart.jam.split(":");
        var waktuStart = new Date();
        waktuStart.setHours(startTime[0]);
        waktuStart.setMinutes(startTime[1]);
        waktuStart.setSeconds(0);
        let monthNow = date.getMonth() + 1;

        if (
          endDay &&
          endDay.length === 3 &&
          !isNaN(endDay[0]) &&
          !isNaN(endDay[1]) &&
          !isNaN(endDay[2])
        ) {
          if (
            date.getFullYear() == parseInt(endDay[0]) &&
            monthNow == endDay[1] &&
            date.getDate() == endDay[2]
          ) {
            if (waktuPertama <= waktuStart) {
              // navigate("loby_ujian");
            }
          } else {
            // navigate("loby_ujian");
          }
        }
      }

      var selisihMilidetik = Math.abs(waktuKedua - waktuPertama);
      var Jam = Math.floor(selisihMilidetik / (1000 * 60 * 60));
      if (Jam < 10) {
        Jam = `0${Jam}`;
      }
      var Menit = Math.floor(
        (selisihMilidetik % (1000 * 60 * 60)) / (1000 * 60)
      );
      if (Menit < 10) {
        Menit = `0${Menit}`;
      }
      var Detik = Math.floor((selisihMilidetik % (1000 * 60)) / 1000);
      if (Detik < 10) {
        Detik = `0${Detik}`;
      }

      // Check if remaining time is 1 minute or less
      if (parseInt(Jam) === 0 && parseInt(Menit) === 0) {
        if (parseInt(Detik) <= 10) {
          dumAudioRef.current.play();
          console.log(`Waktu Tinggal ${Detik} detik Lagi`);
        } else {
          dumAudioRef.current.pause();
          dumAudioRef.current.currentTime = 0;
        }
      }

      setSelisihJam(Jam);
      setSelisihMenit(Menit);
      setSelisihDetik(Detik);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeEnd]);

  function DisplayNumber() {
    if (Width < 450) {
      setDisplayNumber((prevDisplayNumber) => !prevDisplayNumber);
    }
  }

  function gotoNumber(number) {
    DisplayNumber();
    window.location.href = `#number-${number}`;
  }

  function AlertTampil() {
    Swal.fire({
      title: "Waktu Anda Habis\n Kirim jawaban seadanya ya",
      icon: "info",
      allowOutsideClick: false,
      confirmButtonColor: "#157347",
      confirmButtonText: "Kirim Jawaban",
      showCancelButton: true,
      cancelButtonText: "Cek penambahan waktu",
    }).then((result) => {
      if (result.isConfirmed) {
        kirimJawaban();
      }
      if (result.isDismissed) {
        fetchData();
      }
    });
  }

  function cekJawaban(number, jawaban, tipe) {
    if (tipe == "pilihan" && jawaban == "~") {
      const esayItem = dataJawaban.find((item) => item.No == number);
      return esayItem ? esayItem.Jawaban : null;
    } else if (tipe == "esay") {
      const esayItem = dataJawaban.find((item) => item.No == number);
      return esayItem ? esayItem.Jawaban : null;
    } else {
      return dataJawaban.some(
        (item) => item.No == number && item.Jawaban == jawaban
      );
    }
  }

  function cekRagu(number) {
    const esayItem = dataJawaban.find((item) => item.No == number);
    return esayItem ? esayItem.Ragu : null;
  }

  function updateJawaban(no, jawaban, ragu) {
    setLoading(true);
    let formData = new FormData();
    formData.append("edit_jawaban", "");
    formData.append("No", no);
    formData.append("Jawaban", jawaban);
    formData.append("ragu", ragu);
    formData.append("dir", directory.dir);
    formData.append("file", directory.file);

    axios({
      method: "post",
      url: `${import.meta.env.VITE_BASEURL}/system_ujian.php`,
      data: formData,
      responseType: "json",
    })
      .then((response) => {
        // setLoading(false);
        if (response.data == "Berhasil") {
          fetchData();
        } else {
          Swal.fire({
            icon: "error",
            title: response.data,
            text: "Mohon beritau panitia ujian untuk pembenahan",
          });
        }
      })
      .catch((error) => {
        console.error("Error updating answer:", error);
      });
  }

  const backupJawaban = async (nama) => {
    let newName = nama.trim();
    newName = nama.replaceAll(" ", "_", newName).replaceAll("'", "`", newName);
    let formData = new FormData();
    formData.append("ujian", Get_Ujian.replaceAll(" ", "_"));
    formData.append("mapel", Get_Mapel.replaceAll(" ", "_"));
    formData.append("kelas", Get_Kelas.replaceAll(" ", "_"));
    formData.append("nama", newName);
    let BaseURL = `${
      import.meta.env.VITE_BASEURL
    }/system_ujian.php?backup_jawaban`;

    if (nama == "All") {
      BaseURL = `${
        import.meta.env.VITE_BASEURL
      }/system_ujian.php?backup_jawaban&All`;
    }

    try {
      const response = await axios.post(BaseURL, formData);
      if (response.data == "Berhasil") {
        // setLoading(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error pada jawaban anda",
          text: `Mohon beritau panitia ujian untuk pembenahan\n${response.data}`,
        });
        // setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const ChangeKirimJawaban = () => {
    let ChangeJawabanKosong = true;
    dataJawaban.forEach((item) => {
      if (item.Jawaban == "" || item.Ragu) {
        ChangeJawabanKosong = false;
      }
    });

    if (!ChangeJawabanKosong) {
      Swal.fire({
        title:
          "Masih ada yang jawaban kosong atau ragu-ragu, Apakah ingin lanjut mengirim",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Lanjut Kirim",
        cancelButtonText: "Tidak Jadi",
        confirmButtonColor: "#157347",
        cancelButtonColor: "#bb2d3b",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          kirimJawaban();
        }
      });
    } else {
      kirimJawaban();
    }
  };

  const kirimJawaban = async () => {
    setLoading(true);
    for (const siswa of dataSiswa) {
      let nama_ujian = Get_Ujian.replaceAll(" ", "_");
      let mapel = Get_Mapel.replaceAll(" ", "_");
      let nama_siswa = siswa.nama.trim();
      nama_siswa = nama_siswa.replaceAll(" ", "_");
      nama_siswa = nama_siswa.replaceAll("'", "`");

      let formData = new FormData();
      formData.append("kirim_jawaban", "");
      formData.append("nama_ujian", nama_ujian);
      formData.append("mapel", mapel);
      formData.append("kelas", siswa.kelas);
      formData.append("tipeKelas", siswa.tipeKelas);
      formData.append("nama_siswa", nama_siswa);
      formData.append("username", siswa.username);

      const kirim = await axios.post(
        `${import.meta.env.VITE_BASEURL}/system_ujian.php`,
        formData
      );

      if (kirim.data == "Berhasil") {
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "Berhasil mengirim jawaban",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          navigate("loby_ujian");
        });
      } else {
        setLoading(false);
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

  function DetectedJam(jam_masuk, hari_masuk) {
    let masuk = jam_masuk.split(":");

    const nowdate = new Date();
    let nowHours = nowdate.getHours();
    if (nowHours < 10) {
      nowHours = `0${nowHours}`;
    }

    let nowMinutes = nowdate.getMinutes();
    if (nowMinutes < 10) {
      nowMinutes = `0${nowMinutes}`;
    }

    let nowDay = nowdate.getDate();
    if (nowDay < 10) {
      nowDay = `0${nowDay}`;
    }

    let nowMonth = nowdate.getMonth();
    if (nowMonth < 10) {
      nowMonth += 1;
      nowMonth = `0${nowMonth}`;
    }

    let nowYear = nowdate.getFullYear();

    let masukTime = parseInt(masuk[0]) * 60 + parseInt(masuk[1]);
    let nowTime = parseInt(nowHours) * 60 + parseInt(nowMinutes);

    if (`${nowYear}-${nowMonth}-${nowDay}` == hari_masuk) {
      if (nowTime < masukTime) {
        navigate("loby_ujian");
      }
    } else {
      navigate("loby_ujian");
    }
  }

  return (
    <Container>
      <audio ref={audioRef} src="/sound/taratata-6264.mp3"></audio>
      <audio ref={dumAudioRef} src="/sound/1minuts_End.mp3"></audio>
      <div
        className={`rounded-bottom-2 position-fixed ${
          selisihJam == 0 && selisihMenit <= 0 ? "timer-end" : "timer"
        }`}
      >
        {waktuSelesai
          ? "Waktu Selesai"
          : selisihJam.toString() === NaN.toString() ||
            selisihMenit === NaN.toString() ||
            selisihDetik === NaN.toString()
          ? `00:00:00`
          : `${selisihJam}:${selisihMenit}:${selisihDetik}`}
      </div>
      <div className="content-ujian">
        <div className="container-soal p-2">
          {data.map((item, index) => (
            <div
              className={`item-soal rounded-4 mb-3 ${
                cekRagu(item.Number) ? "bg-ragu" : ""
              }`}
              key={index}
            >
              <div
                className="d-flex flex-row mb-3 ms-2 mt-2 fw-bolder text-primary number-container"
                onClick={DisplayNumber}
                id={`number-${item.Number}`}
              >
                <div>Soal ke </div>{" "}
                <div className="number-items ms-1 bg-primary text-white">
                  {" "}
                  {item.Number}{" "}
                </div>
              </div>
              <div className="p-2 text-soal">
                <p
                  dangerouslySetInnerHTML={{
                    __html: item.Soal.replaceAll("&nbsp;", " "),
                  }}
                ></p>
              </div>
              {item.tipe == "esay" ? (
                <div className="ms-5">
                  <textarea
                    name={`jawaban-${item.Number}`}
                    cols={Width < 450 ? "30" : Width < 850 ? "60" : "100"}
                    rows="5"
                    id={`jawaban-${item.Number}`}
                    defaultValue={cekJawaban(item.Number, "", item.tipe)}
                  ></textarea>
                  <br />
                  <button
                    className={`btn btn-success ${
                      Width < 450 ? "w-60" : Width < 850 ? "w-75" : "w-25"
                    } mb-2`}
                    onClick={() => {
                      const newValue = document.getElementById(
                        `jawaban-${item.Number}`
                      ).value;
                      updateJawaban(item.Number, newValue, false);
                    }}
                  >
                    kirim jawaban soal ini
                  </button>
                </div>
              ) : (
                <div>
                  {/* Pilihan A */}
                  <div
                    className={`d-flex flex-row mb-3 ms-4 me-4 rounded-3 cek${
                      cekJawaban(item.Number, "A", item.tipe) ? " pilihan" : ""
                    }`}
                    onClick={() => {
                      updateJawaban(item.Number, "A", false);
                    }}
                  >
                    <div className="fw-bolder p-2">
                      <Form.Check
                        inline
                        name={`jawaban-${item.Number}`}
                        type="radio"
                        checked={cekJawaban(item.Number, "A", item.tipe)}
                        id={item.Number + "_A"}
                      />
                    </div>

                    <label
                      htmlFor={item.Number + "_A"}
                      className="p-2"
                      dangerouslySetInnerHTML={{
                        __html: item.A.replaceAll("&nbsp;", " "),
                      }}
                    ></label>
                  </div>
                  {/* Pilihan B */}
                  <div
                    className={`d-flex flex-row mb-3 ms-4 me-4 rounded-3 cek${
                      cekJawaban(item.Number, "B", item.tipe) ? " pilihan" : ""
                    }`}
                    onClick={() => {
                      updateJawaban(item.Number, "B", false);
                    }}
                  >
                    <div className="fw-bolder p-2">
                      <Form.Check
                        inline
                        name={`jawaban-${item.Number}`}
                        type="radio"
                        checked={cekJawaban(item.Number, "B", item.tipe)}
                        id={item.Number + "_B"}
                      />
                    </div>
                    <label
                      htmlFor={item.Number + "_B"}
                      className="p-2"
                      dangerouslySetInnerHTML={{
                        __html: item.B.replaceAll("&nbsp;", " "),
                      }}
                    ></label>
                  </div>
                  {/* Pilihan C */}
                  <div
                    className={`d-flex flex-row mb-3 ms-4 me-4 rounded-3 cek${
                      cekJawaban(item.Number, "C", item.tipe) ? " pilihan" : ""
                    }`}
                    onClick={() => {
                      updateJawaban(item.Number, "C", false);
                    }}
                  >
                    <div className="fw-bolder p-2">
                      <Form.Check
                        inline
                        name={`jawaban-${item.Number}`}
                        type="radio"
                        checked={cekJawaban(item.Number, "C", item.tipe)}
                        id={item.Number + "_C"}
                      />
                    </div>
                    <label
                      htmlFor={item.Number + "_C"}
                      className="p-2"
                      dangerouslySetInnerHTML={{
                        __html: item.C.replaceAll("&nbsp;", " "),
                      }}
                    ></label>
                  </div>
                  {/* Pilihan D */}
                  <div
                    className={`d-flex flex-row mb-3 ms-4 me-4 rounded-3 cek${
                      cekJawaban(item.Number, "D", item.tipe) ? " pilihan" : ""
                    }`}
                    onClick={() => {
                      updateJawaban(item.Number, "D", false);
                    }}
                  >
                    <div className="fw-bolder p-2">
                      <Form.Check
                        inline
                        name={`jawaban-${item.Number}`}
                        type="radio"
                        checked={cekJawaban(item.Number, "D", item.tipe)}
                        id={item.Number + "_D"}
                      />
                    </div>
                    <label
                      htmlFor={item.Number + "_D"}
                      className="p-2"
                      dangerouslySetInnerHTML={{
                        __html: item.D.replaceAll("&nbsp;", " "),
                      }}
                    ></label>
                  </div>
                  {/* Pilihan E */}
                  {item.E == "" ||
                  item.E == " " ||
                  item.E == "<p><br></p>" ||
                  item.E == "<p></p>" ||
                  item.E == "<br>" ? null : (
                    <div
                      className={`d-flex flex-row mb-3 ms-4 me-4 rounded-3 cek${
                        cekJawaban(item.Number, "E", item.tipe)
                          ? " pilihan"
                          : ""
                      }`}
                      onClick={() => {
                        updateJawaban(item.Number, "E", false);
                      }}
                    >
                      <div className="fw-bolder p-2">
                        <Form.Check
                          inline
                          name={`jawaban-${item.Number}`}
                          type="radio"
                          checked={cekJawaban(item.Number, "E", item.tipe)}
                          id={item.Number + "_E"}
                        />
                      </div>
                      <div
                        className="p-2"
                        dangerouslySetInnerHTML={{
                          __html: item.E.replaceAll("&nbsp;", " "),
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              )}
              <div align="center">
                {cekRagu(item.Number) ? (
                  <button
                    className="btn btn-success btn-sm mb-3"
                    onClick={() => {
                      updateJawaban(
                        item.Number,
                        cekJawaban(item.Number, "~", item.tipe),
                        false
                      );
                    }}
                  >
                    Yakin
                  </button>
                ) : (
                  <button
                    className="btn btn-warning btn-sm mb-3"
                    onClick={() => {
                      updateJawaban(
                        item.Number,
                        cekJawaban(item.Number, "~", item.tipe),
                        true
                      );
                    }}
                  >
                    Ragu-Ragu
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            className="btn btn-success w-100 m-3"
            hidden={Width > 450}
            onClick={ChangeKirimJawaban}
          >
            Kirim Jawaban
          </button>
        </div>

        <div className="container-number" hidden={displayNumber}>
          <button
            className="btn btn-success w-100"
            onClick={ChangeKirimJawaban}
          >
            Kirim Jawaban
          </button>
          <div className={dataJawaban.length > 44 ? "row row-scroll" : "row"}>
            {dataJawaban.map((item, index) => (
              <div
                key={index}
                className={`item-number col-3 border border-2 fs-4 fw-bolder${
                  cekRagu(item.No)
                    ? " bg-warning text-black"
                    : item.Jawaban != ""
                    ? " bg-success text-white"
                    : ""
                }`}
                onClick={() => {
                  gotoNumber(item.No);
                }}
              >
                {item.No}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};
export default Ujian;
