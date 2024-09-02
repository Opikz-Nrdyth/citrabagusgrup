import { FloatingLabel, Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
// Editor
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/plugins/image.min.js";
import "froala-editor/js/plugins/colors.min.js";
import "froala-editor/js/plugins/draggable.min.js";
import "froala-editor/js/plugins/font_family.min.js";
import "froala-editor/js/plugins/font_size.min.js";
import "froala-editor/js/plugins/table.min.js";
import "froala-editor/js/plugins/word_paste.min.js";
import "froala-editor/js/plugins/lists.min.js";
import "froala-editor/js/plugins/special_characters.min.js";
import "froala-editor/js/plugins/quote.min.js";
import "froala-editor/js/plugins/align.min.js";
import "../../Style/Admin/input_soal.css";
import FroalaEditorComponent from "react-froala-wysiwyg";

const InputSoal = ({ setLoading }) => {
  const navigate = useNavigate();
  const width = window.screen.width;
  const [numberOld, setNumberOld] = useState("");
  const [number, setNumber] = useState("");
  const [soal, setSoal] = useState("");
  const [jawabanA, setJawabanA] = useState("");
  const [jawabanB, setJawabanB] = useState("");
  const [jawabanC, setJawabanC] = useState("");
  const [jawabanD, setJawabanD] = useState("");
  const [jawabanE, setJawabanE] = useState("");
  const [kunci, setKunci] = useState("");
  const UrlParams = new URLSearchParams(document.location.search);
  const Get_Ujian = UrlParams.get("ujian");
  const Get_Mapel = UrlParams.get("mapel");
  const Get_Kelas = UrlParams.get("kelas");
  const [tipeJawaban, setTipeJawaban] = useState("pilihan");

  const [data, setData] = useState([]);
  const [btnKirim, setBtnKirim] = useState("kirim");

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
    document.body.style.overflowY = "scroll";
  }, []);

  function AddData() {
    let formData = new FormData();
    formData.append("ujian", Get_Ujian);
    formData.append("mapel", Get_Mapel);
    formData.append("kelas", Get_Kelas);
    formData.append("number", number);
    formData.append("soal", soal);
    formData.append("A", jawabanA);
    formData.append("B", jawabanB);
    formData.append("C", jawabanC);
    formData.append("D", jawabanD);
    formData.append("E", jawabanE);
    formData.append("kunci", kunci);
    formData.append("tipe", tipeJawaban);

    setLoading(true);
    axios({
      method: "post",
      url: `${import.meta.env.VITE_BASEURL}/ujian.php?input_soal`,
      data: formData,
      responseType: "json",
    })
      .then((response) => {
        if (response.data == "Berhasil") {
          Swal.fire({
            title: "berhasil menambah data",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            title: response.data,
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .finally(() => {
        setLoading(false);
        fetchData();
        setNumber(parseInt(number) + 1);
        setSoal("");
        setJawabanA("");
        setJawabanB("");
        setJawabanC("");
        setJawabanD("");
        setJawabanE("");
        setKunci("");
      });
  }

  function GetDataEdit(number, soal, a, b, c, d, e, kunci, tipe) {
    setNumber(number);
    setNumberOld(number);
    setSoal(soal);
    setJawabanA(a);
    setJawabanB(b);
    setJawabanC(c);
    setJawabanD(d);
    setJawabanE(e);
    setKunci(kunci);
    setTipeJawaban(tipe);
    setBtnKirim("edit");
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }

  function UpdateData() {
    let formData = new FormData();
    formData.append("ujian", Get_Ujian);
    formData.append("mapel", Get_Mapel);
    formData.append("kelas", Get_Kelas);
    formData.append("number_old", numberOld);
    formData.append("number", number);
    formData.append("soal", soal);
    formData.append("A", jawabanA);
    formData.append("B", jawabanB);
    formData.append("C", jawabanC);
    formData.append("D", jawabanD);
    formData.append("E", jawabanE);
    formData.append("kunci", kunci);
    formData.append("tipe", tipeJawaban);

    setLoading(true);
    axios({
      method: "post",
      url: `${import.meta.env.VITE_BASEURL}/ujian.php?update_soal`,
      data: formData,
    })
      .then((response) => {
        if (response.data == "Berhasil") {
          Swal.fire({
            title: "berhasil mengupdate data",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            title: response.data,
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .finally(() => {
        setLoading(false);
        fetchData();
        setNumber(parseInt(number) + 1);
        setSoal("");
        setJawabanA("");
        setJawabanB("");
        setJawabanC("");
        setJawabanD("");
        setJawabanE("");
        setKunci("");
        setBtnKirim("kirim");
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      });
  }

  function cancelEdit() {
    setNumber("");
    setSoal("");
    setJawabanA("");
    setJawabanB("");
    setJawabanC("");
    setJawabanD("");
    setJawabanE("");
    setKunci("");
    setBtnKirim("kirim");
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }

  function DeleteData(numberId) {
    Swal.fire({
      icon: "info",
      title: `Anda yakin ingin menghapus ${numberId}`,
      confirmButtonColor: "#bb2d3b",
      confirmButtonText: "Hapus",
      showCancelButton: true,
      cancelButtonColor: "#157347",
      cancelButtonText: "Batal",
      allowOutsideClick: false,
    }).then((res) => {
      if (res.isConfirmed) {
        let formData = new FormData();
        formData.append("ujian", Get_Ujian);
        formData.append("mapel", Get_Mapel);
        formData.append("kelas", Get_Kelas);
        formData.append("number", numberId);
        setLoading(true);
        axios({
          method: "post",
          url: `${import.meta.env.VITE_BASEURL}/ujian.php?delete_soal`,
          data: formData,
        })
          .then((response) => {
            if (response.data == "Berhasil") {
              Swal.fire({
                title: "berhasil menghapus data",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
              });
            } else {
              Swal.fire({
                title: response.data,
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          })
          .finally(() => {
            setLoading(false);
            fetchData();
          });
      }
    });
  }

  return (
    <div>
      <div className="button-action w-element-admin" align="right">
        <button
          className="btn btn-primary me-1 mb-1"
          onClick={() => {
            navigate(
              `inputkunci?ujian=${Get_Ujian}&mapel=${Get_Mapel}&kelas=${Get_Kelas}`
            );
          }}
        >
          <i className="fa-solid fa-key"></i> <b>Input kunci</b>
        </button>
        <button
          className="btn btn-primary me-1 mb-1"
          onClick={() => {
            navigate(
              `document?ujian=${Get_Ujian}&mapel=${Get_Mapel}&kelas=${Get_Kelas}`
            );
          }}
        >
          <i className="fa-solid fa-file"></i> <b>Download Document</b>
        </button>
        <button
          className="btn btn-primary me-1 mb-1"
          onClick={() => {
            navigate(
              `preview?ujian=${Get_Ujian}&mapel=${Get_Mapel}&kelas=${Get_Kelas}`
            );
          }}
        >
          <i className="fa-solid fa-mobile-screen-button"></i> <b>Preview</b>
        </button>
      </div>
      <div className="editor mt-3 w-element-admin mb-3">
        <FloatingLabel
          label="Masukan Nomer Soal"
          controlId="numberSoal"
          className="mb-3"
        >
          <Form.Control
            type="number"
            placeholder="numberSoal"
            value={number}
            onChange={(e) => {
              setNumber(e.target.value);
            }}
          />
        </FloatingLabel>
        <span className="fs-5">Soal</span>
        <div className="border rounded-1 editor-container" id="soalEditor">
          <FroalaEditorComponent
            config={{
              placeholderText: "Tuliskan Soal disini",
              charCounterCount: true,
              toolbarInline: true,
              toolbarVisibleWithoutSelection: true,
            }}
            onModelChange={(newText) => {
              setSoal(newText.replaceAll("&nbsp;", " "));
            }}
            model={soal}
            tag="textarea"
          />
        </div>
        <div className="row mt-2">
          <div className={width < 450 ? "col-12" : "col-6"}>
            <span className="fs-5">Jawaban A</span>
            <div className="border rounded-1 editor-container">
              <FroalaEditorComponent
                config={{
                  placeholderText: "Tuliskan Jawaban A disini",
                  charCounterCount: true,
                  toolbarInline: true,
                  toolbarVisibleWithoutSelection: true,
                }}
                onModelChange={(newText) => {
                  setJawabanA(newText.replaceAll("&nbsp;", " "));
                }}
                model={jawabanA}
                tag="textarea"
              />
            </div>
          </div>
          <div className={width < 450 ? "col-12" : "col-6"}>
            <span className="fs-5">Jawaban B</span>
            <div className="border rounded-1 editor-container">
              <FroalaEditorComponent
                config={{
                  placeholderText: "Tuliskan Jawaban B disini",
                  charCounterCount: true,
                  toolbarInline: true,
                  toolbarVisibleWithoutSelection: true,
                }}
                onModelChange={(newText) => {
                  setJawabanB(newText.replaceAll("&nbsp;", " "));
                }}
                model={jawabanB}
                tag="textarea"
              />
            </div>
          </div>
          <div className={width < 450 ? "col-12 mt-2" : "col-6 mt-2"}>
            <span className="fs-5">Jawaban C</span>
            <div className="border rounded-1 editor-container">
              <FroalaEditorComponent
                config={{
                  placeholderText: "Tuliskan Jawaban C disini",
                  charCounterCount: true,
                  toolbarInline: true,
                  toolbarVisibleWithoutSelection: true,
                }}
                onModelChange={(newText) => {
                  setJawabanC(newText.replaceAll("&nbsp;", " "));
                }}
                model={jawabanC}
                tag="textarea"
              />
            </div>
          </div>
          <div className={width < 450 ? "col-12 mt-2" : "col-6 mt-2"}>
            <span className="fs-5">Jawaban D</span>
            <div className="border rounded-1 editor-container">
              <FroalaEditorComponent
                config={{
                  placeholderText: "Tuliskan Jawaban D disini",
                  charCounterCount: true,
                  toolbarInline: true,
                  toolbarVisibleWithoutSelection: true,
                }}
                onModelChange={(newText) => {
                  setJawabanD(newText.replaceAll("&nbsp;", " "));
                }}
                model={jawabanD}
                tag="textarea"
              />
            </div>
          </div>
          <div className={width < 450 ? "col-12 mt-2" : "col-6 mt-2"}>
            <span className="fs-5">Jawaban E</span>
            <div className="border rounded-1 editor-container">
              <FroalaEditorComponent
                config={{
                  placeholderText: "Tuliskan Jawaban E disini",
                  charCounterCount: true,
                  toolbarInline: true,
                  toolbarVisibleWithoutSelection: true,
                }}
                onModelChange={(newText) => {
                  setJawabanE(newText.replaceAll("&nbsp;", " "));
                }}
                model={jawabanE}
                tag="textarea"
              />
            </div>
          </div>
          <div className={width < 450 ? "col-12 mt-2" : "col-6 mt-2"}>
            <span className="fs-5">Kunci Jawaban</span>
            {tipeJawaban == "pilihan" ? (
              <div>
                <Form.Select
                  onChange={(e) => {
                    setKunci(e.target.value);
                  }}
                  aria-label="Floating label select example"
                  size="lg"
                >
                  <option defaultValue="">Pilih Kunci</option>
                  <option selected={kunci == "A"} defaultValue="A">
                    A
                  </option>
                  <option selected={kunci == "B"} defaultValue="B">
                    B
                  </option>
                  <option selected={kunci == "C"} defaultValue="C">
                    C
                  </option>
                  <option selected={kunci == "D"} defaultValue="D">
                    D
                  </option>
                  <option selected={kunci == "E"} defaultValue="E">
                    E
                  </option>
                </Form.Select>
              </div>
            ) : (
              <div className="border rounded-1">
                <textarea
                  cols="49"
                  rows="6"
                  defaultValue={kunci}
                  onChange={(e) => {
                    setKunci(e.target.value);
                  }}
                ></textarea>
              </div>
            )}
            <div>
              <input
                type="radio"
                id="pilihan"
                className="mt-2"
                name="pilihan"
                checked={tipeJawaban == "pilihan"}
                onChange={() => {
                  setTipeJawaban("pilihan");
                }}
              />
              <label htmlFor="pilihan" className="ms-3">
                Pilihan Ganda
              </label>
              <input
                type="radio"
                id="esay"
                className="mt-2 ms-3"
                name="pilihan"
                checked={tipeJawaban == "esay"}
                onChange={() => {
                  setTipeJawaban("esay");
                }}
              />
              <label htmlFor="esay" className="ms-3">
                Esay
              </label>
            </div>
          </div>
        </div>

        <button
          className="btn btn-success w-100 mt-3"
          onClick={btnKirim == "kirim" ? AddData : UpdateData}
        >
          {btnKirim == "kirim" ? "Kirim" : "Update"}
        </button>
        {btnKirim == "edit" ? (
          <button className="btn btn-warning w-100 mt-1" onClick={cancelEdit}>
            Cancel
          </button>
        ) : (
          ""
        )}
      </div>
      <div className="overflow-x-scroll w-element-admin">
        <table className="table table-striped">
          <thead className="table-info">
            <tr>
              <th>No</th>
              <th>Soal</th>
              <th>Jawaban A</th>
              <th>Jawaban B</th>
              <th>Jawaban C</th>
              <th>Jawaban D</th>
              <th>Jawaban E</th>
              <th>Kunci</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.Number}</td>
                <td dangerouslySetInnerHTML={{ __html: item.Soal }}></td>
                <td dangerouslySetInnerHTML={{ __html: item.A }}></td>
                <td dangerouslySetInnerHTML={{ __html: item.B }}></td>
                <td dangerouslySetInnerHTML={{ __html: item.C }}></td>
                <td dangerouslySetInnerHTML={{ __html: item.D }}></td>
                <td dangerouslySetInnerHTML={{ __html: item.E }}></td>
                <td>{item.Kunci}</td>
                <td>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      GetDataEdit(
                        item.Number,
                        item.Soal,
                        item.A,
                        item.B,
                        item.C,
                        item.D,
                        item.E,
                        item.Kunci,
                        item.tipe
                      );
                    }}
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </span>{" "}
                  |{" "}
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      DeleteData(item.Number);
                    }}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default InputSoal;
