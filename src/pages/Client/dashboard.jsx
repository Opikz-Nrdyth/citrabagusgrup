import { Card, Container, FloatingLabel, Form } from "react-bootstrap";
import "../../assets/Style/Client/dashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Placeholder,
  PlaceholderLine,
  PlaceholderParagraph,
} from "semantic-ui-react";
import withReactContent from "sweetalert2-react-content";

const formatDate = (dateString) => {
  const months = [
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

  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  const date = new Date(dateString);
  const dayName = days[date.getDay()];
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${dayName}, ${day}-${month}-${year}`;
};

const Dashboard = ({ setLoading, dataSiswa }) => {
  const Width = window.screen.width;
  const date = new Date();
  const [data, setData] = useState([]);
  const [dataInformation, setDataInformation] = useState([]);
  const SwalReactContent = withReactContent(Swal);
  function Ucapan() {
    let Sambuatan = "";
    const Jam = date.getHours();
    if (Jam > 23 || Jam <= 10) {
      // ubah && menjadi ||
      Sambuatan = "Selamat Pagi";
    } else if (Jam > 10 && Jam <= 14) {
      Sambuatan = "Selamat Siang";
    } else if (Jam > 14 && Jam <= 20) {
      Sambuatan = "Selamat Sore";
    } else if (Jam > 20 && Jam <= 23) {
      Sambuatan = "Selamat Malam";
    }
    return Sambuatan;
  }

  const [getPlaceholder, setPlaceholder] = useState(true);
  const navigate = useNavigate();

  const fetchData = () => {
    axios({
      method: "get",
      url: `${import.meta.env.VITE_BASEURL}/settings.php?read`,
    }).then((response) => {
      setData(response.data);
    });

    axios({
      method: "get",
      url: `${import.meta.env.VITE_BASEURL}/information.php?get`,
    })
      .then((response) => {
        setDataInformation(response.data);
      })
      .finally(() => {
        setPlaceholder(false);
      });
  };
  useEffect(() => {
    fetchData();
    document.body.style.overflowY = "scroll";
    document.body.style.overflowX = "hidden";
  }, []);

  function cekEnable(name) {
    let callBack = "";
    data.forEach((item) => {
      if (item.nama == name) {
        callBack = item.value;
      }
    });
    return callBack;
  }

  function masukTryOut() {
    if (data && data.length > 0) {
      if (!cekEnable("Pra_Regist")) {
        Swal.fire({
          title: "Anda tidak diperkenankan mengikuti ujian",
          text: "Mohon hubungi petugas front office untuk melakukan administrasi dan daftar ulang",
          icon: "info",
        }).then(() => {
          fetchData();
        });
      } else if (cekEnable("ujian")) {
        if (
          localStorage.getItem("token_ujian") == null ||
          localStorage.getItem("token_ujian") != cekEnable("token_ujian")
        ) {
          SwalReactContent.fire({
            title: "Masukan Token Ujian",
            html: (
              <FloatingLabel
                controlId="token_id"
                label="Token Ujian"
                required
                name="Token Ujian"
                className="mb-1"
              >
                <Form.Control type="text" placeholder="Token Ujian" />
              </FloatingLabel>
            ),
            confirmButtonColor: "#157347",
            confirmButtonText: "Simpan",
            showCancelButton: true,
            cancelButtonColor: "#bb2d3b",
            cancelButtonText: "Batal",
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              const token_id = document.getElementById("token_id").value;

              if (token_id != "" || token_id != " ") {
                localStorage.setItem("token_ujian", token_id);
                masukTryOut();
              }
            }
          });
        } else {
          navigate("loby_ujian");
        }
      } else {
        Swal.fire({
          title: "Tombol ini dinonaktifkan admin",
          icon: "info",
          timer: 1000,
          showConfirmButton: false,
        }).then(() => {
          fetchData();
        });
      }
    }
  }
  return (
    <div>
      {dataSiswa.map((item, index) => (
        <div className="header" key={index}>
          <div className="blue-section">
            <div className="fs-3 fw-bolder">
              <i className="fa-solid fa-grip-vertical"></i> Citra Bagus Grup
            </div>
          </div>
          <div id="curved-corner-topleft"></div>
          <div className="talk-bubble tri-right round btm-left">
            <div className="talktext">
              <div className="name fs-3 fw-bolder">Hai, {item.nama}</div>
              <div className="ucapan">{Ucapan()}</div>
            </div>
            <div className="dots">
              <div className="dots-1">
                <div className="dots-1-inner"></div>
              </div>
              <div className="dots-2"></div>
              <div className="dots-3"></div>
            </div>
          </div>

          <div
            className="Account"
            onClick={() => {
              navigate("profile");
            }}
          >
            <img src={item.profile} alt="Profile" />
          </div>
        </div>
      ))}

      <div className="row button-selection gap-3">
        <div
          className={Width > 850 ? "col-2 button-item" : "col-5 button-item"}
          onClick={() => {
            data && data.length > 0
              ? cekEnable("materi")
                ? navigate("materi")
                : Swal.fire({
                    title: "Tombol ini dinonaktifkan admin",
                    icon: "info",
                    timer: 1000,
                    showConfirmButton: false,
                  }).then(() => {
                    fetchData();
                  })
              : null;
          }}
        >
          <p className="fs-2 fw-bolder">Materi</p>
          <img src="/images/Materi.png" alt="Materi" />
        </div>
        <div
          className={Width > 850 ? "col-2 button-item" : "col-5 button-item"}
          onClick={() => {
            data && data.length > 0
              ? cekEnable("jadwal")
                ? navigate("jadwal")
                : Swal.fire({
                    title: "Tombol ini dinonaktifkan admin",
                    icon: "info",
                    timer: 1000,
                    showConfirmButton: false,
                  }).then(() => {
                    fetchData();
                  })
              : null;
          }}
        >
          <p className="fs-2 fw-bolder">Jadwal</p>
          <img
            src={`/images/calendar-icon-${date.getDate()}.png`}
            alt="Calander"
          />
        </div>
        <div
          className={Width > 850 ? "col-2 button-item" : "col-5 button-item"}
          onClick={() => {
            data && data.length > 0
              ? cekEnable("penilaian")
                ? navigate("penilaian")
                : Swal.fire({
                    title: "Tombol ini dinonaktifkan admin",
                    icon: "info",
                    timer: 1000,
                    showConfirmButton: false,
                  }).then(() => {
                    fetchData();
                  })
              : null;
          }}
        >
          <p className="fs-2 fw-bolder">Penilaian</p>
          <img src="/images/Evaluasi.png" alt="Penilaian" />
        </div>
        <div
          className={Width > 850 ? "col-2 button-item" : "col-5 button-item"}
          onClick={masukTryOut}
        >
          <p className="fs-2 fw-bolder">Try Out</p>
          <img src="/images/Tryout.png" alt="try out" />
        </div>
      </div>

      <div id="curved-corner-topright"></div>
      <div className="comment-selection"></div>
      <div className="title-comment fs-1 fw-bolder">
        Informasi Terbaru Bimbel CBG
      </div>
      <div className="informations">
        <Container>
          <div className="row gap-2">
            {dataInformation && dataInformation.length > 0 ? (
              dataInformation.map((item, index) => (
                <div
                  className={
                    Width > 850 ? "item-comment col-5" : "item-comment col-12"
                  }
                  key={index}
                >
                  <div className="title-items fs-3">{item.title}</div>
                  <div align="right">{formatDate(item.tanggal_terbit)}</div>
                  <hr />
                  <div className="deskripsi-items fs-6">{item.deskripsi}</div>
                </div>
              ))
            ) : getPlaceholder ? (
              <div className="col-12 gap-2 row">
                <div
                  className={
                    Width > 850
                      ? "item-comment-placeholder col-5"
                      : "item-comment-placeholder col-12"
                  }
                >
                  <Placeholder className="placeHolder">
                    <PlaceholderParagraph>
                      <PlaceholderLine />
                      <PlaceholderLine />
                      <hr />
                      <PlaceholderLine />
                    </PlaceholderParagraph>
                  </Placeholder>
                </div>
                <div
                  className={
                    Width > 850
                      ? "item-comment-placeholder col-5"
                      : "item-comment-placeholder col-12"
                  }
                >
                  <Placeholder className="placeHolder">
                    <PlaceholderParagraph>
                      <PlaceholderLine />
                      <PlaceholderLine />
                      <hr />
                      <PlaceholderLine />
                    </PlaceholderParagraph>
                  </Placeholder>
                </div>
              </div>
            ) : null}
          </div>
        </Container>
      </div>
    </div>
  );
};
export default Dashboard;
