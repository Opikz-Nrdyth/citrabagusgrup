import axios from "axios";
import "../../Style/Admin/preview.css";
import "../../Style/universal.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import Swal from "sweetalert2";
import Ujian from "../../../pages/Client/ujian";

const PreviwUjian = ({ setLoading }) => {
  const UrlParams = new URLSearchParams(document.location.search);
  const navigate = useNavigate();
  const Get_Ujian = UrlParams.get("ujian");
  const Get_Mapel = UrlParams.get("mapel");
  const Get_Kelas = UrlParams.get("kelas");
  const Params = useParams();
  const Admin = Params["*"].toLowerCase();
  let componentPDF = useRef();

  const [preview, setPreview] = useState("handphone");
  const [kunci, setKunci] = useState(false);

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
        setData(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();

    if (Admin == "document") {
      setPreview("A4 m-3");
      document.body.style.overflowY = "scroll";
    } else {
      // document.body.style.overflowY = "hidden";
      document.documentElement.style.height = "100vh";
      document.body.style.height = "90vh";
    }
    if (typeof window?.MathJax !== "undefined") {
      window.MathJax.typeset();
    }
  }, []);

  useEffect(() => {
    if (Admin == "preview") {
      if (preview != "handphone") {
        document.getElementById("container-number").style.display = "block";
      } else {
        document.getElementById("container-number").style.display = "none";
      }
    }
  }, [preview]);

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: `${Get_Ujian} ${Get_Mapel} ${Get_Kelas}`,
    onAfterPrint: () =>
      Swal.fire({
        title: "Berhasil Menyimpan PDF",
        icon: "success",
      }),
  });

  const gotoNumber = (number, view) => {
    if (view == "handphone") {
      document.getElementById("container-number").style.display = "none";
    }
    let urlNumber = `#number-${number}`;
    window.location.href = urlNumber;
  };

  return (
    <div style={{ height: "90vh" }}>
      {Admin == "preview" ? (
        <div className="button-action w-element-admin" align="right">
          <button
            className="btn btn-success me-1 mb-1"
            onClick={() => {
              navigate(
                `inputsoal?ujian=${Get_Ujian}&mapel=${Get_Mapel}&kelas=${Get_Kelas}`
              );
            }}
          >
            <i className="fa-solid fa-file-pen"></i> <b>Edit Soal</b>
          </button>
          <button
            className="btn btn-primary me-1 mb-1"
            onClick={() => {
              setPreview("handphone");
            }}
          >
            <i className="fa-solid fa-mobile-screen-button"></i>{" "}
            <b>Tampilan Handphone</b>
          </button>
          <button
            className="btn btn-primary me-1 mb-1"
            onClick={() => {
              setPreview("tablet");
            }}
          >
            <i className="fa-solid fa-tablet-screen-button"></i>{" "}
            <b>Tampilan Tablet</b>
          </button>
          <button
            className="btn btn-primary me-1 mb-1"
            onClick={() => {
              setPreview("laptop");
            }}
          >
            <i className="fa-solid fa-laptop"></i> <b>Tampilan Latop</b>
          </button>
        </div>
      ) : (
        <div className="button-action w-element-admin" align="right">
          <button
            className="btn btn-success me-1 mb-1"
            onClick={() => {
              navigate(
                `inputsoal?ujian=${Get_Ujian}&mapel=${Get_Mapel}&kelas=${Get_Kelas}`
              );
            }}
          >
            <i className="fa-solid fa-file-pen"></i> <b>Edit Soal</b>
          </button>
          <button
            className="btn btn-primary me-1 mb-1"
            onClick={() => {
              setKunci(false);
            }}
          >
            <i className="fa-solid fa-wand-magic"></i> <b>Tanpa Kunci</b>
          </button>
          <button
            className="btn btn-primary me-1 mb-1"
            onClick={() => {
              setKunci(true);
            }}
          >
            <i className="fa-solid fa-wand-sparkles"></i> <b>Dengan Kunci</b>
          </button>
          <button className="btn btn-primary me-1 mb-1" onClick={generatePDF}>
            <i className="fa-solid fa-file-pdf"></i> <b>Download PDF</b>
          </button>
        </div>
      )}

      <div
        ref={componentPDF}
        id="component_word"
        className={`canvas-${preview}`}
      >
        <div className={`selection-${preview}`}>
          <div className={`header-${preview}`}>
            {Admin == "preview" ? (
              <div className={`urlView-${preview}`}>{window.location.href}</div>
            ) : (
              ""
            )}
          </div>
          <div className={`content-${preview} container-soal-${preview}`}>
            {data.map((item, index) => (
              <div
                key={index}
                className={
                  Admin == "preview" ? "item-soal rounded-4 mb-3 ms-3 me-3" : ""
                }
              >
                {Admin == "preview" ? (
                  <div>
                    <div
                      className="d-flex flex-row mb-3 ms-2 mt-2 fw-bolder text-primary number-container"
                      id={`number-${item.Number}`}
                      onClick={() => {
                        document.getElementById(
                          "container-number"
                        ).style.display = "block";
                      }}
                    >
                      <div>Soal ke </div>{" "}
                      <div className="number-items ms-1 bg-primary text-white">
                        {" "}
                        {item.Number}{" "}
                      </div>
                    </div>
                    <div className="p-2 text-soal" id={`number-${item.Number}`}>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: item.Soal.replaceAll("&nbsp;", " "),
                        }}
                      ></p>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex flex-row mb-3">
                    <div className="fw-bolder p-2">{`${item.Number}.`}</div>
                    <div
                      dangerouslySetInnerHTML={{ __html: item.Soal }}
                      className="p-2"
                    ></div>
                  </div>
                )}

                <div
                  className={
                    kunci && item.Kunci == "A"
                      ? `d-flex flex-row ${
                          Admin == "preview" ? "mb-3" : ""
                        } ms-5 text-danger`
                      : `d-flex flex-row ${
                          Admin == "preview" ? "mb-3" : ""
                        } ms-5`
                  }
                >
                  <div className="fw-bolder p-2">
                    {Admin == "preview" ? (
                      <Form.Check inline name={`${item.Number}`} type="radio" />
                    ) : (
                      "A. "
                    )}
                  </div>
                  <div
                    dangerouslySetInnerHTML={{ __html: item.A }}
                    className="p-2"
                  ></div>
                </div>
                <div
                  className={
                    kunci && item.Kunci == "B"
                      ? `d-flex flex-row ${
                          Admin == "preview" ? "mb-3" : ""
                        } ms-5 text-danger`
                      : `d-flex flex-row ${
                          Admin == "preview" ? "mb-3" : ""
                        } ms-5`
                  }
                >
                  <div className="fw-bolder p-2">
                    {Admin == "preview" ? (
                      <Form.Check inline name={`${item.Number}`} type="radio" />
                    ) : (
                      "B. "
                    )}
                  </div>
                  <div
                    dangerouslySetInnerHTML={{ __html: item.B }}
                    className="p-2"
                  ></div>
                </div>
                <div
                  className={
                    kunci && item.Kunci == "C"
                      ? `d-flex flex-row ${
                          Admin == "preview" ? "mb-3" : ""
                        } ms-5 text-danger`
                      : `d-flex flex-row ${
                          Admin == "preview" ? "mb-3" : ""
                        } ms-5`
                  }
                >
                  <div className="fw-bolder p-2">
                    {Admin == "preview" ? (
                      <Form.Check inline name={`${item.Number}`} type="radio" />
                    ) : (
                      "C. "
                    )}
                  </div>
                  <div
                    dangerouslySetInnerHTML={{ __html: item.C }}
                    className="p-2"
                  ></div>
                </div>
                <div
                  className={
                    kunci && item.Kunci == "D"
                      ? `d-flex flex-row ${
                          Admin == "preview" ? "mb-3" : ""
                        } ms-5 text-danger`
                      : `d-flex flex-row ${
                          Admin == "preview" ? "mb-3" : ""
                        } ms-5`
                  }
                >
                  <div className="fw-bolder p-2">
                    {Admin == "preview" ? (
                      <Form.Check inline name={`${item.Number}`} type="radio" />
                    ) : (
                      "D. "
                    )}
                  </div>
                  <div
                    dangerouslySetInnerHTML={{ __html: item.D }}
                    className="p-2"
                  ></div>
                </div>
                {item.E == "" ||
                item.E == " " ||
                item.E == "<p><br></p>" ||
                item.E == "<p></p>" ||
                item.E == "<br>" ? null : (
                  <span>
                    <div
                      className={
                        kunci && item.Kunci == "E"
                          ? `d-flex flex-row ${
                              Admin == "preview" ? "mb-3" : ""
                            } ms-5 text-danger`
                          : `d-flex flex-row ${
                              Admin == "preview" ? "mb-3" : ""
                            } ms-5`
                      }
                    >
                      <div className="fw-bolder p-2">
                        {Admin == "preview" ? (
                          <Form.Check
                            inline
                            name={`${item.Number}`}
                            type="radio"
                          />
                        ) : (
                          "E. "
                        )}
                      </div>
                      <div
                        dangerouslySetInnerHTML={{ __html: item.E }}
                        className="p-2"
                      ></div>
                    </div>
                  </span>
                )}
                {Admin == "preview" ? (
                  <div align="center">
                    <button className="btn btn-warning btn-sm mb-3">
                      Ragu-Ragu
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          {Admin == "preview" ? (
            <div
              className={`container-number-prev container-number-prev-${preview}`}
              id="container-number"
            >
              <button className="btn btn-success w-100">Kirim Jawaban</button>
              <div className={data.length > 44 ? "row row-scroll" : "row"}>
                {data.map((item, index) => (
                  <div
                    key={index}
                    className={`item-number col-3 border border-2 fs-4 fw-bolder`}
                    onClick={() => {
                      gotoNumber(item.Number, preview);
                    }}
                  >
                    {item.Number}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          <div className={`footer-${preview}`}></div>
        </div>
      </div>
    </div>
  );
};
export default PreviwUjian;
