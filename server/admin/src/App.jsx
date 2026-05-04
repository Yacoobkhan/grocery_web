import react from 'react';
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = '$'

const App = () => {

  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");

  useEffect(() => {
    if(token){
      localStorage.setItem("adminToken",token);
    }
  },[token]);

  return (
    <div className="min-h-screen bg-gray-50">

      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />

          <div className="flex">
            {/* ✅ Sidebar always visible */}
            <Sidebar />

            {/* ✅ Page content */}
            <div className="flex-1 p-6">
              <Routes>
                <Route path="/" element={<Navigate to="/list" />} />
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      )}

    </div>
  );
};


export default App;