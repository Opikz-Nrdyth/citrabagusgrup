import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
// Data JSX
import Aos from "aos";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Interface/home_page";
import "./assets/Style/universal.css";

import Login from "./pages/Interface/login";
import Index from "./pages/Admin";
import JadwalTentor from "./pages/Interface/jadwal_tentor";
import PresensiAdmin from "./pages/Interface/presensiAdmin";
import IndexClient from "./pages/Client";
import Daftar from "./assets/Components/Interface/daftar";

function App() {
  Aos.init();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/jadwal_tentor/*" element={<JadwalTentor />} />
        <Route path="/RuangAdmin/*" element={<Index />} />
        <Route path="/Siswa/*" element={<IndexClient />} />
        <Route path="/Daftar/*" element={<Daftar />} />
        <Route path="/presensi_karyawan" element={<PresensiAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
