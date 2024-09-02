import { Form, InputGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Dropdown } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

// Custom hook untuk mengatur penilaian
function usePenilaian() {
  // State untuk menyimpan nilai penilaian
  const [newValue, setNewValue] = useState("");

  // Fungsi untuk menangani aksi tombol
  const handleAction = (value) => {
    // Jika value adalah "benar", tambahkan span dengan class bg-primary
    if (value === "benar") {
      setNewValue(
        (prevValue) =>
          prevValue + "<span class='p-1 rounded-1 bg-primary'>Benar</span>"
      );
    } else if (value === "salah") {
      setNewValue(
        (prevValue) =>
          prevValue + "<span class='p-1 rounded-1 bg-danger'>Salah</span>"
      );
    }
    // Jika value adalah "jumlah soal", tambahkan span dengan class bg-warning
    else if (value === "jumlah soal") {
      setNewValue(
        (prevValue) =>
          prevValue +
          "<span class='p-1 rounded-1 bg-warning'>Jumlah Soal</span>"
      );
    } else if (value === "reset") {
      setNewValue((prevValue) => "");
    }
    // Selain itu, tambahkan value secara langsung
    else {
      setNewValue((prevValue) => prevValue + value);
    }
  };

  // Kembalikan nilai penilaian dan fungsi aksi
  return [newValue, handleAction];
}

