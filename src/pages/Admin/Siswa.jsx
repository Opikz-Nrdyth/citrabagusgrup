import { FloatingLabel, Form, InputGroup, Pagination } from "react-bootstrap";
import "../../assets/Style/Admin/siswa.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import inputData from "../../json/inputData.json";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Siswa = ({ setLoading }) => {
  let [DataSiswa, setDataSiswa] = useState([]);
  let [otherData, setOtherData] = useState([]);
  let [pagination, setPagination] = useState({
    numberAktif: 1,
    numberMin: 1,
    numberMax: 6,
  });
  const [validated, setValidated] = useState(false);
  let [actionButton, setActionButton] = useState(-1);
  let [newData, setNewData] = useState({
    user: "",
    nama: "",
    kelas: "",
    tipekelas: "",
    sekolah: "",
    lahir: "",
    orang_tua: "",
    alamat: "",
    hp: "",
    pass: "",
    secondary_kelas: "",
    program: "",
    tlp_ortu: "",
    pekerjaan: "",
    userOld: "",
  });

  const SwalReactContent = withReactContent(Swal);
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let width = window.screen.width;
  let search = urlParams.get("search");
  let active = 1;
  if (urlParams.get("page") != null) {
    active = urlParams.get("page");
  }
  let items = [];
  const navigate = useNavigate();

  function fetchData() {
    let url = `${import.meta.env.VITE_BASEURL}/siswa.php?read&page=${active}`;
    if (search != null) {
      url = `${
        import.meta.env.VITE_BASEURL
      }/siswa.php?read&page=${active}&search=${search}`;
    }
    setLoading(true);
    axios({
      method: "get",
      url: url,
      responseType: "json",
    })
      .then(function (response) {
        setDataSiswa(response.data.data);
        setOtherData(response.data);
      })
      .catch((err) => {
        Swal.fire({
          title: err,
          icon: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }
  useEffect(() => {
    document.body.style.overflowY = "scroll";
    fetchData();
  }, []);

  useEffect(() => {
    let Pagination = { ...pagination };
    Pagination.numberAktif = active;
    if (
      active >= Pagination.numberMax - 1 &&
      Pagination.numberMax <= otherData.total_pages - 1
    ) {
      Pagination.numberMin += 1;
      Pagination.numberMax += 1;
    }
    if (active <= Pagination.numberMin + 1 && Pagination.numberMin >= 2) {
      Pagination.numberMin -= 1;
      Pagination.numberMax -= 1;
    }
    setPagination(Pagination);
    fetchData();
  }, [active]);

  function actionPagnition(action) {
    let Pagination = { ...pagination };
    Pagination.numberAktif = active;

    if (action == "frist") {
      Pagination.numberMin = 1;
      Pagination.numberMax = 6;
    } else if (action == "last") {
      Pagination.numberMin = otherData.total_pages - 5;
      Pagination.numberMax = otherData.total_pages;
    } else if (action == "next") {
      if (Pagination.numberMax <= otherData.total_pages - 3) {
        Pagination.numberMin += 5;
        Pagination.numberMax += 3;
      } else {
        Pagination.numberMin = otherData.total_pages - 5;
        Pagination.numberMax = otherData.total_pages;
      }
    } else if (action == "prev") {
      if (Pagination.numberMin >= 3) {
        Pagination.numberMin -= 3;
        Pagination.numberMax -= 5;
      } else {
        Pagination.numberMin = 1;
        Pagination.numberMax = 6;
      }
    }
    setPagination(Pagination);
  }

  function SearchFunction() {
    var valueSearch = document.getElementById("search").value;
    navigate("?page=1&search=" + valueSearch);
    fetchData();
  }

  document.onkeydown = (event) => {
    if (event.key == "Enter") {
      SearchFunction();
    }
  };

  if (otherData.total_pages < 6) {
    for (
      let number = pagination.numberMin;
      number <= otherData.total_pages;
      number++
    ) {
      items.push(
        <Pagination.Item
          key={number}
          active={number == active}
          onClick={() => {
            if (search) {
              navigate("?page=" + number + "&search=" + search);
            } else {
              navigate("?page=" + number);
            }
          }}
        >
          {number}
        </Pagination.Item>
      );
    }
  } else {
    for (
      let number = pagination.numberMin;
      number <= pagination.numberMax;
      number++
    ) {
      items.push(
        <Pagination.Item
          key={number}
          active={number == active}
          onClick={() => {
            if (search) {
              navigate("?page=" + number + "&search=" + search);
            } else {
              navigate("?page=" + number);
            }
          }}
        >
          {number}
        </Pagination.Item>
      );
    }
  }

  function tambah_62(nomer) {
    let nomerString = nomer.toString().trim();
    nomerString = nomerString.replace("<br>", "");
    if (nomerString.startsWith("8")) {
      return "62" + nomerString;
    } else if (nomerString.startsWith("0")) {
      return "62" + nomerString.slice(1);
    } else {
      return nomerString;
    }
  }

  function gotoWhatsapp(number, nama) {
    let numberSplit = number.split("/");
    if (number != "") {
      if (numberSplit.length == 1) {
        Swal.fire({
          html: "<p class='fw-bold'>Anda Ingin Menghubungi " + nama + "?",
          icon: "info",
          showCancelButton: true,
          confirmButtonText:
            '<i class="fa-brands fa-whatsapp"></i> ' +
            tambah_62(numberSplit[0]),
          confirmButtonColor: "#157347",
        }).then((response) => {
          if (response.isConfirmed) {
            let nomerString = numberSplit[0].toString();
            if (
              nomerString.includes("E") ||
              nomerString.includes("e") ||
              nomerString == "" ||
              nomerString == " "
            ) {
              Swal.fire({
                title: "Nomer Kemungkinan Rusak!!",
                icon: "error",
              });
            } else {
              window.open(
                "https://api.whatsapp.com/send/?phone=" +
                  tambah_62(numberSplit[0]) +
                  "&text&type=phone_number&app_absent=0"
              );
            }
          }
        });
      } else {
        Swal.fire({
          html:
            "<p class='fw-bold'>Anda Ingin Menghubungi " +
            nama +
            "?</p> <p>Pilih salah satu nomer dibawah ini</p>",
          icon: "info",
          showCancelButton: true,
          showDenyButton: true,
          confirmButtonText:
            '<i class="fa-brands fa-whatsapp"></i> ' +
            tambah_62(numberSplit[0]),
          denyButtonText:
            '<i class="fa-brands fa-whatsapp"></i> ' +
            tambah_62(numberSplit[1]),
          denyButtonColor: "#157347",
          confirmButtonColor: "#157347",
        }).then((response) => {
          if (response.isConfirmed) {
            let nomerString = numberSplit[0].toString();
            if (
              nomerString.includes("E") ||
              nomerString.includes("e") ||
              nomerString == "" ||
              nomerString == " "
            ) {
              Swal.fire({
                title: "Nomer Kemungkinan Rusak!!",
                icon: "error",
              });
            } else {
              window.open(
                "https://api.whatsapp.com/send/?phone=" +
                  tambah_62(numberSplit[0]) +
                  "&text&type=phone_number&app_absent=0"
              );
            }
          }
          if (response.isDenied) {
            let nomerString = numberSplit[1].toString();
            if (
              nomerString.includes("E") ||
              nomerString.includes("e") ||
              nomerString == "" ||
              nomerString == " "
            ) {
              Swal.fire({
                title: "Nomer Kemungkinan Rusak!!",
                icon: "error",
              });
            } else {
              window.open(
                "https://api.whatsapp.com/send/?phone=" +
                  tambah_62(numberSplit[1]) +
                  "&text&type=phone_number&app_absent=0"
              );
            }
          }
        });
      }
    }
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  function AddSiswa(func) {
    let dataInput = [];
    let JsonInputSiswa = inputData.siswa;
    if (func == "add") {
      JsonInputSiswa.map((item, index) => {
        if (item.type != "dropdown") {
          dataInput.push(
            <FloatingLabel
              key={index}
              controlId={item.name}
              label={item.placeholder}
              required
              name={item.name}
              className={item.name == "TipeKelas" ? "mb-1 form-Kelas" : "mb-1"}
            >
              <Form.Control type={item.type} placeholder={item.placeholder} />
              <Form.Control.Feedback type="invalid" align="left">
                Harap isi {item.placeholder} atau tanda “-” untuk kosong
              </Form.Control.Feedback>
            </FloatingLabel>
          );
        } else {
          let Kelas = [];
          for (let index = item.minValue; index <= item.maxValue; index++) {
            Kelas.push(
              <option defaultValue={index} key={index}>
                Kelas {index}
              </option>
            );
          }
          dataInput.push(
            <Form.Select
              key={index}
              aria-label="Default select example"
              className="mb-1 form-selectClass"
              id={item.name}
              name={item.name}
            >
              <option>Pilih Kelas</option>
              {Kelas}
              <Form.Control.Feedback type="invalid">
                Harap pilih kelas
              </Form.Control.Feedback>
            </Form.Select>
          );
        }
      });
      SwalReactContent.fire({
        title: <p>Tambah Data Siswa</p>,
        html: (
          <Form
            noValidate
            validated={validated}
            id="form-add"
            onSubmit={handleSubmit}
          >
            {...dataInput}
          </Form>
        ),
        confirmButtonColor: "#157347",
        confirmButtonText: "Simpan",
        showCancelButton: true,
        cancelButtonColor: "#bb2d3b",
        cancelButtonText: "Batal",
        allowOutsideClick: false,
        preConfirm: () => {
          let inputs = document.querySelectorAll(
            "#form-add input, #form-add select"
          );
          let isEmpty = [...inputs].some((input) => {
            input.classList.remove("is-invalid");
            input.classList.remove("is-valid");

            if (input.value === "" || input.value === "Pilih Kelas") {
              input.classList.add("is-invalid");
              input.setAttribute("autoFocus", "");
              return true;
            } else {
              input.classList.add("is-valid");
              input.removeAttribute("autoFocus");
              return false;
            }
          });
          if (isEmpty) {
            return false;
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const user = document.getElementById("Username").value;
          const nama = document.getElementById("Nama").value;
          const lahir = document.getElementById("TanggalLahir").value;
          const sekolah = document.getElementById("AsalSekolah").value;
          const nohp = document.getElementById("NoHP").value;
          let kelas = document.getElementById("Kelas").value;
          kelas = kelas.replace("Kelas ", "");
          const tipekelas = document.getElementById("TipeKelas").value;
          const secondaryKelas =
            document.getElementById("SecondaryKelas").value;
          const program = document.getElementById("Program").value;
          const ortu = document.getElementById("NamaOrtu").value;
          const alamat = document.getElementById("Alamat").value;
          const tlp_ortu = document.getElementById("tlpOrtu").value;
          const pekerjaan = document.getElementById("Pekerjaan").value;
          const pass = document.getElementById("Password").value;

          let formData = new FormData();
          formData.append("user", user);
          formData.append("nama", nama);
          formData.append("kelas", kelas);
          formData.append("tipekelas", tipekelas);
          formData.append("sekolah", sekolah);
          formData.append("lahir", lahir);
          formData.append("ortu", ortu);
          formData.append("alamat", alamat);
          formData.append("nohp", nohp);
          formData.append("pass", pass);
          formData.append("secondary_kelas", secondaryKelas);
          formData.append("program", program);
          formData.append("tlp_ortu", tlp_ortu);
          formData.append("pekerjaan", pekerjaan);
          setLoading(true);
          axios({
            method: "post",
            url: `${import.meta.env.VITE_BASEURL}/siswa.php?add`,
            data: formData,
          })
            .then(function (response) {
              if (response.data == "Berhasil") {
                Swal.fire({
                  title: "Berhasil Menyimpan Siswa",
                  icon: "success",
                  showConfirmButton: false,
                  timer: 1000,
                });
              } else {
                Swal.fire({
                  title: response.data,
                  icon: "error",
                });
              }
            })
            .catch((err) => {
              Swal.fire({
                title: err,
                icon: "error",
              });
            })
            .finally(() => {
              setLoading(false);
              fetchData();
            });
        }
      });
    }
  }

  const anEditTable = (index, e) => {
    let item = DataSiswa[index];
    let newDataInput = { ...newData };
    let tr = e.target.parentElement;
    const tds = tr.querySelectorAll("td");
    for (let i = 0; i < tds.length; i++) {
      if (i == 0) {
        newDataInput.user = tds[i].innerHTML;
      } else if (i == 1) {
        newDataInput.nama = tds[i].innerHTML;
      } else if (i == 2) {
        newDataInput.lahir = tds[i].innerHTML;
      } else if (i == 3) {
        newDataInput.sekolah = tds[i].innerHTML;
      } else if (i == 4) {
        newDataInput.hp = tds[i].innerHTML;
      } else if (i == 5) {
        newDataInput.kelas = tds[i].innerHTML;
      } else if (i == 6) {
        newDataInput.tipekelas = tds[i].innerHTML;
      } else if (i == 7) {
        newDataInput.secondary_kelas = tds[i].innerHTML;
      } else if (i == 8) {
        newDataInput.program = tds[i].innerHTML;
      } else if (i == 9) {
        newDataInput.orang_tua = tds[i].innerHTML;
      } else if (i == 10) {
        newDataInput.alamat = tds[i].innerHTML;
      } else if (i == 11) {
        newDataInput.tlp_ortu = tds[i].innerHTML;
      } else if (i == 12) {
        newDataInput.pekerjaan = tds[i].innerHTML;
      } else if (i == 13) {
        newDataInput.pass = tds[i].innerHTML;
      }
    }
    newDataInput.userOld = item.username;
    setNewData(newDataInput);
    setActionButton(index);
  };

  function editData() {
    let formData = new FormData();
    formData.append("user", newData.user);
    formData.append("nama", newData.nama);
    formData.append("kelas", newData.kelas);
    formData.append("tipekelas", newData.tipekelas);
    formData.append("sekolah", newData.sekolah);
    formData.append("lahir", newData.lahir);
    formData.append("ortu", newData.orang_tua);
    formData.append("alamat", newData.alamat);
    formData.append("nohp", newData.hp);
    formData.append("pass", newData.pass);
    formData.append("secondary_kelas", newData.secondary_kelas);
    formData.append("program", newData.program);
    formData.append("tlp_ortu", newData.tlp_ortu);
    formData.append("pekerjaan", newData.pekerjaan);
    formData.append("userOld", newData.userOld);

    Swal.fire({
      title: "Apakah anda mau merubah data " + newData.nama,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Lanjut Edit",
      cancelButtonText: "Tidak Jadi",
      confirmButtonColor: "#157347",
      cancelButtonColor: "#bb2d3b",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        axios({
          method: "post",
          url: `${import.meta.env.VITE_BASEURL}/siswa.php?update`,
          data: formData,
        })
          .then(function (response) {
            setActionButton(-1);
          })
          .catch((err) => {
            Swal.fire({
              title: err,
              icon: "error",
            });
          })
          .finally(() => {
            setLoading(false);
            fetchData();
          });
      }
    });
  }

  function deleteData(user, nama) {
    Swal.fire({
      title: "Apakah anda mau Menghapus data " + nama,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Lanjut Delete",
      cancelButtonText: "Tidak Jadi",
      confirmButtonColor: "#fd4053",
      cancelButtonColor: "#22bf76",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        let formData = new FormData();
        formData.append("user", user);
        setLoading(true);
        axios({
          method: "post",
          url: `${import.meta.env.VITE_BASEURL}/siswa.php?delete`,
          data: formData,
        })
          .then(function (response) {
            setActionButton(-1);
            if (response.data == "Berhasil") {
              Swal.fire({
                title: "Berhasil Menghapus " + nama,
                icon: "success",
                showConfirmButton: false,
                timer: 1000,
              });
            } else {
              Swal.fire({
                title: response.data,
                icon: "error",
              });
            }
          })
          .catch((err) => {
            Swal.fire({
              title: err,
              icon: "error",
            });
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
      <div align="right" className="w-element-admin">
        <InputGroup
          className={
            width < 420 ? "mb-3 w-85" : width < 900 ? "mb-3 w-50" : "mb-3 w-25"
          }
        >
          <button
            className="btn btn-primary"
            name="addSiswa"
            onClick={() => {
              navigate("importexcell");
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
            </svg>
          </button>
          <button
            className="btn btn-warning"
            name="addSiswa"
            onClick={() => {
              AddSiswa("add");
            }}
          >
            <i className="fa-solid fa-user-plus"></i>
          </button>
          <Form.Control
            placeholder="Cari Data Siswa"
            aria-label="dataSiswa"
            aria-describedby="dataSiswa"
            className="border border-success"
            id="search"
            defaultValue={search != null || search != undefined ? search : ""}
          />
          <button
            className="btn btn-success"
            name="addSiswa"
            onClick={() => {
              SearchFunction();
            }}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </InputGroup>
      </div>
      <Pagination className="pagination-top" size="sm" hidden={width < 450}>
        {pagination.numberMin > 1 ? (
          <>
            <Pagination.First
              onClick={() => {
                actionPagnition("frist");
              }}
            />
            <Pagination.Prev
              onClick={() => {
                actionPagnition("prev");
              }}
            />
          </>
        ) : (
          ""
        )}
        {items}
        {pagination.numberMax < otherData.total_pages ? (
          <>
            <Pagination.Next
              onClick={() => {
                actionPagnition("next");
              }}
            />
            <Pagination.Last
              onClick={() => {
                actionPagnition("last");
              }}
            />
          </>
        ) : (
          ""
        )}
      </Pagination>
      <span className="fw-bolder">Total Result: {otherData.data_records}</span>
      &ensp;
      <span className="fw-bolder">Total Siswa: {otherData.total_records}</span>
      <div className="tableData w-element-admin">
        <table className="table table-striped">
          <thead className="table-info">
            <tr>
              <th>Induk</th>
              <th>Nama</th>
              <th>Tanggal Lahir</th>
              <th>Asal Sekolah</th>
              <th>No HP</th>
              <th colSpan="2">Kelas</th>
              <th>Secondary Kelas</th>
              <th>Program</th>
              <th>Nama Ortu</th>
              <th>Alamat</th>
              <th>Tlp Ortu</th>
              <th>Pekerjaan</th>
              <th>Password</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {DataSiswa.map((item, index) => (
              <tr
                key={index}
                onInput={(e) => anEditTable(index, e)}
                className={actionButton == index ? "table-warning" : ""}
                onMouseOver={(e) =>
                  e.target.parentElement.classList.add("table-secondary")
                }
                onMouseLeave={(e) =>
                  e.target.parentElement.classList.remove("table-secondary")
                }
              >
                <td
                  contentEditable="true"
                  dangerouslySetInnerHTML={{ __html: item.username }}
                ></td>

                <td
                  contentEditable="true"
                  className="w-25"
                  dangerouslySetInnerHTML={{ __html: item.nama }}
                ></td>

                <td
                  contentEditable="true"
                  className="w-15"
                  dangerouslySetInnerHTML={{ __html: item.Tanggal_lahir }}
                ></td>

                <td
                  contentEditable="true"
                  dangerouslySetInnerHTML={{ __html: item.asal_sekolah }}
                ></td>

                <td
                  contentEditable="true"
                  onClick={() => gotoWhatsapp(item.no_hp, item.nama)}
                  dangerouslySetInnerHTML={{ __html: item.no_hp }}
                ></td>

                <td
                  contentEditable="true"
                  align="right"
                  dangerouslySetInnerHTML={{ __html: item.kelas }}
                ></td>

                <td
                  contentEditable="true"
                  className="w-25"
                  dangerouslySetInnerHTML={{ __html: item.tipeKelas }}
                ></td>

                <td
                  contentEditable="true"
                  dangerouslySetInnerHTML={{ __html: item.secondary_kelas }}
                ></td>

                <td
                  contentEditable="true"
                  dangerouslySetInnerHTML={{ __html: item.program }}
                ></td>

                <td
                  contentEditable="true"
                  className="w-15"
                  dangerouslySetInnerHTML={{ __html: item.orang_tua }}
                ></td>

                <td
                  contentEditable="true"
                  className="w-15"
                  dangerouslySetInnerHTML={{ __html: item.alamat }}
                ></td>

                <td
                  contentEditable="true"
                  className="w-15"
                  dangerouslySetInnerHTML={{ __html: item.tlp_ortu }}
                ></td>

                <td
                  contentEditable="true"
                  className="w-15"
                  dangerouslySetInnerHTML={{ __html: item.pekerjaan }}
                ></td>

                <td
                  contentEditable="true"
                  dangerouslySetInnerHTML={{ __html: item.password }}
                ></td>

                <td
                  align="center"
                  onMouseLeave={(e) =>
                    e.target.classList.remove("table-secondary")
                  }
                >
                  <button
                    className="btn btn-sm btn-danger"
                    name={item.username}
                    hidden={actionButton == index}
                    onClick={() => {
                      deleteData(item.username, item.nama);
                    }}
                  >
                    <i
                      className="fa-solid fa-trash"
                      onMouseLeave={(e) =>
                        e.target.classList.remove("table-secondary")
                      }
                    ></i>
                  </button>
                  <button
                    name={item.name}
                    className="btn btn-sm btn-success"
                    hidden={actionButton != index}
                    onClick={() => {
                      editData();
                    }}
                  >
                    <i className="fa-solid fa-check fa-bounce"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div align="center" className="w-element-admin mt-2">
        <Pagination className="pagination" size="sm">
          {pagination.numberMin > 1 ? (
            <>
              <Pagination.First
                onClick={() => {
                  actionPagnition("frist");
                }}
              />
              <Pagination.Prev
                onClick={() => {
                  actionPagnition("prev");
                }}
              />
            </>
          ) : (
            ""
          )}
          {items}
          {pagination.numberMax < otherData.total_pages ? (
            <>
              <Pagination.Next
                onClick={() => {
                  actionPagnition("next");
                }}
              />
              <Pagination.Last
                onClick={() => {
                  actionPagnition("last");
                }}
              />
            </>
          ) : (
            ""
          )}
        </Pagination>
      </div>
    </div>
  );
};
export default Siswa;
