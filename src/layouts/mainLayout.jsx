import { Outlet } from "react-router-dom";
import Header from "../components/header/header";
import CarritoFloatingButton from "../components/CarritoFloatingButton";


function MainLayout() {
  return (
    <>
      <Header />
      <main className="p-4">
        <Outlet />
      </main>
      <CarritoFloatingButton />
    </>
  );
}

export default MainLayout;