import "../../Style/Admin/sidebar.css";
import "../../Style/universal.css";
import jsonIndex from "../../../json/menuAdmin.json";
import { useNavigate, useParams } from "react-router-dom";
const SidebarAdmin = () => {
  const navigate = useNavigate();
  const width = window.screen.width;
  const Params = useParams();
  const Admin = Params["*"];
  function humbergerClick(nav) {
    if (width < 450) {
      document.getElementById("sidebar").setAttribute("hidden", "");
    }
    navigate(nav);
  }

  return (
    <div className="sidebar z-3 pb-5" id="sidebar" hidden={width < 450}>
      {jsonIndex.map((item, index) => (
        <div
          className={
            Admin.replaceAll(" ", "_").toLocaleLowerCase() ==
            item.name.replaceAll(" ", "_").toLocaleLowerCase()
              ? "fs-6 side-item-active fw-bolder"
              : "fs-6 side-item"
          }
          key={index}
          onClick={() => {
            let newName = item.name.replaceAll(" ", "_").toLowerCase();
            humbergerClick(newName);
          }}
        >
          <span dangerouslySetInnerHTML={{ __html: item.logo }}>{}</span>
          {" " + item.name}
        </div>
      ))}
    </div>
  );
};
export default SidebarAdmin;
