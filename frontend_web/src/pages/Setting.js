import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import "../styles/Dashboard.css";
import { useTranslation } from "react-i18next";

const Setting = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [language, setLanguage] = useState("id");

  const username = localStorage.getItem("username") || "Admin";

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
          hour12: i18n.language === "en"
        }
      );

      setCurrentDate(date);
      setCurrentTime(time);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [i18n.language]);

  useEffect(() => {
    const saved = localStorage.getItem("pengaturan");
    if (saved) {
      const parsed = JSON.parse(saved);
      setLanguage(parsed.language || "id");
      i18n.changeLanguage(parsed.language || "id");
    }
  }, [i18n]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSave = () => {
    const pengaturan = { language };
    localStorage.setItem("pengaturan", JSON.stringify(pengaturan));
    i18n.changeLanguage(language);
    alert(t("setting.saved"));
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
        <h3>{t("setting.title")}</h3>

        <div className="setting-section">
          <h4>🌐 {t("setting.display")}</h4>
          <label>
            {t("setting.language")}:
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ marginLeft: "0.5rem" }}
            >
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English</option>
            </select>
          </label>
        </div>

        <button
          onClick={handleSave}
          style={{
            marginTop: "20px",
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          💾 {t("setting.save")}
        </button>
      </main>
    </div>
  );
};

export default Setting;
