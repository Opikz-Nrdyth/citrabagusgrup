import { Container, FloatingLabel, Form } from "react-bootstrap";
import "../../assets/Style/Client/lobyujian.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const LobyUjian = ({ loading, setLoading, dataSiswa }) => {
  const Width = window.screen.width;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const SwalReactContent = withReactContent(Swal);
  const [ClickKirimData, setClickKirimData] = useState(false);
  const [dataUniv, setDataUniv] = useState({
    univ_1: "",
    prodi_1: "",
    univ_2: "",
    prodi_2: "",
    univ_3: "",
    prodi_3: "",
  });

  const [viewMinat, setViewMinat] = useState(false);

  useEffect(() => {
    document.body.style.overflowY = "scroll";
    if (dataSiswa.length > 0) {
      dataSiswa.forEach((siswa) => {
        setLoading(true);
        axios({
          url: `${import.meta.env.VITE_BASEURL}/ujian.php?read_ujian&search=${
            siswa.kelas
          }`,
          method: "get",
          responseType: "json",
        })
          .then((response) => {
            setData(response.data);
          })
          .finally(() => {
            setLoading(false);
          });
      });
    }
  }, [dataSiswa]);

  function pickRandomColor() {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor}`;
  }

  useEffect(() => {
    axios({
      method: "get",
      url: `${import.meta.env.VITE_BASEURL}/settings.php?read`,
    }).then((response) => {
      response.data.forEach((item) => {
        if (item.nama == "minat_univ") {
          setViewMinat(item.value);
        }
      });
    });
  }, []);

  useEffect(() => {
    if (ClickKirimData) {
      const minat_1 = `${dataUniv.univ_1} - ${dataUniv.prodi_1}`;
      const minat_2 = `${dataUniv.univ_2} - ${dataUniv.prodi_2}`;
      const minat_3 = `${dataUniv.univ_3} - ${dataUniv.prodi_3}`;

      dataSiswa.forEach((siswa) => {
        let formData = new FormData();
        formData.append("add_univ", "");
        formData.append("user", siswa.username);
        formData.append("nama", siswa.nama);
        formData.append("univ1", minat_1);
        formData.append("univ2", minat_2);
        formData.append("univ3", minat_3);
        axios({
          url: `${import.meta.env.VITE_BASEURL}/minat_univ.php`,
          method: "post",
          data: formData,
          responseType: "json",
        })
          .then((response) => {
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
          })
          .finally(() => {
            setClickKirimData(false);
          });
      });
    }
  }, [ClickKirimData, dataUniv]);

  const isHidden = (item) =>
    item.status !== "hidden" && item.status !== "preview";
  const dataOnline = data.filter(isHidden);

  const hasOnline = data.some(isHidden);

  function DetectedJam(jam_masuk, jam_keluar, hari_masuk) {
    let masuk = jam_masuk.split(":");
    let keluar = jam_keluar.split(":");

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

    let nowMonth = nowdate.getMonth() + 1; // karena indeks bulan dimulai dari 0
    if (nowMonth < 10) {
      nowMonth = `0${nowMonth}`;
    }

    let nowYear = nowdate.getFullYear();

    let masukTime = parseInt(masuk[0]) * 60 + parseInt(masuk[1]);
    let keluarTime = parseInt(keluar[0]) * 60 + parseInt(keluar[1]);
    let nowTime = parseInt(nowHours) * 60 + parseInt(nowMinutes);

    if (`${nowYear}-${nowMonth}-${nowDay}` == hari_masuk) {
      if (nowTime < masukTime) {
        return false; // belum waktunya masuk
      } else if (nowTime >= keluarTime) {
        return false; // sudah waktunya keluar
      } else {
        return true; // boleh masuk
      }
    } else {
      return false; // bukan hari masuk
    }
  }

  const AddMinatUniv = async () => {
    const result = await SwalReactContent.fire({
      title: "Tambah Minat Universitas Anda",
      showCancelButton: true,
      confirmButtonText: "Kirim Data",
      cancelButtonText: "Tidak Jadi",
      confirmButtonColor: "#157347",
      cancelButtonColor: "#bb2d3b",
      allowOutsideClick: false,
      html: (
        <div style={{ overflowX: "hidden" }}>
          {/* Minat 1 */}
          <FloatingLabel label="Masukan Universitas Pertama" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Masukan Universitas Pertama"
              defaultValue={dataUniv.univ_1}
              onChange={(e) => {
                setDataUniv((prevState) => ({
                  ...prevState,
                  univ_1: e.target.value,
                }));
              }}
            />
          </FloatingLabel>

          <FloatingLabel
            label="Masukan Program Studi / Jurusan Pertama"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="Masukan Jurusan Pertama"
              defaultValue={dataUniv.prodi_1}
              onChange={(e) => {
                setDataUniv((prevState) => ({
                  ...prevState,
                  prodi_1: e.target.value,
                }));
              }}
            />
          </FloatingLabel>
          {/* Minat 2 */}
          <FloatingLabel label="Masukan Universitas Kedua" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Masukan Universitas Kedua"
              defaultValue={dataUniv.univ_2}
              onChange={(e) => {
                setDataUniv((prevState) => ({
                  ...prevState,
                  univ_2: e.target.value,
                }));
              }}
            />
          </FloatingLabel>
          <FloatingLabel
            label="Masukan Program Studi / Jurusan Kedua"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="Masukan Jurusan Kedua"
              defaultValue={dataUniv.prodi_2}
              onChange={(e) => {
                setDataUniv((prevState) => ({
                  ...prevState,
                  prodi_2: e.target.value,
                }));
              }}
            />
          </FloatingLabel>
          {/* Minat 3 */}
          <FloatingLabel label="Masukan Universitas Ketiga" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Masukan Universitas Ketiga"
              defaultValue={dataUniv.univ_3}
              onChange={(e) => {
                setDataUniv((prevState) => ({
                  ...prevState,
                  univ_3: e.target.value,
                }));
              }}
            />
          </FloatingLabel>
          <FloatingLabel
            label="Masukan Program Studi / Jurusan Ketiga"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="Masukan Jurusan Ketiga"
              defaultValue={dataUniv.prodi_3}
              onChange={(e) => {
                setDataUniv((prevState) => ({
                  ...prevState,
                  prodi_3: e.target.value,
                }));
              }}
            />
          </FloatingLabel>
        </div>
      ),
    });

    if (result.isConfirmed) {
      setClickKirimData(true);
    }
  };

  return (
    <Container className="container-data">
      {dataSiswa?.map((item, index) => {
        if (viewMinat && item.kelas == 12) {
          return (
            <div className="mb-2" align="center" key={index}>
              <button className="btn btn-primary" onClick={AddMinatUniv}>
                Masukan Minat Universitas
              </button>
            </div>
          );
        }
      })}
      <div className="row gap-3 content">
        {hasOnline ? (
          dataOnline.map((item, index) => (
            <div
              key={index}
              className={
                Width > 900
                  ? "item-loby border col-3 rounded-4 d-flex flex-column"
                  : "item-loby border border-1 border-black shadow-sm col-5 rounded-4 d-flex flex-column"
              }
            >
              <div align="right">
                <div
                  className="circle"
                  style={{ backgroundColor: pickRandomColor() }}
                ></div>
              </div>
              <div className="fs-6 fw-bold tryout">{item.nama_ujian}</div>
              <div className="fs-4 fw-bolder text-center">{item.mapel}</div>
              <div className="row mt-3">
                <div className={Width > 450 ? "col-6" : "col-12 text-center"}>
                  Kelas {item.kelas}
                </div>
                <div
                  className={
                    Width > 450 ? "col-6 text-end" : "col-12 text-center"
                  }
                >
                  <span>{item.tanggal}</span>
                  <div>{`${item.jam_mulai}-${item.jam_selesai}`}</div>
                </div>
              </div>
              <button
                className={`btn w-100 mb-2 mt-2 ${
                  item.status == "preview" ? "btn-warning" : "btn-primary"
                }`}
                onClick={() => {
                  if (
                    DetectedJam(item.jam_mulai, item.jam_selesai, item.tanggal)
                  ) {
                    navigate(
                      `ujian?ujian=${item.nama_ujian}&mapel=${item.mapel}&kelas=${item.kelas}`
                    );
                  }
                }}
                disabled={
                  item.status == "stop" ||
                  !DetectedJam(item.jam_mulai, item.jam_selesai, item.tanggal)
                }
              >
                {item.status == "preview" ? "Preview" : "Mulai Ujian"}
              </button>
            </div>
          ))
        ) : loading ? (
          <div
            className={
              Width > 900
                ? "item-loby border col-3 rounded-4 d-flex flex-column ui placeholder"
                : "item-loby border border-1 border-black shadow-sm col-5 rounded-4 d-flex flex-column ui placeholder"
            }
          >
            <div align="right">
              <div
                className="circle"
                style={{ backgroundColor: pickRandomColor() }}
              ></div>
            </div>

            <div className="fs-6 fw-bold tryout line"></div>
            <div className="fs-4 fw-bolder text-center line w-75 ms-5"></div>
            <div className="row mt-3">
              <div
                className={
                  Width > 450 ? "col-6 line" : "col-12 text-center line"
                }
              ></div>
              <div
                className={
                  Width > 450 ? "col-6 text-end" : "col-12 text-center"
                }
              >
                <div className="line"></div>
                <div className="line">     -     </div>
              </div>
            </div>
            <button className="btn btn-primary disabled placeholder"></button>
          </div>
        ) : (
          <div className="position-absolute start-50 top-50 translate-middle">
            <p align="center">
              <img src="/images/NoFound.gif" width="300px" alt="not found" />
            </p>
          </div>
        )}
      </div>
    </Container>
  );
};
export default LobyUjian;
