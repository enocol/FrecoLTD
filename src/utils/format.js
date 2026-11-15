// Shared formatting / pricing helpers.

// Trading currency. Shown explicitly (not just the symbol) so customers and
// Stripe can see exactly what they're being charged in.
export const CURRENCY = { code: "GBP", symbol: "£" };

// ---------------------------------------------------------------------------
// Business / legal identity — EDIT THESE before going live.
// UK limited companies must show the registered name, company number, place of
// registration and registered office on their website. Replace every value in
// [square brackets] with your real details. These feed the footer, the policy
// pages and the contact page, so you only change them here.
// ---------------------------------------------------------------------------
export const BUSINESS = {
  legalName: "Freco Limited",
  tradingName: "Freco Limited",
  companyNumber: "13699598", // Companies House registration number
  placeOfRegistration: "England & Wales",
  registeredOffice: "63 Junction Street, Dudley, DY2 8XT",
  // Not VAT-registered — no VAT number and no VAT charged on prices.
  email: "support@frecolimited.co.uk",
  phone: "+44(0)7519 999500",
  phoneHref: "tel:+447519999500",
  returnsWindowDays: 14, // statutory distance-selling cancellation window
};

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

export function formatPrice(value) {
  return gbp.format(value || 0);
}

// Flat-rate delivery, free over the threshold.
export const FREE_DELIVERY_THRESHOLD = 1000;
export const DELIVERY_FEE = 24.99;

// Where customers collect orders in person (free "click & collect").
export const COLLECTION_POINT = {
  name: "Freco Autos — Collection Depot",
  line1: "Sher Storage, Ann Road, Unit 13-14",
  line2: "Smethwick",
  city: "Birmingham",
  postcode: "B66 2NZ",
  hours: "Mon–Fri 9am–5pm · Sat 9am–1pm",
};

export function deliveryFor(subtotal) {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
}
