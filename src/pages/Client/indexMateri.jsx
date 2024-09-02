import axios from "axios";
import "../../assets/Style/universal.css";
import "../../assets/Style/Admin/preview.css";
import { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const IndexMateri = ({ setLoading, dataSiswa }) => {
  const [data, setData] = useState([]);
  const [kunci, setKunci] = useState(true);
  const UrlParams = new URLSearchParams(document.location.search);
  const Get_Nama = UrlParams.get("nama");
  const Get_Tipe = UrlParams.get("tipe");

  let componentPDF = useRef();
  const fetchData = () => {
    for (const siswa of dataSiswa) {
      if (Get_Tipe == "PDF") {
      } else {
        let formData = new FormData();
        formData.append("ujian", Get_Tipe.replaceAll(" ", "_"));
        formData.append("mapel", Get_Nama.replaceAll(" ", "_"));
        formData.append("kelas", siswa.kelas);
        formData.append("nama", siswa.nama.trim().replaceAll(" ", "_"));
        setLoading(true);
        axios({
          method: "post",
          url: `${import.meta.env.VITE_BASEURL}/ujian.php?read_soal&jawaban`,
          data: formData,
          responseType: "json",
        })
          .then((response) => {
            setData(response.data);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  };

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: `${Get_Nama}`,
    onAfterPrint: () =>
      Swal.fire({
        title: "Berhasil Menyimpan PDF",
        icon: "success",
      }),
  });

  useEffect(() => {
    document.body.style.overflow = "scroll";
    if (dataSiswa) {
      fetchData();
    }
  }, [dataSiswa]);
  return (
    <Container className="container-data">
      <div className="button-action" align="right">
        <button
          className="btn btn-primary me-1 mb-1"
          onClick={() => {
            setKunci(false);
          }}
        >
          <i className="fa-solid fa-wand-magic"></i> <b>Tanpa Jawaban</b>
        </button>
        <button
          className="btn btn-primary me-1 mb-1"
          onClick={() => {
            setKunci(true);
          }}
        >
          <i className="fa-solid fa-wand-sparkles"></i> <b>Dengan Jawaban</b>
        </button>
        <button className="btn btn-primary me-1 mb-1" onClick={generatePDF}>
          <i className="fa-solid fa-file-pdf"></i> <b>Download PDF</b>
        </button>
      </div>
      <div ref={componentPDF} id="component_word" className={`canvas-full`}>
        <div className={`selection-full`}>
          <div className={`content-full`}>
            {data.map((item, index) => (
              <div key={index}>
                {item.tipe == "esay" ? (
                  <div className="fw-bolder fs-5 ms-2">Pertanyaan Esay</div>
                ) : null}
                <div className="d-flex flex-row mb-3">
                  <div className="fw-bolder p-2">{`${item.Number}.`}</div>
                  <div
                    dangerouslySetInnerHTML={{ __html: item.Soal }}
                    className="p-2"
                  ></div>
                </div>

                {item.tipe == "esay" ? (
                  <div>
                    {kunci ? (
                      <textarea
                        className="ms-5"
                        value={item.Jawaban}
                        cols="30"
                        rows="10"
                        readOnly
                      ></textarea>
                    ) : null}
                  </div>
                ) : (
                  <div>
                    <div
                      className={
                        kunci && item.Jawaban == "A"
                          ? "d-flex flex-row mb-3 ms-5 text-danger"
                          : "d-flex flex-row mb-3 ms-5"
                      }
                    >
                      <div className="fw-bolder p-2">A.</div>
                      <div
                        dangerouslySetInnerHTML={{ __html: item.A }}
                        className="p-2"
                      ></div>
                    </div>

                    <div
                      className={
                        kunci && item.Jawaban == "B"
                          ? "d-flex flex-row mb-3 ms-5 text-danger"
                          : "d-flex flex-row mb-3 ms-5"
                      }
                    >
                      <div className="fw-bolder p-2">B.</div>
                      <div
                        dangerouslySetInnerHTML={{ __html: item.B }}
                        className="p-2"
                      ></div>
                    </div>

                    <div
                      className={
                        kunci && item.Jawaban == "C"
                          ? "d-flex flex-row mb-3 ms-5 text-danger"
                          : "d-flex flex-row mb-3 ms-5"
                      }
                    >
                      <div className="fw-bolder p-2">C.</div>
                      <div
                        dangerouslySetInnerHTML={{ __html: item.C }}
                        className="p-2"
                      ></div>
                    </div>

                    <div
                      className={
                        kunci && item.Jawaban == "D"
                          ? "d-flex flex-row mb-3 ms-5 text-danger"
                          : "d-flex flex-row mb-3 ms-5"
                      }
                    >
                      <div className="fw-bolder p-2">D.</div>
                      <div
                        dangerouslySetInnerHTML={{ __html: item.D }}
                        className="p-2"
                      ></div>
                    </div>

                    {item.E == "" || item.E == " " ? null : (
                      <div
                        className={
                          kunci && item.Jawaban == "E"
                            ? "d-flex flex-row mb-3 ms-5 text-danger"
                            : "d-flex flex-row mb-3 ms-5"
                        }
                      >
                        <div className="fw-bolder p-2">E.</div>
                        <div
                          dangerouslySetInnerHTML={{ __html: item.E }}
                          className="p-2"
                        ></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className={`footer-full`}></div>
        </div>
      </div>
    </Container>
  );
};

export default IndexMateri;
