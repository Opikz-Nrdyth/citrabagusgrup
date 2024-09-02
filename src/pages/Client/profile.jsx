import "../../assets/Style/universal.css";
import "../../assets/Style/Client/profile.css";
import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Profile = ({ setLoading, dataSiswa }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [dataNomer, setDataNomer] = useState({
    admin_1: "",
    admin_2: "",
  });

  const Width = window.screen.width;

  const fetchData = () => {
    setLoading(true);
    axios({
      method: "get",
      url: `${import.meta.env.VITE_BASEURL}/settings.php?read`,
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
    document.body.style.overflowY = "scroll";
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      data.forEach((item) => {
        if (item.nama == "admin_1") {
          setDataNomer((prevState) => ({ ...prevState, admin_1: item.value }));
        }
        if (item.nama == "admin_2") {
          setDataNomer((prevState) => ({ ...prevState, admin_2: item.value }));
        }
      });
    }
  }, [data]);

  function exit() {
    localStorage.removeItem("user");
    localStorage.removeItem("pass");
    navigate("/login");
  }
  return (
    <Container className="element-profile">
      {dataSiswa && dataSiswa.length > 0
        ? dataSiswa.map((item, index) => (
            <div className="row" key={index}>
              <div
                className={`pribadi ${
                  Width < 450 ? "col-11" : Width < 850 ? "col-12" : "col-6"
                } border-element`}
              >
                <div className="profile p-3" align="center">
                  <div className="rounded-profile">
                    <img src={item.profile} width="100px" alt="img-profile" />
                  </div>
                  <p className="fw-bolder fs-4 text-start mt-5">Data Diri</p>
                  <div className="row border-bottom mt-1">
                    <div className="col-6 text-start">Nama Siswa</div>
                    <div className="col-6 text-end">{item.nama}</div>
                  </div>
                  <div className="row border-bottom mt-5">
                    <div className="col-6 text-start">Tanggal Lahir</div>
                    <div className="col-6 text-end">{item.Tanggal_lahir}</div>
                  </div>
                  <div className="row border-bottom mt-5">
                    <div className="col-6 text-start">Asal Sekolah</div>
                    <div className="col-6 text-end">{item.asal_sekolah}</div>
                  </div>
                  <div className="row border-bottom mt-5">
                    <div className="col-6 text-start">Nomer HP</div>
                    <div className="col-6 text-end">
                      {Width < 450
                        ? item.no_hp.replaceAll("/", " ")
                        : item.no_hp.replaceAll("/", " / ")}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  Width < 450 ? "col-11" : Width < 850 ? "col-12" : "col-6"
                }
              >
                <div className="data_orangtua border-element p-3">
                  <p className="fw-bolder fs-4">Data Orang Tua</p>
                  <div className="row border-bottom mt-3">
                    <div className="col-6">Nama Orang Tua</div>
                    <div className="col-6 text-end">{item.orang_tua}</div>
                  </div>
                  <div className="row border-bottom mt-3">
                    <div className="col-6">Alamat Rumah</div>
                    <div className="col-6 text-end">{item.alamat}</div>
                  </div>

                  <div className="row border-bottom mt-3">
                    <div className="col-6">No orang tua</div>
                    <div className="col-6 text-end">{item.tlp_ortu}</div>
                  </div>
                  <div className="row border-bottom mt-3">
                    <div className="col-6">Pekerjaan orang tua</div>
                    <div className="col-6 text-end">{item.pekerjaan}</div>
                  </div>
                </div>
                <div className="data_cbg border-element p-3 mt-2">
                  <p className="fw-bolder fs-4">Data Citra Bagus Grup</p>
                  <div className="row border-bottom mt-3">
                    <div className="col-6">Kelas</div>
                    <div className="col-6 text-end">{`${item.kelas} ${item.tipeKelas}`}</div>
                  </div>
                  <div className="row border-bottom mt-3">
                    <div className="col-6">Kelas Kedua</div>
                    <div className="col-6 text-end">{item.secondary_kelas}</div>
                  </div>
                  <div className="row border-bottom mt-3">
                    <div className="col-6">Program</div>
                    <div className="col-6 text-end">{item.program}</div>
                  </div>
                  <div className="row border-bottom mt-3">
                    <div className="col-6">Username / No.Induk</div>
                    <div className="col-6 text-end">{item.username}</div>
                  </div>
                  <div className="row border-bottom mt-3">
                    <div className="col-6">Password</div>
                    <div className="col-6 text-end">{item.password}</div>
                  </div>
                  <div className="row border-bottom mt-3">
                    <div className="col-6">Admin 1</div>
                    <div className="col-6 text-end">
                      <button
                        className="p-1 border rounded-2 pointer color-whatsapp text-center"
                        onClick={() => {
                          window.location.href = `https://wa.me/62${parseInt(
                            dataNomer.admin_1
                          )}`;
                        }}
                      >
                        <i className="fa-brands fa-whatsapp"></i>{" "}
                        {dataNomer.admin_1}
                      </button>
                    </div>
                  </div>
                  <div className="row border-bottom mt-3">
                    <div className="col-6">Admin 2</div>
                    <div className="col-6 text-end">
                      <button
                        className="p-1 border rounded-2 pointer color-whatsapp text-center"
                        onClick={() => {
                          window.location.href = `https://wa.me/62${parseInt(
                            dataNomer.admin_2
                          )}`;
                        }}
                      >
                        <i className="fa-brands fa-whatsapp"></i>{" "}
                        {dataNomer.admin_2}
                      </button>
                    </div>
                  </div>
                  <div className="row border-bottom mt-3">
                    <div className="col-6">Instagram</div>
                    <div className="col-6 text-end">
                      <button
                        className="p-1 border rounded-2 pointer color-instagram text-center"
                        onClick={() => {
                          window.location.href =
                            "https://www.instagram.com/citrabagus?igsh=ajVxcHE1MjNpd2Mz";
                        }}
                      >
                        <i className="fa-brands fa-instagram"></i> @citrabagus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        : null}
      <button
        className="btn btn-success w-50 mt-3 mb-3 exit-btn"
        onClick={exit}
      >
        <i className="fa-solid fa-door-open"></i> Exit
      </button>
    </Container>
  );
};
export default Profile;
