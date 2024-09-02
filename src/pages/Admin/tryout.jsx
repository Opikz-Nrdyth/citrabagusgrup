import { useParams } from "react-router-dom";
import TabelTryout from "../../assets/Components/Admin/tabelTryout";
import InputSoal from "../../assets/Components/Admin/InputSoal";
import "../../assets/Style/universal.css";
import "../../assets/Style/Admin/tryout.css";

const Tryout = ({ setLoading }) => {
  document.querySelector("body").style.overflowY = "scroll";
  const Params = useParams();
  const Admin = Params["*"].toLowerCase();

  return (
    <>
      {Admin == "ujian" ? (
        <TabelTryout setLoading={setLoading} />
      ) : Admin == "inputsoal" ? (
        <InputSoal setLoading={setLoading} />
      ) : (
        ""
      )}
    </>
  );
};
export default Tryout;
