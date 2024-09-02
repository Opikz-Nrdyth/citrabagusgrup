import { Container, Form } from "react-bootstrap";
import "../../assets/Style/universal.css";
import "../../assets/Style/Client/penilaian.css";
import axios from "axios";
import { useEffect, useState } from "react";
const PenilaianSiswa = ({ dataSiswa }) => {
  const [siswa, setSiswa] = useState({
    kelas: "",
    induk: "",
  });

  const [dataTryout, setDataTryout] = useState([]);
  const [data, setData] = useState([]);
  const [dataNilai, setDataNilai] = useState([]);

  const [ujianSelected, setUjianSelected] = useState("");

  const fetchData = () => {
    dataSiswa.forEach((item) => {
      setSiswa((prevState) => ({ ...prevState, kelas: item.kelas }));
      setSiswa((prevState) => ({ ...prevState, induk: item.username }));

      axios({
        method: "get",
        url: `${import.meta.env.VITE_BASEURL}/penilaian.php?read_ujian&kelas=${
          item.kelas
        }`,
        responseType: "json",
      }).then((response) => {
        setDataTryout(response.data);

        let groupedData = [];
        let ujianMap = new Map(); // untuk menyimpan indeks dari setiap nama_ujian
        response.data.forEach((item) => {
          let nama_ujian = item.nama_ujian;
          if (ujianMap.has(nama_ujian)) {
            // jika nama_ujian sudah ada, tambahkan item ke data array
            let index = ujianMap.get(nama_ujian);
            groupedData[index].data.push(item);
          } else {
            // jika nama_ujian belum ada, buat objek baru dengan data array
            let newObj = {
              nama_ujian: nama_ujian,
              data: [item],
            };

            groupedData.push(newObj);
            ujianMap.set(nama_ujian, groupedData.length - 1);
          }
        });

        // Mengurutkan groupedData berdasarkan nama_ujian
        groupedData.sort((a, b) => a.nama_ujian.localeCompare(b.nama_ujian));

        setData(groupedData);

        fetchNilai(response.data);
      });
    });
  };

  const fetchNilai = (dataTryout) => {
    if (dataTryout && dataTryout.length > 0) {
      axios({
        method: "post",
        url: `${import.meta.env.VITE_BASEURL}/penilaian.php?read_nilai`,
        data: dataTryout,
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        const sortedData = response.data.sort((a, b) => {
          return a.nama.localeCompare(b.nama);
        });
        setDataNilai(sortedData);
      });
    }
  };

  useEffect(() => {
    fetchData();
    document.body.style.overflow = "scroll";
  }, [dataSiswa]);

  return (
    <Container className="container-data">
      <Form.Select
        aria-label="Default select example"
        onChange={(e) => {
          setUjianSelected(e.target.value);
        }}
      >
        <option>Pilih Nilai Ujian</option>
        {data.map((item, index) => (
          <option value={item.nama_ujian} key={index}>
            {item.nama_ujian}
          </option>
        ))}
      </Form.Select>
      <table className="table table-striped mt-3 table-bordered border-secondary">
        <thead className="table-info">
          <tr>
            <th rowSpan={2} className="align-middle text-center">
              Induk
            </th>
            <th rowSpan={2} className="align-middle text-center">
              Nama
            </th>
            <th rowSpan={2} className="align-middle text-center">
              Kelas
            </th>
            {data
              .filter((item) => item.nama_ujian == ujianSelected)
              .map((item, index) => (
                <th
                  key={index}
                  className="text-center"
                  colSpan={item.data.length}
                >
                  {item.nama_ujian}
                </th>
              ))}
          </tr>
          <tr>
            {dataTryout
              .filter((item) => item.nama_ujian == ujianSelected)
              .map((item, index) => (
                <th key={index} className="text-center">
                  {item.mapel}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {dataNilai.map((item, index) => (
            <tr
              key={index}
              className={item.username == siswa.induk ? "table-warning" : null}
            >
              <td className="text-center">{item.username}</td>
              <td className="text-center">{item.nama}</td>
              <td className="text-center">{`${item.kelas} ${item.tipeKelas}`}</td>
              {dataTryout
                .filter((item) => item.nama_ujian == ujianSelected)
                .map((m, i) => {
                  var NilaiValue = `${m.nama_ujian}_${m.mapel}`;
                  NilaiValue = NilaiValue.replaceAll(" ", "_");
                  return (
                    <td key={i} className="text-center">
                      {item[NilaiValue]}
                    </td>
                  );
                })}
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
};
export default PenilaianSiswa;