const AturPenilaian = ({ dataTryout, Kelas }) => {
  // Gunakan custom hook untuk mengatur penilaian
  const [newValue, handleAction] = usePenilaian();
  const [TryoutOptions, setTryoutOptions] = useState([]);
  const [ujianName, setUjianName] = useState("");
  const navigate = useNavigate();
  const [dataSetPenilaian, setDataSetPenilaian] = useState([]);

  const fetchTabelSetPenilaian = () => {
    axios({
      method: "post",
      url: `${import.meta.env.VITE_BASEURL}/penilaian.php?read_setpenilaian`,
    }).then((response) => {
      setDataSetPenilaian(response.data);
    });
  };

  useEffect(() => {
    fetchTabelSetPenilaian();
  }, []);
  // Array untuk menyimpan data tombol
  const buttons = [
    { value: "benar", label: "Benar", icon: null },
    { value: "salah", label: "Salah", icon: null },
    { value: "jumlah soal", label: "Jumlah Soal", icon: null },
    { value: "+", label: null, icon: "fa-solid fa-plus" },
    { value: "-", label: null, icon: "fa-solid fa-minus" },
    { value: "*", label: null, icon: "fa-solid fa-xmark" },
    { value: "/", label: null, icon: "fa-solid fa-divide" },
    { value: "10", label: "10", icon: null },
    { value: "100", label: "100", icon: null },
    { value: "1000", label: "1000", icon: null },
    { value: "(10/100)", label: "10%", icon: null },
    { value: "(100/100)", label: "100%", icon: null },
    { value: "(1000/100)", label: "1000%", icon: null },
    { value: "0", label: "0", icon: null },
    { value: "1", label: "1", icon: null },
    { value: "2", label: "2", icon: null },
    { value: "3", label: "3", icon: null },
    { value: "4", label: "4", icon: null },
    { value: "5", label: "5", icon: null },
    { value: "6", label: "6", icon: null },
    { value: "7", label: "7", icon: null },
    { value: "8", label: "8", icon: null },
    { value: "9", label: "9", icon: null },
    { value: "(", label: "(", icon: null },
    { value: ")", label: ")", icon: null },
  ];

  useEffect(() => {
    let groupedData = [];
    let FristObj = {
      key: `All`,
      value: `All`,
      text: `Semua`,
    };

    groupedData.push(FristObj);
    dataTryout.forEach((item) => {
      let newObj = {
        key: `${item.nama_ujian}_${item.mapel}`,
        value: `${item.nama_ujian}_${item.mapel}_${item.kelas}`,
        text: `${item.nama_ujian}_${item.mapel}_${item.kelas}`,
      };
      groupedData.push(newObj);
    });
    setTryoutOptions(groupedData);
  }, [dataTryout]);

  function kirimFormatPenilaian() {
    let setPenilaian = document.getElementById("setPenilaian");
    let setKelas = Kelas;
    let setNameUjian = ujianName.replaceAll(" ", "_");
    let formData = new FormData();
    formData.append("tambah_penilaian", "");
    formData.append("kelas", setKelas);
    formData.append("penilaian", setPenilaian.innerText);
    formData.append("tipe", setNameUjian);
    axios({
      method: "post",
      url: `${import.meta.env.VITE_BASEURL}/penilaian.php`,
      data: formData,
    })
      .then((response) => {
        if (response.data == "Berhasil") {
          Swal.fire({
            icon: "success",
            title: `Berhasil menambah format nilai untuk kelas${setKelas}`,
            timer: 1500,
            showConfirmButton: false,
          });
        }
      })
      .finally(() => {
        handleAction("reset");
        fetchTabelSetPenilaian();
      });
  }

  function deleteFormatPenilaian(id, mapel, kelas) {
    mapel = mapel.replaceAll("_", " ");
    if (mapel == "All") {
      mapel = "Semua";
    }
    Swal.fire({
      title: `Apakah anda benar benar mau menghapus format penilaian ${mapel} kelas ${kelas}`,
      icon: "info",
      confirmButtonColor: "#fd4053",
      confirmButtonText: "Hapus",
      showCancelButton: true,
      cancelButtonColor: "#157347",
      cancelButtonText: "Batal",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        let formData = new FormData();
        formData.append("delete_penilaian", "");
        formData.append("id", id);
        axios({
          method: "post",
          url: `${import.meta.env.VITE_BASEURL}/penilaian.php`,
          data: formData,
        }).then((response) => {
          if (response.data == "Berhasil") {
            Swal.fire({
              icon: "success",
              title: `Berhasil menghapus format nilai untuk kelas${kelas}`,
              timer: 1500,
              showConfirmButton: false,
            });
            fetchTabelSetPenilaian();
          }
        });
      }
    });
  }

  const handlerNameUjian = (e, { value }) => {
    setUjianName(value);
  };
  return (
    <div className="w-element-admin mt-3">
      <InputGroup className="mb-3">
        <InputGroup.Text>Set</InputGroup.Text>
        <div
          placeholder="Penilaian"
          aria-label="Penilaian"
          aria-describedby="setPenilaian"
          className="border form-control"
          id="setPenilaian"
          // Gunakan dangerouslySetInnerHTML untuk menampilkan HTML
          dangerouslySetInnerHTML={{ __html: newValue }}
        ></div>
        <button
          className="btn btn-danger"
          onClick={() => {
            // Reset nilai penilaian menjadi string kosong
            handleAction("reset");
          }}
        >
          Clear
        </button>
      </InputGroup>

      <div className="button-action">
        {/* Petakan setiap elemen array menjadi sebuah tombol */}
        {buttons.map((button) => (
          <button
            className="btn btn-sm btn-secondary me-1 mb-1"
            onClick={() => {
              // Panggil handleAction dengan value yang sesuai
              handleAction(button.value);
            }}
          >
            {/* Jika ada icon, gunakan icon, jika tidak, gunakan label */}
            {button.icon ? <i className={button.icon}></i> : button.label}
          </button>
        ))}
      </div>

      <InputGroup className="mb-3 mt-3">
        <InputGroup.Text id="setPenilaian">Kelas</InputGroup.Text>
        <Form.Select
          aria-label="Default select example"
          onChange={(e) => {
            navigate(`?kelas=${e.target.value}`);
          }}
        >
          <option>Pilih Kelas</option>
          <option value="1" selected={Kelas == 1}>
            Kelas 1
          </option>
          <option value="2" selected={Kelas == 2}>
            Kelas 2
          </option>
          <option value="3" selected={Kelas == 3}>
            Kelas 3
          </option>
          <option value="4" selected={Kelas == 4}>
            Kelas 4
          </option>
          <option value="5" selected={Kelas == 5}>
            Kelas 5
          </option>
          <option value="6" selected={Kelas == 6}>
            Kelas 6
          </option>
          <option value="7" selected={Kelas == 7}>
            Kelas 7
          </option>
          <option value="8" selected={Kelas == 8}>
            Kelas 8
          </option>
          <option value="9" selected={Kelas == 9}>
            Kelas 9
          </option>
          <option value="10" selected={Kelas == 10}>
            Kelas 10
          </option>
          <option value="11" selected={Kelas == 11}>
            Kelas 11
          </option>
          <option value="12" selected={Kelas == 12}>
            Kelas 12
          </option>
        </Form.Select>
      </InputGroup>
      <Dropdown
        placeholder="Pilih Ujian"
        fluid
        search
        selection
        className="form-control"
        options={TryoutOptions}
        onChange={handlerNameUjian}
      />
      <button
        className="btn btn-success w-100 mt-3"
        onClick={kirimFormatPenilaian}
      >
        Kirim Format Penilaian
      </button>

      <div className="scrollData">
        <table className="table table-striped mt-3">
          <thead className="table-info">
            <tr>
              <th>Kelas</th>
              <th>Mapel Tujuan</th>
              <th>Penilaian</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {dataSetPenilaian.map((item, index) => (
              <tr key={index}>
                <td>{item.kelas}</td>
                <td>{item.tipe.replaceAll("_", " ")}</td>
                <td>{item.penilaian}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      deleteFormatPenilaian(item.id, item.tipe, item.kelas);
                    }}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AturPenilaian;
