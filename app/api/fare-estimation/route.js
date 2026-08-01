import { calculateFareEstimate } from "../../lib/booking";

export async function POST(request) {
  try {
    const payload = await request.json();
    const { vehicleId, tripType, distanceKm, durationMins } = payload ?? {};

    if (!vehicleId || !tripType || !Number.isFinite(Number(distanceKm))) {
      return Response.json({ error: "Invalid fare estimate request." }, { status: 400 });
    }

    return Response.json(calculateFareEstimate({ vehicleId, tripType, distanceKm, durationMins }));
  } catch {
    return Response.json({ error: "Unable to calculate fare." }, { status: 400 });
  }
}
