import React from "react";
import { Navigate } from "react-router-dom";
import { getToken, getUser } from "../../services/auth.js";

export default function ProtectedRoute({ children, roles = [] }) {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;

  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;

  if (!roles || roles.length === 0) return children;

  const wanted = roles.map(r => String(r || '').toUpperCase());

  if (wanted.includes('ADMIN') || wanted.includes('SUPERUSER')) {
    // Normalizamos posibles formatos de is_superuser
    const raw = user.is_superuser;
    const isSuperuser = (raw === true) || (raw === 1) || (String(raw).toLowerCase() === 'true');
    if (isSuperuser) return children;
    return <Navigate to="/" replace />;
  }

  const userRol = String(user.rol || '').toUpperCase();
  if (wanted.includes(userRol)) return children;

  return <Navigate to="/" replace />;
}