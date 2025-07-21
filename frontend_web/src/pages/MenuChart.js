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

function MenuChart() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";

  const currentDate = new Date().toISOString().split('T')[0];
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString(i18n.language === 'en' ? "en-US" : "id-ID"));
  const [selectedParam, setSelectedParam] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('hour');
  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString(i18n.language === 'en' ? "en-US" : "id-ID"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch('http://localhost:4000/api/sensor')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(d => {
          const date = new Date(d.waktu || d.created_at);
          return {
            ...d,
            time: date.toTimeString().split(':').slice(0, 2).join(':'),
            dateStr: date.toISOString().split('T')[0],
            week: `Week ${getWeekNumber(date)}`,
            month: date.toLocaleString('default', { month: 'long' })
          };
        });
        setSensorData(formatted);
      })
      .catch(err => {
        console.error('Gagal fetch sensor data:', err);
      });
  }, []);

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const filteredData = {
    hour: sensorData.filter(d => d.dateStr === today).slice(-8), // ✅ hanya data hari ini
    day: groupAndAverage(sensorData, d => d.dateStr, 'date'),
    week: groupAndAverage(sensorData, d => d.week, 'week'),
    month: groupAndAverage(sensorData, d => d.month, 'month')
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
          <AreaChart data={filteredData[selectedPeriod]}>
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
