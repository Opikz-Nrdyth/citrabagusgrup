import { Dropdown, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../assets/Style/universal.css";
import "../../assets/Style/Admin/Penilaian.css";
import TablePenilaian from "../../assets/Components/Admin/tablePenilaian";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import AturPenilaian from "../../assets/Components/Admin/aturPenilaian";

const Penilaian = ({ setLoading }) => {
  const navigate = useNavigate();
  const [aturPenilaian, setAturPenilaian] = useState(false);
  const [exportExcell, setExportExcell] = useState(false);
  const UrlParams = new URLSearchParams(document.location.search);
  const Kelas = UrlParams.get("kelas");
  const [dataTryout, setDataTryout] = useState([]);
  const [data, setData] = useState([]);
  const [dataNilai, setDataNilai] = useState([]);

  function changeAturPenilaian() {
    if (aturPenilaian) {
      setAturPenilaian(false);
    } else {
      setAturPenilaian(true);
    }
  }

  const fetchData = () => {
    axios({
      method: "get",
      url: `${
        import.meta.env.VITE_BASEURL
      }/penilaian.php?read_ujian&kelas=${Kelas}`,
      responseType: "json",
    }).then((response) => {
      setDataTryout(response.data);

      let groupedData = [];
      let ujianMap = new Map();
      response.data.forEach((item) => {
        let nama_ujian = item.nama_ujian;
        if (ujianMap.has(nama_ujian)) {
          let index = ujianMap.get(nama_ujian);
          groupedData[index].data.push(item);
        } else {
          let newObj = {
            nama_ujian: nama_ujian,
            data: [item],
          };

          groupedData.push(newObj);
          ujianMap.set(nama_ujian, groupedData.length - 1);
        }
      });
      groupedData.sort((a, b) => a.nama_ujian.localeCompare(b.nama_ujian));
      setData(groupedData);
      fetchNilai(response.data);
    });
  };

  const fetchNilai = (dataTryout) => {
    axios({
      method: "post",
      url: `${import.meta.env.VITE_BASEURL}/penilaian.php?read_nilai`,
      data: dataTryout,
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      const sortedData = response.data.sort((a, b) => {
        return a.nama.localeCompare(b.nama);
      });
      setDataNilai(sortedData);
    });
  };

  useEffect(() => {
    document.body.style.overflowY = "scroll";
    if (Kelas == null || Kelas == "null" || Kelas == "") {
    } else {
      fetchData();
    }
  }, [Kelas]);

  return (
    <div>
      <div className="w-element-admin" align="right">
        <Dropdown className="d-inline mx-2 border">
          <Dropdown.Toggle id="dropdown-autoclose-true">
            <i className="fa-solid fa-users-rectangle"></i>{" "}
            {Kelas == null || Kelas == "null" || Kelas == ""
              ? "Pilih Kelas"
              : `Kelas ${Kelas}`}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                navigate("?kelas=1");
              }}
            >
              Kelas 1
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                navigate("?kelas=2");
              }}
            >
              Kelas 2
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                navigate("?kelas=3");
              }}
            >
              Kelas 3
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                navigate("?kelas=4");
              }}
            >
              Kelas 4
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                navigate("?kelas=5");
              }}
            >
              Kelas 5
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                navigate("?kelas=6");
              }}
            >
              Kelas 6
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                navigate("?kelas=7");
              }}
            >
              Kelas 7
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                navigate("?kelas=8");
              }}
            >
              Kelas 8
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                navigate("?kelas=9");
              }}
            >
              Kelas 9
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                navigate("?kelas=10");
              }}
            >
              Kelas 10
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                navigate("?kelas=11");
              }}
            >
              Kelas 11
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                navigate("?kelas=12");
              }}
            >
              Kelas 12
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <button
          className={
            aturPenilaian
              ? "btn btn-danger me-2 mb-2"
              : "btn btn-primary me-2 mb-2"
          }
          onClick={changeAturPenilaian}
        >
          <i className="fa-solid fa-clipboard-list"></i>{" "}
          {aturPenilaian ? "Close Atur Penilaian" : "Atur Penilaian"}
        </button>
        <button
          className="btn btn-primary me-2 mb-2"
          onClick={() => {
            navigate("penilaian_manual");
          }}
        >
          <i className="fa-solid fa-wrench"></i> Penilaian Manual
        </button>
        <button
          className="btn btn-primary mb-2"
          onClick={() => {
            setExportExcell(true);
          }}
        >
          <i className="fa-solid fa-file-excel"></i> export excell
        </button>
      </div>

      {aturPenilaian ? (
        <AturPenilaian dataTryout={dataTryout} Kelas={Kelas} />
      ) : (
        <TablePenilaian
          dataTryout={dataTryout}
          data={data}
          dataNilai={dataNilai}
          exportExcell={exportExcell}
          setExportExcell={setExportExcell}
        />
      )}
    </div>
  );
};
export default Penilaian;
