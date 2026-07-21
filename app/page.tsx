import Image from "next/image";
import HeroSection from './Components/HeroSection'
import BookingSection from './Components/BookingSection'
import Cars from './Components/Cars'
import WhyChooseUs from './Components/WhyChooseUs'
import FaqSection from './Components/FaqSection'


export default function Home() {
  return (
    <>
      <HeroSection />

      <div className="-mt-24 md:-mt-32 relative z-10">
        <BookingSection />
      </div>

      <Cars/>
      <WhyChooseUs/>



      <FaqSection/>

   
    
    </>
  );
}
