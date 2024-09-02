import axios from "axios";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";

const Fakta = () => {
  const [data, setData] = useState({
    jumlahSiswa: 0,
    jumlahAlumni: 0,
    bulanBerdiri: 0,
    tenagaKerja: 0,
  });

  const calculateMonths = (startDate) => {
    const start = new Date(startDate);
    const end = new Date();

    const years = end.getFullYear() - start.getFullYear();

    return years;
  };

  const FetchData = async () => {
    const responseAlumni = await axios.get(
      `${import.meta.env.VITE_BASEURL}/alumni.php?read`
    );
    const responseSiswa = await axios.get(
      `${import.meta.env.VITE_BASEURL}/siswa.php?read`
    );

    const responseTentor = await axios.get(
      `${import.meta.env.VITE_BASEURL}/pres_tentor.php?read_tentor`
    );

    setData((prev) => ({
      ...prev,
      jumlahAlumni: responseAlumni.data.length,
      jumlahSiswa: responseSiswa.data.data.length,
      tenagaKerja: responseTentor.data.length,
      bulanBerdiri: calculateMonths("2009-06-01"),
    }));
  };

  useEffect(() => {
    FetchData();
  }, []);
  return (
    <Container>
      <div data-aos="fade-up">
        <h1 className="title" id="Fakta">
          Fakta Menarik
        </h1>
        <p className="br-heart fs-6">
          <i className="fa-regular fa-heart"></i>
        </p>
      </div>

      <div className="container-fakta">
        <div className="row">
          <div
            className="bg-fakta col-5 col-sm-2 m-1"
            data-aos="fade-up"
            data-aos-easing="linear"
            data-aos-duration="500"
          >
            <h1 className="text-white">
              <i className="fa-regular fa-clock icon-fakta"></i>
            </h1>
            <h1 className="fw-bolder text-white">{data.bulanBerdiri}</h1>
            <p className="text-white fs-6">Tahun Berdiri</p>
            <div className="footer-fakta w-100"></div>
          </div>
          <div
            className="bg-fakta col-5 col-sm-2 m-1"
            data-aos="fade-up"
            data-aos-easing="linear"
            data-aos-duration="800"
          >
            <h1 className="text-white">
              <i className="fa-solid fa-users icon-fakta"></i>
            </h1>
            <h1 className="fw-bolder text-white">{data.jumlahSiswa}</h1>
            <p className="text-white fs-6">Siswa Aktif</p>
            <div className="footer-fakta w-100"></div>
          </div>
          <div
            className="bg-fakta col-5 col-sm-2 m-1"
            data-aos="fade-up"
            data-aos-easing="linear"
            data-aos-duration="1100"
          >
            <h1 className="text-white">
              <i className="fa-solid fa-graduation-cap icon-fakta"></i>
            </h1>
            <h1 className="fw-bolder text-white">{7000 + data.jumlahAlumni}</h1>
            <p className="text-white fs-6">Lulus</p>
            <div className="footer-fakta w-100"></div>
          </div>
          <div
            className="bg-fakta col-5 col-sm-2 m-1"
            data-aos="fade-up"
            data-aos-easing="linear"
            data-aos-duration="1400"
          >
            <h1 className="text-white">
              <i className="fa-solid fa-user-tie icon-fakta"></i>
            </h1>
            <h1 className="fw-bolder text-white">{data.tenagaKerja}</h1>
            <p className="text-white fs-6">Tenaga Pengajar</p>
            <div className="footer-fakta w-100"></div>
          </div>
        </div>
      </div>
      <br />
      <br />
    </Container>
  );
};
export default Fakta;
