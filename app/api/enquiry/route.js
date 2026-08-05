export const runtime = "nodejs";

const TELEGRAM_API = "https://api.telegram.org";

function text(value, fallback = "—") {
  const normalized = String(value ?? "").trim();
  return normalized ? normalized.slice(0, 500) : fallback;
}

function escapeHtml(value) {
  return text(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[character]));
}

function formatTripType(tripType) {
  return {
    oneway: "One Way",
    roundtrip: "Round Trip",
    airport: "Airport Pickup",
  }[tripType] ?? "One Way";
}

function formatVehicle(vehicleId) {
  return {
    sedan: "Sedan",
    prime_sedan: "Prime Sedan",
    suv: "SUV",
    prime_suv: "Prime SUV",
  }[vehicleId] ?? text(vehicleId);
}

function formatPickupDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? "");
  if (!match) return text(value);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00`));
}

function formatRupees(amount) {
  const value = Number(amount);
  return Number.isFinite(value) ? `₹${Math.round(value).toLocaleString("en-IN")}` : "—";
}

function referenceId(value) {
  if (typeof value === "string" && /^ENQ-[A-Z0-9-]+$/i.test(value)) return value;
  return `ENQ-${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 90 + 10)}`;
}

function selectedRequirements(form) {
  const labels = [
    ["womanAlone", "Woman travelling alone"],
    ["seniorCitizen", "Senior citizen"],
    ["travellingWithInfant", "Travelling with infant"],
    ["extraLuggage", "Extra luggage"],
  ];
  return labels.filter(([key]) => form?.[key]).map(([, label]) => label);
}

function telegramMessage({ event, form, fare, tripType, enquiryId }) {
  const isInstantEnquiry = event === "instant-enquiry";
  if (isInstantEnquiry) {
    return [
      "⚡ <b>INSTANT WEBSITE ENQUIRY</b>",
      "━━━━━━━━━━━━━━━━━━━",
      "👤 <b>CUSTOMER DETAILS</b>",
      `🧑 <b>Name:</b> ${escapeHtml(form?.customerName)}`,
      `📞 <b>Mobile:</b> ${escapeHtml(form?.mobile)}`,
      "",
      "🌐 <b>Source:</b> 10-second website popup",
      `🕒 <b>Received:</b> ${new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date())}`,
      "",
      "<i>Please contact this customer as soon as possible.</i>",
    ].join("\n");
  }

  const isConfirmation = event === "booking-confirmed";
  const title = isConfirmation ? "✅ <b>BOOKING CONFIRMED</b>" : "📝 <b>NEW FARE ENQUIRY</b>";
  const bookingLines = [
    title,
    "",
    `<b>Reference:</b> ${escapeHtml(enquiryId)}`,
    `<b>Trip type:</b> ${escapeHtml(formatTripType(tripType))}`,
    `<b>Vehicle:</b> ${escapeHtml(form?.vehicle)}`,
    "",
    `<b>Pickup:</b> ${escapeHtml(form?.pickup)}`,
    `<b>Drop:</b> ${escapeHtml(form?.drop)}`,
    `<b>Date & time:</b> ${escapeHtml(form?.pickupDate)} · ${escapeHtml(form?.pickupTime)}`,
    "",
    `<b>Customer:</b> ${escapeHtml(form?.customerName)}`,
    `<b>Mobile:</b> ${escapeHtml(form?.mobile)}`,
    form?.email ? `<b>Email:</b> ${escapeHtml(form.email)}` : null,
    `<b>Requirements:</b> ${escapeHtml(selectedRequirements(form))}`,
  ];

  if (isConfirmation) {
    bookingLines.push(
      "",
      "<b>Fare estimate</b>",
      `<b>Total:</b> ${escapeHtml(formatRupees(fare?.fare))}`,
      `<b>Distance:</b> ${escapeHtml(fare?.distanceKm)} km`,
      `<b>Rate:</b> ${escapeHtml(formatRupees(fare?.ratePerKm))}/km`,
      `<b>Driver bata:</b> ${escapeHtml(formatRupees(fare?.driverBata))}`,
    );
  }

  const requirements = selectedRequirements(form);
  const separator = "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501";
  const structuredLines = [
    title,
    separator,
    "\u{1F194} <b>BOOKING REFERENCE</b>",
    `<code>${escapeHtml(enquiryId)}</code>`,
    "",
    "\u{1F697} <b>TRIP DETAILS</b>",
    `\u{1F6E3}\uFE0F <b>Trip type:</b> ${escapeHtml(formatTripType(tripType))}`,
    `\u{1F698} <b>Vehicle:</b> ${escapeHtml(formatVehicle(form?.vehicle))}`,
    "",
    "\u{1F4CD} <b>ROUTE & SCHEDULE</b>",
    `\u{1F7E2} <b>Pickup</b>\n${escapeHtml(form?.pickup)}`,
    `\u{1F534} <b>Drop</b>\n${escapeHtml(form?.drop)}`,
    `\u{1F4C5} <b>Pickup schedule</b>\n${escapeHtml(formatPickupDate(form?.pickupDate))} \u{2022} ${escapeHtml(form?.pickupTime)}`,
    "",
    "\u{1F464} <b>CUSTOMER DETAILS</b>",
    `\u{1F9D1} <b>Name:</b> ${escapeHtml(form?.customerName)}`,
    `\u{1F4DE} <b>Mobile:</b> ${escapeHtml(form?.mobile)}`,
    form?.email ? `\u{2709}\uFE0F <b>Email:</b> ${escapeHtml(form.email)}` : null,
    requirements.length
      ? `\u{1F9F3} <b>Special requirements</b>\n${requirements.map((item) => `\u{2022} ${escapeHtml(item)}`).join("\n")}`
      : "\u{1F9F3} <b>Special requirements:</b> None",
  ];

  if (isConfirmation) {
    structuredLines.push(
      "",
      "\u{1F4B0} <b>FARE SUMMARY</b>",
      `\u{1F4B3} <b>Estimated total:</b> <code>${escapeHtml(formatRupees(fare?.fare))}</code>`,
      `\u{1F4CF} <b>Distance:</b> ${escapeHtml(fare?.distanceKm)} km`,
      `\u{1F3F7}\uFE0F <b>Rate:</b> ${escapeHtml(formatRupees(fare?.ratePerKm))}/km`,
      `\u{1F468}\u200D\u2708\uFE0F <b>Driver bata:</b> ${escapeHtml(formatRupees(fare?.driverBata))}`,
    );
  }

  return structuredLines.filter(Boolean).join("\n");
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const { form, fare, tripType, event } = payload ?? {};
    const validEvent = event === "enquiry" || event === "booking-confirmed" || event === "instant-enquiry";
    const isInstantEnquiry = event === "instant-enquiry";

    if (!validEvent || !form?.customerName || !form?.mobile || (!isInstantEnquiry && (!form?.pickup || !form?.drop))) {
      return Response.json({ error: "Invalid booking notification data." }, { status: 400 });
    }

    if (event === "booking-confirmed" && !Number.isFinite(Number(fare?.fare))) {
      return Response.json({ error: "A valid fare is required to confirm a booking." }, { status: 400 });
    }

    const enquiryId = referenceId(payload.enquiryId);
    const record = {
      enquiryId,
      pickup: text(form.pickup),
      drop: text(form.drop),
      vehicle: text(form.vehicle),
      fare: Number.isFinite(Number(fare?.fare)) ? Number(fare.fare) : null,
      customerName: text(form.customerName),
      mobile: text(form.mobile),
      pickupDate: text(form.pickupDate),
      pickupTime: text(form.pickupTime),
    };

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!botToken || !chatId) {
      return Response.json({
        ...record,
        telegram: { sent: false, reason: "not-configured" },
      });
    }

    const telegramResponse = await fetch(`${TELEGRAM_API}/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage({ event, form, fare, tripType, enquiryId }),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      cache: "no-store",
    });

    if (!telegramResponse.ok) {
      console.error("Telegram notification failed", telegramResponse.status);
      const error = telegramResponse.status === 401 || telegramResponse.status === 404
        ? "Telegram rejected the bot token. Add the BotFather API token to TELEGRAM_BOT_TOKEN."
        : telegramResponse.status === 400 || telegramResponse.status === 403
          ? "Telegram could not access the target chat. Verify TELEGRAM_CHAT_ID and add the bot to that group or channel."
          : "Could not notify the booking team. Please try again.";
      return Response.json({ error }, { status: 502 });
    }

    return Response.json({ ...record, telegram: { sent: true } });
  } catch (error) {
    console.error("Enquiry notification failed", error);
    return Response.json({ error: "Unable to submit the booking notification." }, { status: 500 });
  }
}
