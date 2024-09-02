import axios from "axios";
import QRCode from "qrcode.react";
import { FloatingLabel, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const TableKaryawan = ({
  fetchDataKaryawan,
  dataKaryawan,
  setSearchID,
  setLoading,
}) => {
  const navigate = useNavigate();
  const SwalReactContent = withReactContent(Swal);
  let width = window.screen.width;

  function handleClick(itemID) {
    navigate(`?search=${itemID}`);
    setSearchID(itemID);
  }

  const AddKaryawan = () => {
    SwalReactContent.fire({
      title: "Edit Karyawan",
      html: (
        <div>
          <FloatingLabel controlId="Nama" label="Nama" className="mb-2">
            <Form.Control type="text" placeholder="Nama"></Form.Control>
          </FloatingLabel>
          <FloatingLabel controlId="JobDesk" label="JobDesk" className="mb-2">
            <Form.Control type="text" placeholder="JobDesk"></Form.Control>
          </FloatingLabel>
          <Form.Select aria-label="Default select example" id="Status">
            <option value="aktif">Aktif</option>
            <option value="cuti">Cuti</option>
          </Form.Select>
        </div>
      ),
      confirmButtonColor: "#157347",
      confirmButtonText: "Simpan",
      showCancelButton: true,
      cancelButtonColor: "#bb2d3b",
      cancelButtonText: "Batal",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const nama = document.getElementById("Nama").value;
        const jobDesk = document.getElementById("JobDesk").value;
        const status = document.getElementById("Status").value;
        let formData = new FormData();
        formData.append("nama", nama);
        formData.append("job_desk", jobDesk);
        formData.append("status", status);
        formData.append("addKaryawan", "");
        setLoading(true);
        axios({
          method: "post",
          url: `${import.meta.env.VITE_BASEURL}/karyawan.php`,
          data: formData,
        }).then((response) => {
          console.log(response.data);
          if (response.data == "Berhasil") {
            Swal.fire({
              icon: "success",
              title: "Berhasil",
              timer: 1500,
              showConfirmButton: false,
            });

            fetchDataKaryawan();
          } else {
            Swal.fire({
              icon: "info",
              title: response.data,
            });
          }

          setLoading(false);
        });
      }
    });
  };

  const EditKaryawan = (nama, job_desk, id) => {
    SwalReactContent.fire({
      title: "Edit Karyawan",
      html: (
        <div>
          <FloatingLabel controlId="Nama" label="Nama" className="mb-2">
            <Form.Control
              type="text"
              placeholder="Nama"
              defaultValue={nama}
            ></Form.Control>
          </FloatingLabel>
          <FloatingLabel controlId="JobDesk" label="JobDesk" className="mb-2">
            <Form.Control
              type="text"
              placeholder="JobDesk"
              defaultValue={job_desk}
            ></Form.Control>
          </FloatingLabel>
          <Form.Select aria-label="Default select example" id="Status">
            <option value="aktif">Aktif</option>
            <option value="cuti">Cuti</option>
          </Form.Select>
        </div>
      ),
      confirmButtonColor: "#157347",
      confirmButtonText: "Simpan",
      showCancelButton: true,
      cancelButtonColor: "#bb2d3b",
      cancelButtonText: "Batal",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const nama = document.getElementById("Nama").value;
        const jobDesk = document.getElementById("JobDesk").value;
        const status = document.getElementById("Status").value;
        let formData = new FormData();
        formData.append("nama", nama);
        formData.append("job_desk", jobDesk);
        formData.append("status", status);
        formData.append("id", id);
        formData.append("editKaryawan", "");
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

            fetchDataKaryawan();
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

  const DeleteKaryawan = (nama, id) => {
    Swal.fire({
      icon: "info",
      title: `Anda yakin ingin menghapus ${nama}`,
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
        formData.append("deleteData", "");

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

            fetchDataKaryawan();
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

  const qrcodeRead = (id, nama) => {
    SwalReactContent.fire({
      title: nama,
      html: <QRCode value={id} />,
    });
  };

  return (
    <div>
      <div align="right" className="w-element-admin">
        <InputGroup
          className={
            width < 420 ? "mb-3 w-85" : width < 900 ? "mb-3 w-50" : "mb-3 w-25"
          }
        >
          <button
            className="btn btn-warning"
            name="addSiswa"
            onClick={() => {
              AddKaryawan();
            }}
          >
            <i className="fa-solid fa-user-plus"></i> Tambah Karyawan
          </button>
        </InputGroup>
      </div>
      <table className="table-striped table w-element-admin">
        <thead className="table-info">
          <tr>
            <th>Nama Karyawan</th>
            <th>Job Desk</th>
            <th>Status</th>
            <th>QR Code</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dataKaryawan.map((item, index) => (
            <tr key={index}>
              <td
                onClick={() => {
                  handleClick(item.nama);
                }}
              >
                {item.nama}
              </td>
              <td>{item.job_desk}</td>
              <td>{item.status}</td>
              <td>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => {
                    qrcodeRead(item.id, item.nama);
                  }}
                >
                  <i className="fa-solid fa-qrcode"></i>
                </button>
              </td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-1"
                  onClick={() => {
                    EditKaryawan(item.nama, item.job_desk, item.id);
                  }}
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    DeleteKaryawan(item.nama, item.id);
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
export default TableKaryawan;
