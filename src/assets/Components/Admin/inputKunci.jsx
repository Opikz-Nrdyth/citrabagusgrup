import axios from "axios";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import "../../Style/universal.css";
import "../../Style/Admin/tryout.css";
import Swal from "sweetalert2";

const InputKunci = ({ setLoading }) => {
  const UrlParams = new URLSearchParams(document.location.search);
  const Get_Ujian = UrlParams.get("ujian");
  const Get_Mapel = UrlParams.get("mapel");
  const Get_Kelas = UrlParams.get("kelas");

  const [data, setData] = useState([]);

  const fetchData = () => {
    let formData = new FormData();
    formData.append("ujian", Get_Ujian);
    formData.append("mapel", Get_Mapel);
    formData.append("kelas", Get_Kelas);
    setLoading(true);
    axios({
      method: "post",
      url: `${import.meta.env.VITE_BASEURL}/ujian.php?read_soal`,
      data: formData,
      responseType: "json",
    })
      .then((response) => {
        setData(
          response.data.map((item) => ({
            Number: item.Number,
            Kunci: item.Kunci,
            Tipe: item.tipe,
          }))
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchData();
    document.body.style.overflowY = "scroll";
  }, []);

  function ChangeItem(number, kunci, tipe) {
    const item = data.find((item) => item.Number == number);
    item.Kunci = kunci;
    item.Tipe = tipe;
    setData(data);
  }

  function kirimData() {
    setLoading(true);
    axios({
      method: "post",
      url: `${import.meta.env.VITE_BASEURL}/ujian.php?update_kunci`, // ganti dengan URL server Anda
      data: { Get_Ujian, Get_Mapel, Get_Kelas, data }, // kirim data sebagai body permintaan
      headers: {
        "Content-Type": "application/json", // tentukan tipe konten sebagai JSON
      },
    })
      .then((res) => {
        fetchData();
        if (res.data == "Berhasil") {
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: res.data,
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div>
      <div className="mg-input-kunci">
        {data.map((item, index) => (
          <div key={index} className="mb-3">
            <span className="fw-bolder me-3">{`(${
              item.Tipe == "esay" ? "esay" : "pilihan ganda"
            }) No ${item.Number}.`}</span>
            {item.Tipe == "esay" ? (
              <div className="w-40">
                <textarea
                  name={`${item.Number}`}
                  id={`${item.Number}_A`}
                  cols="49"
                  rows="6"
                  defaultValue={item.Kunci}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    ChangeItem(item.Number, newValue, "esay");
                  }}
                ></textarea>
              </div>
            ) : (
              <div>
                <Form.Check
                  inline
                  label="A"
                  name={`${item.Number}`}
                  type="radio"
                  id={`${item.Number}_A`}
                  defaultChecked={item.Kunci == "A"}
                  onChange={() => {
                    ChangeItem(item.Number, "A", "pilihan");
                  }}
                />
                <Form.Check
                  inline
                  label="B"
                  name={`${item.Number}`}
                  type="radio"
                  id={`${item.Number}_B`}
                  defaultChecked={item.Kunci == "B"}
                  onChange={() => {
                    ChangeItem(item.Number, "B", "pilihan");
                  }}
                />
                <Form.Check
                  inline
                  label="C"
                  name={`${item.Number}`}
                  type="radio"
                  id={`${item.Number}_C`}
                  defaultChecked={item.Kunci == "C"}
                  onChange={() => {
                    ChangeItem(item.Number, "C", "pilihan");
                  }}
                />
                <Form.Check
                  inline
                  label="D"
                  name={`${item.Number}`}
                  type="radio"
                  id={`${item.Number}_D`}
                  defaultChecked={item.Kunci == "D"}
                  onChange={() => {
                    ChangeItem(item.Number, "D", "pilihan");
                  }}
                />
                <Form.Check
                  inline
                  label="E"
                  name={`${item.Number}`}
                  type="radio"
                  id={`${item.Number}_E`}
                  defaultChecked={item.Kunci == "E"}
                  onChange={() => {
                    ChangeItem(item.Number, "E", "pilihan");
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        className="btn btn-success mt-3 w-element-admin"
        onClick={kirimData}
      >
        Kirim Perubahan
      </button>
    </div>
  );
};

export default InputKunci;
