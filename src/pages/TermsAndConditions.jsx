import React, { useState } from "react";
import { useLang } from "@/lib/LanguageContext";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const termsEN = [
  {
    num: "1", title: "Scope",
    body: "These Terms and Conditions apply to all purchases made through the provider's platform.",
  },
  {
    num: "2", title: "Products",
    body: null,
    sub: [
      { title: "Digital Products", items: ["Individual music tracks", "LP collections including bonus tracks"] },
      { title: "Physical Products", items: ["CD version", "Vinyl edition (limited to 10,000 units worldwide)"] },
    ],
  },
  {
    num: "3", title: "Payment",
    body: "Payment is made via credit card or any available payment methods during checkout. The selected payment method will be charged immediately after purchase. Payment processing may be handled by third-party providers.",
  },
  {
    num: "4", title: "Delivery",
    body: null,
    sub: [
      {
        title: "Digital Products",
        items: [
          "Delivered instantly via email",
          "QR code provided for direct mobile download",
          "Access is immediate",
          "Delivery is considered complete once the file is made available.",
        ],
      },
      {
        title: "CD Version",
        items: [
          "Shipping date: July 30, 2026",
          "Worldwide shipping",
          "Shipping will occur only from this date onward. Early shipping is not possible.",
          "Includes: Immediate digital download & digital version via email",
        ],
      },
      {
        title: "Vinyl Edition",
        items: [
          "Limited to 10,000 copies worldwide",
          "Shipping date: August 15, 2026",
          "Shipping will occur only from this date onward. Early shipping is not possible.",
          "Includes: Immediate digital download & digital version via email",
        ],
      },
    ],
  },
  {
    num: "5", title: "Usage Rights",
    body: "All digital content is for personal use only. Redistribution or commercial use is prohibited.",
  },
  {
    num: "6", title: "Withdrawal & Refund Policy",
    body: null,
    sub: [
      {
        title: "Digital Products",
        items: [
          "By purchasing, the customer agrees that delivery begins immediately and the right of withdrawal is waived.",
          "Digital products are non-refundable and non-exchangeable.",
        ],
      },
      {
        title: "Physical Products",
        items: ["CD and Vinyl are non-refundable and non-exchangeable."],
      },
    ],
  },
  {
    num: "7", title: "Shipping Issues",
    body: "Worldwide shipping. In case of delivery issues, the customer may contact support. A replacement shipment may be arranged.",
  },
  {
    num: "8", title: "Liability",
    body: "The provider is only liable for intent and gross negligence.",
  },
  {
    num: "9", title: "Final Provisions",
    body: "Applicable law is the provider's country of residence.",
  },
  {
    num: "10", title: "Customer Agreement",
    body: null,
    sub: [
      {
        title: "By purchasing, the customer confirms:",
        items: [
          "Acceptance of these Terms",
          "Acceptance of fixed shipping dates",
          "Acknowledgment that early delivery is not possible",
        ],
      },
    ],
  },
];

const termsES = [
  {
    num: "1", title: "Ámbito de aplicación",
    body: "Estos términos se aplican a todas las compras realizadas en la plataforma.",
  },
  {
    num: "2", title: "Productos",
    body: null,
    sub: [
      { title: "Productos digitales", items: ["Tracks individuales", "Colección LP con bonus tracks"] },
      { title: "Productos físicos", items: ["CD", "Vinilo (limitado a 10.000 unidades)"] },
    ],
  },
  {
    num: "3", title: "Pago",
    body: "El pago se realiza mediante tarjeta o métodos disponibles en el proceso de compra. El cargo se realiza inmediatamente.",
  },
  {
    num: "4", title: "Entrega",
    body: null,
    sub: [
      {
        title: "Productos digitales",
        items: [
          "Entrega inmediata por email",
          "Código QR para descarga directa",
          "La entrega se considera completa una vez disponible el archivo.",
        ],
      },
      {
        title: "CD",
        items: [
          "Fecha de envío: 30 de julio de 2026",
          "El envío se realiza únicamente a partir de esta fecha. No es posible adelantarlo.",
          "Incluye descarga digital inmediata.",
        ],
      },
      {
        title: "Vinilo",
        items: [
          "Limitado a 10.000 unidades",
          "Fecha de envío: 15 de agosto de 2026",
          "El envío se realiza únicamente a partir de esta fecha. No es posible adelantarlo.",
          "Incluye descarga digital inmediata.",
        ],
      },
    ],
  },
  {
    num: "5", title: "Derechos de uso",
    body: "Uso personal únicamente. Prohibida la redistribución.",
  },
  {
    num: "6", title: "Devoluciones",
    body: null,
    sub: [
      {
        title: "Digital",
        items: [
          "No hay derecho de desistimiento tras la compra.",
          "No hay reembolsos ni cambios.",
        ],
      },
      {
        title: "Físico",
        items: ["No se aceptan devoluciones ni cambios."],
      },
    ],
  },
  {
    num: "7", title: "Envío",
    body: "Envío mundial. En caso de problema, contactar soporte.",
  },
  {
    num: "8", title: "Responsabilidad",
    body: "Limitada a dolo o negligencia grave.",
  },
  {
    num: "9", title: "Disposiciones finales",
    body: "Se aplica la ley del país del proveedor.",
  },
  {
    num: "10", title: "Aceptación",
    body: null,
    sub: [
      {
        title: "El cliente acepta:",
        items: [
          "Estos términos",
          "Las fechas de envío fijas",
          "Que no es posible adelantar el envío",
        ],
      },
    ],
  },
];

export default function TermsAndConditions() {
  const { lang: siteLang } = useLang();
  const [lang, setLang] = useState(siteLang || "en");

  const terms = lang === "es" ? termsES : termsEN;
  const title = lang === "es" ? "Términos y Condiciones" : "Terms and Conditions";
  const backLabel = lang === "es" ? "Volver" : "Back";

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link to="/" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary transition">
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
          {/* Lang switcher */}
          <div className="flex items-center rounded-full border border-border bg-card overflow-hidden font-body text-xs font-semibold">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 transition ${lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("es")}
              className={`px-3 py-1.5 transition ${lang === "es" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              ES
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-10">
        <h1 className="font-display text-4xl font-black tracking-tight text-primary md:text-5xl mb-10">
          {title}
        </h1>

        <div className="space-y-10">
          {terms.map((section) => (
            <div key={section.num} className="border-t border-border pt-8">
              <h2 className="font-display text-xl font-bold text-foreground mb-3">
                {section.num}. {section.title}
              </h2>
              {section.body && (
                <p className="font-body text-sm leading-8 text-muted-foreground">{section.body}</p>
              )}
              {section.sub && (
                <div className="mt-4 space-y-5">
                  {section.sub.map((s, i) => (
                    <div key={i}>
                      <div className="font-body text-sm font-semibold text-foreground mb-2">{s.title}</div>
                      <ul className="space-y-1.5">
                        {s.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 font-body text-sm leading-7 text-muted-foreground">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}