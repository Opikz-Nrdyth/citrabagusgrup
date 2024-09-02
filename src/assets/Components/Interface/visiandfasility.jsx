import Lottie from "lottie-react";
import { Container } from "react-bootstrap";
import Consult from "../../../Animation/Consult.json";
import Cafe from "../../../Animation/Cafe.json";
import Fasilitas from "../../../Animation/Fasilitas.json";
import Parkir from "../../../Animation/Parkir.json";
import Pertemuan from "../../../Animation/Pertemuan.json";
import Tryout from "../../../Animation/TryOut.json";
import { useEffect, useState } from "react";

const VisiDanFasilitas = () => {
  let [indexLottie, setIndexLottie] = useState("col-xs-12 col-sm-4 order-1");
  let [indexText, setIndexText] = useState("col-xs-12 col-sm-8 order-0");
  let [indexLottieRight, setIndexLottieRight] = useState(
    "col-xs-12 col-sm-4 order-0"
  );
  let [indexTextRight, setIndexTextRight] = useState(
    "col-xs-12 col-sm-8 order-1"
  );
  let [lottieAnimationLeft, setLottieAnimationLeft] = useState("fade-left");
  let [lottieAnimationRight, setLottieAnimationRight] = useState("fade-right");
  useEffect(() => {
    if (window.screen.width < 450) {
      setIndexLottie("col-xs-12 col-sm-4 order-0");
      setIndexText("col-xs-12 col-sm-8 order-1");
      setIndexLottieRight("col-xs-12 col-sm-4 order-0");
      setIndexTextRight("col-xs-12 col-sm-8 order-1");
      setLottieAnimationLeft("fade-up");
      setLottieAnimationRight("fade-up");
    }
  });
  return (
    <Container>
      {/* Visi dan Misi */}
      <div className="content-margin-welcome"></div>
      <div data-aos="fade-up">
        <h1 className="title" id="Fasilitas">
          Visi & Misi
        </h1>
        <p className="br-heart fs-6">
          <i className="fa-regular fa-heart"></i>
        </p>
      </div>
      <p className="content-visi" data-aos="fade-up">
        Berdedikasi dalam Membentuk Generasi Emas Indonesia. Sejak 2009, Bimbel
        Citra Bagus Grup telah berkontribusi dalam membangun fondasi pendidikan
        yang kuat di Indonesia. Kami berkomitmen untuk membantu setiap siswa
        mencapai potensi penuh mereka. Keramahan kami memudahkan siswa belajar.
      </p>

      {/* Fasilitas */}
      <div data-aos="fade-up">
        <h1 className="title" id="Fasilitas">
          Fasilitas
        </h1>
        <p className="br-heart fs-6">
          <i className="fa-regular fa-heart"></i>
        </p>
      </div>
      <div className="row d-flex align-items-center justify-content-center content-Fasilitas">
        <div className={indexLottieRight}>
          <Lottie
            animationData={Consult}
            className="w-100"
            data-aos={lottieAnimationRight}
          />
        </div>
        <div className={indexText}>
          <div data-aos={lottieAnimationLeft}>
            <h2 className="fw-bold title-fasilitas">
              Konsultasi diluar jam bimbel
            </h2>
            <p className="deskripsi-fasilitas">
              Setiap siswa diberikan kebebasan dalam berkonsultasi soal-soal
              meski di luar jam bimbel dan Setiap siswa di bimbing dengan cermat
              dalam penentuan jurusan yang ingin mereka ambil dalam jenjang
              selanjutnya
            </p>
          </div>
        </div>
      </div>
      <div className="row d-flex align-items-center justify-content-center content-Fasilitas">
        <div className={indexText}>
          <div data-aos={lottieAnimationRight}>
            <h2 className="fw-bold title-fasilitas">
              3X Pertemuan dalam seminggu
            </h2>
            <p className="deskripsi-fasilitas">
              Setiap siswa yang belajar di CBG akan mendapatkan jadwal les tiga
              kali pertemuan dalam seminggu dan dalam satu pertemuan memiliki
              waktu 90 menit
            </p>
          </div>
        </div>
        <div className={indexLottie}>
          <Lottie
            animationData={Pertemuan}
            className="w-100"
            data-aos={lottieAnimationLeft}
          />
        </div>
      </div>
      <div className="row d-flex align-items-center justify-content-center content-Fasilitas">
        <div className={indexLottieRight}>
          <Lottie
            animationData={Fasilitas}
            className="w-100"
            data-aos={lottieAnimationRight}
          />
        </div>
        <div className={indexTextRight}>
          <div data-aos={lottieAnimationLeft}>
            <h2 className="fw-bold title-fasilitas">
              Kelas Reguler dan Eksklusif
            </h2>
            <p className="deskripsi-fasilitas">
              Setiap siswa akan mendapatan kelas sesuai yang mereka inginan,
              untuk kelas reguler maksimal 12 siswa dan eksklusif maksimal 6
              siswa dan seluruh fasilitas yang lain akan disama ratakan
            </p>
          </div>
        </div>
      </div>
      <div className="row d-flex align-items-center justify-content-center content-Fasilitas">
        <div className={indexText}>
          <div data-aos={lottieAnimationRight}>
            <h2 className="fw-bold title-fasilitas">
              Soal Try out dan Gladi bersih
            </h2>
            <p className="deskripsi-fasilitas">
              Setiap siswa akan selalu di bimbing dalam pengerjaan UKK, SMBP,
              dan SNBT dengan soal-soal tryout yang di sediakan dan Gladi bersih
              sebelum pelaksanaan
            </p>
          </div>
        </div>
        <div className={indexLottie}>
          <Lottie
            animationData={Tryout}
            className="w-100"
            data-aos={lottieAnimationLeft}
          />
        </div>
      </div>
      <div className="row d-flex align-items-center justify-content-center content-Fasilitas">
        <div className={indexLottieRight}>
          <Lottie
            animationData={Cafe}
            className="w-100"
            data-aos={lottieAnimationRight}
          />
        </div>
        <div className={indexTextRight}>
          <div data-aos={lottieAnimationLeft}>
            <h2 className="fw-bold title-fasilitas">
              WiFi dan Cafe yang nyaman
            </h2>
            <p className="deskripsi-fasilitas">
              Di era serba internet ini kami juga memberikan fasilitas WIFI
              dengan koneksi yang cepat dan stabil untuk memudahkan siswa dalam
              belajar mengajar dan terdapat Cafe yang nyaman untuk siswa
              bersantai
            </p>
          </div>
        </div>
      </div>
      <div className="row d-flex align-items-center justify-content-center content-Fasilitas">
        <div className={indexText}>
          <div data-aos={lottieAnimationRight}>
            <h2 className="fw-bold title-fasilitas">Parkir yang luas</h2>
            <p className="deskripsi-fasilitas">
              Siswa diberikan fasilitas tempat parkir yang luas dan juga kang
              parkir yang siap sedia membantu para siswa dalam penempatan
              kendaraan bermotor
            </p>
          </div>
        </div>
        <div className={indexLottie}>
          <Lottie
            animationData={Parkir}
            className="w-100"
            data-aos={lottieAnimationLeft}
          />
        </div>
      </div>
    </Container>
  );
};
export default VisiDanFasilitas;
