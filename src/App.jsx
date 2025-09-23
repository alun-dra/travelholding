// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import SiteShell from "./components/ui/SiteShell";

// Home (lista + hero + about)
import Home from "./pages/Home";

// Páginas de marcas (cada una con su diseño)
import BrandAltitude from "./pages/brands/AltitudeRituals";
import BrandTravelKit from "./pages/brands/TravelKit";
import BrandInnovawaste from "./pages/brands/Innovawaste";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteShell />}>
        <Route index element={<Home />} />

        {/* páginas por marca */}
        <Route path="brand/altitude-rituals" element={<BrandAltitude />} />
        <Route path="brand/travel-kit" element={<BrandTravelKit />} />
        <Route path="brand/innovawaste" element={<BrandInnovawaste />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
