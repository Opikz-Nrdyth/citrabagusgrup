import Container from "react-bootstrap/Container";
import { Navbar, Nav } from "react-bootstrap";

// Foto
import Logo from "/images/logo.png";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const NavigationBar = () => {
  const [NavColor, setNavColor] = useState("position-fixed w-100 top-m3 z-3");
  const navigate = useNavigate();

  function checkScroll() {
    var viewportHeight = window.innerHeight;
    var scrollPosition = window.scrollY;
    if (window.location.pathname.indexOf("/jadwal_tentor") > -1) {
      setNavColor("position-fixed w-100 bg-orangered top-m3 z-3");
    } else if (scrollPosition >= viewportHeight) {
      setNavColor("position-fixed w-100 bg-orangered top-m3 z-3");
    } else {
      setNavColor("position-fixed w-100 top-m3 z-3");
    }
  }
  useEffect(() => {
    checkScroll();
  }, []);
  window.addEventListener("scroll", checkScroll);

  function urlLink(url, linkType) {
    let btnHumberger = document.querySelector(".navbar-toggler");
    if (linkType == "#") {
      window.location.href = "/#" + url;
      btnHumberger.click();
    } else {
      navigate(`/${url}`);
    }
  }

  return (
    <Navbar collapseOnSelect expand="lg" className={NavColor}>
      <Container>
        <Navbar.Brand href="#home" className="d-inline-block align-top">
          <img src={Logo} alt="Logo" height={30} width={30} />
          <span className="logotext text-white"> | Citra Bagus Grup</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            <span
              onClick={() => urlLink("home", "#")}
              className="nav-link nav-light"
            >
              Home
            </span>
            <span
              onClick={() => urlLink("Fasilitas", "#")}
              className="nav-link nav-light"
            >
              Fasilitas
            </span>
            <span
              onClick={() => urlLink("Foto", "#")}
              className="nav-link nav-light"
            >
              Foto-Foto
            </span>
            <span onClick={() => urlLink()} className="nav-link nav-light">
              Nilai Try Out
            </span>
            <span
              onClick={() => urlLink("jadwal_tentor", "link")}
              className="nav-link nav-light"
            >
              Jadwal Bulanan
            </span>
            <span
              onClick={() => urlLink("Daftar/datasiswa", "link")}
              className="nav-link nav-light"
            >
              Daftar
            </span>
            <span
              onClick={() => urlLink("login", "link")}
              className="nav-link nav-light"
            >
              Login
            </span>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default NavigationBar;
