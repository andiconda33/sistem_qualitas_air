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

  const [sensorData, setSensorData] = useState(null);
  const username = localStorage.getItem("username") || "User";

  // ✅ Auto Refresh Sensor Data setiap 3 detik
  useEffect(() => {
    const fetchSensorData = () => {
      fetch("http://localhost:4000/api/sensor")
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            setSensorData(data[0]); // ambil data terbaru karena sudah di-ORDER DESC
          }
        })
        .catch((err) => {
          console.error("Gagal ambil data sensor:", err);
        });
    };

    fetchSensorData(); // Ambil saat pertama kali load
    //const interval = setInterval(fetchSensorData, 10800000); // 3 jam = 3 * 60 * 60 * 1000 ms
    const interval = setInterval(fetchSensorData, 300000);
    return () => clearInterval(interval); // Hapus interval saat komponen unmount
  }, []); // ✅ kosong, jangan pakai i18n.language

  // Waktu real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString(
          i18n.language === "en" ? "en-US" : "id-ID"
        )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const checkStatus = (ph, suhu, amonia) => {
    const isPhNormal = ph >= 6.5 && ph <= 8.5;
    const isSuhuNormal = suhu >= 24 && suhu <= 30;
    const isAmoniaNormal = amonia <= 950;

    if (isPhNormal && isSuhuNormal && isAmoniaNormal) {
      return t("dashboard.Normal");
    } else if ((ph < 6 || ph > 9) || (suhu < 23 || suhu > 34) || (amonia > 1000)) {
      return t("dashboard.Bahaya");
    } else {
      return t("dashboard.Waspada");
    }
  };

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

        {!sensorData ? (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            {t("loading")}
          </p>
        ) : (
          <div className="cards-container">
            <div className="card">
              <img src="/ph-icon.png" alt="pH" className="icon" />
              <h3>{t("dashboard.ph")}</h3>
              <p>{sensorData.ph}</p>
            </div>
            <div className="card">
              <img src="/temp-icon.png" alt="Suhu" className="icon" />
              <h3>{t("dashboard.temp")}</h3>
              <p>{sensorData.suhu} °C</p>
            </div>
            <div className="card">
              <img src="/ammonia-icon.png" alt="Amonia" className="icon" />
              <h3>{t("dashboard.ammonia")}</h3>
              <p>{sensorData.amonia} ppm</p>
            </div>
            <div className="card">
              <img src="/condition-icon.png" alt="Kondisi" className="icon" />
              <h3>{t("dashboard.condition")}</h3>
              <p>{checkStatus(sensorData.ph, sensorData.suhu, sensorData.amonia)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
