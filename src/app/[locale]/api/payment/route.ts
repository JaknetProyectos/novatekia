import { NextRequest, NextResponse } from "next/server";
import { processKeycopPayment, PaymentData } from "@/lib/payment"; // Ajusta tu importación
import { PayRequestBody, PayApiResponse } from "@/types/checkout";

// Helper para validar campos requeridos antes de procesar
function validatePayPayload(body: Partial<PayRequestBody>): string | null {
    if (!body.amount || body.amount <= 0) return "El monto es inválido o no existe.";

    const { cardData, customer } = body;
    if (!cardData) return "Los datos de tarjeta son obligatorios.";
    if (!cardData.number || !cardData.name || !cardData.month || !cardData.year || !cardData.cvv) {
        return "Faltan campos obligatorios en los datos de la tarjeta.";
    }

    if (!customer) return "Los datos del cliente son obligatorios.";
    if (!customer.nombre || !customer.apellido || !customer.email || !customer.telefono || !customer.direccion) {
        return "Faltan datos personales o de envío requeridos.";
    }

    return null;
}

export async function POST(req: NextRequest) {
    try {
        const body: PayRequestBody = await req.json();

        // 1. Validación de Request Body
        const validationError = validatePayPayload(body);
        if (validationError) {
            return NextResponse.json<PayApiResponse>(
                { success: false, error: validationError },
                { status: 400 }
            );
        }

        // 2. Extraer IP del cliente desde los headers de Next.js
        const clientIp =
            req.headers.get("x-forwarded-for")?.split(",")[0] ||
            req.headers.get("x-real-ip") ||
            "127.0.0.1";

        // 3. Formatear la orden (Generar un orderId de respaldo si no fue provisto)
        const orderId = body.orderId || `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const paymentPayload: PaymentData = {
            amount: body.amount,
            orderId: orderId,
            currency: body.currency || "MXN",
            cardData: {
                number: body.cardData.number.replace(/\s+/g, ""),
                name: body.cardData.name.trim(),
                month: body.cardData.month.padStart(2, "0"), // Asegura 2 dígitos (ej: "05")
                year: body.cardData.year.length === 2 ? `20${body.cardData.year}` : body.cardData.year, // Normaliza a 4 dígitos
                cvv: body.cardData.cvv.trim(),
            },
            customer: {
                ...body.customer,
                nombre: body.customer.nombre.trim(),
                apellido: body.customer.apellido.trim(),
                email: body.customer.email.trim().toLowerCase(),
            },
            metadata: {
                ip: clientIp,
                notes: body.metadata?.notes,
            },
        };

        // 4. Ejecutar el procesamiento de cobro
        const paymentResult = await processKeycopPayment(paymentPayload);
        console.log(paymentResult)

        if (!paymentResult.success) {
            return NextResponse.json<PayApiResponse>(
                {
                    success: false,
                    error: paymentResult.error || "El pago fue declinado o no pudo completarse.",
                    status: paymentResult.status,
                },
                { status: 402 } // Payment Required / Declined
            );
        }

        // 5. Respuesta Exitosa
        return NextResponse.json<PayApiResponse>({
            success: true,
            message: "Pago procesado con éxito",
            orderId: paymentResult.orderId || orderId,
            reference: paymentResult.reference,
            transactionId: paymentResult.orderId,
            status: paymentResult.status,
        });

    } catch (error: any) {
        console.error("API /api/pay Internal Error:", error);
        return NextResponse.json<PayApiResponse>(
            {
                success: false,
                error: "Error interno al intentar conectar con la pasarela de pagos.",
            },
            { status: 500 }
        );
    }
}