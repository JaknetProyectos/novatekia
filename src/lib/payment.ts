'use server';

import axios from 'axios';

export interface PaymentData {
    amount: number;
    orderId: string;
    currency?: string;

    cardData: {
        number: string;
        name: string;
        month: string;
        year: string;
        cvv: string;
    };

    customer: {
        nombre: string;
        apellido: string;
        email: string;
        telefono: string;
        direccion: string;
        direccion2?: string;
        ciudad: string;
        estado: string;
        pais?: string;
        cp: string;
        empresa?: string;
    };

    metadata?: {
        ip?: string;
        deviceId?: string;
        notes?: string;
    };
}

const API_URL = "https://pagos.keycop.com.mx/api/v1"

async function getAuthToken() {
    const { data } = await axios.post(`${API_URL}/signin`, {
        email: process.env.KEYCOP_EMAIL,
        password: process.env.KEYCOP_PASSWORD
    });

    return data.authToken;
}

async function tokenizeCard(token: string, payment: PaymentData) {
    const card = payment.cardData;

    const { data } = await axios.post(`${API_URL}/card/tokenizer`, {
        cardData: {
            cardNumber: card.number.replace(/\s/g, ''), // Limpiar espacios
            cardholderName: card.name,
            expirationYear: card.year,
            expirationMonth: card.month
        }
    }, {
        headers: { Authorization: `Bearer ${token}` }
    });

    return data.cardNumberToken;
}


export async function processKeycopPayment(payment: PaymentData) {
    try {
        // 1. Autenticación
        const authToken = await getAuthToken();
        const currency = (payment.currency || "MXN").toUpperCase();
        const currencyCode = currency === "USD" ? "840" : "484";

        // 2. Tokenización (Sin el CVV)
        const cardToken = await tokenizeCard(authToken, payment);

        // 3. Ejecución de la Venta
        const salePayload = {
            amount: Number(payment.amount),
            currency: currencyCode,
            reference: payment.orderId,

            customerInformation: {
                firstName: payment.customer.nombre,
                lastName: payment.customer.apellido,
                email: payment.customer.email,
                phone1: payment.customer.telefono,
                address1: payment.customer.direccion,
                address2: payment.customer.direccion2 || "",
                city: payment.customer.ciudad,
                state: payment.customer.estado,
                postalCode: payment.customer.cp,
                country: payment.customer.pais || "MX",
                company: payment.customer.empresa || "",
                ip: payment.metadata?.ip || "127.0.0.1",
            },

            cardData: {
                cardNumberToken: cardToken,
                cvv: payment.cardData.cvv,
            },
        };

        const { data } = await axios.post(`${API_URL}/sale`, salePayload, {
            headers: { Authorization: `Bearer ${authToken}` }
        });


        return {
            success: data.status == "APPROVED",
            orderId: data.orderId,
            reference: data.reference,
            status: data.status,
            data: data
        };

    } catch (error: any) {

        console.error("Keycop Payment Error:", error.response?.data || error.message);
        return {
            success: false,
            status: "error",
            error: error.response?.data?.message || "Error procesando el pago"
        };
    }
}