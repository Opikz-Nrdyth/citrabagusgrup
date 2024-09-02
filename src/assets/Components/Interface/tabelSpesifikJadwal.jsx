import axios from "axios";
import { useEffect, useState } from "react";

const TabelSpesifikJadwal = () => {
  const [dataJadwal, setDataJadwal] = useState([]);
  let Params = window.location.pathname;
  Params = Params.split("/");
  const Date = Params[3].split("-");

  function setBulanToInd(bulan, tahun) {
    let namaBulan = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    let namaBulanInd = namaBulan[bulan - 1];
    let tanggalInd = `${namaBulanInd} ${tahun}`;
    return tanggalInd;
  }

  useEffect(() => {
    axios({
      method: "get",
      url: `${import.meta.env.VITE_BASEURL}/calander.php?bulan=${Date[1]}&tahun=${Date[2]}`,
      responseType: "json",
    })
      .then(function (response) {
        setDataJadwal(response.data.Data);
      })
      .catch((err) => {
        Swal.fire({
          title: err,
          icon: "error",
        });
      });
  }, []);

  const listData = (item) => {
    return (
      <>
        {item.Schedule.map((data, index) => (
          <tr key={data.id}>
            <td>{index + 1}</td>
            <td>{data.jam}</td>
            <td>{data.kelas}</td>
            <td>{data.mapel}</td>
            <td>{data.pengajar}</td>
            <td>{data.ruangan}</td>
          </tr>
        ))}
      </>
    );
  };

  // filter dataJadwal berdasarkan item.Tanggal == Date[0]
  const filteredData = dataJadwal.filter((item) => item.Tanggal == Date[0]);

  return (
    <div className="content-jadwal-tentor">
      <div className="fs-3 p-3" align="center">
        {`${Date[0]}, ${setBulanToInd(Date[1], Date[2])}`}
      </div>
      <table className="table table-striped">
        <thead className="table-info text-center">
          <tr>
            <td>No</td>
            <td>Waktu</td>
            <td>Kelas</td>
            <td>Mapel</td>
            <td>Pengajar</td>
            <td>Ruangan</td>
          </tr>
        </thead>
        <tbody className="text-center">{filteredData.map(listData)}</tbody>
      </table>
    </div>
  );
};
export default TabelSpesifikJadwal;
