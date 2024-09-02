import { useEffect } from "react";
import Daftar from "../../assets/Components/Interface/daftar";
import Fakta from "../../assets/Components/Interface/faktamenarik";
import Footer from "../../assets/Components/Interface/footers";
import Foto from "../../assets/Components/Interface/foto";
import Maps from "../../assets/Components/Interface/maps";
import NavigationBar from "../../assets/Components/Interface/navbar";
import VisiDanFasilitas from "../../assets/Components/Interface/visiandfasility";
import Welcome from "../../assets/Components/Interface/welcome";

import "../../assets/Style/landing-page.css";

const HomePage = () => {
  document.title = "Citra Bagus Grup";
  useEffect(() => {
    document.body.style.overflowY = "scroll";
  });

  return (
    <>
      <NavigationBar />
      <Welcome />
      <VisiDanFasilitas />
      <Foto />
      <Fakta />
      {/* <Daftar /> */}
      <Maps />
      <Footer />
    </>
  );
};
export default HomePage;
