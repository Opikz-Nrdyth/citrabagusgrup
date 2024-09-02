import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const ReadAnswer = () => {
  const UrlParams = new URLSearchParams(document.location.search);
  const Get_Ujian = UrlParams.get("ujian").replaceAll(" ", "_");
  const Get_Mapel = UrlParams.get("mapel").replaceAll(" ", "_");
  const Get_Kelas = UrlParams.get("kelas");
  const Get_Mulai = UrlParams.get("mulai");

  const Width = window.screen.width;

  const [data, setData] = useState([]);

  const fetchData = async () => {
    let formData = new FormData();
    formData.append("ujian", Get_Ujian);
    formData.append("mapel", Get_Mapel);
    formData.append("kelas", Get_Kelas);
    formData.append("mulai", Get_Mulai);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASEURL}/system_ujian.php?cek_jawaban`,
        formData
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 4000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const backupJawaban = async (nama) => {
    let newName = nama.trim();
    newName = nama.replaceAll(" ", "_", newName).replaceAll("'", "`", newName);
    let formData = new FormData();
    formData.append("ujian", Get_Ujian);
    formData.append("mapel", Get_Mapel);
    formData.append("kelas", Get_Kelas);
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
        Swal.fire({
          title: `Berhasil Membackup ${nama == "All" ? "Semua" : ""} Jawaban`,
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
      console.error("Error fetching data:", error);
    }
  };

  const restoreJawaban = async (nama) => {
    let newName = nama.trim();
    newName = nama.replaceAll(" ", "_", newName).replaceAll("'", "`", newName);
    let formData = new FormData();
    formData.append("ujian", Get_Ujian);
    formData.append("mapel", Get_Mapel);
    formData.append("kelas", Get_Kelas);
    formData.append("nama", newName);
    let BaseURL = `${
      import.meta.env.VITE_BASEURL
    }/system_ujian.php?restore_jawaban`;

    if (nama == "All") {
      BaseURL = `${
        import.meta.env.VITE_BASEURL
      }/system_ujian.php?restore_jawaban&All`;
    }

    try {
      const response = await axios.post(BaseURL, formData);
      if (response.data.indexOf("Berhasil") > -1) {
        Swal.fire({
          title: `Berhasil Merestore ${nama == "All" ? "Semua" : ""} Jawaban`,
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
      console.error("Error fetching data:", error);
    }
  };

  const removeJawaban = async (nama) => {
    let newName = nama.trim();
    newName = nama.replaceAll(" ", "_", newName).replaceAll("'", "`", newName);
    let formData = new FormData();
    formData.append("ujian", Get_Ujian);
    formData.append("mapel", Get_Mapel);
    formData.append("kelas", Get_Kelas);
    formData.append("nama", newName);
    let BaseURL = `${
      import.meta.env.VITE_BASEURL
    }/system_ujian.php?hapus_jawaban`;

    if (nama == "All") {
      BaseURL = `${
        import.meta.env.VITE_BASEURL
      }/system_ujian.php?hapus_jawaban&All`;
    }

    try {
      Swal.fire({
        title: "Apakah Anda Benar-Benar Ingin Menghapsu Jawaban",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Lanjut Delete",
        cancelButtonText: "Tidak Jadi",
        confirmButtonColor: "#fd4053",
        cancelButtonColor: "#22bf76",
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await axios.post(BaseURL, formData);
          if (response.data.indexOf("Berhasil") > -1) {
            Swal.fire({
              title: `Berhasil Menghapus ${
                nama == "All" ? "Semua" : ""
              } Jawaban`,
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
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="w-element-admin overflow-x-scroll">
      <div align="right" className="mb-3">
        <button
          className="btn btn-primary me-3"
          onClick={() => {
            backupJawaban("All");
          }}
        >
          <i className="fa-solid fa-cloud-arrow-up"></i> Backup Semua Jawaban
        </button>
        <button
          className="btn btn-success"
          onClick={() => {
            restoreJawaban("All");
          }}
        >
          <i className="fa-solid fa-cloud-arrow-down"></i> Restore Semua Jawaban
        </button>
      </div>
      <table className="table table-striped">
        <thead className="table-info">
          <tr>
            <th rowSpan="2" className="align-middle">
              Nama
            </th>
            <th rowSpan="2" className="align-middle">
              Created File
            </th>
            <th rowSpan="2" className="align-middle">
              Terakhir Diedit
            </th>
            <th rowSpan="2" className="align-middle">
              Waktu Telat
            </th>
            <th rowSpan="2" className="align-middle">
              Dikerjakan
            </th>
            <th rowSpan="2" className="align-middle">
              Belum Dikerjakan
            </th>
            <th colSpan="3" className="text-center">
              Action
            </th>
          </tr>
          <tr>
            <th>backup</th>
            <th>restore</th>
            <th>delete</th>
          </tr>
        </thead>
        <tbody>
          {data && data.data && data.data.length > 0 ? (
            data.data.map((item, index) => (
              <tr
                key={index}
                className={
                  item.file_error || item.sudah_dikerjakan == 0
                    ? "table-danger"
                    : item.sudah_dikerjakan > 0 && !item.sudah_dikirim
                    ? "table-primary"
                    : null
                }
              >
                <td>{item.nama}</td>
                <td>{item.created_file}</td>
                <td>{item.terakhir_diedit}</td>
                <td>{item.waktu_telat}</td>
                <td>{item.sudah_dikerjakan}</td>
                <td>{item.belum_dikerjakan}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm me-1"
                    onClick={() => {
                      backupJawaban(item.nama);
                    }}
                  >
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-success btn-sm me-1"
                    onClick={() => {
                      restoreJawaban(item.nama);
                    }}
                  >
                    <i className="fa-solid fa-cloud-arrow-down"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm me-1"
                    onClick={() => {
                      removeJawaban(item.nama);
                    }}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReadAnswer;
