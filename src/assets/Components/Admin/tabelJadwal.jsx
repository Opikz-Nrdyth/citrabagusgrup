import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { StateContext } from "../../../pages/Admin/jadwal";

const TabelJadwal = (dataTanggal) => {
  const [dataJadwal, setDataJadwal] = useState([]);
  const {
    inputJadwal,
    setinputJadwal,
    setColabs,
    setIdUpdate,
    setBtnKirim,
  } = useContext(StateContext);
  useEffect(() => {
    axios({
      method: "get",
      url: `${import.meta.env.VITE_BASEURL}/jadwal.php?jadwalAll&tanggal=${dataTanggal.day}`, // menggunakan template literals untuk menyederhanakan URL
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
      });
  }, [dataJadwal]);
  const groupBy = (array, key) => {
    return array.reduce((result, item) => {
      // Dapatkan nilai kunci dari item
      const value = item[key];
      // Buat array kosong untuk kunci jika belum ada
      result[value] = result[value] || [];
      // Tambahkan item ke array untuk kunci
      result[value].push(item);
      // Kembalikan objek hasil
      return result;
    }, {});
  };

  // Kelompokkan dataJadwal berdasarkan jam
  const groupedData = groupBy(dataJadwal, "jam");

  function editData(id, kelas, mapel, tentor, ruang) {
    let Jadwal = { ...inputJadwal };
    Jadwal.kelas = kelas;
    Jadwal.mapel = mapel;
    Jadwal.tentor = tentor;
    Jadwal.ruang = ruang;

    let Kelas = kelas.split(" + ");
    if (Kelas.length > 1) {
      setColabs(2);
    }
    setinputJadwal(Jadwal);
    setBtnKirim("Update");
    setIdUpdate(id);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }

  function deleteData(id, kelas) {
    Swal.fire({
      title: "Apakah anda mau Menghapus kelas " + kelas,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Lanjut Delete",
      cancelButtonText: "Tidak Jadi",
      confirmButtonColor: "#fd4053",
      cancelButtonColor: "#22bf76",
      allowOutsideClick: false,
    }).then(() => {
      let formData = new FormData();
      formData.append("deleteJadwal", "");
      formData.append("id", id);
      axios({
        method: "post",
        url: `${import.meta.env.VITE_BASEURL}/jadwal.php`,
        data: formData,
      })
        .then(function (response) {
          if (response.data == "Berhasil") {
            Swal.fire({
              title: "Berhasil Menghapus Jadwal",
              icon: "success",
              showConfirmButton: false,
              timer: 1000,
            });
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          } else {
            Swal.fire({
              title: response.data,
              icon: "error",
            });
          }
        })
        .catch((err) => {
          Swal.fire({
            title: err,
            icon: "error",
          });
        });
    });
  }
  return (
    <div>
      {Object.entries(groupedData).map(([jam, jadwal]) => (
        <div className="content-jadwal border rounded-2" key={jam}>
          <div className="jamAjar fw-bolder text-primary">{jam}</div>
          <table className="table table-striped">
            <thead className="table-info">
              <tr>
                <th>Kelas</th>
                <th>Mapel</th>
                <th>Tentor</th>
                <th>Ruangan</th>
                <th>Siswa / Kursi</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {jadwal.map((item) => (
                <tr
                  key={item.id}
                  className={
                    parseInt(item.jumlah_siswa) > parseInt(item.jumlah_kursi)
                      ? "table-warning"
                      : ""
                  }
                >
                  <td width="16.6%">{item.kelas}</td>
                  <td width="16.6%">{item.mapel}</td>
                  <td width="16.6%">{item.pengajar}</td>
                  <td width="16.6%">{item.ruangan}</td>
                  <td width="16.6%">{`${item.jumlah_siswa} / ${item.jumlah_kursi}`}</td>
                  <td>
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => {
                        editData(
                          item.id,
                          item.kelas,
                          item.mapel,
                          item.pengajar,
                          item.ruangan
                        );
                      }}
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        deleteData(item.id, item.kelas);
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
      ))}
    </div>
  );
};
export default TabelJadwal;
