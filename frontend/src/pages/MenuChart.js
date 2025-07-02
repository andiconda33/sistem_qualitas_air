import React, { useState, useEffect } from 'react';
import {
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, AreaChart, Area
} from 'recharts';
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const colors = {
  ph: '#007bff',
  suhu: '#28a745',
  amonia: '#ff6b35'
};

const hourData = [
  { tanggal: "2025-06-20", time: '02:00', ph: 7.1, suhu: 28, amonia: 0.5 },
  { tanggal: "2025-06-20", time: '05:00', ph: 7.4, suhu: 29, amonia: 0.6 },
  { tanggal: "2025-06-20", time: '08:00', ph: 7.2, suhu: 30, amonia: 0.7 },
  { tanggal: "2025-06-20", time: '11:00', ph: 7.6, suhu: 31, amonia: 0.8 },
  { tanggal: "2025-06-20", time: '14:00', ph: 7.3, suhu: 30, amonia: 0.6 },
  { tanggal: "2025-06-20", time: '17:00', ph: 7.5, suhu: 29, amonia: 0.6 },
  { tanggal: "2025-06-20", time: '20:00', ph: 7.0, suhu: 28, amonia: 0.4 },
  { tanggal: "2025-06-20", time: '23:00', ph: 7.1, suhu: 27, amonia: 0.3 },

  { tanggal: "2025-06-21", time: '02:00', ph: 7.2, suhu: 28, amonia: 0.5 },
  { tanggal: "2025-06-21", time: '05:00', ph: 7.3, suhu: 29, amonia: 0.6 },
  { tanggal: "2025-06-21", time: '08:00', ph: 7.4, suhu: 30, amonia: 0.7 },
  { tanggal: "2025-06-21", time: '11:00', ph: 7.6, suhu: 31, amonia: 0.8 },
  { tanggal: "2025-06-21", time: '14:00', ph: 7.5, suhu: 30, amonia: 0.6 },
  { tanggal: "2025-06-21", time: '17:00', ph: 7.3, suhu: 29, amonia: 0.6 },
  { tanggal: "2025-06-21", time: '20:00', ph: 7.2, suhu: 28, amonia: 0.4 },
  { tanggal: "2025-06-21", time: '23:00', ph: 7.1, suhu: 27, amonia: 0.3 },
];

function average(data) {
  const valid = data.filter(d => d.ph && d.suhu && d.amonia);
  const total = valid.length;
  return {
    ph: +(valid.reduce((sum, d) => sum + d.ph, 0) / total).toFixed(2),
    suhu: +(valid.reduce((sum, d) => sum + d.suhu, 0) / total).toFixed(2),
    amonia: +(valid.reduce((sum, d) => sum + d.amonia, 0) / total).toFixed(2)
  };
}

function getWeekNumber(date) {
  const onejan = new Date(date.getFullYear(), 0, 1);
  return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}

function groupAndAverage(data, keyFn, labelKey) {
  const groups = {};
  data.forEach(d => {
    const key = keyFn(d);
    if (!groups[key]) groups[key] = [];
    groups[key].push(d);
  });
  return Object.entries(groups).map(([key, values]) => ({
    [labelKey]: key,
    ...average(values)
  }));
}

const dates = [...new Set(hourData.map(d => d.tanggal))];
const latestDate = dates.sort().reverse()[0];
const filteredHourData = hourData
  .filter(d => d.tanggal === latestDate)
  .sort((a, b) => a.time.localeCompare(b.time))
  .slice(0, 8);

const dayData = groupAndAverage(hourData, d => d.tanggal, 'date');
const weekData = groupAndAverage(hourData, d => `Week ${getWeekNumber(new Date(d.tanggal))}`, 'week');
const monthData = groupAndAverage(hourData, d => new Date(d.tanggal).toLocaleString('default', { month: 'long' }), 'month');

function MenuChart() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";

  const currentDate = new Date().toISOString().split('T')[0];
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString(i18n.language === 'en' ? "en-US" : "id-ID"));
  const [selectedParam, setSelectedParam] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('hour');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString(i18n.language === 'en' ? "en-US" : "id-ID"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    hour: filteredHourData,
    day: dayData,
    week: weekData,
    month: monthData
  };

  const getXAxisKey = () => {
    switch (selectedPeriod) {
      case 'day': return 'date';
      case 'week': return 'week';
      case 'month': return 'month';
      default: return 'time';
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
          <button className="logout-button" onClick={() => navigate('/login')}>
            <FaSignOutAlt /> {t("logout")}
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ fontWeight: 'bold' }}>{t("menuChart.parameter")}:</label>
          <select
            value={selectedParam}
            onChange={(e) => setSelectedParam(e.target.value)}
            style={{ marginLeft: '1rem', padding: '5px 10px', borderRadius: '5px' }}>
            <option value="all">{t("menuChart.all")}</option>
            <option value="ph">{t("menuChart.ph")}</option>
            <option value="suhu">{t("menuChart.temperature")}</option>
            <option value="amonia">{t("menuChart.ammonia")}</option>
          </select>
        </div>

        <div>
          <label style={{ fontWeight: 'bold' }}>{t("menuChart.time")}:</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{ marginLeft: '1rem', padding: '5px 10px', borderRadius: '5px' }}>
            <option value="hour">{t("menuChart.hour")}</option>
            <option value="day">{t("menuChart.day")}</option>
            <option value="week">{t("menuChart.week")}</option>
            <option value="month">{t("menuChart.month")}</option>
          </select>
        </div>
      </div>

      <div style={{ width: '100%', height: 400 }}>
        <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>{t("menuChart.graph")}</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData[selectedPeriod]}>
            <defs>
              <linearGradient id="phGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.ph} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colors.ph} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="suhuGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.suhu} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colors.suhu} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="amoniaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.amonia} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colors.amonia} stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis dataKey={getXAxisKey()} />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />

            {(selectedParam === 'all' || selectedParam === 'ph') && (
              <Area type="monotone" dataKey="ph" stroke={colors.ph} fill="url(#phGradient)" name={t("menuChart.ph")} />
            )}
            {(selectedParam === 'all' || selectedParam === 'suhu') && (
              <Area type="monotone" dataKey="suhu" stroke={colors.suhu} fill="url(#suhuGradient)" name={t("menuChart.temperature")} />
            )}
            {(selectedParam === 'all' || selectedParam === 'amonia') && (
              <Area type="monotone" dataKey="amonia" stroke={colors.amonia} fill="url(#amoniaGradient)" name={t("menuChart.ammonia")} />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default MenuChart;
