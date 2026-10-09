import { Route, Routes } from "react-router-dom";

import { DEMO } from "./constants.js";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import ArtGallery from "./pages/ArtGallery.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import MapPage from "./pages/MapPage.jsx";
import PlaceDetailPage from "./pages/PlaceDetailPage.jsx";
import PlacesPage from "./pages/PlacesPage.jsx";

// Har bir sahifa (URL) uchun bitta komponent
export default function App() {
  return (
    <>
      {DEMO && (
        <div className="demo-banner">
          Demo rejim: namuna ma'lumotlar. Kirish uchun istalgan login va parolni yozing.
        </div>
      )}
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/places" element={<PlacesPage />} />
          <Route path="/places/:slug" element={<PlaceDetailPage />} />
          {import.meta.env.DEV && <Route path="/art-gallery" element={<ArtGallery />} />}
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<div className="container section"><h2>Sahifa topilmadi</h2></div>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
