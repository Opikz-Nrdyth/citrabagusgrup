import { Container } from "react-bootstrap";
import jsonIndex from "../../json/menuAdmin.json";
import "../../assets/Style/Admin/Dashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const [Colum, setColum] = useState("col-2");
  const navigate = useNavigate();
  useEffect(() => {
    const width = window.screen.width;
    if (width < 450) {
      setColum("col-5");
    } else if (width > 450 && width < 850) {
      setColum("col-3");
    } else {
      setColum("col-2");
    }
  }, []);
  return (
    <div className="row container-menu">
      {jsonIndex.map((item, index) => (
        <button
          key={index}
          className={Colum + " btn btn-orangered p-3 rounded-3 m-1"}
          align="center"
          onClick={() => {
            navigate(item.name.toLocaleLowerCase().replaceAll(" ", "_"));
          }}
        >
          <h1 dangerouslySetInnerHTML={{ __html: item.logo }}></h1>
          <h2>{item.name}</h2>
        </button>
      ))}
    </div>
  );
};
export default Dashboard;
