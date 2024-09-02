import Footer from "../../assets/Components/Interface/footers";
import NavigationBar from "../../assets/Components/Interface/navbar";

import { useParams } from "react-router-dom";
import TabelJadwalTentor from "../../assets/Components/Interface/tabelJadwalTentor";
import TabelSpesifikJadwal from "../../assets/Components/Interface/tabelSpesifikJadwal";

const JadwalTentor = () => {
  const Params = useParams();
  const Jadwal = Params["*"].toLowerCase();
  document.querySelector('body').style.overflowY = 'hidden'
  return (
    <>
      <NavigationBar />
      {Jadwal.indexOf("view") > -1 ? (
        <TabelSpesifikJadwal />
      ) : (
        <TabelJadwalTentor />
      )}
    </>
  );
};

export default JadwalTentor;
