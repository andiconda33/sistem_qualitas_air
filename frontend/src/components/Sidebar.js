import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaChartBar,
  FaDatabase,
  FaCog,
  FaSyncAlt,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleUpdate = () => {
    alert("Data berhasil diperbarui!");
  };

  return (
    <div className="sidebar">
      <div className="menu">
        <div
          className={`menu-item ${currentPath === "/dashboard" ? "active" : ""}`}
          onClick={() => handleNavigation("/dashboard")}
        >
          <FaTachometerAlt className="menu-icon" />
          <span>Dashboard</span>
        </div>
        <div
          className={`menu-item ${currentPath === "/menu-chart" ? "active" : ""}`}
          onClick={() => handleNavigation("/menu-chart")}
        >
          <FaChartBar className="menu-icon" />
          <span>Menu Chart</span>
        </div>
        <div
          className={`menu-item ${currentPath === "/data-record" ? "active" : ""}`}
          onClick={() => handleNavigation("/data-record")}
        >
          <FaDatabase className="menu-icon" />
          <span>Data Record</span>
        </div>
        <div
          className={`menu-item ${currentPath === "/setting" ? "active" : ""}`}
          onClick={() => handleNavigation("/setting")}
        >
          <FaCog className="menu-icon" />
          <span>Setting</span>
        </div>
      </div>

      <div className="update-section">
        <div className="update-icon">
          <FaSyncAlt />
        </div>
        <h4>UPDATE DATE</h4>
        <p>Klik Update Untuk Menampilkan Data Terbaru</p>
        <button className="update-button" onClick={handleUpdate}>
          Update
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
