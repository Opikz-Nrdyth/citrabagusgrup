import axios from "axios";
import { useEffect, useState } from "react";
import { Input, Radio, Segment } from "semantic-ui-react";
import Swal from "sweetalert2";

const Settings = ({ setLoading }) => {
  const [data, setData] = useState([]);
  const Width = window.screen.width;

  const fetchData = () => {
    setLoading(true);
    axios({
      method: "get",
      url: `${import.meta.env.VITE_BASEURL}/settings.php?read`,
    })
      .then((response) => {
        setData(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateData = (keyData, value) => {
    let formData = new FormData();
    formData.append("key", keyData);
    formData.append("value", value);
    setLoading(true);

    axios({
      method: "post",
      url: `${import.meta.env.VITE_BASEURL}/settings.php?update`,
      data: formData,
    })
      .then((response) => {
        if (response.data == "Berhasil") {
          Swal.fire({
            icon: "success",
            title: "berhasil",
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: response.data,
          });
        }
      })
      .finally(() => {
        setLoading(false);
        fetchData();
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  function classCol(tipe) {
    if (Width < 450) {
      if (tipe == "togle") {
        return "col-9";
      } else {
        return "col-4";
      }
    } else if (Width > 450 && Width < 850) {
      if (tipe == "togle") {
        return "col-10";
      } else {
        return "col-7";
      }
    } else {
      if (tipe == "togle") {
        return "col-11";
      } else {
        return "col-9";
      }
    }
  }

  const removeData = (keyData) => {
    if (keyData == "Hapus_Semua_Siswa") {
      Swal.fire({
        title: "Apakah anda ingin menghapus semua siswa?",
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
          formData.append("remove_siswa", keyData);
          setLoading(true);

          axios({
            method: "post",
            url: `${import.meta.env.VITE_BASEURL}/settings.php`,
            data: formData,
          })
            .then((response) => {
              if (response.data == "Berhasil") {
                Swal.fire({
                  title: "Berhasil menghapus semua siswa",
                  icon: "success",
                  timer: 1500,
                  showConfirmButton: false,
                });
              } else {
                Swal.fire({
                  title: "Gagal menghapus semua siswa",
                  icon: "error",
                  html: response.data,
                });
              }
            })
            .finally(() => {
              setLoading(false);
            });
        }
      });
    }

    if (keyData == "Hapus_Semua_Jadwal") {
      Swal.fire({
        title: "Apakah anda ingin menghapus semua jadwal?",
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
          formData.append("remove_jadwal", keyData);
          setLoading(true);

          axios({
            method: "post",
            url: `${import.meta.env.VITE_BASEURL}/settings.php`,
            data: formData,
          })
            .then((response) => {
              if (response.data == "Berhasil") {
                Swal.fire({
                  title: "Berhasil menghapus semua jadwal",
                  icon: "success",
                  timer: 1500,
                  showConfirmButton: false,
                });
              } else {
                Swal.fire({
                  title: "Gagal menghapus semua jadwal",
                  icon: "error",
                  html: response.data,
                });
              }
            })
            .finally(() => {
              setLoading(false);
            });
        }
      });
    }

    if (keyData == "Hapus_Semua_Jawaban") {
      Swal.fire({
        title: "Apakah anda ingin menghapus semua jawaban siswa?",
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
          formData.append("remove_jawaban", keyData);
          setLoading(true);

          axios({
            method: "post",
            url: `${import.meta.env.VITE_BASEURL}/settings.php`,
            data: formData,
          })
            .then((response) => {
              if (response.data.status == "success") {
                Swal.fire({
                  title: "Berhasil menghapus semua Jawaban",
                  icon: "success",
                  html: response.data.data,
                });
              } else {
                Swal.fire({
                  title: "Gagal menghapus semua Jawaban",
                  icon: "error",
                  html: response.data,
                });
              }
            })
            .finally(() => {
              setLoading(false);
            });
        }
      });
    }

    if (keyData == "Hapus_Semua_Backup") {
      Swal.fire({
        title: "Apakah anda ingin menghapus semua backup jawaban siswa?",
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
          formData.append("remove_backup", keyData);
          setLoading(true);

          axios({
            method: "post",
            url: `${import.meta.env.VITE_BASEURL}/settings.php`,
            data: formData,
          })
            .then((response) => {
              if (response.data.status == "success") {
                Swal.fire({
                  title: "Berhasil menghapus semua Backup Jawaban",
                  icon: "success",
                  html: response.data.data,
                });
              } else {
                Swal.fire({
                  title: "Gagal menghapus semua Backup Jawaban",
                  icon: "error",
                  html: response.data,
                });
              }
            })
            .finally(() => {
              setLoading(false);
            });
        }
      });
    }

    if (keyData == "Jadikan_Semua_Siswa_Alumni") {
      Swal.fire({
        title: "Apakah anda ingin menjadikan semua siswa menjadi alumni?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Jadikan Alumni",
        cancelButtonText: "Tidak Jadi",
        confirmButtonColor: "#fd4053",
        cancelButtonColor: "#22bf76",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          let formData = new FormData();
          formData.append("jadikan_alumni", keyData);
          setLoading(true);

          axios({
            method: "post",
            url: `${import.meta.env.VITE_BASEURL}/settings.php`,
            data: formData,
          })
            .then((response) => {
              if (response.data == "success") {
                Swal.fire({
                  title: "Berhasil Menjadikan Alumni Semua Siswa",
                  icon: "success",
                });
              } else {
                Swal.fire({
                  title: "Gagal Menjadikan Alumni Semua Siswa",
                  icon: "error",
                  html: response.data,
                });
              }
            })
            .finally(() => {
              setLoading(false);
            });
        }
      });
    }
  };

  return (
    <div className="w-element-admin">
      {data && data.length > 0
        ? data.map((item, index) => (
            <Segment className="row" key={index}>
              <div className={classCol(item.tipe)}>
                <div className="fs-5 fw-bolder">
                  {item.nama.replaceAll("_", " ")}
                </div>
                {item.tipe == "togle" && Width < 450 ? (
                  <div className="fs-6">{item.deskripsi}</div>
                ) : Width > 450 ? (
                  <div className="fs-6">{item.deskripsi}</div>
                ) : null}
              </div>
              <div className={item.tipe == "button" ? "col-3" : "col-1"}>
                {item.tipe == "togle" ? (
                  <Radio
                    toggle
                    className="pt-2"
                    checked={item.value == true}
                    onClick={(e) => {
                      let checked =
                        e.target.parentElement.parentElement.querySelector(
                          "input"
                        ).checked;
                      updateData(item.nama, !checked);
                    }}
                  />
                ) : item.tipe == "button" ? (
                  <div align="right">
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        removeData(item.nama);
                      }}
                    >
                      {item.nama.replaceAll("_", " ")}
                    </button>
                  </div>
                ) : item.tipe == "value" ? (
                  <Input
                    placeholder={item.nama}
                    defaultValue={item.value}
                    onBlur={(e) => {
                      let value =
                        e.target.parentElement.parentElement.querySelector(
                          "input"
                        ).value;
                      updateData(item.nama, value);
                    }}
                  />
                ) : null}
              </div>
            </Segment>
          ))
        : null}
    </div>
  );
};
export default Settings;
