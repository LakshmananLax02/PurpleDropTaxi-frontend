import Image from "next/image";
import HeroSection from './Components/HeroSection'
import BookingSection from './Components/BookingSection'


export default function Home() {
  return (
    <>
      <HeroSection />

      <div className="-mt-24 md:-mt-32 relative z-10">
        <BookingSection />
      </div>
   
    
    </>
  );
}
