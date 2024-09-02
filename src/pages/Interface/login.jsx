import { FloatingLabel, Form, InputGroup } from "react-bootstrap";
import "../../assets/Style/login.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "/images/logotext.png";
import axios from "axios";
import Swal from "sweetalert2";

const Login = () => {
  document.title = "Login";
  let [eyes, setEyes] = useState('<i class="fa-solid fa-eye"></i>');
  let [tipe, setTipe] = useState("password");
  const navigate = useNavigate();
  const storageUser = localStorage.getItem("user");
  const storagePass = localStorage.getItem("pass");
  const [data, setData] = useState({
    user: "",
    pass: "",
  });

  function eyesClick() {
    if (eyes == '<i class="fa-solid fa-eye"></i>') {
      setEyes('<i class="fa-solid fa-eye-slash"></i>');
      setTipe("text");
    } else {
      setEyes('<i class="fa-solid fa-eye"></i>');
      setTipe("password");
    }
  }

  const fetchData = () => {
    axios({
      method: "get",
      url: `${import.meta.env.VITE_BASEURL}/settings.php?read`,
    }).then((response) => {
      response.data.forEach((item) => {
        if (item.nama == "username") {
          setData((prevState) => ({ ...prevState, user: item.value }));
        }
        if (item.nama == "password") {
          setData((prevState) => ({ ...prevState, pass: item.value }));
        }
      });
    });
  };

  useEffect(() => {
    fetchData();
    document.body.style.overflowY = "hidden";
    if (storageUser != null && storagePass != null) {
      data && data.length > 0 ? Login() : null;
    }
  }, []);

  function Login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    axios({
      method: "get",
      url: `${
        import.meta.env.VITE_BASEURL
      }/siswa.php?login&username=${user}&password=${pass}`,
      responseType: "json",
    }).then((response) => {
      if (response.data == "Gagal") {
        if (user == data.user && pass == data.pass) {
          localStorage.setItem("user", user);
          localStorage.setItem("pass", pass);
          navigate("/RuangAdmin/");
        } else {
          Swal.fire({
            title: "Username atau Password anda salah",
            icon: "error",
          });
        }
      } else {
        localStorage.setItem("user", user);
        localStorage.setItem("pass", pass);
        navigate("/Siswa/");
      }
    });
  }

  document.onkeydown = (event) => {
    if (event.key == "Enter") {
      Login();
    }
  };

  return (
    <div className="bg-Login">
      <div align="center">
        <img src={logo} alt="logo" className="logotext" />
      </div>
      <div className="glass position-absolute start-50 top-80 translate-middle"></div>
      <div className="from-input position-absolute start-50 top-80 translate-middle">
        <FloatingLabel
          controlId="username"
          label="Username"
          className="mb-3 user"
        >
          <Form.Control
            type="text"
            placeholder="Username"
            defaultValue={storageUser}
          />
        </FloatingLabel>

        <InputGroup className="mb-3">
          <FloatingLabel controlId="password" label="Password">
            <Form.Control
              type={tipe}
              placeholder="Password"
              defaultValue={storagePass}
            />
          </FloatingLabel>
          <button className="btn btn-light" onClick={eyesClick}>
            <span dangerouslySetInnerHTML={{ __html: eyes }}></span>
          </button>
        </InputGroup>
        <button className="btn btn-success w-100" id="login" onClick={Login}>
          LOGIN
        </button>
      </div>
    </div>
  );
};
export default Login;
