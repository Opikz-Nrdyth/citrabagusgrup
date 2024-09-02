import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const MinatUniv = ({ setLoading }) => {
  const [data, setData] = useState([]);

  const fetchData = () => {
    setLoading(true);
    let formData = new FormData();
    formData.append("read_univ", "read_univ");
    axios({
      method: "post",
      url: `${import.meta.env.VITE_BASEURL}/minat_univ.php?read`,
      data: formData,
    })
      .then((response) => {
        setData(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const remove_univ = (induk, nama) => {
    setLoading(true);
    let formData = new FormData();
    formData.append("remove_univ", "");
    formData.append("induk", induk);
    Swal.fire({
      title: `Apakah anda ingin menghapus data ${nama}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Lanjut Hapus",
      cancelButtonText: "Tidak Jadi",
      confirmButtonColor: "#bb2d3b",
      cancelButtonColor: "#157347",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        axios({
          method: "post",
          url: `${import.meta.env.VITE_BASEURL}/minat_univ.php`,
          data: formData,
        })
          .then((response) => {
            if (response.data == "Berhasil") {
              Swal.fire({
                title: `Berhasil Menghapus Data ${nama}`,
                timer: 1500,
                icon: "success",
                showConfirmButton: false,
              });
              fetchData();
            } else {
              Swal.fire({
                title: `Gagal Menghapus Data ${nama}`,
                text: response.data,
                icon: "error",
              });
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const remove_all = () => {
    setLoading(true);
    let formData = new FormData();
    formData.append("remove_all", "");
    Swal.fire({
      title: `Apakah anda ingin semua menghapus data`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Lanjut Hapus",
      cancelButtonText: "Tidak Jadi",
      confirmButtonColor: "#bb2d3b",
      cancelButtonColor: "#157347",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        axios({
          method: "post",
          url: `${import.meta.env.VITE_BASEURL}/minat_univ.php`,
          data: formData,
        })
          .then((response) => {
            if (response.data == "Berhasil") {
              Swal.fire({
                title: `Berhasil Menghapus Data`,
                timer: 1500,
                icon: "success",
                showConfirmButton: false,
              });
              fetchData();
            } else {
              Swal.fire({
                title: `Gagal Menghapus Data`,
                text: response.data,
                icon: "error",
              });
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const handlerExportExcell = (tableName) => {
    // Get the HTML table element
    const table = document.getElementById("table-data");

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert the HTML table to a worksheet
    const ws = XLSX.utils.table_to_sheet(table);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, tableName);

    // Save the workbook as an Excel file
    XLSX.writeFile(wb, `${tableName}.xlsx`);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="w-element-admin">
      <div align="right" className="mb-3">
        <button
          className="btn btn-success me-3"
          onClick={() => {
            handlerExportExcell("data minat univ");
          }}
        >
          Export Excell
        </button>
        <button className="btn btn-danger" onClick={remove_all}>
          Hapus Semua Data
        </button>
      </div>
      <table className="table table-striped mb-3" id="table-data">
        <thead className="table-info">
          <tr>
            <th>Induk</th>
            <th>Nama</th>
            <th>Minat 1</th>
            <th>Minat 2</th>
            <th>Minat 3</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr key={index}>
              <td>{item.induk}</td>
              <td>{item.nama}</td>
              <td>{item.minat_1}</td>
              <td>{item.minat_2}</td>
              <td>{item.minat_3}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    remove_univ(item.induk, item.nama);
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
export default MinatUniv;
