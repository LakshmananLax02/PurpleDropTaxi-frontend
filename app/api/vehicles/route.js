import { FALLBACK_VEHICLES } from "../../lib/booking";

export async function GET() {
  return Response.json(FALLBACK_VEHICLES);
}
