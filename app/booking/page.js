import BookingSection from '../Components/BookingSection'

export default async function Booking({ searchParams }) {
    const params = await searchParams;
    const pickup = typeof params.pickup === "string" ? params.pickup : "";
    const drop = typeof params.drop === "string" ? params.drop : "";
    const label = typeof params.route === "string" ? params.route : "";
    const presetRoute = pickup && drop ? { pickup, drop, label } : null;

    return <BookingSection key={presetRoute ? `${pickup}|${drop}` : "booking-form"} variant="booking" presetRoute={presetRoute} />;
}
