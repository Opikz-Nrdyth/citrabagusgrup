import axios from "axios";
import { useEffect, useState } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const PraRegist = ({ setLoading }) => {
  const [data, setData] = useState([]);
  const SwalReactContent = withReactContent(Swal);

  const fetchData = () => {
    setLoading(true);
    axios({
      method: "get",
      url: `${import.meta.env.VITE_BASEURL}/siswa.php?read_praregist`,
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
  }, []);

  const regist = (user) => {
    const SelectedUser = data.find((item) => item.username == user);
    SwalReactContent.fire({
      title: "Rubah menjadi siswa ter-registrasi",
      showCancelButton: true,
      confirmButtonText: "Lanjut Edit",
      cancelButtonText: "Tidak Jadi",
      confirmButtonColor: "#157347",
      cancelButtonColor: "#bb2d3b",
      allowOutsideClick: false,
      html: (
        <div className="overflow-hidden">
          <FloatingLabel controlId="Username" label="Username" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Username"
              defaultValue={SelectedUser.username}
            />
          </FloatingLabel>
          <FloatingLabel controlId="Nama" label="Nama" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Nama"
              defaultValue={SelectedUser.nama}
            />
          </FloatingLabel>
          <div className="row">
            <div className="col-6">
              <Form.Select
                aria-label="Default select example"
                id="Kelas"
                className="mb-3"
                style={{ padding: "15px" }}
              >
                <option>Pilih Kelas</option>
                <option value="1" selected={SelectedUser.kelas == 1}>
                  Kelas 1
                </option>
                <option value="2" selected={SelectedUser.kelas == 2}>
                  Kelas 2
                </option>
                <option value="3" selected={SelectedUser.kelas == 3}>
                  Kelas 3
                </option>
                <option value="4" selected={SelectedUser.kelas == 4}>
                  Kelas 4
                </option>
                <option value="5" selected={SelectedUser.kelas == 5}>
                  Kelas 5
                </option>
                <option value="6" selected={SelectedUser.kelas == 6}>
                  Kelas 6
                </option>
                <option value="7" selected={SelectedUser.kelas == 7}>
                  Kelas 7
                </option>
                <option value="8" selected={SelectedUser.kelas == 8}>
                  Kelas 8
                </option>
                <option value="9" selected={SelectedUser.kelas == 9}>
                  Kelas 9
                </option>
                <option value="10" selected={SelectedUser.kelas == 10}>
                  Kelas 10
                </option>
                <option value="11" selected={SelectedUser.kelas == 11}>
                  Kelas 11
                </option>
                <option value="12" selected={SelectedUser.kelas == 12}>
                  Kelas 12
                </option>
              </Form.Select>
            </div>
            <FloatingLabel
              controlId="TypeKelas"
              label="Tipe Kelas"
              className="col-6"
            >
              <Form.Control
                type="text"
                placeholder="TypeKelas"
                defaultValue={SelectedUser.tipeKelas}
              />
            </FloatingLabel>
          </div>
          <FloatingLabel
            controlId="SecondaryClass"
            label="Secondary Kelas"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="Secondary Kelas"
              defaultValue={SelectedUser.secondary_kelas}
            />
          </FloatingLabel>
          <FloatingLabel controlId="Password" label="Password" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Password"
              defaultValue={SelectedUser.password}
            />
          </FloatingLabel>
        </div>
      ),
    }).then((result) => {
      if (result.isConfirmed) {
        const username = document.getElementById("Username").value;
        const nama = document.getElementById("Nama").value;
        const kelas = document.getElementById("Kelas").value;
        const tipeKelas = document.getElementById("TypeKelas").value;
        const secondaryClass = document.getElementById("SecondaryClass").value;
        const password = document.getElementById("Password").value;

        let formData = new FormData();
        formData.append("user", username);
        formData.append("nama", nama);
        formData.append("lahir", SelectedUser.Tanggal_lahir);
        formData.append("sekolah", SelectedUser.asal_sekolah);
        formData.append("hp", SelectedUser.no_hp);
        formData.append("kelas", kelas);
        formData.append("tipekelas", tipeKelas);
        formData.append("pass", password);
        formData.append("ortu", SelectedUser.orang_tua);
        formData.append("alamat", SelectedUser.alamat);
        formData.append("nohp", SelectedUser.no_hp);
        formData.append("secondary_kelas", secondaryClass);
        formData.append("program", SelectedUser.program);
        formData.append("tlp_ortu", SelectedUser.tlp_ortu);
        formData.append("pekerjaan", SelectedUser.pekerjaan);
        formData.append("userOld", user);

        setLoading(true);
        axios({
          method: "post",
          url: `${import.meta.env.VITE_BASEURL}/siswa.php?update`,
          data: formData,
        })
          .then((response) => {
            console.log(response.data);
            fetchData();
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const remove = (user, nama) => {
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
  };

  return (
    <div className="w-element-admin">
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
          {data?.map((item, index) => (
            <tr key={index}>
              <td>{item.username}</td>
              <td>{item.nama}</td>
              <td>{item.Tanggal_lahir}</td>
              <td>{item.asal_sekolah}</td>
              <td>{item.no_hp}</td>
              <td>{item.kelas}</td>
              <td>{item.tipeKelas}</td>
              <td>{item.secondary_kelas}</td>
              <td>{item.program}</td>
              <td>{item.orang_tua}</td>
              <td>{item.alamat}</td>
              <td>{item.tlp_ortu}</td>
              <td>{item.pekerjaan}</td>
              <td>{item.password}</td>
              <td className="fs-6">
                <span
                  onClick={() => {
                    regist(item.username);
                  }}
                >
                  <i className="fa-solid fa-check"></i>
                </span>
                {" | "}
                <span
                  onClick={() => {
                    remove(item.username, item.nama);
                  }}
                >
                  <i className="fa-solid fa-trash"></i>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default PraRegist;
