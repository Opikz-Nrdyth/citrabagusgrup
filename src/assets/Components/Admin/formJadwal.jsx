import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import { Button, Popup } from "semantic-ui-react";
import Swal from "sweetalert2";
import { StateContext } from "../../../pages/Admin/jadwal";

const FormJadwal = ({ setLoading, day, clock }) => {
  const [listKelas, setListKelas] = useState([]);
  const [dataJadwal, setDataJadwal] = useState([]);
  const width = window.screen.width;
  const {
    inputJadwal,
    setinputJadwal,
    Colabs,
    setColabs,
    setBtnKirim,
    btnKirim,
    idUpdate,
  } = useContext(StateContext);

  useEffect(() => {
    // List Kelas
    axios({
      method: "get",
      url: `${import.meta.env.VITE_BASEURL}/jadwal.php?listKelas`,
      responseType: "json",
    })
      .then(function (response) {
        setListKelas(response.data);
      })
      .catch((err) => {
        Swal.fire({
          title: err,
          icon: "error",
        });
      });
  }, [listKelas]);

  useEffect(() => {
    // List Data
    axios({
      method: "get",
      url: `${
        import.meta.env.VITE_BASEURL
      }/jadwal.php?jadwal&tanggal=${day}&jam=${clock}`,
      responseType: "json",
    })
      .then(function (response) {
        setDataJadwal(response.data);
      })
      .catch((err) => {
        Swal.fire({
          title: err,
          icon: "error",
        });
      });
  }, [dataJadwal]);

  const cekExistRuangan = (value) =>
    dataJadwal.Data?.RuanganTidakTersedia?.some(
      (item) => item.ruangan == value
    );

  const cekExistTentor = (value) =>
    dataJadwal.Data?.PengajarTidakTersedia?.some(
      (item) => item.pengajar == value
    );

  function addData(value) {
    let htmlData = "";
    if (value == "kelas") {
      htmlData =
        '<div class="form-floating mb-3">' +
        '<input type="number" class="form-control" id="Kelas" placeholder="kelas">' +
        '<label for="Kelas">Kelas</label>' +
        "</div>" +
        '<div class="form-floating mb-3">' +
        '<input type="text" class="form-control" id="tipeKelas" placeholder="tipeKelas">' +
        '<label for="tipeKelas">Tipe Kelas</label>' +
        "</div>";
    }
    if (value == "mapel") {
      htmlData =
        '<div class="form-floating mb-3">' +
        '<input type="text" class="form-control" id="Mapel" placeholder="mapel">' +
        '<label for="Kelas">Mapel</label>' +
        "</div>";
    }
    if (value == "ruangan") {
      htmlData =
        '<div class="form-floating mb-3">' +
        '<input type="number" class="form-control" id="Ruangan" placeholder="ruangan">' +
        '<label for="Kelas">Ruangan</label>' +
        "</div>" +
        '<div class="form-floating mb-3">' +
        '<input type="number" class="form-control" id="Kapasitas" placeholder="Kapasitas">' +
        '<label for="tipeKelas">Kapasitas</label>' +
        "</div>";
    }
    Swal.fire({
      title: "Tambah Data " + value,
      html: htmlData,
      confirmButtonColor: "#157347",
      confirmButtonText: "Simpan",
      showCancelButton: true,
      cancelButtonColor: "#bb2d3b",
      cancelButtonText: "Batal",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed && value == "kelas") {
        let kelas = document.getElementById("Kelas");
        let Tipekelas = document.getElementById("tipeKelas");
        if (
          kelas.value <= 0 ||
          kelas.value == "" ||
          Tipekelas.value == "" ||
          Tipekelas.value == " "
        ) {
          Swal.fire({
            icon: "error",
            title: "Harap isi Semua Bidang",
          });
        } else {
          let formData = new FormData();
          formData.append("addKelas", "");
          formData.append("kelas", kelas.value);
          formData.append("tipeKelas", Tipekelas.value);
          setLoading(true);
          axios({
            method: "post",
            url: `${import.meta.env.VITE_BASEURL}/jadwal.php`,
            data: formData,
          })
            .then(function (response) {
              if (response.data == "Berhasil") {
                Swal.fire({
                  title: "Berhasil Menyimpan " + value,
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
            });
        }
      } else if (result.isConfirmed && value == "mapel") {
        let mapel = document.getElementById("Mapel");
        if (mapel.value == "" || mapel.value == " ") {
          Swal.fire({
            icon: "error",
            title: "Harap isi Semua Bidang",
          });
        } else {
          let formData = new FormData();
          formData.append("addMapel", "");
          formData.append("mapel", mapel.value);
          setLoading(true);
          axios({
            method: "post",
            url: `${import.meta.env.VITE_BASEURL}/jadwal.php`,
            data: formData,
          })
            .then(function (response) {
              if (response.data == "Berhasil") {
                Swal.fire({
                  title: "Berhasil Menyimpan " + value,
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
            });
        }
      } else if (result.isConfirmed && value == "ruangan") {
        let ruang = document.getElementById("Ruangan");
        let kapasitas = document.getElementById("Kapasitas");
        if (
          ruang.value <= 0 ||
          ruang.value == "" ||
          kapasitas.value <= 0 ||
          kapasitas.value == ""
        ) {
          Swal.fire({
            icon: "error",
            title: "Harap isi Semua Bidang",
          });
        } else {
          let formData = new FormData();
          formData.append("addRuangan", "");
          formData.append("ruangan", ruang.value);
          formData.append("kapasitas", kapasitas.value);
          setLoading(true);
          axios({
            method: "post",
            url: `${import.meta.env.VITE_BASEURL}/jadwal.php`,
            data: formData,
          })
            .then(function (response) {
              if (response.data == "Berhasil") {
                Swal.fire({
                  title: "Berhasil Menyimpan " + value,
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
            });
        }
      }
    });
  }

  let btnTambahan = document.querySelectorAll(".tambahan");
  btnTambahan.forEach((btn) => {
    btn.addEventListener("mousedown", (e) => {
      // menambahkan baris ini untuk mencegah klik kanan bawaan browser
      e.preventDefault();
      let Kelas = btn.getAttribute("kelas");
      let TipeKelas = btn.getAttribute("tipekelas");
      if (e.button == 2) {
        Swal.fire({
          title: "Hapus Kelas Tambahan " + Kelas + " " + TipeKelas,
          confirmButtonColor: "#bb2d3b",
          confirmButtonText: "Hapus",
          showCancelButton: true,
          cancelButtonColor: "#157347",
          cancelButtonText: "Batal",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            let formData = new FormData();
            formData.append("deleteKelas", "");
            formData.append("kelas", Kelas);
            formData.append("tipeKelas", TipeKelas);
            setLoading(true);
            axios({
              method: "post",
              url: `${import.meta.env.VITE_BASEURL}/jadwal.php`,
              data: formData,
            })
              .then(function (response) {
                if (response.data == "Berhasil") {
                  Swal.fire({
                    title: "Berhasil Menghapus Kelas Tambahan",
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
              });
          }
        });
        e.stopImmediatePropagation();
      }
    });
  });

  let btnMapel = document.querySelectorAll(".mapel");
  btnMapel.forEach((btn) => {
    btn.addEventListener("mousedown", (e) => {
      // menambahkan baris ini untuk mencegah klik kanan bawaan browser
      e.preventDefault();
      let Mapel = btn.getAttribute("mapel");
      if (e.button == 2) {
        Swal.fire({
          title: "Hapus Mapel " + Mapel,
          confirmButtonColor: "#bb2d3b",
          confirmButtonText: "Hapus",
          showCancelButton: true,
          cancelButtonColor: "#157347",
          cancelButtonText: "Batal",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            let formData = new FormData();
            formData.append("deleteMapel", "");
            formData.append("mapel", Mapel);
            setLoading(true);
            axios({
              method: "post",
              url: `${import.meta.env.VITE_BASEURL}/jadwal.php`,
              data: formData,
            })
              .then(function (response) {
                if (response.data == "Berhasil") {
                  Swal.fire({
                    title: "Berhasil Menghapus Mata Pelajaran",
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
              });
          }
        });
        e.stopImmediatePropagation();
      }
    });
  });

  let btnRuangan = document.querySelectorAll(".ruangan");
  btnRuangan.forEach((btn) => {
    btn.addEventListener("mousedown", (e) => {
      // menambahkan baris ini untuk mencegah klik kanan bawaan browser
      e.preventDefault();
      let Ruangan = btn.getAttribute("ruang");
      if (e.button == 2) {
        Swal.fire({
          title: "Hapus Ruangan " + Ruangan,
          confirmButtonColor: "#bb2d3b",
          confirmButtonText: "Hapus",
          showCancelButton: true,
          cancelButtonColor: "#157347",
          cancelButtonText: "Batal",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            let formData = new FormData();
            formData.append("deleteRuangan", "");
            formData.append("ruangan", Ruangan);
            setLoading(true);
            axios({
              method: "post",
              url: `${import.meta.env.VITE_BASEURL}/jadwal.php`,
              data: formData,
            })
              .then(function (response) {
                if (response.data == "Berhasil") {
                  Swal.fire({
                    title: "Berhasil Menghapus Ruangan",
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
              });
          }
        });
        e.stopImmediatePropagation();
      }
    });
  });

  function handlerAddKelas(kelas, jumlahSiswa) {
    let Jadwal = { ...inputJadwal };
    let cekKelas = Jadwal.kelas.split(" + ");
    if (Colabs == 1) {
      Jadwal.kelas = kelas;
      Jadwal.jumlahSiswa = jumlahSiswa;
    } else {
      if (cekKelas.includes(kelas)) {
      } else {
        Jadwal.kelas = Jadwal.kelas + " + " + kelas;
        Jadwal.jumlahSiswa =
          parseInt(Jadwal.jumlahSiswa) + parseInt(jumlahSiswa);
      }
    }

    setinputJadwal(Jadwal);
  }

  function setDataCollabs() {
    if (Colabs <= 2) {
      let colabs = Colabs;
      colabs++;
      setColabs(colabs);
    }

    if (Colabs == 2) {
      setColabs(1);
    }
  }

  function readKelasAviliable(Kelas) {
    let Jadwal = { ...inputJadwal };
    let kelas = Jadwal.kelas.split(" + ");
    if (kelas.includes(Kelas)) {
      return true;
    } else {
      return false;
    }
  }

  function handlerAddMapel(mapel) {
    let Jadwal = { ...inputJadwal };
    Jadwal.mapel = mapel;
    setinputJadwal(Jadwal);
  }

  function readMapelAviliable(Mapel) {
    let Jadwal = { ...inputJadwal };
    let mapel = Jadwal.mapel;
    if (mapel.includes(Mapel)) {
      return true;
    } else {
      return false;
    }
  }

  function handlerAddTentor(tentor) {
    let Jadwal = { ...inputJadwal };
    let cekExist = dataJadwal.Data?.PengajarTidakTersedia?.some(
      (item) => item.pengajar == tentor
    );

    if (cekExist) {
      Swal.fire({
        title: "Waduh tentor ini sudah kepakai!!",
        text: "Mau tetap Pakai?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Lanjut Pakai",
        cancelButtonText: "Tidak Jadi",
        confirmButtonColor: "#fd4053",
        cancelButtonColor: "#22bf76",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          Jadwal.tentor = tentor;
          setinputJadwal(Jadwal);
        }
      });
    } else {
      Jadwal.tentor = tentor;
      setinputJadwal(Jadwal);
    }
  }

  function readTentorAviliable(Tentor) {
    let Jadwal = { ...inputJadwal };
    let tentor = Jadwal.tentor;
    if (tentor.includes(Tentor)) {
      return true;
    } else {
      return false;
    }
  }

  function handlerAddRuang(ruang, kapasitas) {
    let Jadwal = { ...inputJadwal };
    let cekExist = dataJadwal.Data?.RuanganTidakTersedia?.some(
      (item) => item.ruangan == ruang
    );
    if (cekExist) {
      Swal.fire({
        title: "Waduh ruangan ini sudah kepakai!!",
        text: "Mau tetap Pakai?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Lanjut Pakai",
        cancelButtonText: "Tidak Jadi",
        confirmButtonColor: "#fd4053",
        cancelButtonColor: "#22bf76",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          Jadwal.ruang = ruang;
          Jadwal.jumlahKursi = kapasitas;
          setinputJadwal(Jadwal);
        }
      });
    } else {
      Jadwal.ruang = ruang;
      Jadwal.jumlahKursi = kapasitas;
      setinputJadwal(Jadwal);
    }
  }

  function readRuangAviliable(Ruang) {
    let Jadwal = { ...inputJadwal };
    let ruang = Jadwal.ruang;
    if (ruang.includes(Ruang)) {
      return true;
    } else {
      return false;
    }
  }

  function clearInput() {
    let Jadwal = { ...inputJadwal };
    Jadwal.kelas = "";
    Jadwal.jumlahKursi = 0;
    Jadwal.jumlahSiswa = 0;
    Jadwal.mapel = "";
    Jadwal.ruang = "";
    Jadwal.tentor = "";
    setinputJadwal(Jadwal);
  }

  function KirimInput() {
    let formData = new FormData();
    formData.append("addJadwal", "");
    formData.append("tanggal", day);
    formData.append("jam", clock);
    formData.append("kelas", inputJadwal.kelas);
    formData.append("mapel", inputJadwal.mapel);
    formData.append("tentor", inputJadwal.tentor);
    formData.append("ruangan", inputJadwal.ruang);
    formData.append("jumlah_siswa", inputJadwal.jumlahSiswa);
    formData.append("jumlah_kursi", inputJadwal.jumlahKursi);

    if (parseInt(inputJadwal.jumlahSiswa) > parseInt(inputJadwal.jumlahKursi)) {
      Swal.fire({
        title: "Jumlah siswa melebihi kapasitas umum kursi",
        icon: "info",
        confirmButtonColor: "#fd4053",
        confirmButtonText: "Simpan",
        showCancelButton: true,
        cancelButtonColor: "#157347",
        cancelButtonText: "Batal",
        allowOutsideClick: false,
      }).then((response) => {
        if (response.isConfirmed) {
          setLoading(true);
          axios({
            method: "post",
            url: `${import.meta.env.VITE_BASEURL}/jadwal.php`,
            data: formData,
          })
            .then(function (response) {
              if (response.data == "Berhasil") {
                Swal.fire({
                  title: "Berhasil Menyimpan Jadwal",
                  icon: "success",
                  showConfirmButton: false,
                  timer: 1000,
                });
                clearInput();
                setColabs(1);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
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
            });
        }
      });
    } else {
      setLoading(true);
      axios({
        method: "post",
        url: `${import.meta.env.VITE_BASEURL}/jadwal.php`,
        data: formData,
      })
        .then(function (response) {
          if (response.data == "Berhasil") {
            Swal.fire({
              title: "Berhasil Menyimpan Jadwal",
              icon: "success",
              showConfirmButton: false,
              timer: 1000,
            });
            clearInput();
            setColabs(1);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
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
        });
    }
  }

  function editInput(id) {
    let formData = new FormData();
    formData.append("updateJadwal", "");
    formData.append("id", id);
    formData.append("kelas", inputJadwal.kelas);
    formData.append("mapel", inputJadwal.mapel);
    formData.append("tentor", inputJadwal.tentor);
    formData.append("ruangan", inputJadwal.ruang);
    formData.append("jumlah_siswa", inputJadwal.jumlahSiswa);
    formData.append("jumlah_kursi", inputJadwal.jumlahKursi);
    setLoading(true);
    axios({
      method: "post",
      url: `${import.meta.env.VITE_BASEURL}/jadwal.php`,
      data: formData,
    })
      .then(function (response) {
        if (response.data == "Berhasil") {
          Swal.fire({
            title: "Berhasil Mengupdate Jadwal",
            icon: "success",
            showConfirmButton: false,
            timer: 1000,
          });
          clearInput();
          setColabs(1);
          setBtnKirim("Kirim");
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
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
      });
  }

  return (
    <React.Fragment>
      <div className="row mb-3">
        {/* Data Kelas */}
        <div className="data col-12 border">
          <div className="fw-bolder" align="center">
            Data Kelas
          </div>
          {listKelas.map(
            (
              { kelas, tipeKelas, tipe, jumlahSiswa },
              index // menggunakan destructuring assignment untuk mengekstrak properti kelas dan tipeKelas
            ) => (
              <Popup
                content={jumlahSiswa + " Siswa"}
                key={index}
                trigger={
                  <Button
                    compact
                    onClick={() => {
                      handlerAddKelas(kelas + " " + tipeKelas, jumlahSiswa);
                    }}
                    color={
                      readKelasAviliable(kelas + " " + tipeKelas)
                        ? "grey"
                        : "brown"
                    }
                    kelas={tipe == "tambahan" ? kelas : ""}
                    tipekelas={tipe == "tambahan" ? tipeKelas : ""}
                    className={tipe == "tambahan" ? "m-1 tambahan" : "m-1"}
                  >
                    {kelas + " " + tipeKelas}
                  </Button>
                }
              />
            )
          )}
          <Button
            compact
            color={Colabs != 2 ? "vk" : "red"}
            onClick={setDataCollabs}
          >
            <i className="fa-solid fa-handshake"></i>
            {Colabs != 2 ? " Colabs" : " Clear"}
          </Button>
          <Button
            compact
            color="vk"
            onClick={() => {
              addData("kelas");
            }}
          >
            <i className="fa-solid fa-file-circle-plus"></i> Tambah Data
          </Button>
        </div>
        {/* Data Pengajar */}
        <div
          className={width > 450 ? "data col-6 border" : "data col-12 border"}
        >
          <div className="fw-bolder" align="center">
            Data Pengajar
          </div>
          {dataJadwal.Data?.SemuaTentor?.map(
            (
              { pengajar },
              index // menggunakan destructuring assignment untuk mengekstrak properti pengajar
            ) => (
              <Button
                compact
                color={
                  cekExistTentor(pengajar)
                    ? "black"
                    : readTentorAviliable(pengajar)
                    ? "grey"
                    : "blue"
                }
                key={index}
                className="m-1"
                onClick={() => {
                  handlerAddTentor(pengajar);
                }}
              >
                {pengajar}
              </Button>
            )
          )}
        </div>

        <div className={width > 450 ? "data col-6 row" : "data col-12 row"}>
          {/* Data Mapel */}
          <div className="border col-12">
            <div className="fw-bolder" align="center">
              Data Jadwal
            </div>
            {dataJadwal.Data?.SemuaMapel?.map(({ mapel }, index) => (
              <Button
                compact
                color={readMapelAviliable(mapel) ? "grey" : "pink"}
                mapel={mapel}
                key={index}
                className="m-1 mapel"
                onClick={() => {
                  handlerAddMapel(mapel);
                }}
              >
                {mapel}
              </Button>
            ))}
            <Button
              compact
              color="vk"
              onClick={() => {
                addData("mapel");
              }}
            >
              <i className="fa-solid fa-file-circle-plus"></i> Tambah Data
            </Button>
          </div>
          {/* Data Ruangan */}
          <div className="border col-12">
            <div className="fw-bolder" align="center">
              Data Ruangan
            </div>
            {dataJadwal.Data?.SemuaRuangan?.map(
              (
                { ruangan, kapasitas },
                index // menggunakan destructuring assignment untuk mengekstrak properti ruangan
              ) => (
                <Popup
                  content={kapasitas + " Kursi"}
                  key={index}
                  trigger={
                    <Button
                      compact
                      ruang={ruangan}
                      color={
                        cekExistRuangan(ruangan)
                          ? "black"
                          : readRuangAviliable(ruangan)
                          ? "grey"
                          : "green"
                      }
                      className="m-1 ruangan"
                      onClick={() => {
                        handlerAddRuang(ruangan, kapasitas);
                      }}
                    >
                      {ruangan}
                    </Button>
                  }
                />
              )
            )}
            <Button
              compact
              color="vk"
              onClick={() => {
                addData("ruangan");
              }}
            >
              <i className="fa-solid fa-file-circle-plus"></i> Tambah Data
            </Button>
          </div>
        </div>
      </div>
      {/* Form Input Data */}
      <div className="inputDataJadwal">
        <FloatingLabel
          controlId="kelas"
          label={
            inputJadwal.jumlahSiswa != ""
              ? inputJadwal.jumlahSiswa + " Siswa"
              : "Kelas"
          }
          className="mb-3 w-25"
        >
          <Form.Control
            type="text"
            readOnly
            defaultValue={inputJadwal.kelas}
            className="rounded-0"
            placeholder="Kelas"
          />
        </FloatingLabel>

        <FloatingLabel controlId="mapel" label="Mapel" className="mb-3 w-25">
          <Form.Control
            type="text"
            readOnly
            className="rounded-0"
            defaultValue={inputJadwal.mapel}
            placeholder="Mapel"
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="tentor"
          label="Pengajar"
          className="mb-3 w-25"
        >
          <Form.Control
            type="text"
            readOnly
            className="rounded-0"
            placeholder="Pengajar"
            defaultValue={inputJadwal.tentor}
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="ruang"
          label={
            inputJadwal.jumlahKursi != ""
              ? inputJadwal.jumlahKursi + " Kursi"
              : "Ruangan"
          }
          className="mb-3 w-25"
        >
          <Form.Control
            type="text"
            readOnly
            className="rounded-0"
            placeholder="Ruangan"
            defaultValue={inputJadwal.ruang}
          />
        </FloatingLabel>
      </div>
      <div>
        <Button color="red" onClick={clearInput}>
          Clear
        </Button>
        {btnKirim == "Kirim" ? (
          <Button color="blue" onClick={KirimInput}>
            Kirim
          </Button>
        ) : (
          <Button
            color="yellow"
            className="text-dark"
            onClick={() => {
              editInput(idUpdate);
            }}
          >
            Update
          </Button>
        )}
      </div>
    </React.Fragment>
  );
};
export default FormJadwal;
