import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./DataRecordTable.css";

const DataRecordTable = ({ period, selectedDate, checkStatus }) => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:4000/api/sensor");
        const result = await res.json();

        const filtered = result.filter((row) => {
          const rowDate = new Date(row.created_at || row.waktu);
          const rowDateOnly = rowDate.toISOString().split("T")[0];
          return rowDateOnly === selectedDate;
        });

        setData(filtered);
      } catch (err) {
        console.error("❌ Gagal mengambil data sensor:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    if (selectedDate) {
      fetchData();
    }
  }, [period, selectedDate]);

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString(i18n.language === "en" ? "en-US" : "id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="table-container">
      <h3 className="table-title">{t("record.title")}</h3>
      <table className="record-table">
        <thead>
          <tr>
            <th>{t("record.hour")}</th>
            <th>{t("record.ph")}</th>
            <th>{t("record.temp")}</th>
            <th>{t("record.ammonia")}</th>
            <th>{t("record.quality")}</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                {t("loading")}
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                {t("record.noData")}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id}>
                <td>{formatTime(row.created_at || row.waktu)}</td>
                <td>{row.ph.toFixed(2)}</td>
                <td>{row.suhu.toFixed(2)} °C</td>
                <td>{row.amonia.toFixed(3)}</td>
                <td>{checkStatus(row.ph, row.suhu, row.amonia)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataRecordTable;
