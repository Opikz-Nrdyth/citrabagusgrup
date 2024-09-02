import axios from "axios";
import { useEffect, useState } from "react";
import TableKaryawan from "../../assets/Components/Admin/tableKaryawan";
import "../../assets/Style/universal.css";
import TableAbsenKaryawan from "../../assets/Components/Admin/tableAbsen";

const Karyawan = ({ setLoading }) => {
  const [dataKaryawan, setDataKaryawan] = useState([]);
  const [searchID, setSearchID] = useState("");
  const UrlParams = new URLSearchParams(document.location.search);
  const search = UrlParams.get("search");

  const fetchDataKaryawan = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASEURL}/karyawan.php?karyawan`
      );
      setDataKaryawan(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflowY = "scroll";
    fetchDataKaryawan();
    if (search == null || search == "null") {
    } else {
      setSearchID(search);
    }
  }, [searchID]);

  return (
    <div>
      {searchID == "" ? (
        <TableKaryawan
          fetchDataKaryawan={fetchDataKaryawan}
          dataKaryawan={dataKaryawan}
          setSearchID={setSearchID}
          setLoading={setLoading}
        />
      ) : (
        <TableAbsenKaryawan setLoading={setLoading} searchID={searchID} />
      )}
    </div>
  );
};
export default Karyawan;
