// frontend/src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
// import NavBar from "../components/NavBar";
import AddSchool from "./pages/AddSchool";
import ShowSchools from "./pages/ShowSchools";
import NavBar from "./components/Navbar";

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/schools" replace />} />
        <Route path="/add" element={<AddSchool />} />
        <Route path="/schools" element={<ShowSchools />} />
        <Route path="*" element={<div className="container py-4">Not Found</div>} />
      </Routes>
    </>
  );
}
