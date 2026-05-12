import React from "react";
import SiteHeader from "@/components/landing/SiteHeader";
import { useLang } from "@/lib/LanguageContext";

const CONTACT_EMAIL = "astudilloestrella@gmail.com";

const content = {
  en: {
    summaryLabel: "Operational Summary",
    summaryTitle: "How This Website Works",
    summaryIntro: "By using this website, you are doing the following:",
    summaryBody:
      "You are purchasing digital music or physical music products directly from holagringo.media. Digital products are delivered immediately after payment and can be downloaded instantly. Physical products such as CDs and vinyl records are produced after the order is placed and shipped within the estimated production time shown on the product page. When you buy a bundle, you receive instant digital access first and physical items are shipped separately later. All payments are final for digital products once access has been granted. Physical products can only be refunded before they are shipped. You are responsible for providing correct email and shipping information. All content is protected by copyright and cannot be resold or redistributed.",
    title: "Terms & Conditions",
    updatedLabel: "Last updated:",
    lastUpdated: "May 12, 2026",
    intro:
      "Welcome to holagringo.media. By accessing this website or purchasing from it, you agree to the following terms and conditions.",
    sections: [
      {
        title: "Products",
        body: "We offer digital and physical music products, including:",
        items: [
          "Digital music downloads",
          "Physical CDs",
          "Vinyl records",
          "Bundled editions (digital + physical)",
        ],
      },
      {
        title: "Digital Delivery",
        paragraphs: [
          "All digital products are delivered electronically immediately after purchase.",
          "Delivery is completed once access to the download link or digital content has been granted via email or account access.",
        ],
      },
      {
        title: "Physical Products & Shipping",
        paragraphs: [
          "Physical products are made to order unless otherwise stated.",
          "Estimated production and shipping times:",
        ],
        items: ["CDs: up to 5 weeks", "Vinyl records: up to 8-10 weeks"],
        closing:
          "Delivery times may vary depending on production schedules and destination country.",
      },
      {
        title: "Bundled Products",
        body: "Bundles include both digital and physical products.",
        items: [
          "Digital content is delivered instantly after purchase",
          "Physical items are shipped separately according to production timelines",
        ],
      },
      {
        title: "Refund Policy",
        body: "Due to the nature of digital goods:",
        items: [
          "All digital product sales are final once access has been granted",
          "No refunds are issued for digital content",
        ],
        subheading: "For physical products:",
        subitems: [
          "Refunds are only available before the item has been shipped",
          "After shipment, refunds or returns are not accepted unless items arrive damaged",
        ],
      },
      {
        title: "Chargebacks & Disputes",
        body: "In the case of payment disputes or chargebacks:",
        items: [
          "We reserve the right to provide proof of delivery, including access logs, email confirmations, and transaction records",
          "Unauthorized chargebacks may result in restriction of future purchases or account access",
        ],
      },
      {
        title: "Customer Responsibility",
        body: "Customers are responsible for:",
        items: [
          "Providing accurate email and shipping information",
          "Ensuring access to their email inbox and download capabilities",
          "Checking spam or junk folders for delivery emails",
        ],
        closing:
          "We are not responsible for delivery issues caused by incorrect information or email filtering systems.",
      },
      {
        title: "Intellectual Property",
        paragraphs: [
          "All music, artwork, recordings, and content are the exclusive intellectual property of holagringo.media and/or its associated artists.",
          "Purchasing does not grant any resale, redistribution, or commercial usage rights unless explicitly stated.",
        ],
      },
      {
        title: "Delivery Model & Compliance Notice",
        paragraphs: [
          "All digital products are delivered immediately and automatically after purchase. This system ensures transparent fulfillment and verifiable access records for each transaction.",
          "All orders are timestamped, tracked, and recorded to confirm delivery and prevent disputes.",
        ],
      },
      {
        title: "Contact",
        body: "For support or inquiries, contact:",
        contact: CONTACT_EMAIL,
      },
    ],
  },
  es: {
    summaryLabel: "Resumen Operativo",
    summaryTitle: "Como Funciona Este Sitio Web",
    summaryIntro: "Al usar este sitio web, aceptas lo siguiente:",
    summaryBody:
      "Estas comprando musica digital o productos fisicos de musica directamente en holagringo.media. Los productos digitales se entregan inmediatamente despues del pago y se pueden descargar al instante. Los productos fisicos, como CDs y vinilos, se producen despues de realizar el pedido y se envian dentro del tiempo estimado de produccion indicado en la pagina del producto. Cuando compras un paquete, recibes primero el acceso digital instantaneo y los articulos fisicos se envian por separado mas adelante. Todos los pagos de productos digitales son finales una vez concedido el acceso. Los productos fisicos solo pueden reembolsarse antes de ser enviados. Eres responsable de proporcionar el email y la direccion de envio correctos. Todo el contenido esta protegido por derechos de autor y no puede revenderse ni redistribuirse.",
    title: "Terminos y Condiciones",
    updatedLabel: "Ultima actualizacion:",
    lastUpdated: "12 de mayo de 2026",
    intro:
      "Bienvenido a holagringo.media. Al acceder a este sitio web o comprar en el, aceptas los siguientes terminos y condiciones.",
    sections: [
      {
        title: "Productos",
        body: "Ofrecemos productos musicales digitales y fisicos, incluyendo:",
        items: [
          "Descargas digitales de musica",
          "CDs fisicos",
          "Discos de vinilo",
          "Ediciones en paquete (digital + fisico)",
        ],
      },
      {
        title: "Entrega Digital",
        paragraphs: [
          "Todos los productos digitales se entregan electronicamente inmediatamente despues de la compra.",
          "La entrega se completa una vez que se concede el acceso al enlace de descarga o al contenido digital por email o acceso de cuenta.",
        ],
      },
      {
        title: "Productos Fisicos y Envio",
        paragraphs: [
          "Los productos fisicos se fabrican bajo pedido salvo que se indique lo contrario.",
          "Tiempos estimados de produccion y envio:",
        ],
        items: ["CDs: hasta 5 semanas", "Vinilos: hasta 8-10 semanas"],
        closing:
          "Los tiempos de entrega pueden variar segun los calendarios de produccion y el pais de destino.",
      },
      {
        title: "Productos en Paquete",
        body: "Los paquetes incluyen productos digitales y fisicos.",
        items: [
          "El contenido digital se entrega al instante despues de la compra",
          "Los articulos fisicos se envian por separado segun los plazos de produccion",
        ],
      },
      {
        title: "Politica de Reembolso",
        body: "Debido a la naturaleza de los productos digitales:",
        items: [
          "Todas las ventas digitales son finales una vez concedido el acceso",
          "No se emiten reembolsos por contenido digital",
        ],
        subheading: "Para productos fisicos:",
        subitems: [
          "Los reembolsos solo estan disponibles antes de que el articulo haya sido enviado",
          "Despues del envio, no se aceptan reembolsos ni devoluciones salvo que los articulos lleguen danados",
        ],
      },
      {
        title: "Contracargos y Disputas",
        body: "En caso de disputas de pago o contracargos:",
        items: [
          "Nos reservamos el derecho de proporcionar prueba de entrega, incluidos registros de acceso, confirmaciones por email y registros de transaccion",
          "Los contracargos no autorizados pueden resultar en restricciones para futuras compras o acceso a la cuenta",
        ],
      },
      {
        title: "Responsabilidad del Cliente",
        body: "Los clientes son responsables de:",
        items: [
          "Proporcionar email y datos de envio correctos",
          "Asegurar el acceso a su bandeja de entrada y capacidad de descarga",
          "Revisar carpetas de spam o correo no deseado para emails de entrega",
        ],
        closing:
          "No somos responsables de problemas de entrega causados por informacion incorrecta o sistemas de filtrado de email.",
      },
      {
        title: "Propiedad Intelectual",
        paragraphs: [
          "Toda la musica, arte, grabaciones y contenido son propiedad intelectual exclusiva de holagringo.media y/o sus artistas asociados.",
          "La compra no otorga derechos de reventa, redistribucion o uso comercial salvo que se indique explicitamente.",
        ],
      },
      {
        title: "Modelo de Entrega y Aviso de Cumplimiento",
        paragraphs: [
          "Todos los productos digitales se entregan inmediata y automaticamente despues de la compra. Este sistema garantiza cumplimiento transparente y registros verificables de acceso para cada transaccion.",
          "Todos los pedidos son fechados, rastreados y registrados para confirmar la entrega y prevenir disputas.",
        ],
      },
      {
        title: "Contacto",
        body: "Para soporte o consultas, contacta:",
        contact: CONTACT_EMAIL,
      },
    ],
  },
};

