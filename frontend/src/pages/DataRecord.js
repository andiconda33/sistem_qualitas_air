import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import DataRecordTable from "../components/DataRecordTable";

const DataRecord = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("hour");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(); // ✅ Tambahkan i18n

  const username = localStorage.getItem("username") || "User";

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const date = now.toISOString().split("T")[0];

      const time = now.toLocaleTimeString(
        i18n.language === "en" ? "en-US" : "id-ID", // ✅ Sesuai bahasa aktif
        {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit", 
          hour12: i18n.language === "en" // ✅ true = pakai AM/PM
        }
      );

      setCurrentDate(date);
      setCurrentTime(time);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [i18n.language]); // ✅ Tambahkan dependency agar update saat bahasa berubah

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
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

      <main className="dashboard-content">
        <div style={{ marginBottom: '1.5rem' }}>
          <label><strong>{t("record.selectPeriod")}:</strong></label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{
              marginLeft: '1rem',
              padding: '5px 10px',
              borderRadius: '5px',
              fontSize: '0.9rem'
            }}
          >
            <option value="hour">{t("record.perHour")}</option>
            <option value="day">{t("record.perDay")}</option>
            <option value="week">{t("record.perWeek")}</option>
            <option value="month">{t("record.perMonth")}</option>
          </select>
        </div>

        <DataRecordTable period={selectedPeriod} />
      </main>
    </div>
  );
};

export default DataRecord;
