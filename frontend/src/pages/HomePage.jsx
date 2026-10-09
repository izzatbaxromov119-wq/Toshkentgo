import CategoryCards from "../components/CategoryCards.jsx";
import CategoryChips from "../components/CategoryChips.jsx";
import DiscountBanners from "../components/DiscountBanners.jsx";
import Features from "../components/Features.jsx";
import FeaturedPlaces from "../components/FeaturedPlaces.jsx";
import Hero from "../components/Hero.jsx";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryCards />
      <CategoryChips />
      <DiscountBanners />
      <FeaturedPlaces />
      <Features />
    </>
  );
}
