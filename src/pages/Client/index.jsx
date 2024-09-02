import { useNavigate, useParams } from "react-router-dom";
import Dashboard from "./dashboard";
import { useEffect, useState } from "react";
import Loader from "../../assets/Components/loader";
import Eroor_404 from "../Interface/error_404";
import { Container, Nav, Navbar } from "react-bootstrap";
import "../../assets/Style/universal.css";
import LobyUjian from "./lobyujian";
import Ujian from "./ujian";
import PenilaianSiswa from "./penilaian";
import axios from "axios";
import "../../assets/Style/Client/index.css";
import MateriSiswa from "./materi";
import IndexMateri from "./indexMateri";
import Profile from "./profile";

const IndexClient = () => {
  document.title = "Siswa";
  const Params = useParams();
  const Admin = Params["*"].toLowerCase();
  const [loading, setLoading] = useState(false);
  const storageUser = localStorage.getItem("user");
  const storagePass = localStorage.getItem("pass");
  const [dataSiswa, setDataSiswa] = useState([]);
  const navigate = useNavigate();

  const Width = window.screen.width;

  const fetchData = () => {
    setLoading(true);
    axios({
      method: "get",
      url: `${
        import.meta.env.VITE_BASEURL
      }/siswa.php?login&username=${storageUser}&password=${storagePass}`,
      responseType: "json",
    })
      .then((response) => {
        setDataSiswa(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (Array.isArray(dataSiswa) && dataSiswa.length > 0) {
    if (
      dataSiswa[0].username != storageUser &&
      dataSiswa[0].password != storagePass
    ) {
      localStorage.removeItem("user");
      localStorage.removeItem("pass");
      navigate("/login");
    }
  } else if (dataSiswa == "Gagal") {
    localStorage.removeItem("user");
    localStorage.removeItem("pass");
    navigate("/login");
  } else if (storageUser == null || storagePass == null) {
    navigate("/login");
  }
  return (
    <>
      {Admin !== "" ? (
        <Navbar className="bg-orangered rounded-bottom-3 position-fixed top-0 left-0 w-100 z-3">
          <Container>
            <Navbar.Brand className="text-white">
              <div
                className="fs-3 fw-bold beardCramp mouse-pointer"
                onClick={() => {
                  Admin == "ujian"
                    ? navigate("/siswa/loby_ujian")
                    : navigate("/siswa");
                }}
              >
                <i className="fa-solid fa-caret-left"></i>{" "}
                {Admin == ""
                  ? "Dashboard"
                  : Admin.indexOf("materi/") >= 0
                  ? Admin.replaceAll("materi/", "").replaceAll("_", " ")
                  : Admin.replaceAll("_", " ")}
              </div>
            </Navbar.Brand>
            <Navbar.Toggle />
            {dataSiswa.map((item, index) => (
              <Navbar.Collapse
                className={`justify-content-end ${
                  Width < 850 && Width > 450 ? "w-50" : null
                }`}
                key={index}
              >
                <Navbar.Text className="text-white">
                  <div className="fs-5 fw-bold nama">{item.nama}</div>
                  <div align="right">{`${item.kelas} ${item.tipeKelas}`}</div>
                </Navbar.Text>
                <Navbar.Text>
                  <div
                    className="border ms-3 rounded-5 bg-info container-profile"
                    style={{ width: "40px", height: "40px" }}
                    onClick={() => {
                      navigate("profile");
                    }}
                  >
                    <img
                      src={item.profile}
                      alt="Profile"
                      className="rounded-5"
                      style={{ width: "40px", height: "40px" }}
                    />
                  </div>
                </Navbar.Text>
              </Navbar.Collapse>
            ))}
          </Container>
        </Navbar>
      ) : (
        ""
      )}
      <div>
        {Admin === "" ? (
          <Dashboard setLoading={setLoading} dataSiswa={dataSiswa} />
        ) : Admin === "loby_ujian" ? (
          <LobyUjian
            loading={loading}
            setLoading={setLoading}
            dataSiswa={dataSiswa}
          />
        ) : Admin === "ujian" ? (
          <Ujian setLoading={setLoading} dataSiswa={dataSiswa} />
        ) : Admin === "penilaian" ? (
          <PenilaianSiswa setLoading={setLoading} dataSiswa={dataSiswa} />
        ) : Admin === "materi" ? (
          <MateriSiswa setLoading={setLoading} dataSiswa={dataSiswa} />
        ) : Admin.indexOf("materi/") >= 0 ? (
          <IndexMateri setLoading={setLoading} dataSiswa={dataSiswa} />
        ) : Admin === "profile" ? (
          <Profile setLoading={setLoading} dataSiswa={dataSiswa} />
        ) : (
          <div className="position-absolute start-50 top-60 translate-middle w-100 ms-lg-5">
            <Eroor_404 />
          </div>
        )}
      </div>
      {loading ? <Loader /> : null}
    </>
  );
};
export default IndexClient;
