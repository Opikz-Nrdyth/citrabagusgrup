import axios from "axios";
import { useEffect, useState } from "react";
import { FloatingLabel, Form, InputGroup } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const TableAbsenKaryawan = ({ setLoading, searchID }) => {
  const [dataAbsen, setDataAbsen] = useState([]);
  const [alfa, setAlfa] = useState(0);
  const [URL, setURL] = useState(
    `${
      import.meta.env.VITE_BASEURL
    }/karyawan.php?absenKaryawan&nama=${searchID}`
  );
  const Width = window.screen.width;

  const SwalReactContent = withReactContent(Swal);

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    const dateObject = new Date(`${year}-${month}-${day}`);
    const dayNames = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const dayName = dayNames[dateObject.getDay()];
    let tanggal = dateObject.getDate();
    if (tanggal < 10) {
      tanggal = `0${tanggal}`;
    }
    let bulan = dateObject.getMonth() + 1;
    if (bulan < 10) {
      bulan = `0${bulan}`;
    }
    const tahun = dateObject.getFullYear();
    return `${dayName}, ${tanggal}/${bulan}/${tahun}`;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(URL);
      let sumAlfa = 0;
      response.data.forEach((item) => {
        if (item.Kehadiran == "-") {
          sumAlfa++;
        }
      });
      setAlfa(sumAlfa);
      setDataAbsen(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [URL]);

  const cekTanggal = () => {
    const TanggalAwal = document.getElementById("tanggal_awal").value;
    const TanggalAkhir = document.getElementById("tanggal_akhir").value;
    if (!TanggalAwal) {
      Swal.fire({
        title: "Masukan Tanggal Awal",
      });
    } else {
      setURL(
        `${
          import.meta.env.VITE_BASEURL
        }/karyawan.php?absenKaryawan&nama=${searchID}&tanggal_awal=${TanggalAwal}&tanggal_akhir=${TanggalAkhir}`
      );
      // Hapus pemanggilan fetchData() dari sini
    }
  };

  const editAbsen = (id) => {
    SwalReactContent.fire({
      title: "Edit Absen Karyawan",
      html: (
        <div>
          <FloatingLabel id="Time" label="Time" className="mb-2">
            <Form.Control
              type="time"
              placeholder="Time"
              id="time"
            ></Form.Control>
          </FloatingLabel>
          <FloatingLabel id="Token" label="Token" className="mb-2">
            <Form.Control
              type="password"
              placeholder="Token"
              id="token"
            ></Form.Control>
          </FloatingLabel>
        </div>
      ),
      confirmButtonColor: "#157347",
      confirmButtonText: "Simpan",
      showCancelButton: true,
      cancelButtonColor: "#bb2d3b",
      cancelButtonText: "Batal",
      allowOutsideClick: false,
      showDenyButton: true,
      denyButtonText: "Bikin Alfa",
      denyButtonColor: "#bb2d3b",
    }).then((result) => {
      const time = document.getElementById("time").value;
      const token = document.getElementById("token").value;

      if (result.isConfirmed) {
        if (token == `${import.meta.env.VITE_TOKEN}`) {
          let formData = new FormData();
          formData.append("time", time);
          formData.append("id", id);
          formData.append("status", "Hadir");
          formData.append("editAbsen", "");
          setLoading(true);
          axios({
            method: "post",
            url: `${import.meta.env.VITE_BASEURL}/karyawan.php`,
            data: formData,
          }).then((response) => {
            if (response.data == "Berhasil") {
              Swal.fire({
                icon: "success",
                title: "Berhasil",
                timer: 1500,
                showConfirmButton: false,
              });

              fetchData();
            } else {
              Swal.fire({
                icon: "info",
                title: response.data,
              });
            }
          });
        } else if (time == "") {
          Swal.fire({
            icon: "error",
            title: "Mohon masukan jam yang valid",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Token salah, Minta bantuan ke Manager atau Developer!!!",
          });
        }
      }
      if (result.isDenied) {
        if (token == `${import.meta.env.VITE_TOKEN}`) {
          let formData = new FormData();
          formData.append("time", time);
          formData.append("id", id);
          formData.append("status", "alfa");
          formData.append("editAbsen", "");
          setLoading(true);
          axios({
            method: "post",
            url: `${import.meta.env.VITE_BASEURL}/karyawan.php`,
            data: formData,
          }).then((response) => {
            if (response.data == "Berhasil") {
              Swal.fire({
                icon: "success",
                title: "Berhasil",
                timer: 1500,
                showConfirmButton: false,
              });

              fetchData();
            } else {
              Swal.fire({
                icon: "info",
                title: response.data,
              });
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Token salah, Minta bantuan ke Manager atau Developer!!!",
          });
        }
      }
    });
  };

  const DeleteAbsen = (nama, tanggal, id) => {
    Swal.fire({
      icon: "info",
      title: `Anda yakin ingin menghapus absensi ${nama} di hari ${tanggal}`,
      confirmButtonColor: "#bb2d3b",
      confirmButtonText: "Hapus",
      showCancelButton: true,
      cancelButtonColor: "#157347",
      cancelButtonText: "Batal",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        let formData = new FormData();
        formData.append("id", id);
        formData.append("deleteAbsen", "");

        axios({
          method: "post",
          url: `${import.meta.env.VITE_BASEURL}/karyawan.php`,
          data: formData,
        }).then((response) => {
          if (response.data == "Berhasil") {
            Swal.fire({
              icon: "success",
              title: "Berhasil",
              timer: 1500,
              showConfirmButton: false,
            });

            fetchData();
          } else {
            Swal.fire({
              icon: "info",
              title: response.data,
            });
          }
        });
      }
    });
  };

  return (
    <div>
      <div className="header-button w-element-admin">
        <InputGroup className={Width > 900 ? "mb-3 w-75" : "mb-3 w-100"}>
          {Width > 450 ? (
            <InputGroup.Text id="basic-addon1">Tanggal Awal</InputGroup.Text>
          ) : (
            ""
          )}
          <Form.Control
            placeholder="TanggalAwal"
            aria-label="TanggalAwal"
            aria-describedby="basic-addon1"
            id="tanggal_awal"
            type="date"
          />
          {Width > 450 ? (
            <InputGroup.Text id="basic-addon2">Tanggal Akhir</InputGroup.Text>
          ) : (
            ""
          )}
          <Form.Control
            placeholder="TanggalAwal"
            aria-label="TanggalAwal"
            id="tanggal_akhir"
            aria-describedby="basic-addon1"
            type="date"
          />
          <button className="btn btn-success" onClick={cekTanggal}>
            Cek
          </button>
        </InputGroup>
      </div>

      <span className="fw-bolder">
        Total Result: {dataAbsen.length} &ensp; Tidak Hadir: {alfa.toString()}
      </span>

      <table className="table-striped table w-element-admin">
        <thead className="table-info">
          <tr>
            <th>Nama Karyawan</th>
            <th>Tanggal</th>
            <th>Jam</th>
            <th>Kehadiran</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dataAbsen.map((item, index) => (
            <tr
              key={index}
              className={item.Kehadiran == "-" ? "table-danger fw-bolder" : ""}
            >
              <td>{item.nama}</td>
              <td>{formatDate(item.tanggal)}</td>
              <td>{item.jam}</td>
              <td>{item.Kehadiran == "H" ? "Hadir" : "Tidak Hadir"}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-1"
                  onClick={() => {
                    editAbsen(item.id);
                  }}
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    DeleteAbsen(item.nama, formatDate(item.tanggal), item.id);
                  }}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default TableAbsenKaryawan;
