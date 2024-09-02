import axios from "axios";
import "../../Style/universal.css";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FloatingLabel, Form } from "react-bootstrap";
const Biaya = ({ setLoading }) => {
  const [data, setData] = useState([]);
  const [program, setProgram] = useState([]);
  const SwalReactContent = withReactContent(Swal);
  const fetchData = () => {
    setLoading(true);
    axios({
      url: `${import.meta.env.VITE_BASEURL}/biaya.php?read_biaya`,
      method: "post",
    }).then((response) => {
      setData(response.data);
    });

    axios({
      url: `${import.meta.env.VITE_BASEURL}/biaya.php?read_program`,
      method: "post",
    })
      .then((response) => {
        setProgram(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    document.body.style.overflowY = "scroll";
    fetchData();
  }, []);

  const AddData = () => {
    SwalReactContent.fire({
      title: "Tambah Data Biaya",
      html: (
        <div>
          <FloatingLabel controlId="Program" label="Program" className="mb-2">
            <Form.Control type="text" placeholder="Program"></Form.Control>
          </FloatingLabel>
          <FloatingLabel controlId="Biaya" label="Biaya" className="mb-2">
            <Form.Control type="text" placeholder="Biaya"></Form.Control>
          </FloatingLabel>
          <Form.Select aria-label="Default select example" id="Kelas">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="SNBT">SNBT</option>
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
        const Program = document.getElementById("Program").value;
        const Kelas = document.getElementById("Kelas").value;
        const Biaya = document.getElementById("Biaya").value;
        let formData = new FormData();
        formData.append("add_biaya", "");
        formData.append("kelas", Kelas);
        formData.append("biaya", Biaya);
        formData.append("program", Program);
        axios({
          method: "post",
          url: `${import.meta.env.VITE_BASEURL}/biaya.php`,
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

  const EditData = (id, Program, Biaya, Kelas) => {
    SwalReactContent.fire({
      title: "Edit Data Biaya",
      html: (
        <div>
          <FloatingLabel controlId="Program" label="Program" className="mb-2">
            <Form.Control
              type="text"
              placeholder="Program"
              defaultValue={Program}
            ></Form.Control>
          </FloatingLabel>
          <FloatingLabel controlId="Biaya" label="Biaya" className="mb-2">
            <Form.Control
              type="text"
              placeholder="Biaya"
              defaultValue={Biaya}
            ></Form.Control>
          </FloatingLabel>
          <Form.Select aria-label="Default select example" id="Kelas">
            <option value="1" selected={Kelas == "1"}>
              1
            </option>
            <option value="2" selected={Kelas == "2"}>
              2
            </option>
            <option value="3" selected={Kelas == "3"}>
              3
            </option>
            <option value="4" selected={Kelas == "4"}>
              4
            </option>
            <option value="5" selected={Kelas == "5"}>
              5
            </option>
            <option value="6" selected={Kelas == "6"}>
              6
            </option>
            <option value="7" selected={Kelas == "7"}>
              7
            </option>
            <option value="8" selected={Kelas == "8"}>
              8
            </option>
            <option value="9" selected={Kelas == "9"}>
              9
            </option>
            <option value="10" selected={Kelas == "10"}>
              10
            </option>
            <option value="11" selected={Kelas == "11"}>
              11
            </option>
            <option value="12" selected={Kelas == "12"}>
              12
            </option>
            <option value="SNBT" selected={Kelas == "SNBT"}>
              SNBT
            </option>
          </Form.Select>
        </div>
      ),
      confirmButtonColor: "#157347",
      confirmButtonText: "Edit",
      showCancelButton: true,
      cancelButtonColor: "#bb2d3b",
      cancelButtonText: "Batal",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const Program = document.getElementById("Program").value;
        const Kelas = document.getElementById("Kelas").value;
        const Biaya = document.getElementById("Biaya").value;
        let formData = new FormData();
        formData.append("update_biaya", "");
        formData.append("id", id);
        formData.append("kelas", Kelas);
        formData.append("biaya", Biaya);
        formData.append("program", Program);
        axios({
          method: "post",
          url: `${import.meta.env.VITE_BASEURL}/biaya.php`,
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

  const DeleteData = (id, Kelas, Program) => {
    Swal.fire({
      icon: "info",
      title: `Anda yakin ingin menghapus program ${Program} kelas ${Kelas}`,
      confirmButtonColor: "#bb2d3b",
      confirmButtonText: "Hapus",
      showCancelButton: true,
      cancelButtonColor: "#157347",
      cancelButtonText: "Batal",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        let formData = new FormData();
        formData.append("delete_biaya", "");
        formData.append("id", id);
        axios({
          method: "post",
          url: `${import.meta.env.VITE_BASEURL}/biaya.php`,
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
    <div className="w-element-admin">
      <div className="btn-action" align="right">
        <button className="btn btn-success" onClick={AddData}>
          Tambah Biaya
        </button>
      </div>
      <div className="table-content">
        <table className="table-striped table mt-3">
          <thead className="table-info">
            <tr>
              <th>Program</th>
              <th>Kelas</th>
              <th>Biaya</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className={
                  item.Program == "Eksklusif"
                    ? "table-success"
                    : item.Program == "Reguler"
                    ? ""
                    : "table-warning"
                }
              >
                <td>{item.Program}</td>
                <td>{item.Kelas}</td>
                <td>
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(item.Biaya)}
                </td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-1"
                    onClick={() => {
                      EditData(item.id, item.Program, item.Biaya, item.Kelas);
                    }}
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      DeleteData(item.id, item.Kelas, item.Program);
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
    </div>
  );
};
export default Biaya;
