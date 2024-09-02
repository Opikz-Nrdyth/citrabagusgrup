import { Container, FloatingLabel, Form, Navbar } from "react-bootstrap";
import Logo from "/images/logo.png";
import "../../assets/Style/universal.css";
import "../../assets/Style/presensiAdmin.css";

import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Loader from "../../assets/Components/loader";
import withReactContent from "sweetalert2-react-content";

const PresensiAdmin = () => {
  const [qrCodeScanner, setQRCodeScanner] = useState();
  const [qrRunning, setQrRunning] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const SwalReactContent = withReactContent(Swal);

  const fetchData = () => {
    document.body.style.overflowY = "scroll";
    setLoading(true);
    axios({
      method: "get",
      url: `${import.meta.env.VITE_BASEURL}/karyawan.php?tambahAbsen`,
      responseType: "json",
    }).finally(() => {
      axios({
        method: "get",
        url: `${import.meta.env.VITE_BASEURL}/karyawan.php?absenHarian`,
        responseType: "json",
      })
        .then((response) => {
          setData(response.data);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  useEffect(() => {
    setQRCodeScanner(
      new Html5Qrcode("reader", {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      })
    );
    setToken();
    fetchData();
  }, []);

  const OpenCamera = () => {
    const onScanSuccess = (qrCodeMessage) => {
      CloseCamera();
      let formData = new FormData();
      formData.append("updateAbsen", "");
      formData.append("id", qrCodeMessage);
      let responseData = "";
      setLoading(true);
      axios({
        method: "post",
        data: formData,
        url: `${import.meta.env.VITE_BASEURL}/karyawan.php`,
        responseType: "json",
      })
        .then((response) => {
          responseData = response.data;
          if (responseData == "Berhasil") {
            Swal.fire({
              icon: "success",
              title: "Berhasil",
              timer: 1500,
              showConfirmButton: false,
            });
            fetchData();
          } else {
            Swal.fire({
              icon: "error",
              title: responseData,
            });
          }
        })
        .finally(() => {
          setLoading(false);
        });
    };
    qrCodeScanner.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: 200,
        video: { width: { min: 1, ideal: 1 }, height: { min: 1, ideal: 1 } },
      },
      onScanSuccess
    );
    setQrRunning(true);
  };

  const CloseCamera = () => {
    qrCodeScanner.stop();
    setQrRunning(false);
  };

  const setToken = () => {
    if (localStorage.getItem("token") != `${import.meta.env.VITE_TOKEN}`) {
      SwalReactContent.fire({
        title: "Masukan Token Akses",
        html: (
          <FloatingLabel id="Token" label="Token" className="mb-2">
            <Form.Control
              type="password"
              placeholder="Token"
              id="token"
            ></Form.Control>
          </FloatingLabel>
        ),
        confirmButtonColor: "#157347",
        confirmButtonText: "Simpan",
        showCancelButton: true,
        cancelButtonColor: "#bb2d3b",
        cancelButtonText: "Batal",
        allowOutsideClick: false,
      }).then((response) => {
        if (response.isConfirmed) {
          const token = document.getElementById("token").value;
          if (token == `${import.meta.env.VITE_TOKEN}`) {
            localStorage.setItem("token", token);
          } else {
            Swal.fire({
              title:
                "Token salah atau Anda tidak mempunyai akses untuk halaman ini",
              icon: "warning",
            }).then((res) => {
              setToken();
            });
          }
        }
      });
    }
  };

  return (
    <div>
      <Navbar
        collapseOnSelect
        expand="lg"
        className="bg-orangered position-fixed w-nav top-0 z-3 overflow-hidden"
      >
        <Container>
          <Navbar.Brand className="brand">
            <img src={Logo} alt="Logo" height={30} width={30} /> | Presensi
            Admin
          </Navbar.Brand>
        </Container>
      </Navbar>

      <div className="margin-content w-100">
        <div align="center">
          <div className="qrcode-canvas">
            <div id="reader"></div>
          </div>
          <button
            className={
              qrRunning ? "btn btn-warning mt-3" : "btn btn-success mt-3"
            }
            onClick={qrRunning ? CloseCamera : OpenCamera}
          >
            {qrRunning ? "Close Camera" : "Open Camera"}
          </button>
          <table className="mt-3 table table-striped w-element-admin">
            <thead className="table-info">
              <tr>
                <td>Nama</td>
                <td>Tanggal</td>
                <td>Jam</td>
              </tr>
            </thead>
            <thead>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className={item.Kehadiran == "-" ? "table-danger" : ""}
                >
                  <td> {item.nama} </td>
                  <td> {item.tanggal} </td>
                  <td> {item.jam} </td>
                </tr>
              ))}
            </thead>
          </table>
        </div>
      </div>
      {loading ? <Loader /> : null}
    </div>
  );
};
export default PresensiAdmin;
