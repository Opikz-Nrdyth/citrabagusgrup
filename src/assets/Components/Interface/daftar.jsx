import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Container,
  Dropdown,
  DropdownButton,
  FloatingLabel,
  Form,
  InputGroup,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import {
  Icon,
  Step,
  StepContent,
  StepDescription,
  StepGroup,
  StepTitle,
} from "semantic-ui-react";
import "../../Style/daftar.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Daftar = () => {
  let [kelasValue, setKelasValue] = useState("");
  let [drdKelasValue, setDrdKelasValue] = useState("Pilih Kelas");
  let [Program, setProgram] = useState("Program");
  let [placement, setPlacement] = useState("right");
  let [classPlacement, setClassPlacement] = useState(
    "m-2 d-flex justify-content-between w-25"
  );
  let [disableBtnProgram, setDisableBtnProgram] = useState(true);
  const Params = useParams();
  const navigate = useNavigate();
  const Daftar = Params["*"].toLowerCase();
  const Width = window.screen.width;
  const [DataPendaftaran, setDataPendaftaran] = useState({
    dataSiswa: {
      nama: "",
      tanggalLahir: "",
      asalSekolah: "",
      noHP: "",
    },
    dataOrangTua: {
      namaOrtu: "",
      alamat: "",
      noHPOrtu: "",
      pekerjaan: "",
    },
    dataBimbel: {
      kelas: "",
      program: "",
      username: "",
      password: "",
      refrensi: "",
    },
  });
  const [biaya, setBiaya] = useState("");
  const [data, setData] = useState([]);
  const [waAdmin, setWaAdmin] = useState("");

  const fetchData = () => {
    axios({
      url: `${import.meta.env.VITE_BASEURL}/biaya.php?read_biaya`,
      method: "post",
    }).then((response) => {
      setData(response.data);
    });

    axios({
      url: `${import.meta.env.VITE_BASEURL}/settings.php?read`,
      method: "post",
    }).then((response) => {
      response.data.forEach((item) => {
        if (item.nama == "admin_1") {
          let number = item.value;
          if (number.startsWith("0")) {
            number = "62" + number.substring(1);
          }
          setWaAdmin(number);
        }
      });
    });
  };

  const generateRandomChar = () => {
    const characters = "abcdefghijklmnopqrstuvwxyz";
    let result = "";
    const length = 6;
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  };

  const getRandom = () => {
    const newString = generateRandomChar();
    setDataPendaftaran((prevState) => ({
      ...prevState,
      dataBimbel: {
        ...prevState.dataBimbel,
        username: newString,
      },
    }));
  };

  useEffect(() => {
    fetchData();
    getRandom();
    if (window.screen.width < 450) {
      setPlacement("top");
      setClassPlacement("m-2 d-flex justify-content-between w-85");
    } else if (window.screen.width < 900) {
      setPlacement("right");
      setClassPlacement("m-2 d-flex justify-content-between w-40");
    } else {
      setPlacement("right");
      setClassPlacement("m-2 d-flex justify-content-between w-25");
    }
    document.body.style.overflowY = "scroll";
  }, []);
  let kelas = [
    "_____Pilih Kelas_____",
    "Kelas 1",
    "Kelas 2",
    "Kelas 3",
    "Kelas 4",
    "Kelas 5",
    "Kelas 6",
    "Kelas 7",
    "Kelas 8",
    "Kelas 9",
    "Kelas 10",
    "Kelas 11",
    "Kelas 12",
  ];
  let listKelas = kelas.map((nama, index) => (
    <Dropdown.Item
      key={index}
      onClick={() => {
        kelasClick(index, nama);
      }}
    >
      {nama}
    </Dropdown.Item>
  ));

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Penjelasan Program CBG</Popover.Header>
      <Popover.Body>
        <p align="justify">
          Untuk Program Reguler Siswa diberikan fasilitas penuh dari cbg yang
          tertera di atas, isi kelas maksimal 12 siswa. Sedangkan Program
          Eksklusif siswa juga diberikan fasilitas penuh dari cbg yang tertera
          di atas dan diberikan fasilitas tambahan yaitu dapat berpindah antar
          kelas untuk mengambil mata pelajaran lain di jadwal yang lain sesuai
          dengan kebutuhan siswa, dan isi kelas maksimal 6 siswa untuk
          pembelajaran lebih matang
        </p>
      </Popover.Body>
    </Popover>
  );

  function kelasClick(kelas, KelasValue) {
    setDataPendaftaran((prevState) => ({
      ...prevState,
      dataBimbel: {
        ...prevState.dataBimbel,
        kelas: kelas,
      },
    }));
    setDrdKelasValue(KelasValue);
    if (kelas != 6 || kelas != 9 || kelas != 12) {
      setProgram("Reguler");
      setDisableBtnProgram(true);
      setDataPendaftaran((prevState) => ({
        ...prevState,
        dataBimbel: {
          ...prevState.dataBimbel,
          program: "Reguler",
        },
      }));
    }
    if (kelas == 6 || kelas == 9 || kelas == 12) {
      setProgram("Program");
      setDisableBtnProgram(false);
    }

    if (kelas == 0) {
      setKelasValue("");
      setDrdKelasValue("Pilih Kelas");
      setProgram("Program");
    } else if (kelas > 0 && kelas <= 6) {
      setKelasValue("SD");
    } else if (kelas > 6 && kelas <= 9) {
      setKelasValue("SMP");
    } else {
      setKelasValue("SMA/SMK");
    }
  }

  function ProgramClick(program) {
    setProgram(program);
  }

  const isDataSiswaComplete = (dataSiswa) => {
    return Object.values(dataSiswa).every((value) => value !== "");
  };

  function nextStep(link) {
    let complete = false;
    if (Daftar == "datasiswa") {
      complete = isDataSiswaComplete(DataPendaftaran.dataSiswa);
      if (!complete) {
        Swal.fire({
          title:
            "Masih ada bagian yang kosong, harap lengkapi seluruh isi form data diri",
        });
      }
    }
    if (Daftar == "dataorangtua") {
      if (DataPendaftaran.dataOrangTua.alamat != "") {
        complete = true;
      } else {
        Swal.fire({
          title: "Masih ada bagian yang kosong, harap isi setidaknya alamat",
        });
      }
    }
    if (Daftar == "databimbel") {
      if (
        DataPendaftaran.dataBimbel.kelas != "" &&
        DataPendaftaran.dataBimbel.username != "" &&
        DataPendaftaran.dataBimbel.password != "" &&
        DataPendaftaran.dataBimbel.program != ""
      ) {
        complete = true;
      } else {
        Swal.fire({
          title:
            "Masih ada bagian yang kosong, harap isi kelas, program, username, dan password",
        });
      }
    }

    if (Daftar == "confirm") {
      complete = true;
    }
    if (complete) {
      navigate(link);
    }
  }

  const getGreeting = () => {
    const currentTime = new Date().getHours();

    if (currentTime >= 5 && currentTime < 12) {
      return "Selamat Pagi";
    } else if (currentTime >= 12 && currentTime < 18) {
      return "Selamat Siang";
    } else if (currentTime >= 18 && currentTime < 21) {
      return "Selamat Sore";
    } else {
      return "Selamat Malam";
    }
  };

  function nextpage() {
    if (Daftar == "datasiswa") {
      if (isDataSiswaComplete(DataPendaftaran.dataSiswa)) {
        navigate("dataorangtua");
      } else {
        Swal.fire({
          title:
            "Masih ada bagian yang kosong, harap lengkapi seluruh isi form data diri",
        });
      }
    }
    if (Daftar == "dataorangtua") {
      if (DataPendaftaran.dataOrangTua.alamat != "") {
        navigate("databimbel");
      } else {
        Swal.fire({
          title: "Masih ada bagian yang kosong, harap isi setidaknya alamat",
        });
      }
    }
    if (Daftar == "databimbel") {
      if (
        DataPendaftaran.dataBimbel.kelas != "" &&
        DataPendaftaran.dataBimbel.username != "" &&
        DataPendaftaran.dataBimbel.password != "" &&
        DataPendaftaran.dataBimbel.program != ""
      ) {
        navigate("confirm");
      } else {
        Swal.fire({
          title:
            "Masih ada bagian yang kosong, harap isi kelas, program, username, dan password",
        });
      }
    }
    if (Daftar == "confirm") {
      const message = `${getGreeting()} admin Citra Bagus Grup,\n\nPerkenalkan, nama saya ${
        DataPendaftaran.dataSiswa.nama
      }. Saya telah mendaftar untuk program bimbingan di lembaga Citra Bagus Grup. Berikut adalah data diri saya:\n\n*Nama Lengkap:* ${
        DataPendaftaran.dataSiswa.nama
      }\n*Tanggal Lahir:* ${
        DataPendaftaran.dataSiswa.tanggalLahir
      }\n*Alamat:* ${DataPendaftaran.dataOrangTua.alamat}\n*Nomor HP:* ${
        DataPendaftaran.dataSiswa.noHP
      }\n*Program:* ${DataPendaftaran.dataBimbel.program}\n*Kelas:* ${
        DataPendaftaran.dataBimbel.kelas
      }\n\nSaya telah mendaftarkan diri ke bimbingan belajar tersebut melalui website resmi citra bagus grup${
        DataPendaftaran.dataBimbel.refrensi != ""
          ? ` berdasarkan refrensi _*${DataPendaftaran.dataBimbel.refrensi}*_`
          : ""
      }. Saya berharap dapat mendapatkan informasi lebih lanjut mengenai jadwal, biaya, dan prosedur pendaftaran selanjutnya.\n\nTerima kasih atas perhatiannya.\n\nHormat saya,\n\n${
        DataPendaftaran.dataSiswa.nama
      }`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappLink = `https://wa.me/${waAdmin}?text=${encodedMessage}`;

      const user = DataPendaftaran.dataBimbel.username;
      const nama = DataPendaftaran.dataSiswa.nama;
      const lahir = DataPendaftaran.dataSiswa.tanggalLahir;
      const sekolah = DataPendaftaran.dataSiswa.asalSekolah;
      const nohp = DataPendaftaran.dataSiswa.noHP;
      const kelas = DataPendaftaran.dataBimbel.kelas;
      const tipekelas = "";
      const secondaryKelas = "";
      const program = DataPendaftaran.dataBimbel.program;
      const ortu = DataPendaftaran.dataOrangTua.namaOrtu;
      const alamat = DataPendaftaran.dataOrangTua.alamat;
      const tlp_ortu = DataPendaftaran.dataOrangTua.noHPOrtu;
      const pekerjaan = DataPendaftaran.dataOrangTua.pekerjaan;
      const pass = DataPendaftaran.dataBimbel.password;

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

      if (
        nama != "" &&
        lahir != "" &&
        sekolah != "" &&
        nohp != "" &&
        alamat != "" &&
        kelas != "" &&
        program != "" &&
        user != "" &&
        pass != ""
      ) {
        axios({
          method: "post",
          url: `${import.meta.env.VITE_BASEURL}/siswa.php?add`,
          data: formData,
        }).then((response) => {
          if (response.data == "Berhasil") {
            Swal.fire({
              title: "Data anda tersimpan di database citra bagus grup",
              icon: "success",
              showConfirmButton: false,
              timer: 1000,
            }).then((result) => {
              localStorage.setItem("user", user);
              localStorage.setItem("pass", pass);
              window.open(whatsappLink, "_blank");
              navigate("/");
            });
          } else {
            Swal.fire({
              title: response.data,
              icon: "error",
            });
          }
        });
      } else {
        Swal.fire({
          title: "Terdapat data yang kurang, harap cek kembali data anda",
          icon: "error",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("datasiswa");
          }
        });
      }
    }
  }

  function cekStep(link) {
    if (link == "datasiswa") {
      if (Daftar == "datasiswa") {
        return "active";
      } else {
        if (Width < 900) {
          return "stepsm-active active";
        } else {
          return "completed";
        }
      }
    }

    if (link == "dataorangtua") {
      if (Daftar == "dataorangtua") {
        return "active";
      }
      if (Daftar == "datasiswa") {
        return "";
      } else {
        if (Width < 900) {
          return "stepsm-active active";
        } else {
          return "completed";
        }
      }
    }

    if (link == "databimbel") {
      if (Daftar == "databimbel") {
        return "active";
      }
      if (Daftar == "dataorangtua" || Daftar == "datasiswa") {
        return "";
      } else {
        if (Width < 900) {
          return "stepsm-active active";
        } else {
          return "completed";
        }
      }
    }
  }

  useEffect(() => {
    if (
      DataPendaftaran.dataBimbel.kelas != "" &&
      DataPendaftaran.dataBimbel.program != ""
    ) {
      data.forEach((item) => {
        if (
          item.Kelas == DataPendaftaran.dataBimbel.kelas &&
          item.Program == DataPendaftaran.dataBimbel.program
        ) {
          setBiaya(item.Biaya);
        }
      });
    } else {
      setBiaya(0);
    }
  }, [DataPendaftaran]);

  function formatRupiah(value) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  }

  const GenratePassword = (tanggalLahir) => {
    const dateObj = new Date(tanggalLahir);
    const month = dateObj.getMonth() + 1; // Mendapatkan bulan (mulai dari 0)
    const day = dateObj.getDate(); // Mendapatkan tanggal

    // Mengonversi bulan dan tanggal ke format MMDD
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const dayStr = day < 10 ? `0${day}` : `${day}`;

    return `${dayStr}${monthStr}`;
  };

  return (
    <Container>
      <div data-aos="fade-up" className="mt-5">
        <h1 className="title" id="Daftar">
          Formulir Pendaftaran
        </h1>
        <p className="br-heart fs-6">
          <i className="fa-regular fa-heart"></i>
        </p>
      </div>

      {Width > 900 ? (
        <div align="center" data-aos="fade-up">
          <StepGroup>
            <Step
              className={cekStep("datasiswa")}
              onClick={() => {
                nextStep("datasiswa");
              }}
            >
              <Icon name="user" />
              <StepContent>
                <StepTitle className="step-title">Data Diri</StepTitle>
                <StepDescription className="step-description">
                  Masukan Data Diri Anda
                </StepDescription>
              </StepContent>
            </Step>
            <Step
              onClick={() => {
                nextStep("dataorangtua");
              }}
              className={cekStep("dataorangtua")}
            >
              <Icon name="street view" />
              <StepContent>
                <StepTitle className="step-title">Data Orang Tua</StepTitle>
                <StepDescription className="step-description">
                  Masukan Data Orang Tua Anda
                </StepDescription>
              </StepContent>
            </Step>
            <Step
              onClick={() => {
                nextStep("databimbel");
              }}
              className={cekStep("databimbel")}
            >
              <Icon name="building" />
              <StepContent>
                <StepTitle className="step-title">
                  Data Citra Bagus Grup
                </StepTitle>
                <StepDescription className="step-description">
                  Masukan Data Citra Bagus Grup
                </StepDescription>
              </StepContent>
            </Step>
            <Step
              onClick={() => {
                nextStep("confirm");
              }}
            >
              <Icon name="file alternate" />
              <StepContent>
                <StepTitle className="step-title">
                  Konfirmasi Pendaftaran
                </StepTitle>
              </StepContent>
            </Step>
          </StepGroup>
        </div>
      ) : (
        <div align="center" data-aos="fade-up">
          <div className="progress-mobile" data-click="1">
            <div className="progress-bar-mobile"></div>
            <div
              className={`step-mobile stepsm ${cekStep("datasiswa")}`}
              onClick={() => {
                nextStep("datasiswa");
              }}
            >
              1
            </div>
            <div
              className={`step-mobile stepsm ${cekStep("dataorangtua")}`}
              onClick={() => {
                nextStep("dataorangtua");
              }}
            >
              2
            </div>
            <div
              className={`step-mobile stepsm ${cekStep("databimbel")}`}
              onClick={() => {
                nextStep("databimbel");
              }}
            >
              3
            </div>
            <div
              className={`step-mobile ${Daftar == "confirm" ? "active" : ""}`}
              onClick={() => {
                nextStep("confirm");
              }}
            >
              4
            </div>
          </div>
        </div>
      )}

      <div data-aos="fade-up">
        <div hidden={Daftar != "datasiswa"}>
          <div className="m-2">
            <FloatingLabel controlId="floatingInput" label="Nama Lengkap">
              <Form.Control
                type="text"
                placeholder="Nama Lengkap"
                required
                onChange={(e) => {
                  setDataPendaftaran((prevState) => ({
                    ...prevState,
                    dataSiswa: {
                      ...prevState.dataSiswa,
                      nama: e.target.value,
                    },
                  }));
                }}
              />
            </FloatingLabel>
          </div>

          <div className="m-2">
            <FloatingLabel controlId="floatingInput" label="Tanggal Lahir">
              <Form.Control
                type="date"
                placeholder="Tanggal Lahir"
                required
                onChange={(e) => {
                  setDataPendaftaran((prevState) => ({
                    ...prevState,
                    dataSiswa: {
                      ...prevState.dataSiswa,
                      tanggalLahir: e.target.value,
                    },
                  }));

                  const SetPassword = GenratePassword(e.target.value);
                  setDataPendaftaran((prevState) => ({
                    ...prevState,
                    dataBimbel: {
                      ...prevState.dataBimbel,
                      password: SetPassword,
                    },
                  }));
                }}
              />
            </FloatingLabel>
          </div>

          <div className="m-2">
            <FloatingLabel controlId="floatingInput" label="Asal Sekolah">
              <Form.Control
                type="text"
                placeholder="sekolah"
                required
                onChange={(e) => {
                  setDataPendaftaran((prevState) => ({
                    ...prevState,
                    dataSiswa: {
                      ...prevState.dataSiswa,
                      asalSekolah: e.target.value,
                    },
                  }));
                }}
              />
            </FloatingLabel>
          </div>

          <div className="m-2">
            <FloatingLabel controlId="floatingInput" label="No HP Siswa">
              <Form.Control
                type="text"
                placeholder="hp siswa"
                required
                onChange={(e) => {
                  setDataPendaftaran((prevState) => ({
                    ...prevState,
                    dataSiswa: {
                      ...prevState.dataSiswa,
                      noHP: e.target.value,
                    },
                  }));
                }}
              />
            </FloatingLabel>
          </div>
        </div>

        <div hidden={Daftar != "dataorangtua"}>
          <div className="m-2">
            <FloatingLabel controlId="floatingInput" label="Nama Orang Tua">
              <Form.Control
                type="text"
                placeholder="Nama Orang Tua"
                onChange={(e) => {
                  setDataPendaftaran((prevState) => ({
                    ...prevState,
                    dataOrangTua: {
                      ...prevState.dataOrangTua,
                      namaOrtu: e.target.value,
                    },
                  }));
                }}
              />
            </FloatingLabel>
          </div>

          <div className="m-2">
            <FloatingLabel controlId="floatingInput" label="Alamat">
              <Form.Control
                type="text"
                required
                placeholder="Alamat"
                onChange={(e) => {
                  setDataPendaftaran((prevState) => ({
                    ...prevState,
                    dataOrangTua: {
                      ...prevState.dataOrangTua,
                      alamat: e.target.value,
                    },
                  }));
                }}
              />
            </FloatingLabel>
          </div>

          <div className="m-2">
            <FloatingLabel controlId="floatingInput" label="No HP Orang Tua">
              <Form.Control
                type="text"
                placeholder="hp ortu"
                onChange={(e) => {
                  setDataPendaftaran((prevState) => ({
                    ...prevState,
                    dataOrangTua: {
                      ...prevState.dataOrangTua,
                      noHPOrtu: e.target.value,
                    },
                  }));
                }}
              />
            </FloatingLabel>
          </div>

          <div className="m-2">
            <FloatingLabel
              controlId="floatingInput"
              label="Pekerjaan Orang Tua"
            >
              <Form.Control
                type="text"
                placeholder="Pekerjaan"
                onChange={(e) => {
                  setDataPendaftaran((prevState) => ({
                    ...prevState,
                    dataOrangTua: {
                      ...prevState.dataOrangTua,
                      pekerjaan: e.target.value,
                    },
                  }));
                }}
              />
            </FloatingLabel>
          </div>
        </div>

        <div hidden={Daftar != "databimbel"}>
          <div className="m-2">
            <InputGroup className="mb-3">
              <DropdownButton
                variant=""
                title={drdKelasValue}
                id="dropdown-kelas"
              >
                {listKelas}
              </DropdownButton>
              <FloatingLabel controlId="floatingInput" label="Kelas">
                <Form.Control
                  type="text"
                  required
                  placeholder="Kelas"
                  value={kelasValue}
                  readOnly={true}
                  onClick={() => {
                    document.getElementById("dropdown-kelas").click();
                  }}
                />
              </FloatingLabel>
            </InputGroup>
          </div>

          <div className={classPlacement}>
            <Dropdown>
              <Dropdown.Toggle
                variant="success"
                id="dropdown-basic"
                disabled={disableBtnProgram}
              >
                {Program}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    ProgramClick("Program");
                  }}
                >
                  _____Program_____
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    ProgramClick("Reguler");
                    setDataPendaftaran((prevState) => ({
                      ...prevState,
                      dataBimbel: {
                        ...prevState.dataBimbel,
                        program: "Reguler",
                      },
                    }));
                  }}
                >
                  Reguler
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    ProgramClick("Eksklusif");
                    setDataPendaftaran((prevState) => ({
                      ...prevState,
                      dataBimbel: {
                        ...prevState.dataBimbel,
                        program: "Eksklusif",
                      },
                    }));
                  }}
                >
                  Eksklusif
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <OverlayTrigger
              placement={placement}
              delay={{ show: 250, hide: 400 }}
              overlay={popover}
            >
              <Button variant="warning">
                <i className="fa-regular fa-circle-question"></i> Tentang
                Program
              </Button>
            </OverlayTrigger>
          </div>

          <div className="m-2">
            <h6>
              Biaya belum termasuk diskon!, untuk claim diskon bisa melakukan
              daftar ulang ke kantor bimbingan belajar citra bagus grup
            </h6>
            <FloatingLabel controlId="floatingInput" label="Biaya Normal">
              <Form.Control
                type="text"
                placeholder="biaya normal"
                disabled={true}
                value={formatRupiah(biaya)}
              />
            </FloatingLabel>
          </div>

          <p className="text-dark fw-bolder ms-2">
            Data Untuk Login Ke Akun Siswa
          </p>
          <div className="m-2">
            <FloatingLabel
              controlId="floatingInput"
              label="Username / No.Induk sementara"
            >
              <Form.Control
                type="text"
                placeholder="Username / No.Induk sementara"
                disabled
                required
                defaultValue={DataPendaftaran.dataBimbel.username}
              />
            </FloatingLabel>
          </div>

          <div className="m-2">
            <FloatingLabel
              controlId="floatingInput"
              label="Password Login Akun"
            >
              <Form.Control
                type="password"
                placeholder="Password Untuk Login Akun"
                disabled
                defaultValue={DataPendaftaran.dataBimbel.password}
              />
            </FloatingLabel>
          </div>

          <div className="m-2">
            <FloatingLabel
              controlId="floatingInput"
              label="Referensi (Optional)"
            >
              <Form.Control
                type="text"
                placeholder="Referensi (Optional)"
                onChange={(e) => {
                  setDataPendaftaran((prevState) => ({
                    ...prevState,
                    dataBimbel: {
                      ...prevState.dataBimbel,
                      refrensi: e.target.value,
                    },
                  }));
                }}
              />
            </FloatingLabel>
          </div>
        </div>

        <div
          className={`row mt-3 mb-3 ${Width < 450 ? "ms-3" : ""}`}
          hidden={Daftar != "confirm"}
        >
          <div
            className={`pribadi ${
              Width < 450 ? "col-11" : Width < 850 ? "col-12" : "col-6"
            } border-element`}
          >
            <div className="profile p-3" align="center">
              <div className="rounded-profile">
                <img src="/images/logo.png" width="70px" alt="img-profile" />
              </div>
              <p className="fw-bolder fs-4 text-start mt-5">Data Diri</p>
              <div className="row border-bottom mt-1">
                <div className="col-6 text-start">Nama Siswa</div>
                <div className="col-6 text-end">
                  {DataPendaftaran.dataSiswa.nama}
                </div>
              </div>
              <div className="row border-bottom mt-5">
                <div className="col-6 text-start">Tanggal Lahir</div>
                <div className="col-6 text-end">
                  {DataPendaftaran.dataSiswa.tanggalLahir}
                </div>
              </div>
              <div className="row border-bottom mt-5">
                <div className="col-6 text-start">Asal Sekolah</div>
                <div className="col-6 text-end">
                  {DataPendaftaran.dataSiswa.asalSekolah}
                </div>
              </div>
              <div className="row border-bottom mt-5">
                <div className="col-6 text-start">Nomer HP</div>
                <div className="col-6 text-end">
                  {Width < 450
                    ? DataPendaftaran.dataSiswa.noHP.replaceAll("/", " ")
                    : DataPendaftaran.dataSiswa.noHP.replaceAll("/", " / ")}
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              Width < 450 ? "col-11" : Width < 850 ? "col-12" : "col-6"
            }
          >
            <div className="data_orangtua border-element p-3">
              <p className="fw-bolder fs-4">Data Orang Tua</p>
              <div className="row border-bottom mt-3">
                <div className="col-6">Nama Orang Tua</div>
                <div className="col-6 text-end">
                  {DataPendaftaran.dataOrangTua.namaOrtu}
                </div>
              </div>
              <div className="row border-bottom mt-3">
                <div className="col-6">Alamat Rumah</div>
                <div className="col-6 text-end">
                  {DataPendaftaran.dataOrangTua.alamat}
                </div>
              </div>

              <div className="row border-bottom mt-3">
                <div className="col-6">No orang tua</div>
                <div className="col-6 text-end">
                  {DataPendaftaran.dataOrangTua.noHPOrtu}
                </div>
              </div>
              <div className="row border-bottom mt-3">
                <div className="col-6">Pekerjaan orang tua</div>
                <div className="col-6 text-end">
                  {DataPendaftaran.dataOrangTua.pekerjaan}
                </div>
              </div>
            </div>

            <div className="data_cbg border-element p-3 mt-2">
              <p className="fw-bolder fs-4">Data Citra Bagus Grup</p>
              <div className="row border-bottom mt-3">
                <div className="col-6">Kelas</div>
                <div className="col-6 text-end">{`${DataPendaftaran.dataBimbel.kelas}`}</div>
              </div>

              <div className="row border-bottom mt-3">
                <div className="col-6">Program</div>
                <div className="col-6 text-end">
                  {DataPendaftaran.dataBimbel.program}
                </div>
              </div>
              <div className="row border-bottom mt-3">
                <div className="col-6">Username / No.Induk</div>
                <div className="col-6 text-end">
                  {DataPendaftaran.dataBimbel.username}
                </div>
              </div>
              <div className="row border-bottom mt-3">
                <div className="col-6">Password</div>
                <div className="col-6 text-end">
                  {DataPendaftaran.dataBimbel.password}
                </div>
              </div>
              <div className="row border-bottom mt-3">
                <div className="col-6">Referensi</div>
                <div className="col-6 text-end">
                  {DataPendaftaran.dataBimbel.refrensi}
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          className="btn btn-success w-100 mb-3"
          onClick={() => {
            nextpage();
          }}
        >
          {Daftar != "confirm" ? "Selanjutnya" : "Daftar Sekarang"}
        </button>
      </div>
    </Container>
  );
};
export default Daftar;
