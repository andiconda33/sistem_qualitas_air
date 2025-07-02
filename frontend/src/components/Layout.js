import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import "./Layout.css";

function Layout() {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
