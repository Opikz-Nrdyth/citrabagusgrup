import { Container } from "react-bootstrap";
import "../../assets/Style/Admin/webutama.css";
import * as XLSX from "xlsx"; // Import xlsx library
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ImportExcell = ({ setLoading }) => {
  const [data, setData] = useState([]);
  const items = Array.from({ length: 15 }, (_, index) => index + 1);
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Filter out rows where column A is empty
      const filteredData = rawData.filter((row) => {
        return row[0] !== undefined && row[0] !== "";
      });

      setData(filteredData);
    };

    reader.readAsArrayBuffer(file);
  };

  const sendDataToServer = () => {
    axios
      .post(`${import.meta.env.VITE_BASEURL}/siswa.php?addExcell`, data)
      .then((response) => {
        if (response.data == "Berhasil") {
          Swal.fire({
            title: "Berhasil Menyimpan Siswa",
            icon: "success",
            showConfirmButton: false,
            timer: 1000,
          }).then(() => {
            navigate("siswa");
          });
        } else {
          Swal.fire({
            title: response.data,
            icon: "error",
            showConfirmButton: false,
            timer: 1000,
          });
        }
      })
      .catch((error) => {
        console.error("Error sending data to server:", error);
      });
  };

  return (
    <Container className="row w-element-admin">
      <div align="right" className="mb-3">
        <button
          className="btn btn-primary"
          name="addSiswa"
          onClick={() => {
            window.open(
              `${
                import.meta.env.VITE_BASEURL
              }/Template Data Siswa Terbaru.xlsx`,
              "_blank"
            );
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="20"
            height="20"
            viewBox="0 0 50 50"
            fill="#fff"
          >
            <path d="M 28.8125 0.03125 L 0.8125 5.34375 C 0.339844 5.433594 0 5.863281 0 6.34375 L 0 43.65625 C 0 44.136719 0.339844 44.566406 0.8125 44.65625 L 28.8125 49.96875 C 28.875 49.980469 28.9375 50 29 50 C 29.230469 50 29.445313 49.929688 29.625 49.78125 C 29.855469 49.589844 30 49.296875 30 49 L 30 1 C 30 0.703125 29.855469 0.410156 29.625 0.21875 C 29.394531 0.0273438 29.105469 -0.0234375 28.8125 0.03125 Z M 32 6 L 32 13 L 34 13 L 34 15 L 32 15 L 32 20 L 34 20 L 34 22 L 32 22 L 32 27 L 34 27 L 34 29 L 32 29 L 32 35 L 34 35 L 34 37 L 32 37 L 32 44 L 47 44 C 48.101563 44 49 43.101563 49 42 L 49 8 C 49 6.898438 48.101563 6 47 6 Z M 36 13 L 44 13 L 44 15 L 36 15 Z M 6.6875 15.6875 L 11.8125 15.6875 L 14.5 21.28125 C 14.710938 21.722656 14.898438 22.265625 15.0625 22.875 L 15.09375 22.875 C 15.199219 22.511719 15.402344 21.941406 15.6875 21.21875 L 18.65625 15.6875 L 23.34375 15.6875 L 17.75 24.9375 L 23.5 34.375 L 18.53125 34.375 L 15.28125 28.28125 C 15.160156 28.054688 15.035156 27.636719 14.90625 27.03125 L 14.875 27.03125 C 14.8125 27.316406 14.664063 27.761719 14.4375 28.34375 L 11.1875 34.375 L 6.1875 34.375 L 12.15625 25.03125 Z M 36 20 L 44 20 L 44 22 L 36 22 Z M 36 27 L 44 27 L 44 29 L 36 29 Z M 36 35 L 44 35 L 44 37 L 36 37 Z"></path>
          </svg>{" "}
          Download Template Excel
        </button>
      </div>
      <h3 className="fw-bolder">Pertatian!!!</h3>
      <ol>
        <li>
          Setelah mendownload biarkan header, jangan dihapus atau di replace
          menjadi data siswa
        </li>
        <li>
          pastika semua sesuai urutan header, jangan sampai ada yang salah
        </li>
        <li>
          jangan merubah code pada url_image ataupun password karena biar terset
          otomatis
        </li>
      </ol>
      <input type="file" id="excelFile" onChange={handleFileUpload} hidden />
      <label htmlFor="excelFile">
        <div className="uploader" align="center">
          <div className="content-uploader">
            <p className="fs-1 text-primary">
              <i className="fa-regular fa-images"></i>
            </p>
            <p className="fs-5 fw-bolder text-primary">
              Browse or Drag and Drop .xlsx
            </p>
            <div className="w-50 bg-primary p-3 rounded-3 fs-4 fw-bolder text-white">
              Browse
            </div>
          </div>
        </div>
      </label>

      <div>
        <button
          className="btn btn-success w-100 mt-3"
          onClick={sendDataToServer}
        >
          Kirim Data
        </button>
      </div>

      <div className="tableData">
        <table className="mt-3 table table-striped">
          <thead className="table-info">
            {data
              .filter((item, index) => index == 0)
              .map((item, index) => (
                <tr>
                  {items.map((i) => (
                    <th className="border border-black text-center" key={i}>
                      {item[i - 1].replaceAll("_", " ")}
                    </th>
                  ))}
                </tr>
              ))}
          </thead>
          <tbody>
            {data
              .filter((item, index) => index != 0)
              .map((item, index) => (
                <tr>
                  {items.map((i) => (
                    <td className="border border-black" key={i}>
                      {item[i - 1]}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
};

export default ImportExcell;
