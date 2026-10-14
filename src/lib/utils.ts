export function formatPrice(price: number, currency: "NGN" | "USD" = "NGN"): string {
  if (price <= 0) return "Contact for price";
  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  return formatter.format(price);
}

export function availabilityLabel(
  status: "available" | "reserved" | "sold"
): string {
  switch (status) {
    case "available":
      return "Available";
    case "reserved":
      return "Reserved";
    case "sold":
      return "Sold";
  }
}