function BulletList({ items }) {
  if (!items?.length) return null;

  return (
    <ul className="mt-4 space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 font-body text-sm leading-7 text-muted-foreground"
        >
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function TermsAndConditions() {
  const { lang } = useLang();
  const tx = content[lang] || content.en;

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-6 py-12 lg:px-10">
        <section className="border-b border-border pb-10">
          <div className="font-body text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            {tx.summaryLabel}
          </div>
          <h1 className="mt-3 font-display text-4xl font-black tracking-tight text-primary md:text-5xl">
            {tx.summaryTitle}
          </h1>
          <p className="mt-6 font-body text-sm font-semibold leading-7 text-foreground">
            {tx.summaryIntro}
          </p>
          <p className="mt-4 font-body text-sm leading-8 text-muted-foreground">
            {tx.summaryBody}
          </p>
        </section>

        <section className="pt-12">
          <div className="font-body text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            {tx.updatedLabel} {tx.lastUpdated}
          </div>
          <h2 className="mt-3 font-display text-4xl font-black tracking-tight text-primary md:text-5xl">
            {tx.title}
          </h2>
          <p className="mt-6 font-body text-sm leading-8 text-muted-foreground">
            {tx.intro}
          </p>

          <div className="mt-10 space-y-10">
            {tx.sections.map((section, index) => (
              <article key={section.title} className="border-t border-border pt-8">
                <h3 className="font-display text-xl font-bold text-foreground">
                  {index + 1}. {section.title}
                </h3>

                {section.body && (
                  <p className="mt-3 font-body text-sm leading-8 text-muted-foreground">
                    {section.body}
                  </p>
                )}

                {section.paragraphs?.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-3 font-body text-sm leading-8 text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}

                <BulletList items={section.items} />

                {section.subheading && (
                  <div className="mt-6 font-body text-sm font-semibold text-foreground">
                    {section.subheading}
                  </div>
                )}

                <BulletList items={section.subitems} />

                {section.closing && (
                  <p className="mt-5 font-body text-sm leading-8 text-muted-foreground">
                    {section.closing}
                  </p>
                )}

                {section.contact && (
                  <a
                    href={`mailto:${section.contact}`}
                    className="mt-4 inline-flex font-body text-sm font-semibold text-primary transition hover:text-primary/75"
                  >
                    {section.contact}
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
