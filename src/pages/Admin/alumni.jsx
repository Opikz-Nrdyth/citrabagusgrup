import { FloatingLabel, Form, InputGroup, Pagination } from "react-bootstrap";
import "../../assets/Style/Admin/siswa.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import inputData from "../../json/inputData.json";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Alumni = ({ setLoading }) => {
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
    let url = `${
      import.meta.env.VITE_BASEURL
    }/alumni.php?readAlumni&page=${active}`;
    if (search != null) {
      url = `${
        import.meta.env.VITE_BASEURL
      }/alumni.php?readAlumni&page=${active}&search=${search}`;
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
          url: `${import.meta.env.VITE_BASEURL}/alumni.php?delete`,
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
          <Form.Control
            placeholder="Cari Data Alumni"
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
      <span className="fw-bolder">Total Alumni: {otherData.total_records}</span>
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

export default Alumni;
