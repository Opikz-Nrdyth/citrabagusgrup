import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dropdown, FloatingLabel, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const TabelTryout = ({ setLoading }) => {
  const width = window.screen.width;
  const UrlParams = new URLSearchParams(document.location.search);
  const Search = UrlParams.get("search");
  const SwalReactContent = withReactContent(Swal);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [URL, setURL] = useState(
    `${import.meta.env.VITE_BASEURL}/ujian.php?read_ujian`
  );
  const prevSearch = useRef(null);

  // Fetch data dari API
  const fetchData = useCallback(async () => {
    const response = await axios.get(URL);
    setData(response.data);
    if (response.status == 200) {
      setLoading(false);
    }
  }, [URL]);

  // Meload fungsi Fetch pertama kali
  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  // Meload fungsi Fetch ketika terdapat search
  useEffect(() => {
    if (Search == null || Search == "null") {
      setURL(`${import.meta.env.VITE_BASEURL}/ujian.php?read_ujian`);
    } else {
      setURL(
        `${import.meta.env.VITE_BASEURL}/ujian.php?read_ujian&search=${Search}`
      );
    }
    if (Search !== prevSearch.current) {
      fetchData();
      prevSearch.current = Search;
    }
  }, [Search, fetchData]);

  function searchFunction() {
    let search = document.getElementById("search").value;
    if (search == "" || search == " ") {
      navigate(`ujian`);
    } else {
      navigate(`?search=${search}`);
    }
  }

  document.onkeydown = (event) => {
    if (event.key == "Enter") {
      searchFunction();
    }
  };

  function Adddata() {
    SwalReactContent.fire({
      title: "Tambah Data Ujian",
      html: (
        <div style={{ overflow: "hidden" }}>
          <FloatingLabel controlId="Ujian" label="Ujian" className="mb-2">
            <Form.Control
              type="text"
              placeholder="Ujian"
              defaultValue="test"
            ></Form.Control>
          </FloatingLabel>
          <FloatingLabel controlId="Mapel" label="Mapel" className="mb-2">
            <Form.Control type="text" placeholder="Ujian"></Form.Control>
          </FloatingLabel>

          <FloatingLabel controlId="Kelas" label="Kelas" className="mb-2">
            <Form.Select
              aria-label="Floating label select example"
              style={{ fontSize: "13px" }}
            >
              <option defaultValue="">Pilih Kelas</option>
              <option defaultValue="1">1</option>
              <option defaultValue="2">2</option>
              <option defaultValue="3">3</option>
              <option defaultValue="4">4</option>
              <option defaultValue="5">5</option>
              <option defaultValue="6">6</option>
              <option defaultValue="7">7</option>
              <option defaultValue="8">8</option>
              <option defaultValue="9">9</option>
              <option defaultValue="10">10</option>
              <option defaultValue="11">11</option>
              <option defaultValue="12">12</option>
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel controlId="Tanggal" label="Tanggal" className="mb-2">
            <Form.Control type="date" placeholder="Ujian"></Form.Control>
          </FloatingLabel>

          <div className="row g-1">
            <FloatingLabel
              controlId="JamMulai"
              label="Jam Mulai"
              className="col-6"
            >
              <Form.Control type="time" placeholder="Ujian"></Form.Control>
            </FloatingLabel>
            <FloatingLabel
              controlId="JamSelesai"
              label="Jam Selesai"
              className="col-6"
            >
              <Form.Control type="time" placeholder="Ujian"></Form.Control>
            </FloatingLabel>
          </div>
        </div>
      ),
      confirmButtonColor: "#157347",
      confirmButtonText: "Simpan",
      showCancelButton: true,
      cancelButtonColor: "#bb2d3b",
      cancelButtonText: "Batal",
      allowOutsideClick: false,
    }).then((res) => {
      if (res.isConfirmed) {
        const ujian = document.getElementById("Ujian").value;
        const mapel = document.getElementById("Mapel").value;
        const kelas = document.getElementById("Kelas").value;
        const tanggal = document.getElementById("Tanggal").value;
        const jam_mulai = document.getElementById("JamMulai").value;
        const jam_selesai = document.getElementById("JamSelesai").value;

        let formData = new FormData();
        formData.append("ujian", ujian);
        formData.append("mapel", mapel);
        formData.append("kelas", kelas);
        formData.append("tanggal", tanggal);
        formData.append("jam_mulai", jam_mulai);
        formData.append("jam_selesai", jam_selesai);
        formData.append("status", "hidden");
        setLoading(true);
        axios({
          method: "post",
          url: `${import.meta.env.VITE_BASEURL}/ujian.php?create_ujian`,
          data: formData,
        })
          .then((response) => {
            fetchData();
            if (response.data == "Berhasil") {
              Swal.fire({
                icon: "success",
                title: "Berhasil Menambah Data Ujian",
                showConfirmButton: false,
                timer: 1500,
              });
            } else {
              Swal.fire({
                icon: "error",
                title: `Error: ${response.data}`,
              });
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  }

  function EditData(
    id,
    ujian,
    mapel,
    kelas,
    tanggal,
    jam_mulai,
    jam_selesai,
    status
  ) {
    SwalReactContent.fire({
      title: "Edit Data Ujian",
      html: (
        <div style={{ overflow: "hidden" }}>
          <FloatingLabel controlId="Ujian" label="Ujian" className="mb-2">
            <Form.Control
              type="text"
              placeholder="Ujian"
              defaultValue={ujian}
            ></Form.Control>
          </FloatingLabel>
          <FloatingLabel controlId="Mapel" label="Mapel" className="mb-2">
            <Form.Control
              type="text"
              placeholder="Ujian"
              defaultValue={mapel}
            ></Form.Control>
          </FloatingLabel>

          <FloatingLabel controlId="Kelas" label="Kelas" className="mb-2">
            <Form.Select
              aria-label="Floating label select example"
              style={{ fontSize: "13px" }}
            >
              <option defaultValue="">Pilih Kelas</option>
              <option selected={kelas == 1} value="1">
                1
              </option>
              <option selected={kelas == 2} value="2">
                2
              </option>
              <option selected={kelas == 3} value="3">
                3
              </option>
              <option selected={kelas == 4} value="4">
                4
              </option>
              <option selected={kelas == 5} value="5">
                5
              </option>
              <option selected={kelas == 6} value="6">
                6
              </option>
              <option selected={kelas == 7} value="7">
                7
              </option>
              <option selected={kelas == 8} value="8">
                8
              </option>
              <option selected={kelas == 9} value="9">
                9
              </option>
              <option selected={kelas == 10} value="10">
                10
              </option>
              <option selected={kelas == 11} value="11">
                11
              </option>
              <option selected={kelas == 12} value="12">
                12
              </option>
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel controlId="Tanggal" label="Tanggal" className="mb-2">
            <Form.Control
              type="date"
              placeholder="Ujian"
              defaultValue={tanggal}
            ></Form.Control>
          </FloatingLabel>

          <div className="row g-1">
            <FloatingLabel
              controlId="JamMulai"
              label="Jam Mulai"
              className="col-6"
            >
              <Form.Control
                type="time"
                defaultValue={jam_mulai}
                placeholder="Ujian"
              ></Form.Control>
            </FloatingLabel>
            <FloatingLabel
              controlId="JamSelesai"
              label="Jam Selesai"
              className="col-6"
            >
              <Form.Control
                type="time"
                defaultValue={jam_selesai}
                placeholder="Ujian"
              ></Form.Control>
            </FloatingLabel>

            <FloatingLabel controlId="status" label="Status" className="mb-2">
              <Form.Select
                aria-label="Floating label select example"
                style={{ fontSize: "13px" }}
              >
                <option selected={status == "hidden"} value="hidden">
                  Hidden
                </option>
                <option selected={status == "stop"} value="stop">
                  Stop
                </option>
                <option selected={status == "preview"} value="preview">
                  Preview
                </option>
                <option selected={status == "online"} value="online">
                  Online
                </option>
              </Form.Select>
            </FloatingLabel>
          </div>
        </div>
      ),
      confirmButtonColor: "#157347",
      confirmButtonText: "Simpan",
      showCancelButton: true,
      cancelButtonColor: "#bb2d3b",
      cancelButtonText: "Batal",
      allowOutsideClick: false,
    }).then((res) => {
      if (res.isConfirmed) {
        const ujian_input = document.getElementById("Ujian").value;
        const mapel_input = document.getElementById("Mapel").value;
        const kelas_input = document.getElementById("Kelas").value;
        const tanggal = document.getElementById("Tanggal").value;
        const jam_mulai = document.getElementById("JamMulai").value;
        const jam_selesai = document.getElementById("JamSelesai").value;
        const status = document.getElementById("status").value;

        let formData = new FormData();
        formData.append("id", id);
        formData.append("ujian", ujian_input);
        formData.append("ujian_lama", ujian);
        formData.append("mapel", mapel_input);
        formData.append("mapel_lama", mapel);
        formData.append("kelas", kelas_input);
        formData.append("kelas_lama", kelas);
        formData.append("tanggal", tanggal);
        formData.append("jam_mulai", jam_mulai);
        formData.append("jam_selesai", jam_selesai);
        formData.append("status", status.toLowerCase());
        setLoading(true);
        axios({
          method: "post",
          url: `${import.meta.env.VITE_BASEURL}/ujian.php?update_ujian`,
          data: formData,
        })
          .then((response) => {
            fetchData();
            if (response.data == "Berhasil") {
              Swal.fire({
                icon: "success",
                title: "Berhasil Merubah Data",
                showConfirmButton: false,
                timer: 1500,
              });
            } else {
              Swal.fire({
                icon: "error",
                title: `Error: ${response.data}`,
              });
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  }

  function EditStatus(id, status) {
    let formData = new FormData();
    formData.append("id", id);
    formData.append("status", status);
    setLoading(true);
    axios({
      method: "post",
      url: `${import.meta.env.VITE_BASEURL}/ujian.php?update_status`,
      data: formData,
    })
      .then((response) => {
        fetchData();
        if (response.data == "Berhasil") {
          Swal.fire({
            icon: "success",
            title: "Berhasil Merubah Data",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: `Error: ${response.data}`,
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function DeleteData(id, ujian, mapel, kelas) {
    Swal.fire({
      icon: "info",
      title: `Anda yakin ingin menghapus ${mapel} dari ${ujian}`,
      confirmButtonColor: "#bb2d3b",
      confirmButtonText: "Hapus",
      showCancelButton: true,
      cancelButtonColor: "#157347",
      cancelButtonText: "Batal",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        let formData = new FormData();
        formData.append("id", id);
        formData.append("ujian", ujian);
        formData.append("mapel", mapel);
        formData.append("kelas", kelas);
        setLoading(true);
        axios({
          method: "post",
          url: `${import.meta.env.VITE_BASEURL}/ujian.php?delete_ujian`,
          data: formData,
        })
          .then((response) => {
            fetchData();
            if (response.data == "Berhasil") {
              Swal.fire({
                icon: "success",
                title: "Berhasil Menghapus Data",
                showConfirmButton: false,
                timer: 1500,
              });
            } else {
              Swal.fire({
                icon: "error",
                title: `Error: ${response.data}`,
              });
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  }

  return (
    <React.Fragment>
      <div align="right" className="w-element-admin">
        <InputGroup
          className={
            width < 450 ? "mb-3 w-100" : width < 850 ? "mb-3 w-50" : "mb-3 w-25"
          }
        >
          <button className="btn btn-warning" onClick={Adddata}>
            <i className="fa-solid fa-folder-plus"></i>
          </button>
          <Form.Control
            placeholder="Cari Data..."
            aria-label="Search"
            aria-describedby="basic-addon1"
            id="search"
          />
          <button
            className="btn btn-success"
            onClick={() => {
              searchFunction();
            }}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </InputGroup>
      </div>

      {/* Table */}
      <div
        className={
          width < 450 ? "tabel-data w-element-admin" : "w-element-admin"
        }
      >
        <table className="table table-striped">
          <thead className="table-info">
            {Search == null || Search == "null" ? (
              <tr>
                <th>Ujian</th>
              </tr>
            ) : (
              <tr>
                <th>Mata Pelajaran</th>
                <th>Kelas</th>
                <th>Tanggal</th>
                <th>Jam</th>
                <th>Ujian</th>
                <th>Partisipan</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            )}
          </thead>
          <tbody>
            {data.map((item, index) => (
              <React.Fragment key={index}>
                {Search == null || Search == "null" ? (
                  <tr
                    className="picker"
                    onClick={() => {
                      document.getElementById("search").value = item.nama_ujian;
                      navigate(`?search=${item.nama_ujian}`);
                    }}
                    onMouseOver={(e) =>
                      e.target.parentElement.classList.add("table-secondary")
                    }
                    onMouseLeave={(e) =>
                      e.target.parentElement.classList.remove("table-secondary")
                    }
                  >
                    <td>
                      <i className="fa-regular fa-folder-open"></i>{" "}
                      {item.nama_ujian}
                    </td>
                  </tr>
                ) : (
                  <tr
                    onMouseOver={(e) =>
                      e.target.parentElement.classList.add("table-secondary")
                    }
                    onMouseLeave={(e) =>
                      e.target.parentElement.classList.remove("table-secondary")
                    }
                  >
                    <td
                      className="picker"
                      onClick={() => {
                        navigate(
                          `inputsoal?ujian=${item.nama_ujian}&mapel=${item.mapel}&kelas=${item.kelas}`
                        );
                        setLoading(true);
                      }}
                    >
                      <i className="fa-regular fa-folder-open"></i> {item.mapel}
                    </td>
                    <td>{item.kelas}</td>
                    <td>{item.tanggal}</td>
                    <td>
                      {item.jam_mulai} - {item.jam_selesai}
                    </td>
                    <td>{item.nama_ujian}</td>
                    <td
                      onMouseLeave={(e) =>
                        e.target.parentElement.classList.remove(
                          "table-secondary"
                        )
                      }
                    >
                      <button
                        className="btn btn-success w-50 btn-sm"
                        onClick={() => {
                          navigate(
                            `readUjian?ujian=${item.nama_ujian}&mapel=${item.mapel}&kelas=${item.kelas}&mulai=${item.tanggal} ${item.jam_mulai}:00`
                          );
                        }}
                      >
                        <i className="fa-solid fa-users"></i>
                      </button>
                    </td>
                    <td
                      onMouseLeave={(e) =>
                        e.target.parentElement.classList.remove(
                          "table-secondary"
                        )
                      }
                    >
                      <Dropdown>
                        <Dropdown.Toggle
                          variant={
                            item.status == "hidden" || item.status == "stop"
                              ? "danger"
                              : item.status == "preview"
                              ? "warning"
                              : "success"
                          }
                          className="btn-sm"
                          id="dropdown-basic"
                        >
                          {item.status}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => {
                              EditStatus(item.id, "online");
                            }}
                          >
                            Online
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              EditStatus(item.id, "preview");
                            }}
                          >
                            Preview
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              EditStatus(item.id, "stop");
                            }}
                          >
                            Stop
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              EditStatus(item.id, "hidden");
                            }}
                          >
                            Hidden
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                    <td
                      onMouseLeave={(e) =>
                        e.target.parentElement.classList.remove(
                          "table-secondary"
                        )
                      }
                    >
                      <button
                        className="btn btn-warning btn-sm me-1"
                        onClick={() => {
                          EditData(
                            item.id,
                            item.nama_ujian,
                            item.mapel,
                            item.kelas,
                            item.tanggal,
                            item.jam_mulai,
                            item.jam_selesai,
                            item.status
                          );
                        }}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          DeleteData(
                            item.id,
                            item.nama_ujian,
                            item.mapel,
                            item.kelas
                          );
                        }}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
};
export default TabelTryout;
