import HeroSlider from "@/components/home/hero-slider";
import HowItWorks from "@/components/home/how-it-works";
import NewArrivals from "@/components/home/new-arrivals";
import Newsletter from "@/components/home/newsletter";
import ReaderReviews from "@/components/home/reader-reviews";
import TopCategories from "@/components/home/top-categories";

export default function Home() {
  return (
    <>
      <HeroSlider />

      <NewArrivals />

      <TopCategories />

      <HowItWorks />

      <ReaderReviews />

      <Newsletter />
    </>
  );
}
