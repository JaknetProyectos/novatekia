export interface PayRequestBody {
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
  amount: number;
  orderId?: string; // Opcional: si no viene, se genera en el servidor
  currency?: string;
  metadata?: {
    notes?: string;
  };
}

export interface PayApiResponse {
  success: boolean;
  message?: string;
  transactionId?: string;
  orderId?: string;
  reference?: string;
  status?: string;
  error?: string;
}