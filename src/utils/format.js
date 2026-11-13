// Shared formatting / pricing helpers.

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

export const VAT_RATE = 0.2;

// Catalogue prices already include VAT; this is the VAT portion for the receipt.
export function vatPortion(amount) {
  return amount - amount / (1 + VAT_RATE);
}
