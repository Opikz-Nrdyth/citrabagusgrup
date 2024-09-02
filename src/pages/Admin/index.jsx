import { useNavigate, useParams } from "react-router-dom";
import Dashboard from "./dashboard";
import NavbarAdmin from "../../assets/Components/Admin/Navbar";
import Siswa from "./Siswa";
import SidebarAdmin from "../../assets/Components/Admin/SideBar";
import { useEffect, useState } from "react";
import Jadwal from "./jadwal";
import "semantic-ui-css/semantic.min.css";
import Eroor_404 from "../Interface/error_404";
import Tryout from "./tryout";
import Loader from "../../assets/Components/loader";
import InputKunci from "../../assets/Components/Admin/inputKunci";
import PreviwUjian from "../../assets/Components/Admin/previewUjian";
import Penilaian from "./penilaian";
import Karyawan from "./karyawan";
import Biaya from "../../assets/Components/Admin/biaya";
import PenilaianManual from "./penilaianManual";
import ReadAnswer from "../../assets/Components/Admin/readAnswer";
import Settings from "./settings";
import axios from "axios";
import Information from "./information";
import WebUtama from "./webUtama";
import PresTentor from "./pres_tentor";
import PraRegist from "./praregist";
import MinatUniv from "./minat_univ";
import Materi from "./materi";
import Alumni from "./alumni";
import ImportExcell from "./import_excell";

const Index = () => {
  document.title = "Ruang Admin";
  const Params = useParams();
  const Admin = Params["*"].toLowerCase();
  const navigate = useNavigate();
  const [margin, setMargin] = useState("margin-content w-100");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    user: "",
    pass: "",
  });

  const storageUser = localStorage.getItem("user");
  const storagePass = localStorage.getItem("pass");

  const fetchData = () => {
    axios({
      method: "get",
      url: `${import.meta.env.VITE_BASEURL}/settings.php?read`,
    }).then((response) => {
      response.data.forEach((item) => {
        if (item.nama == "username") {
          setData((prevState) => ({ ...prevState, user: item.value }));
        }
        if (item.nama == "password") {
          setData((prevState) => ({ ...prevState, pass: item.value }));
        }
      });
    });
  };

  useEffect(() => {
    if (Admin != "") {
      setMargin("margin-content-side w-100");
    } else {
      setMargin("margin-content w-100");
    }

    if (storageUser == null || storagePass == null) {
      navigate("/login/");
    } else {
      if (data.user != "" && data.pass != "") {
        if (storageUser == data.user && storagePass == data.pass) {
          console.log("Berhasil Login");
        } else {
          localStorage.removeItem("user");
          localStorage.removeItem("pass");
          navigate("/login");
        }
      }
    }
  });

  useEffect(() => {
    fetchData();
    document.body.style.overflowY = "scroll";
  }, []);

  return (
    <>
      <div>
        <NavbarAdmin />
      </div>
      {Admin != "" ? <SidebarAdmin /> : ""}
      <div className={margin}>
        {Admin === "" ? (
          <Dashboard />
        ) : Admin == "siswa" ? (
          <Siswa setLoading={setLoading} />
        ) : Admin == "jadwal" ? (
          <Jadwal setLoading={setLoading} />
        ) : Admin == "materi" ? (
          <Materi setLoading={setLoading} />
        ) : Admin == "ujian" || Admin == "inputsoal" ? (
          <Tryout setLoading={setLoading} />
        ) : Admin == "inputkunci" ? (
          <InputKunci setLoading={setLoading} />
        ) : Admin == "preview" || Admin == "document" ? (
          <PreviwUjian setLoading={setLoading} />
        ) : Admin == "penilaian" ? (
          <Penilaian setLoading={setLoading} />
        ) : Admin == "karyawan" ? (
          <Karyawan setLoading={setLoading} />
        ) : Admin == "biaya" ? (
          <Biaya setLoading={setLoading} />
        ) : Admin == "penilaian_manual" ? (
          <PenilaianManual setLoading={setLoading} />
        ) : Admin == "readujian" ? (
          <ReadAnswer setLoading={setLoading} />
        ) : Admin == "settings" ? (
          <Settings setLoading={setLoading} />
        ) : Admin == "informasi" ? (
          <Information setLoading={setLoading} />
        ) : Admin == "album" ? (
          <WebUtama setLoading={setLoading} />
        ) : Admin == "pres_tentor" ? (
          <PresTentor setLoading={setLoading} />
        ) : Admin == "pra_regist" ? (
          <PraRegist setLoading={setLoading} />
        ) : Admin == "minat_univ" ? (
          <MinatUniv setLoading={setLoading} />
        ) : Admin == "alumni" ? (
          <Alumni setLoading={setLoading} />
        ) : Admin == "importexcell" ? (
          <ImportExcell setLoading={setLoading} />
        ) : (
          <Eroor_404 />
        )}
      </div>
      {loading ? <Loader /> : null}
    </>
  );
};
export default Index;
