import { formatPrice } from "@/lib/format-price";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getTranslations } from "next-intl/server";
import { EmailItem } from "@/types/email-item";

const resend = new Resend(process.env.RESEND_API_KEY);

// Configuración de variables globales y colores del tema
const BRAND_NAME = "Novatekia";
const BRAND_URL = "https://novatekia.com.mx";
const BRAND_LOGO = "https://novatekia.com.mx/title.png";
const BRAND_BANNER = "https://images.unsplash.com/photo-1565688103955-d38e06888776?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const SUPPORT_EMAIL = "atencion@novatekia.com.mx";
const SENDER_EMAIL = `${BRAND_NAME} <${SUPPORT_EMAIL}>`;

// Paleta Guinda + Amarillo
const BG_GUINDA = "#800020";
const COLOR_YELLOW = "#fbbf24";
const COLOR_YELLOW_HOVER = "#f59e0b";
const COLOR_DARK_GUINDA = "#500014";

export interface ConfirmRequestBody {
  locale?: string;
  orderId: string;
  amount: number;
  items: EmailItem[];
  customer: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    direccion: string;
    ciudad: string;
    estado: string;
    cp: string;
  };
  notes?: string;
}

function escapeHtml(value: string) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function shell(content: string, footerText: { support: string; rights: string }) {
  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title>${BRAND_NAME}</title>
      </head>
      <body
        style="
          margin:0;
          padding:0;
          background-color:${BG_GUINDA};
          font-family: 'Inter', Arial, Helvetica, sans-serif;
          color:#18181b;
        "
      >
        <table
          role="presentation"
          width="100%"
          border="0"
          cellspacing="0"
          cellpadding="0"
          style="
            background-color: ${BG_GUINDA};
            padding: 40px 16px;
          "
        >
          <tr>
            <td align="center">
              <table
                role="presentation"
                width="100%"
                border="0"
                cellspacing="0"
                cellpadding="0"
                style="
                  max-width: 600px;
                  width: 100%;
                  border-collapse: separate;
                  border-spacing: 0;
                "
              >
                <!-- Logo -->
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <a href="${BRAND_URL}" style="text-decoration:none;">
                      <img
                        src="${BRAND_LOGO}"
                        alt="${BRAND_NAME}"
                        style="display: block; max-width: 160px; height: auto; border: 0;"
                      />
                    </a>
                  </td>
                </tr>

                <!-- Tarjeta Blanca Central con borde de contraste -->
                <tr>
                  <td
                    style="
                      background: #ffffff;
                      border-radius: 16px;
                      border: 2px solid ${COLOR_DARK_GUINDA};
                      overflow: hidden;
                      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
                    "
                  >
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      ${content}
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                ${footerBlock(footerText)}
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function heroBlock(pretitle: string, title: string, subtitle: string) {
  return `
    <!-- Banner Image -->
    <tr>
      <td style="padding: 0; line-height: 0;">
        <img
          src="${BRAND_BANNER}"
          alt="Banner ${BRAND_NAME}"
          style="width: 100%; height: auto; display: block; border: 0;"
        />
      </td>
    </tr>
    <!-- Títulos -->
    <tr>
      <td style="padding: 32px 32px 16px 32px;">
        <p
          style="
            margin: 0 0 8px 0;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: ${COLOR_DARK_GUINDA};
          "
        >
          ${escapeHtml(pretitle)}
        </p>
        <h1
          style="
            margin: 0 0 12px 0;
            font-size: 26px;
            font-weight: 900;
            line-height: 1.2;
            color: ${COLOR_DARK_GUINDA};
          "
        >
          ${escapeHtml(title)}
        </h1>
        <p
          style="
            margin: 0;
            font-size: 15px;
            line-height: 1.6;
            color: #4b5563;
          "
        >
          ${escapeHtml(subtitle)}
        </p>
      </td>
    </tr>
  `;
}

function sectionStart() {
  return `
    <tr>
      <td style="padding: 0 32px 32px 32px;">
  `;
}

function sectionEnd() {
  return `
      </td>
    </tr>
  `;
}

function footerBlock(footerText: { support: string; rights: string }) {
  return `
    <tr>
      <td style="padding: 32px 16px 0 16px; text-align: center;">
        <p
          style="
            margin: 0;
            font-size: 13px;
            line-height: 1.6;
            color: ${COLOR_YELLOW};
          "
        >
          ${escapeHtml(footerText.support)} <a href="mailto:${SUPPORT_EMAIL}" style="color: ${COLOR_YELLOW}; font-weight: bold; text-decoration: underline;">${SUPPORT_EMAIL}</a>
        </p>
        <p
          style="
            margin: 8px 0 0 0;
            font-size: 12px;
            color: rgba(251, 191, 36, 0.75);
          "
        >
          © ${new Date().getFullYear()} · ${BRAND_NAME}. ${escapeHtml(footerText.rights)}
        </p>
      </td>
    </tr>
  `;
}

function infoGrid(items: { label: string; value: string; href?: string }[]) {
  const cells = items
    .map(
      (item) => `
      <td valign="top" style="padding: 0 16px 16px 0; min-width: 150px; width: 50%;">
        <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 16px; height: 100%;">
          <p
            style="
              margin: 0 0 4px 0;
              font-size: 11px;
              line-height: 1;
              letter-spacing: 0.1em;
              text-transform: uppercase;
              font-weight: 800;
              color: ${COLOR_DARK_GUINDA};
            "
          >
            ${escapeHtml(item.label)}
          </p>
          ${
            item.href
              ? `<a href="${escapeHtml(item.href)}" style="font-size: 14px; line-height: 1.4; color: #18181b; text-decoration: none; font-weight: 700; display: block; word-break: break-word;">${escapeHtml(item.value)}</a>`
              : `<p style="margin: 0; font-size: 14px; line-height: 1.4; color: #18181b; font-weight: 700; word-break: break-word;">${escapeHtml(item.value)}</p>`
          }
        </div>
      </td>
    `
    )
    .join("");

  return `
    <table
      role="presentation"
      width="100%"
      border="0"
      cellspacing="0"
      cellpadding="0"
      style="margin-top: 16px;"
    >
      <tr>
        ${cells}
      </tr>
    </table>
  `;
}

function itemsTable(
  items: EmailItem[],
  total: number,
  labels: { concept: string; quantity: string; total: string; totalPaid: string; currencyFormat: string }
) {
  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #fef3c7;">
          <p style="margin: 0; font-size: 14px; font-weight: 700; color: ${COLOR_DARK_GUINDA};">${escapeHtml(item.title)}</p>
          ${item.description ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">${escapeHtml(item.description)}</p>` : ""}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #fef3c7; text-align: center; font-size: 14px; color: #374151;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #fef3c7; text-align: right; font-size: 14px; font-weight: 700; color: ${COLOR_DARK_GUINDA};">
          ${escapeHtml(labels.currencyFormat.replace("{price}", formatPrice(item.price * item.quantity)))}
        </td>
      </tr>`
    )
    .join("");

  return `
    <div style="margin-top: 24px; border: 1px solid #fde68a; border-radius: 8px; overflow: hidden;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #ffffff;">
        <thead>
          <tr>
            <th style="padding: 12px 16px; background: #fffbeb; text-align: left; font-size: 11px; font-weight: 800; text-transform: uppercase; color: ${COLOR_DARK_GUINDA}; letter-spacing: 0.05em; border-bottom: 1px solid #fde68a;">${escapeHtml(labels.concept)}</th>
            <th style="padding: 12px 16px; background: #fffbeb; text-align: center; font-size: 11px; font-weight: 800; text-transform: uppercase; color: ${COLOR_DARK_GUINDA}; letter-spacing: 0.05em; border-bottom: 1px solid #fde68a;">${escapeHtml(labels.quantity)}</th>
            <th style="padding: 12px 16px; background: #fffbeb; text-align: right; font-size: 11px; font-weight: 800; text-transform: uppercase; color: ${COLOR_DARK_GUINDA}; letter-spacing: 0.05em; border-bottom: 1px solid #fde68a;">${escapeHtml(labels.total)}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="3" style="padding: 0 16px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                ${rows}
              </table>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding: 16px; background: #fffbeb; text-align: right; font-size: 16px; font-weight: 900; color: ${COLOR_DARK_GUINDA}; border-top: 1px solid #fde68a;">
              ${escapeHtml(labels.totalPaid.replace("{amount}", formatPrice(total)))}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  `;
}

export async function POST(req: NextRequest) {
  try {
    const body: ConfirmRequestBody = await req.json();
    const locale = body.locale || "es";
    const t = await getTranslations({ locale, namespace: "Emails.checkoutEmail" });

    if (!body.orderId || !body.customer?.email || !body.items) {
      return NextResponse.json(
        { success: false, error: t("customerError") },
        { status: 400 }
      );
    }

    const { orderId, amount, items, customer, notes } = body;
    const clientName = `${customer.nombre} ${customer.apellido}`.trim();
    const clientAddress = `${customer.direccion}, ${customer.ciudad}, ${customer.estado}, CP ${customer.cp}`;

    const footerText = {
      support: t("footerSupport"),
      rights: t("footerRights"),
    };

    const tableLabels = {
      concept: t("tableConcept"),
      quantity: t("tableQuantity"),
      total: t("tableTotal"),
      totalPaid: t("tableTotalPaid", { amount: formatPrice(amount) }),
      currencyFormat: t("currencyFormat", { price: "{price}" }),
    };

    const customerHTML = shell(`
      ${heroBlock(
        t("customerHeroPretitle"),
        t("customerHeroTitle"),
        t("customerHeroSubtitle", { name: customer.nombre })
      )}

      ${sectionStart()}
        ${infoGrid([
          { label: t("labelOrderNumber"), value: `#${orderId}` },
          { label: t("labelDate"), value: new Date().toLocaleDateString(locale === "en" ? "en-US" : "es-MX", { year: 'numeric', month: 'long', day: 'numeric' }) },
        ])}
        
        ${infoGrid([
          { label: t("labelShippingAddress"), value: clientAddress },
        ])}

        ${itemsTable(items, amount, tableLabels)}

        <div style="margin-top: 32px; text-align: center;">
          <a
            href="${BRAND_URL}"
            style="
              display: inline-block;
              padding: 16px 32px;
              background-color: ${COLOR_YELLOW};
              color: ${COLOR_DARK_GUINDA};
              text-decoration: none;
              font-size: 14px;
              font-weight: 900;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              border-radius: 8px;
              border: 1px solid ${COLOR_YELLOW_HOVER};
              box-shadow: 0 4px 12px rgba(128, 0, 32, 0.25);
            "
          >
            ${escapeHtml(t("buttonBackToStore"))}
          </a>
        </div>
      ${sectionEnd()}
    `, footerText);

    const businessHTML = shell(`
      ${heroBlock(
        t("businessHeroPretitle"),
        t("businessHeroTitle"),
        t("businessHeroSubtitle")
      )}

      ${sectionStart()}
        ${infoGrid([
          { label: t("labelCustomer"), value: clientName },
          { label: t("labelEmail"), value: customer.email, href: `mailto:${customer.email}` },
        ])}
        
        ${infoGrid([
          { label: t("labelPhone"), value: customer.telefono },
          { label: t("labelOrder"), value: `#${orderId}` },
        ])}

        <div style="margin-top: 16px; padding: 20px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px;">
          <p style="margin: 0 0 8px 0; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 800; color: ${COLOR_DARK_GUINDA};">
            ${escapeHtml(t("labelCustomerAddress"))}
          </p>
          <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #18181b; font-weight: 600;">
            ${escapeHtml(clientAddress)}
          </p>
          
          ${notes ? `
            <p style="margin: 16px 0 8px 0; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 800; color: ${COLOR_DARK_GUINDA};">
              ${escapeHtml(t("labelAdditionalNotes"))}
            </p>
            <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #18181b;">
              ${escapeHtml(notes)}
            </p>
          ` : ""}
        </div>

        ${itemsTable(items, amount, tableLabels)}
      ${sectionEnd()}
    `, footerText);

    await Promise.all([
      resend.emails.send({
        from: SENDER_EMAIL,
        to: [customer.email],
        subject: t("customerSubject", { orderId }),
        html: customerHTML,
      }),
      resend.emails.send({
        from: SENDER_EMAIL,
        to: [SUPPORT_EMAIL],
        subject: t("businessSubject", { orderId }),
        html: businessHTML,
      }),
    ]);

    return NextResponse.json({ success: true, message: t("successMessage") });
  } catch (error: any) {
    console.error("Error enviando correos en /api/checkout:", error);
    return NextResponse.json(
      { success: false, error: "El pago fue exitoso pero falló el envío del correo de confirmación." },
      { status: 500 }
    );
  }
}