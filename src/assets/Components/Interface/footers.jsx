import axios from "axios";
import { useEffect, useState } from "react";

const Footer = () => {
  const date = new Date();

  const [data, setData] = useState({
    admin1: "",
    admin2: "",
  });
  const fetchData = () => {
    axios({
      url: `${import.meta.env.VITE_BASEURL}/settings.php?read`,
      method: "get",
    }).then((response) => {
      response.data.forEach((item) => {
        if (item.nama == "admin_1") {
          setData((prevState) => ({ ...prevState, admin1: item.value }));
        }
        if (item.nama == "admin_2") {
          setData((prevState) => ({ ...prevState, admin2: item.value }));
        }
      });
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const gotourl = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="wave">
      <p className="fw-bolder fs-3 text-white" align="center">
        Kontak Kami:
      </p>
      <div className="d-flex align-items-center justify-content-center">
        <div
          className="sosmed d-flex align-items-center justify-content-lg-start fs-3 rounded-5 whatsapp"
          onClick={() => {
            gotourl(
              `https://api.whatsapp.com/send/?phone=${data.admin1}&text=%22Hallo%20CBG%22&type=phone_number&app_absent=0`
            );
          }}
        >
          <i className="fa-brands fa-whatsapp"></i>
          <span className="fw-bolder fs-5">&ensp;Admin 1</span>
        </div>
        <div
          className="sosmed d-flex align-items-center justify-content-lg-start fs-3 rounded-5 whatsapp"
          onClick={() => {
            gotourl(
              `https://api.whatsapp.com/send/?phone=${data.admin2}&text=%22Hallo%20CBG%22&type=phone_number&app_absent=0`
            );
          }}
        >
          <i className="fa-brands fa-whatsapp"></i>
          <span className="fw-bolder fs-5">&ensp;Admin 2</span>
        </div>
        <div
          className="sosmed d-flex align-items-center justify-content-lg-start fs-3 rounded-5 instagram"
          onClick={() => {
            gotourl(
              `https://www.instagram.com/citrabagus?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==`
            );
          }}
        >
          <i className="fa-brands fa-instagram"></i>
          <span className="fw-bolder fs-5">&ensp;@citrabagus</span>
        </div>
        <div
          className="sosmed d-flex align-items-center justify-content-lg-start fs-3 rounded-5 facebook"
          onClick={() => {
            gotourl(`https://web.facebook.com/profile.php?id=100011700533476`);
          }}
        >
          <i className="fa-brands fa-facebook-f"></i>
          <span className="fw-bolder fs-5">&ensp;Citra Bagus Bimbel</span>
        </div>
      </div>
      <div className="copyright">
        <div className="text-light copy-text fs-5 mb-2" align="center">
          copyright © {date.getFullYear()} - developed by <b>Opikstudio</b>
        </div>
        <div className="text-light copy-text fs-5" align="center">
          copyright © {date.getFullYear()} - distributor by{" "}
          <b>Citra Bagus Grup</b>
        </div>
      </div>
    </div>
  );
};
export default Footer;
