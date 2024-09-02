import axios from "axios";
import { useEffect, useState } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import Swal from "sweetalert2";
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

const Information = () => {
  const [data, setData] = useState([]);
  const SwalReactContent = withReactContent(Swal);

  const fetchData = () => {
    axios({
      method: "get",
      url: `${import.meta.env.VITE_BASEURL}/information.php?get&getAll`,
      responseType: "json",
    }).then((response) => {
      setData(response.data);
    });
  };

  const AddData = () => {
    SwalReactContent.fire({
      title: "Tambah informasi baru",
      html: (
        <div>
          <FloatingLabel controlId="title" label="title" className="mb-2">
            <Form.Control
              type="text"
              maxLength="100"
              placeholder="Title"
            ></Form.Control>
          </FloatingLabel>
          <FloatingLabel
            controlId="deskripsi"
            label="Deskripsi"
            className="mb-2"
          >
            <Form.Control
              as="textarea"
              maxLength="200"
              placeholder="Leave a comment here"
              style={{ height: "100px" }}
            />
          </FloatingLabel>
          <FloatingLabel controlId="date" label="date" className="mb-2">
            <Form.Control type="date" placeholder="date"></Form.Control>
          </FloatingLabel>
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: "Kirim",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#157347",
      cancelButtonColor: "#bb2d3b",
      allowOutsideClick: false,
    }).then((result) => {
      const title = document.getElementById("title").value;
      const deskripsi = document.getElementById("deskripsi").value;
      const tanggal_terbit = document.getElementById("date").value;
      if (result.isConfirmed) {
        let formData = new FormData();
        formData.append("title", title);
        formData.append("deskripsi", deskripsi);
        formData.append("tanggal_terbit", tanggal_terbit);
        axios({
          method: "post",
          data: formData,
          url: `${import.meta.env.VITE_BASEURL}/information.php?post`,
          responseType: "json",
        }).then((response) => {
          if (response.data == "Berhasil") {
            fetchData();
            Swal.fire({
              title: "Berhasil Menambah Informasi",
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
        });
      }
    });
  };

  const editData = (id, title, deskripsi, date) => {
    SwalReactContent.fire({
      title: "Tambah informasi baru",
      html: (
        <div>
          <FloatingLabel controlId="id" label="id" className="mb-2">
            <Form.Control
              type="text"
              disabled
              placeholder="id"
              defaultValue={id}
            ></Form.Control>
          </FloatingLabel>
          <FloatingLabel controlId="title" label="title" className="mb-2">
            <Form.Control
              type="text"
              maxLength="100"
              defaultValue={title}
              placeholder="Title"
            ></Form.Control>
          </FloatingLabel>
          <FloatingLabel
            controlId="deskripsi"
            label="Deskripsi"
            className="mb-2"
          >
            <Form.Control
              as="textarea"
              maxLength="200"
              defaultValue={deskripsi}
              placeholder="Leave a comment here"
              style={{ height: "100px" }}
            />
          </FloatingLabel>
          <FloatingLabel controlId="date" label="date" className="mb-2">
            <Form.Control
              type="date"
              placeholder="date"
              defaultValue={date}
            ></Form.Control>
          </FloatingLabel>
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: "Kirim",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#157347",
      cancelButtonColor: "#bb2d3b",
      allowOutsideClick: false,
    }).then((result) => {
      const title = document.getElementById("title").value;
      const deskripsi = document.getElementById("deskripsi").value;
      const tanggal_terbit = document.getElementById("date").value;
      if (result.isConfirmed) {
        let formData = new FormData();
        formData.append("title", title);
        formData.append("deskripsi", deskripsi);
        formData.append("tanggal_terbit", tanggal_terbit);
        formData.append("id", id);
        axios({
          method: "post",
          data: formData,
          url: `${import.meta.env.VITE_BASEURL}/information.php?update`,
          responseType: "json",
        }).then((response) => {
          if (response.data == "Berhasil") {
            fetchData();
            Swal.fire({
              title: "Berhasil Menambah Informasi",
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
        });
      }
    });
  };

  const deleteData = (id) => {
    Swal.fire({
      title: "Apakah anda ingin menghapus data dengan id " + id,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Lanjut Hapus",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#bb2d3b",
      cancelButtonColor: "#157347",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        let formData = new FormData();
        formData.append("id", id);
        axios({
          method: "post",
          data: formData,
          url: `${import.meta.env.VITE_BASEURL}/information.php?delete`,
          responseType: "json",
        }).then((response) => {
          if (response.data == "Berhasil") {
            fetchData();
            Swal.fire({
              title: "Berhasil Menambah Informasi",
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
        });
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-element-admin">
      <div align="right" className="mb-3">
        <button className="btn btn-success" onClick={AddData}>
          Tambah Informasi
        </button>
      </div>
      <table className="table table-striped">
        <thead className="table-info">
          <tr>
            <th>id</th>
            <th>tanggal terbit</th>
            <th>judul</th>
            <th>deskripsi</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{formatDate(item.tanggal_terbit)}</td>
                <td>{item.title}</td>
                <td>{item.deskripsi}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-1"
                    onClick={() => {
                      editData(
                        item.id,
                        item.title,
                        item.deskripsi,
                        item.tanggal_terbit
                      );
                    }}
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      deleteData(item.id);
                    }}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" align="center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default Information;
