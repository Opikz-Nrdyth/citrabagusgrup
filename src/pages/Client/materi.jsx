import { Card, Container, Placeholder } from "react-bootstrap";
import "../../assets/Style/Client/materi.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MateriSiswa = ({ setLoading, dataSiswa }) => {
  const Width = window.screen.width;
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [getPlaceholder, setPlaceholder] = useState(true);

  const fetchData = () => {
    for (const siswa of dataSiswa) {
      axios({
        url: `${import.meta.env.VITE_BASEURL}/bank_materi.php?kelas=${
          siswa.kelas
        } ${siswa.tipeKelas}&&tipeKelas=${siswa.tipeKelas}&read_ujian`,
        method: "get",
      })
        .then((response) => {
          setData(response.data);
        })
        .finally(() => {
          setPlaceholder(false);
        });
    }
  };

  useEffect(() => {
    document.body.style.overflowY = "scroll";
    if (dataSiswa) {
      fetchData();
    }
  }, [dataSiswa]);
  return (
    <div className="container-data">
      <div className="row border data">
        {data && data.length > 0 ? (
          data.map((item, index) => (
            <div
              key={index}
              className={`${
                Width < 920 && Width > 450
                  ? "col-4"
                  : Width < 450
                  ? "col-6"
                  : "col-2"
              } mb-3`}
            >
              <Card
                className="card"
                onClick={() => {
                  if (item.tipe == "PDF") {
                    window.open(
                      `${import.meta.env.VITE_BASEURL}/${item.url_materi}`,
                      "_blank"
                    );
                  } else {
                    navigate(
                      `materi/${item.nama_buku.replaceAll(" ", "_")}?nama=${
                        item.nama_buku
                      }&tipe=${item.tipe}`
                    );
                  }
                }}
              >
                <Card.Img variant="top" src={`/images/${item.tipe}.png`} />
                <Card.Body>
                  <Card.Title className="fw-bolder">
                    {item.nama_buku.replaceAll("_", " ")}
                  </Card.Title>
                  <Card.Text>{item.tanggal_terbit}</Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))
        ) : getPlaceholder ? (
          <div
            className={`${
              Width < 920 && Width > 450
                ? "col-4"
                : Width < 450
                ? "col-6"
                : "col-2"
            } mb-3`}
          >
            <Card className="card">
              <Card.Img variant="top" src={"https://placehold.co/30x35"} />
              <Card.Body>
                <Placeholder as={Card.Title} animation="glow">
                  <Placeholder xs={6} />
                </Placeholder>
                <Placeholder as={Card.Text} animation="glow">
                  <Placeholder xs={7} /> <Placeholder xs={4} />{" "}
                  <Placeholder xs={4} /> <Placeholder xs={6} />{" "}
                  <Placeholder xs={8} />
                </Placeholder>
              </Card.Body>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default MateriSiswa;
