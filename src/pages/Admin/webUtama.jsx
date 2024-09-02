import { Container, FloatingLabel, Form } from "react-bootstrap";
import "../../assets/Style/Admin/webutama.css";
import { useEffect, useState } from "react";
import { Radio } from "semantic-ui-react";
import axios from "axios";
import Swal from "sweetalert2";

const WebUtama = ({ setLoading }) => {
  const [imageValue, setImageValue] = useState();
  const [imageUpload, setImageUpload] = useState();
  const [imagePreview, setImagePreview] = useState();
  const [deskripsi, setDeskripsi] = useState("");
  const [type, setType] = useState("foto");
  const Width = window.screen.width;
  const [data, setData] = useState([]);

  const fetchData = () => {
    setLoading(true);
    axios({
      method: "get",
      url: `${import.meta.env.VITE_BASEURL}/fotowebutama.php?read`,
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
      setImageValue(e.target.files);
      setImageUpload(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (!imageValue) return;
    let tmp = [];
    for (let i = 0; i < imageValue.length; i++) {
      tmp.push(URL.createObjectURL(imageValue[i]));
    }
    const objUrls = tmp;
    setImagePreview(objUrls);

    for (let i = 0; i < objUrls.length; i++) {
      return () => {
        URL.revokeObjectURL(objUrls[i]);
      };
    }
  }, imageValue);

  function switchType(tipe) {
    setType(tipe);
  }

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("foto", imageUpload);
    formData.append("deskripsi", deskripsi);
    formData.append("uploadFoto", "");
    setLoading(true);
    axios({
      method: "post",
      url: `${import.meta.env.VITE_BASEURL}/fotowebutama.php`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
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
        setImageValue();
      });
  };

  const deleteFoto = (id) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("delete", "");
    setLoading(true);
    axios({
      method: "post",
      url: `${import.meta.env.VITE_BASEURL}/fotowebutama.php`,
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
        accept="image/jpeg, image/png, image/jpg"
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
              Browse or Drag and Drop .jpg, .jpeg, .png
            </p>
            <div className="w-50 bg-primary p-3 rounded-3 fs-4 fw-bolder text-white">
              Browse
            </div>
          </div>
        </div>
      </label>
      {imageValue && imageValue.length > 0 ? (
        <div className="preview bg-primary row">
          <div className="col-6">
            <img
              src={imagePreview}
              width="40px"
              height="40px"
              alt={imageValue[0].name}
            />
            <span className="ms-3 fs-5 fw-bolder text-white">
              {imageValue[0].name}
            </span>
          </div>
          <div className="col-6" align="right">
            <button
              className="btn btn-danger"
              onClick={() => {
                setImageValue();
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
          label="Tuliskan Deskripsi Disini"
          className="mb-3"
        >
          <Form.Control
            as="textarea"
            placeholder="Tuliskan Deskripsi Disini"
            onChange={(e) => {
              setDeskripsi(e.target.value);
            }}
          />
        </FloatingLabel>
        <button className="btn btn-success w-100 mb-3" onClick={handleUpload}>
          Upload {type}
        </button>
      </div>

      <table className="table-striped table table-info">
        <thead>
          <tr>
            <th>ID</th>
            <th>Foto</th>
            <th>Deskripsi</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>
                <img
                  src={import.meta.env.VITE_BASEURL + item.foto}
                  alt={item.id}
                  width="30px"
                />
              </td>
              <td>{item.deskripsi}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    deleteFoto(item.id);
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
export default WebUtama;
