import { Container, Nav, Navbar } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Logo from "/images/logo.png";
import "../../Style/universal.css";
import "../../Style/Admin/sidebar.css";
import { useEffect, useState } from "react";

const NavbarAdmin = () => {
  const navigate = useNavigate();
  const width = window.screen.width;
  const Params = useParams();
  const Admin = Params["*"];
  const [fs_1, setFs_1] = useState("fs-1 humberger-btn");
  useEffect(() => {
    if (window.screen.width > 760) {
      setFs_1("fs-4");
    }
  }, []);

  function humbergerClick() {
    let sideBar = document.getElementById("sidebar");
    if (sideBar.getAttribute("hidden") != null) {
      sideBar.removeAttribute("hidden");
    } else {
      sideBar.setAttribute("hidden", "");
    }
  }

  function exit() {
    localStorage.removeItem("user");
    localStorage.removeItem("pass");
    navigate("/login");
  }

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      className="bg-orangered position-fixed w-nav top-0 z-3 overflow-hidden"
    >
      <Container>
        <Navbar.Brand
          onClick={() => {
            navigate("/ruangadmin/");
          }}
          className="brand"
        >
          <img src={Logo} alt="Logo" height={30} width={30} /> | Ruang Admin{" "}
          {Admin != "" ? " / " + Admin.replaceAll("_", " ") : ""}
        </Navbar.Brand>
        {Admin == "" ? (
          <span className={fs_1} onClick={exit}>
            <i className="fa-solid fa-right-from-bracket"></i>
          </span>
        ) : (
          <>
            {width > 450 ? (
              <span></span>
            ) : (
              <Navbar.Toggle
                className={fs_1}
                id="humberger_btn"
                onClick={() => {
                  humbergerClick();
                }}
              >
                <i className="fa-solid fa-bars"></i>
              </Navbar.Toggle>
            )}
          </>
        )}
      </Container>
    </Navbar>
  );
};
export default NavbarAdmin;
