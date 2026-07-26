import BookingSection from "./Components/BookingSection";
import Cars from "./Components/Cars";
import WhyChooseUs from "./Components/WhyChooseUs";
import FaqSection from "./Components/FaqSection";

export default function Home() {
  return (
    <>
      {/* Page 1: carousel-background hero with the enquiry form.
          Submitting it navigates to /estimate (page 2). */}
      <BookingSection />

      <Cars />
      <WhyChooseUs />
      <FaqSection />
    </>
  );
}
