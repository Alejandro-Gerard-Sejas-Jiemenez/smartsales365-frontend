import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router.jsx";
import CarritoFloatingButton from "./components/CarritoFloatingButton";
import { CarritoProvider } from "./pages/ecommerce/CarritoContext";

export default function App(){
  return (
    <CarritoProvider>
      <RouterProvider router={router} />
    </CarritoProvider>
  );
}