import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getTranslations } from "next-intl/server";

const resend = new Resend(process.env.RESEND_API_KEY);

// Configuración de variables globales

const BRAND_NAME = "Novatekia";
const BRAND_URL = "https://novatekia.com.mx";
const BRAND_LOGO = "https://novatekia.com.mx/title.png";
const BRAND_BANNER = "https://images.unsplash.com/photo-1565688103955-d38e06888776?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const SUPPORT_EMAIL = "atencion@novatekia.com.mx";
const SENDER_EMAIL = `${BRAND_NAME} <${SUPPORT_EMAIL}>`;

// Colores del diseño previo (Guinda, Dorado, Zinc oscuro)
const PRIMARY_COLOR = "#d97706"; // Dorado / Amber-600
const BURGUNDY_COLOR = "#800020"; // Guinda
const TEXT_COLOR = "#f4f4f5"; // Zinc 100
const TEXT_MUTED = "#a1a1aa"; // Zinc 400
const CARD_BG = "#18181b"; // Zinc 900
const BG_COLOR = "#09090b"; // Zinc 950
const BORDER_COLOR = "#27272a"; // Zinc 800

/**
 * Plantilla base HTML con estética sobria y bordes rectos (sin rounded)
 */
function getBaseEmailLayout(contentHtml: string, copyrightText: string) {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${BRAND_NAME}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: ${BG_COLOR}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: ${TEXT_COLOR};">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: ${BG_COLOR}; padding: 30px 0;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: ${CARD_BG}; border: 1px solid ${BORDER_COLOR};">
              
              <!-- Banner Superior -->
              <tr>
                <td style="padding: 0; border-bottom: 2px solid ${BURGUNDY_COLOR};">
                  <img src="${BRAND_BANNER}" alt="${BRAND_NAME} Banner" width="600" style="width: 100%; max-width: 600px; height: 160px; object-fit: cover; display: block;" />
                </td>
              </tr>

              <!-- Contenido Principal -->
              <tr>
                <td style="padding: 36px 28px;">
                  ${contentHtml}
                </td>
              </tr>

              <!-- Footer con Logo -->
              <tr>
                <td align="center" style="padding: 24px; background-color: #09090b; border-top: 1px solid ${BORDER_COLOR};">
                  <a href="${BRAND_URL}" target="_blank" style="text-decoration: none; display: inline-block;">
                    <img src="${BRAND_LOGO}" alt="${BRAND_NAME} Logo" height="32" style="height: 32px; width: auto; display: block; margin-bottom: 12px;" />
                  </a>
                  <p style="margin: 0; font-size: 11px; color: ${TEXT_MUTED}; text-align: center; text-transform: uppercase; letter-spacing: 0.1em;">
                    &copy; ${new Date().getFullYear()} ${BRAND_NAME}. ${copyrightText}
                  </p>
                  <p style="margin: 6px 0 0 0; font-size: 12px; color: ${TEXT_MUTED}; text-align: center;">
                    <a href="${BRAND_URL}" style="color: ${PRIMARY_COLOR}; text-decoration: none; font-family: monospace;">${BRAND_URL.replace("https://", "")}</a>
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Genera filas HTML dinámicas para los campos del formulario
 */
function renderFieldRow(label: string, value?: string | number | boolean | null) {
  if (value === undefined || value === null || value === "") return "";
  const stringValue = String(value);

  return `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid ${BORDER_COLOR}; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: ${PRIMARY_COLOR}; width: 35%; vertical-align: top;">
        ${label}
      </td>
      <td style="padding: 10px 0; border-bottom: 1px solid ${BORDER_COLOR}; font-size: 14px; color: ${TEXT_COLOR}; vertical-align: top;">
        ${stringValue.replace(/\n/g, "<br/>")}
      </td>
    </tr>
  `;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Mapeo exacto de los campos recibidos por la solicitud
    const { locale, nombre, empresa, email, mensaje, plazo, presupuesto } = body;

    const t = await getTranslations({ locale, namespace: "Emails.contactEmail" });

    // Validación de los campos obligatorios
    if (!nombre || !email) {
      return NextResponse.json(
        { error: t("validationError") },
        { status: 400 }
      );
    }

    // 1. Correo de Confirmación para el Cliente
    const clientEmailContent = `
      <p style="margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: ${PRIMARY_COLOR}; font-weight: bold;">
        ${t("client.badge")}
      </p>
      <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 300; color: #ffffff; text-transform: uppercase; letter-spacing: -0.02em;">
        ${t("client.greeting")} <span style="color: ${PRIMARY_COLOR}; font-weight: 600;">${nombre}</span>
      </h2>
      <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: ${TEXT_COLOR};">
        ${t("client.message")}
      </p>

      <div style="background-color: #09090b; padding: 20px; margin: 24px 0; border: 1px solid ${BORDER_COLOR}; border-left: 3px solid ${BURGUNDY_COLOR};">
        <h3 style="margin: 0 0 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; color: ${PRIMARY_COLOR};">
          ${t("summaryTitle")}
        </h3>
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          ${renderFieldRow(t("fields.name"), nombre)}
          ${renderFieldRow(t("fields.company"), empresa)}
          ${renderFieldRow(t("fields.email"), email)}
          ${renderFieldRow(t("fields.message"), mensaje)}
          ${renderFieldRow(t("fields.timeline"), plazo)}
          ${renderFieldRow(t("fields.budget"), presupuesto)}
        </table>
      </div>

      <p style="margin: 0; font-size: 12px; line-height: 1.5; color: ${TEXT_MUTED};">
        ${t("client.additionalInfoPrefix")}${""
      } <a href="mailto:${SUPPORT_EMAIL}" style="color: ${PRIMARY_COLOR}; text-decoration: none;">${SUPPORT_EMAIL}</a>${t("client.additionalInfoSuffix")}
      </p>
    `;

    // 2. Correo de Notificación para el Negocio
    const businessEmailContent = `
      <p style="margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: ${PRIMARY_COLOR}; font-weight: bold;">
        ${t("business.badge")}
      </p>
      <h2 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 300; color: #ffffff; text-transform: uppercase;">
        ${t("business.titlePrefix")} <span style="color: ${PRIMARY_COLOR}; font-weight: 600;">${nombre}</span>
      </h2>
      <p style="margin: 0 0 20px 0; font-size: 14px; color: ${TEXT_COLOR};">
        ${t("business.message")}
      </p>

      <div style="background-color: #09090b; padding: 20px; margin: 20px 0; border: 1px solid ${BORDER_COLOR}; border-left: 3px solid ${BURGUNDY_COLOR};">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          ${renderFieldRow(t("fields.name"), nombre)}
          ${renderFieldRow(t("fields.company"), empresa)}
          ${renderFieldRow(t("business.contactEmailLabel"), email)}
          ${renderFieldRow(t("fields.message"), mensaje)}
          ${renderFieldRow(t("business.timelineInMindLabel"), plazo)}
          ${renderFieldRow(t("fields.budget"), presupuesto)}
        </table>
      </div>
    `;

    // Enviar correo de confirmación al cliente
    const clientEmailPromise = resend.emails.send({
      from: SENDER_EMAIL,
      to: [email],
      subject: `${t("client.subject")} - ${BRAND_NAME}`,
      html: getBaseEmailLayout(clientEmailContent, t("copyright")),
    });

    // Enviar correo de notificación al equipo interno
    const businessEmailPromise = resend.emails.send({
      from: SENDER_EMAIL,
      to: [SUPPORT_EMAIL],
      replyTo: email, // Responder directamente al correo del cliente
      subject: `[${t("business.subjectPrefix")}] ${empresa ? `${empresa} - ` : ""}${nombre}`,
      html: getBaseEmailLayout(businessEmailContent, t("copyright")),
    });

    // Enviar ambos en paralelo
    await Promise.all([clientEmailPromise, businessEmailPromise]);

    return NextResponse.json(
      { success: true, message: t("successMessage") },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error enviando email vía Resend:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al procesar el envío del correo." },
      { status: 500 }
    );
  }
}