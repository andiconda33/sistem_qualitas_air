import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Dummy data per jam
const dummyData = [
  // 2025-06-16
  { tanggal: "2025-06-16", jam: "02:00", ph: 6.1, suhu: 32.5, amonia: 0.07 },
  { tanggal: "2025-06-16", jam: "05:00", ph: 7.0, suhu: 29.0, amonia: 0.03 },
  { tanggal: "2025-06-16", jam: "08:00", ph: 7.1, suhu: 28.5, amonia: 0.01 },
  { tanggal: "2025-06-16", jam: "11:00", ph: 6.7, suhu: 29.1, amonia: 0.03 },
  { tanggal: "2025-06-16", jam: "14:00", ph: 6.5, suhu: 30.2, amonia: 0.04 },
  { tanggal: "2025-06-16", jam: "17:00", ph: 6.2, suhu: 30.8, amonia: 0.06 },
  { tanggal: "2025-06-16", jam: "20:00", ph: 6.9, suhu: 31.5, amonia: 0.02 },
  { tanggal: "2025-06-16", jam: "23:00", ph: 7.4, suhu: 28.9, amonia: 0.01 },
  
  // 2025-06-17
  { tanggal: "2025-06-17", jam: "02:00", ph: 6.0, suhu: 33.0, amonia: 0.08 },
  { tanggal: "2025-06-17", jam: "05:00", ph: 7.3, suhu: 28.4, amonia: 0.02 },
  { tanggal: "2025-06-17", jam: "08:00", ph: 6.8, suhu: 28.0, amonia: 0.02 },
  { tanggal: "2025-06-17", jam: "11:00", ph: 6.9, suhu: 29.4, amonia: 0.05 },
  { tanggal: "2025-06-17", jam: "14:00", ph: 6.6, suhu: 30.6, amonia: 0.03 },
  { tanggal: "2025-06-17", jam: "17:00", ph: 6.3, suhu: 31.8, amonia: 0.06 },
  { tanggal: "2025-06-17", jam: "20:00", ph: 7.2, suhu: 32.0, amonia: 0.01 },
  { tanggal: "2025-06-17", jam: "23:00", ph: 7.4, suhu: 28.7, amonia: 0.02 },
  
  // 2025-06-18
  { tanggal: "2025-06-18", jam: "02:00", ph: 6.1, suhu: 32.2, amonia: 0.07 },
  { tanggal: "2025-06-18", jam: "05:00", ph: 7.0, suhu: 28.7, amonia: 0.02 },
  { tanggal: "2025-06-18", jam: "08:00", ph: 7.0, suhu: 27.5, amonia: 0.01 },
  { tanggal: "2025-06-18", jam: "11:00", ph: 6.9, suhu: 28.9, amonia: 0.02 },
  { tanggal: "2025-06-18", jam: "14:00", ph: 6.5, suhu: 30.4, amonia: 0.04 },
  { tanggal: "2025-06-18", jam: "17:00", ph: 6.2, suhu: 31.0, amonia: 0.06 },
  { tanggal: "2025-06-18", jam: "20:00", ph: 6.8, suhu: 30.0, amonia: 0.03 },
  { tanggal: "2025-06-18", jam: "23:00", ph: 7.3, suhu: 28.8, amonia: 0.01 },

];

// Fungsi menentukan kualitas air
const getKualitas = ({ ph, suhu, amonia }) => {
  if (ph < 6.0 || ph > 9.0 || suhu < 24 || suhu > 32 || amonia > 0.05) return "Bahaya";
  if (ph < 6.5 || ph > 8.5 || (suhu >= 24 && suhu < 26) || (suhu > 30 && suhu <= 32) || (amonia > 0.02 && amonia <= 0.05)) return "Waspada";
  return "Normal";
};

const rataRata = (items) => {
  const total = items.reduce((acc, item) => {
    acc.ph += item.ph;
    acc.suhu += item.suhu;
    acc.amonia += item.amonia;
    return acc;
  }, { ph: 0, suhu: 0, amonia: 0 });
  const length = items.length;
  return {
    ph: total.ph / length,
    suhu: total.suhu / length,
    amonia: total.amonia / length
  };
};

const generateDailyData = (data) => {
  const grouped = {};
  data.forEach(item => {
    if (!grouped[item.tanggal]) grouped[item.tanggal] = [];
    grouped[item.tanggal].push(item);
  });
  return Object.entries(grouped).map(([tanggal, rows]) => {
    const avg = rataRata(rows);
    return { label: tanggal, ...avg, kualitas: getKualitas(avg) };
  });
};

const generateWeeklyData = (data) => {
  const grouped = {};
  data.forEach(item => {
    const date = new Date(item.tanggal);
    const weekKey = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
    if (!grouped[weekKey]) grouped[weekKey] = [];
    grouped[weekKey].push(item);
  });
  return Object.entries(grouped).map(([label, rows]) => {
    const avg = rataRata(rows);
    return { label: `Week ${label}`, ...avg, kualitas: getKualitas(avg) };
  });
};

const generateMonthlyData = (data) => {
  const grouped = {};
  data.forEach(item => {
    const date = new Date(item.tanggal);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!grouped[monthKey]) grouped[monthKey] = [];
    grouped[monthKey].push(item);
  });
  return Object.entries(grouped).map(([label, rows]) => {
    const avg = rataRata(rows);
    const monthName = new Date(label + "-01").toLocaleString("default", { month: "long", year: "numeric" });
    return { label: monthName, ...avg, kualitas: getKualitas(avg) };
  });
};

const DataRecordTable = ({ period = "hour" }) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState("2025-06-16");
  const [dataTampil, setDataTampil] = useState([]);

  useEffect(() => {
    if (period === "hour") {
      const filtered = dummyData.filter(row => row.tanggal === selectedDate).map(row => ({ ...row, kualitas: getKualitas(row) }));
      setDataTampil(filtered);
    } else if (period === "day") {
      setDataTampil(generateDailyData(dummyData));
    } else if (period === "week") {
      setDataTampil(generateWeeklyData(dummyData));
    } else if (period === "month") {
      setDataTampil(generateMonthlyData(dummyData));
    }
  }, [period, selectedDate]);

  const getColumnLabel = () => {
    const map = {
      hour: t("record.column.hour"),
      day: t("record.column.day"),
      week: t("record.column.week"),
      month: t("record.column.month")
    };
    return map[period] || t("record.column.day");
  };

  return (
    <div className="dashboard-content">
      {period === "hour" && (
        <div style={{ margin: "1rem 0" }}>
          <label><strong>{t("record.selectDate")}:</strong></label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ marginLeft: "1rem", padding: "5px" }}
          />
        </div>
      )}

      <div className="table-container">
        <h3 style={{ marginBottom: "1rem" }}>{t("record.tableTitle")}</h3>
        <table className="record-table" border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%" }}>
          <thead style={{ background: "#f0f0f0" }}>
            <tr>
              <th>{getColumnLabel()}</th>
              <th>{t("record.column.ph")}</th>
              <th>{t("record.column.temp")}</th>
              <th>{t("record.column.ammonia")}</th>
              <th>{t("record.column.quality")}</th>
            </tr>
          </thead>
          <tbody>
            {dataTampil.length > 0 ? (
              dataTampil.map((row, i) => (
                <tr key={i}>
                  <td>{row.jam || row.label}</td>
                  <td>{row.ph.toFixed(2)}</td>
                  <td>{row.suhu.toFixed(2)}</td>
                  <td>{row.amonia.toFixed(3)}</td>
                  <td>{t(`dashboard.${row.kualitas}`)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>{t("record.noData")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataRecordTable;
