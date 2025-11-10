import React from "react";
import {
  createBrowserRouter,
} from "react-router-dom";

import MainLayout from "../layouts/mainLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";


import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import RecuperarPassword from "../pages/RecuperarPassword.jsx";

import DashboardHome from "../pages/dashboard/home.jsx";
import CuentasPage from "../pages/dashboard/usuarios/cuentas.jsx";
import BitacoraPage from "../pages/dashboard/usuarios/bitacora.jsx";
import AvisosPage from "../pages/dashboard/usuarios/avisos.jsx";
import ClientesPage from "../pages/dashboard/usuarios/clientes.jsx"; 

import ErrorBoundaryPage from "../pages/ErrorBoundaryPage.jsx";
import ProtectedRoute from "../components/routing/ProtectedRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorBoundaryPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ]
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute roles={['ADMIN']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundaryPage />,
    children: [
      { index: true, element: <DashboardHome /> },
      
      // Acceso y Seguridad
      { path: "usuarios", element: <CuentasPage /> },
      { path: "usuarios/bitacora", element: <BitacoraPage /> },
      { path: "avisos", element: <AvisosPage /> },
      { path: "clientes", element: <ClientesPage /> },
      
    ]
  },
  {
    path: "/recuperar-password",
    element: <RecuperarPassword />
  },
  { path: "*", element: <ErrorBoundaryPage /> }
]);

export { router };
