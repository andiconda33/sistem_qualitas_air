import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import "../styles/Dashboard.css";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentDate = new Date().toISOString().split("T")[0];
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString(i18n.language === "en" ? "en-US" : "id-ID")
  );

  const username = localStorage.getItem("username") || "User";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString(i18n.language === "en" ? "en-US" : "id-ID")
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const dummyData = {
    ph: 11,
    suhu: 34,
    amonia: "0.6 ppm"
  };

  const checkStatus = (ph, suhu, amoniaStr) => {
    const amonia = parseFloat(amoniaStr);
    const isPhNormal = ph >= 6.5 && ph <= 8.5;
    const isSuhuNormal = suhu >= 26 && suhu <= 32;
    const isAmoniaNormal = amonia <= 0.5;

    if (isPhNormal && isSuhuNormal && isAmoniaNormal) {
      return t("dashboard.Normal");
    } else if ((ph < 6 || ph > 9) || (suhu < 24 || suhu > 34) || (amonia > 1)) {
      return t("dashboard.Bahaya");
    } else {
      return t("dashboard.Waspada");
    }
  };

  const kondisi = checkStatus(dummyData.ph, dummyData.suhu, dummyData.amonia);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <img src="/logo.png" alt="Logo" className="header-logo" />
            <h2>{t("title")}</h2>
          </div>
          <div className="dashboard-user">
            <span>{currentDate} | {currentTime}</span>
            <span>{t("hi", { name: username })}</span>
            <button className="logout-button" onClick={handleLogout}>
              <FaSignOutAlt /> {t("logout")}
            </button>
          </div>
        </header>
        
        <div className="cards-container">
          <div className="card">
            <img src="/ph-icon.png" alt="pH" className="icon" />
            <h3>{t("dashboard.ph")}</h3>
            <p>{dummyData.ph}</p>
          </div>
          <div className="card">
            <img src="/temp-icon.png" alt="Suhu" className="icon" />
            <h3>{t("dashboard.temp")}</h3>
            <p>{dummyData.suhu} °C</p>
          </div>
          <div className="card">
            <img src="/ammonia-icon.png" alt="Amonia" className="icon" />
            <h3>{t("dashboard.ammonia")}</h3>
            <p>{dummyData.amonia}</p>
          </div>
          <div className="card">
            <img src="/condition-icon.png" alt="Kondisi" className="icon" />
            <h3>{t("dashboard.condition")}</h3>
            <p>{kondisi}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
