import axios from "axios";
import { useEffect, useState } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const PresTentor = ({ setLoading }) => {
  const [data, setData] = useState([]);
  const [dataTentor, setDataTentor] = useState([]);
  const [selectedTentor, setSelectedTentor] = useState(null);
  const [timeSelected, setTimeSelected] = useState("");
  const [tentorData, setTentorData] = useState({
    nama: "",
    serialnumber: "",
    status: "",
    fingerprint_id: "",
  });
  const SwalReactContent = withReactContent(Swal);

  const fetchData = () => {
    setLoading(true);
    axios({
      method: "get",
      url: `${import.meta.env.VITE_BASEURL}/pres_tentor.php?read_hadir`,
    })
      .then((response) => {
        setData(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchDataTentor = () => {
    setLoading(true);
    axios({
      method: "get",
      url: `${import.meta.env.VITE_BASEURL}/pres_tentor.php?read_tentor`,
    })
      .then((response) => {
        setDataTentor(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
    fetchDataTentor();
  }, []);

  const handleSelectChange = (event) => {
    const selectedName = event.target.value;
    const selectedTentorData = dataTentor.find(
      (item) => item.nama === selectedName
    );

    setSelectedTentor(selectedName);
    setTentorData({
      nama: selectedTentorData?.nama || "",
      status: selectedTentorData?.status || "",
      serialnumber: selectedTentorData?.serialnumber || "",
      fingerprint_id: selectedTentorData?.fingerprint_id || "",
    });
  };

  const reloadData = () => {
    fetchData();
    fetchDataTentor();
  };

  const AddAbsen = () => {
    SwalReactContent.fire({
      title: "Tambah Absen Manual",
      confirmButtonColor: "#157347",
      confirmButtonText: "Simpan",
      showCancelButton: true,
      cancelButtonColor: "#bb2d3b",
      cancelButtonText: "Batal",
      allowOutsideClick: false,
      html: (
        <div>
          <Form.Select
            className="mb-3"
            aria-label="Default select example"
            onChange={handleSelectChange}
          >
            <option>Pilih Tentor Dibawah</option>
            {dataTentor?.map((item, index) => (
              <option value={item.nama} key={index}>
                {item.nama}
              </option>
            ))}
          </Form.Select>
          <Form.Control
            placeholder="Jam Datang"
            aria-label="Jam Datang"
            aria-describedby="basic-addon1"
            type="time"
            onChange={(e) => {
              setTimeSelected(e.target.value);
            }}
          />
        </div>
      ),
    }).then((result) => {
      if (result.isConfirmed) {
        let formData = new FormData();
        formData.append("nama", tentorData.nama);
        formData.append("serialnumber", tentorData.serialnumber);
        formData.append("status", tentorData.status);
        formData.append("fingerprint_id", tentorData.fingerprint_id);
        formData.append("timein", timeSelected);
        formData.append("add_absen", "");
        setLoading(true);
        axios({
          method: "post",
          url: `${import.meta.env.VITE_BASEURL}/pres_tentor.php`,
          data: formData,
        })
          .then((response) => {
            if (response.data == "Berhasil") {
              Swal.fire({
                title: "Berhasil",
                timer: 1500,
                icon: "success",
                showConfirmButton: false,
              });
              fetchData();
            } else {
              Swal.fire({
                title: "Gagal Menambah Absensi",
                text: response.data,
                icon: "error",
              });
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const hapusData = (id) => {
    Swal.fire({
      title: `Menghapus data dengan id ${id}`,
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
        formData.append("delete_absen", "");
        axios({
          method: "post",
          url: `${import.meta.env.VITE_BASEURL}/pres_tentor.php`,
          data: formData,
        })
          .then((response) => {
            if (response.data == "Berhasil") {
              Swal.fire({
                title: "Berhasil",
                timer: 1500,
                icon: "success",
                showConfirmButton: false,
              });
              fetchData();
            } else {
              Swal.fire({
                title: "Gagal Menambah Absensi",
                text: response.data,
                icon: "error",
              });
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };
  return (
    <div className="w-element-admin">
      <div align="right" className="mb-3">
        <button className="btn btn-success me-2 mb-2" onClick={reloadData}>
          <i className="fa-solid fa-rotate"></i>
        </button>
        <a
          href="https://presensitentor.bimbel-citrabagusgrup.com/"
          target="_blank"
          className="btn btn-success me-2 mb-2"
        >
          <i className="fa-solid fa-globe"></i> Presensi Tentor
        </a>
        <button className="btn btn-success mb-2" onClick={AddAbsen}>
          <i className="fa-solid fa-user-plus"></i> Tambah Absensi
        </button>
      </div>
      <div>
        <table className="table table-striped table-info">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Fingerprint ID</th>
              <th>Tanggal</th>
              <th>Jam</th>
              <th>Hapus</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.nama}</td>
                <td>{item.fingerprint_id}</td>
                <td>{item.checkindate}</td>
                <td>{item.timein}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      hapusData(item.id);
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
export default PresTentor;
