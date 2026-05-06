export const stripePaymentLinks = {
  digital: import.meta.env.VITE_STRIPE_DIGITAL_PAYMENT_LINK || "",
  cd: import.meta.env.VITE_STRIPE_CD_PAYMENT_LINK || "",
  vinyl: import.meta.env.VITE_STRIPE_VINYL_PAYMENT_LINK || "",
}

export function getStripePaymentLink(format) {
  return stripePaymentLinks[format] || ""
}
