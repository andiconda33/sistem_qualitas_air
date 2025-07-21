import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import DataRecordTable from "../components/DataRecordTable";

const DataRecord = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("hour");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const username = localStorage.getItem("username") || "User";

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const date = now.toISOString().split("T")[0];
      const time = now.toLocaleTimeString(
        i18n.language === "en" ? "en-US" : "id-ID",
        {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: i18n.language === "en",
        }
      );

      setCurrentDate(date);
      setCurrentTime(time);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [i18n.language]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  // Fungsi prediksi kualitas air
  const checkStatus = (ph, suhu, amonia) => {
    const isPhNormal = ph >= 6.5 && ph <= 8.5;
    const isSuhuNormal = suhu >= 26 && suhu <= 30;
    const isAmoniaNormal = amonia <= 950;

    if (isPhNormal && isSuhuNormal && isAmoniaNormal) {
      return t("dashboard.Normal");
    } else if ((ph < 6 || ph > 9) || (suhu < 24 || suhu > 34) || (amonia > 1000)) {
      return t("dashboard.Bahaya");
    } else {
      return t("dashboard.Waspada");
    }
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

        <div style={{ marginBottom: '1.5rem' }}>
          <label><strong>{t("record.selectDate")}:</strong></label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              marginLeft: '1rem',
              padding: '5px 10px',
              borderRadius: '5px',
              fontSize: '0.9rem'
            }}
          />
        </div>

        <DataRecordTable
          period={selectedPeriod}
          selectedDate={selectedDate}
          checkStatus={checkStatus}
        />
      </main>
    </div>
  );
};

export default DataRecord;
