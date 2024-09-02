import { Container, FloatingLabel, Form } from "react-bootstrap";
import "../../assets/Style/Admin/webutama.css";
import { useEffect, useState } from "react";
import { Radio } from "semantic-ui-react";
import axios from "axios";
import Swal from "sweetalert2";
const Materi = ({ setLoading }) => {
  const [fileValue, setFileValue] = useState();
  const [fileUpload, setFileUpload] = useState();
  const [filePreview, setFilePreview] = useState();
  const [formInput, setFormInput] = useState({
    judul: "",
    kelas: "",
    tentor: "",
    mapel: "",
    tanggal: "",
  });
  const [type, setType] = useState("foto");
  const Width = window.screen.width;
  const [data, setData] = useState([]);
  const [dataKelas, setDataKelas] = useState([]);
  const [dataTentor, setDataTentor] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    const DaftarKelas = await axios.get(
      `${import.meta.env.VITE_BASEURL}/materi.php?readKelas`
    );
    const DaftarTentor = await axios.get(
      `${import.meta.env.VITE_BASEURL}/pres_tentor.php?read_tentor`
    );

    setDataTentor(DaftarTentor.data);

    setDataKelas(DaftarKelas.data);

    axios({
      method: "get",
      url: `${import.meta.env.VITE_BASEURL}/materi.php?read&kelas=admin`,
    })
      .then((response) => {
        setData(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileValue(e.target.files);
      setFileUpload(e.target.files[0]);
      setFormInput((prevFormData) => ({
        ...prevFormData,
        judul: e.target.files[0].name
          .replaceAll("_", " ")
          .replaceAll(".pdf", ""),
      }));
    }
  };

  useEffect(() => {
    if (!fileValue) return;
    let tmp = [];
    for (let i = 0; i < fileValue.length; i++) {
      tmp.push(URL.createObjectURL(fileValue[i]));
    }
    const objUrls = tmp;
    setFilePreview(objUrls);

    for (let i = 0; i < objUrls.length; i++) {
      return () => {
        URL.revokeObjectURL(objUrls[i]);
      };
    }
  }, fileValue);

  function switchType(tipe) {
    setType(tipe);
  }

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", fileUpload);
    formData.append("tentor", formInput.tentor);
    formData.append("mapel", formInput.mapel);
    formData.append("tanggal", formInput.tanggal);
    formData.append("judul", formInput.judul);
    formData.append("kelas", formInput.kelas);
    formData.append("uploadMateri", "");
    setLoading(true);
    axios({
      method: "post",
      url: `${import.meta.env.VITE_BASEURL}/materi.php`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log(response.data);
        if (response.data == "Berhasil") {
          fetchData();
        } else {
          Swal.fire({
            title: "Gagal Mengupload",
            text: response.data,
            icon: "error",
          });
        }
      })
      .finally(() => {
        setLoading(false);
        setFileValue();
      });
  };

  const deleteFile = (id) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("deleteMateri", "");
    setLoading(true);
    axios({
      method: "post",
      url: `${import.meta.env.VITE_BASEURL}/materi.php`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        if (response.data == "Berhasil") {
          fetchData();
          Swal.fire({
            title: "Berhasil Menghapus",
            icon: "success",
            timer: 1500,
          });
        } else {
          Swal.fire({
            title: "Gagal Menghapus",
            text: response.data,
            icon: "error",
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container className="row w-element-admin border">
      <input
        type="file"
        accept="application/pdf"
        id="image"
        hidden
        onChange={handleFileChange}
      />
      <label htmlFor="image">
        <div className="uploader" align="center">
          <div className="content-uploader">
            <p className="fs-1 text-primary">
              <i className="fa-regular fa-images"></i>
            </p>
            <p className="fs-5 fw-bolder text-primary">
              Browse or Drag and Drop .PDF
            </p>
            <div className="w-50 bg-primary p-3 rounded-3 fs-4 fw-bolder text-white">
              Browse
            </div>
          </div>
        </div>
      </label>
      {fileValue && fileValue.length > 0 ? (
        <div className="preview bg-primary row">
          <div className="col-10">
            <img
              src="/images/PDF_file_icon.png"
              width="40px"
              height="40px"
              alt={fileValue[0].name}
            />
            <span className="ms-3 fs-5 fw-bolder text-white">
              {fileValue[0].name.replaceAll("_", " ")}
            </span>
          </div>
          <div className="col-2" align="right">
            <button
              className="btn btn-danger"
              onClick={() => {
                setFileValue();
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      ) : null}
      <div className="mt-4 input-text">
        <FloatingLabel
          controlId="floatingInput"
          label="Nama Materi"
          className="mb-3"
        >
          <Form.Control
            type="text"
            defaultValue={
              fileValue && fileValue.length > 0
                ? fileValue[0].name.replaceAll("_", " ").replaceAll(".pdf", "")
                : null
            }
            onChange={(e) => {
              setFormInput((prevFormData) => ({
                ...prevFormData,
                judul: e.target.value,
              }));
            }}
            placeholder="Nama Materi"
          />
        </FloatingLabel>

        <Form.Select
          className="mb-3"
          size="lg"
          onChange={(e) => {
            setFormInput((prevFormData) => ({
              ...prevFormData,
              kelas: e.target.value,
            }));
          }}
        >
          <option defaultValue="">Pilih Kelas</option>
          {dataKelas?.map((item, index) => (
            <option defaultValue={item.kelas_list} key={index}>
              {item.kelas_list}
            </option>
          ))}
        </Form.Select>

        <Form.Select
          className="mb-3"
          size="lg"
          onChange={(e) => {
            setFormInput((prevFormData) => ({
              ...prevFormData,
              tentor: e.target.value,
            }));
          }}
        >
          <option defaultValue="">Pilih Tentor</option>
          {dataTentor?.map((item, index) => (
            <option defaultValue={item.nama} key={index}>
              {item.nama}
            </option>
          ))}
        </Form.Select>

        <FloatingLabel controlId="floatingInput" label="Mapel" className="mb-3">
          <Form.Control
            type="text"
            onChange={(e) => {
              setFormInput((prevFormData) => ({
                ...prevFormData,
                mapel: e.target.value,
              }));
            }}
            placeholder="Mapel"
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="floatingInput"
          label="Tanggal"
          className="mb-3"
        >
          <Form.Control
            type="date"
            defaultValue={
              fileValue && fileValue.length > 0
                ? fileValue[0].name.replaceAll("_", " ").replaceAll(".pdf", "")
                : null
            }
            onChange={(e) => {
              setFormInput((prevFormData) => ({
                ...prevFormData,
                tanggal: e.target.value,
              }));
            }}
            placeholder="Tanggal"
          />
        </FloatingLabel>

        <button className="btn btn-success w-100 mb-3" onClick={handleUpload}>
          Upload Materi
        </button>
      </div>

      <table className="table-striped table table-info">
        <thead>
          <tr>
            <th>ID</th>
            <th>Materi</th>
            <th>Mapel</th>
            <th>Tentor</th>
            <th>Kelas</th>
            <th>Tanggal Terbit</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{item.materi}</td>
              <td>{item.mapel}</td>
              <td>{item.tentor}</td>
              <td>{item.kelas}</td>
              <td>{item.tanggal}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    window.open(
                      `${import.meta.env.VITE_BASEURL}${item.url_materi}`
                    );
                  }}
                >
                  <i class="fa-solid fa-eye"></i>
                </button>{" "}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    deleteFile(item.id);
                  }}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
};
export default Materi;
