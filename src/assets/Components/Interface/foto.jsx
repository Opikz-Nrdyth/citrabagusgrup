import axios from "axios";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Swal from "sweetalert2";

const Foto = () => {
  const [data, setData] = useState([]);
  function fotoClick(url, title) {
    Swal.fire({
      title: title,
      html: "<img src='" + url + "' width='100%'>",
      confirmButtonText: "Tutup",
      confirmButtonColor: "#a3c538",
    });
  }

  const fetchData = () => {
    axios({
      method: "get",
      url: `${import.meta.env.VITE_BASEURL}/fotowebutama.php?read`,
    }).then((response) => {
      setData(response.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Container>
      <div data-aos="fade-up">
        <h1 className="title" id="Foto">
          Foto - Foto
        </h1>
        <p className="br-heart fs-6">
          <i className="fa-regular fa-heart"></i>
        </p>
      </div>
      <div className="row container-foto">
        {data?.map((item, index) => (
          <div
            key={index}
            className="card col-6 col-sm-3"
            onClick={() => {
              fotoClick(
                import.meta.env.VITE_BASEURL + item.foto,
                item.deskripsi
              );
            }}
            data-aos="flip-left"
          >
            <img
              src={import.meta.env.VITE_BASEURL + item.foto}
              className="card-img-top"
              alt={item.deskripsi}
            />
            <div className="card-body">
              <p className="card-text" align="center">
                {item.deskripsi}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};
export default Foto;
