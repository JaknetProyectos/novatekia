"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useCart } from "@/context/cart-context";
import { toast } from "sonner";
import { PayRequestBody } from "@/types/checkout";
import {
    CreditCard,
    User,
    MapPin,
    Tag,
    Lock,
    ArrowLeft,
    CheckCircle2,
    Loader2,
    ShieldCheck,
    FileText,
    ShoppingBag
} from "lucide-react";
import { EmailItem } from "@/types/email-item";
import { ConfirmRequestBody } from "../api/checkout/route";
import { formatPrice } from "@/lib/format-price";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

interface Coupon {
    code: string;
    type: "percent" | "fixed";
    value: number;
}

const AVAILABLE_COUPONS: Coupon[] = [
    { code: "NOVA10", type: "percent", value: 10 },
    { code: "TEKIA15", type: "fixed", value: 500 },
];

export default function CheckoutPage() {
    const router = useRouter();
    const { items, total: subtotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
    const t = useTranslations("checkoutPage");

    // Estado de Cupones
    const [couponInput, setCouponInput] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
    const locale = useLocale();

    // Formulario con todos los campos
    const [formData, setFormData] = useState({
        // Cliente
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        empresa: "",
        // Dirección
        direccion: "",
        direccion2: "",
        ciudad: "",
        estado: "",
        cp: "",
        pais: "MX",
        // Tarjeta
        cardNumber: "",
        cardName: "",
        cardMonth: "",
        cardYear: "",
        cardCvv: "",
        // Metadata
        notes: "",
    });

    // Cálculo de Descuentos, IVA y Total Final
    const discountAmount = useMemo(() => {
        if (!appliedCoupon) return 0;
        if (appliedCoupon.type === "percent") {
            return (subtotal * appliedCoupon.value) / 100;
        }
        return Math.min(appliedCoupon.value, subtotal);
    }, [subtotal, appliedCoupon]);

    const subtotalAfterDiscount = useMemo(() => {
        return Math.max(0, subtotal - discountAmount);
    }, [subtotal, discountAmount]);

    const ivaAmount = useMemo(() => {
        return subtotalAfterDiscount * 0.16; // 16% de IVA
    }, [subtotalAfterDiscount]);

    const finalTotal = useMemo(() => {
        return subtotalAfterDiscount + ivaAmount;
    }, [subtotalAfterDiscount, ivaAmount]);

    // Manejo de cambios en los inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Validar y aplicar cupón
    const handleApplyCoupon = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanCode = couponInput.trim().toUpperCase();

        if (!cleanCode) {
            toast.error(t("toasts.enterCoupon"));
            return;
        }

        const found = AVAILABLE_COUPONS.find((c) => c.code === cleanCode);

        if (found) {
            setAppliedCoupon(found);
            toast.success(t("toasts.couponApplied", { code: found.code }));
        } else {
            toast.error(t("toasts.invalidCoupon"));
        }
    };

    // Procesar pago contra /api/payment
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (items.length === 0) {
            toast.error(t("toasts.emptyCart"));
            return;
        }

        setLoading(true);

        const payPayload: PayRequestBody = {
            amount: finalTotal,
            currency: "MXN",
            cardData: {
                number: formData.cardNumber,
                name: formData.cardName,
                month: formData.cardMonth,
                year: formData.cardYear,
                cvv: formData.cardCvv,
            },
            customer: {
                nombre: formData.nombre,
                apellido: formData.apellido,
                email: formData.email,
                telefono: formData.telefono,
                direccion: formData.direccion,
                direccion2: formData.direccion2 || undefined,
                ciudad: formData.ciudad,
                estado: formData.estado,
                cp: formData.cp,
                pais: formData.pais || "MX",
                empresa: formData.empresa || undefined,
            },
            metadata: {
                notes: formData.notes || undefined,
            },
        };

        try {
            const payRes = await fetch("/api/payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payPayload),
            });

            const payResult = await payRes.json();

            if (!payRes.ok || !payResult.success) {
                throw new Error(payResult.error || t("toasts.paymentDeclined"));
            }

            const emailItems: EmailItem[] = items.map((item) => ({
                id: item.product?.id || item.id,
                image: "/logo.png",
                title: (item.product?.title as string) || t("defaultServiceTitle"),
                price: item.product?.price as number,
                quantity: item.quantity,
                description: item.product?.description as string,
            }));

            const confirmPayload: ConfirmRequestBody = {
                orderId: payResult.orderId,
                amount: finalTotal,
                items: emailItems,
                customer: {
                    nombre: formData.nombre,
                    apellido: formData.apellido,
                    email: formData.email,
                    telefono: formData.telefono,
                    direccion: formData.direccion,
                    ciudad: formData.ciudad,
                    estado: formData.estado,
                    cp: formData.cp,
                },
                notes: formData.notes || undefined,
            };

            await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...confirmPayload,
                    locale
                }),
            });

            toast.success(t("toasts.paymentSuccess", { orderId: payResult.orderId }));

            setSuccessOrderId(payResult.orderId);
            clearCart();

        } catch (error: any) {
            toast.error(error.message || t("toasts.paymentError"));
        } finally {
            setLoading(false);
        }
    };

    // 1. Renderizar vista de Éxito si hay un ID de orden
    if (successOrderId) {
        return (
            <div className="min-h-screen bg-amber-500 px-4 py-16 flex items-center justify-center border-b border-red-950/20">
                <div className="bg-white border-2 border-red-950 p-8 sm:p-10 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-950 text-amber-400 flex items-center justify-center mx-auto mb-6 border border-red-900">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-red-950 uppercase mb-3 tracking-wide">{t("success.title")}</h2>
                    <p className="text-zinc-800 mb-6 text-sm leading-relaxed">{t("success.description")}</p>

                    <div className="bg-amber-100/60 border border-red-950/20 p-4 mb-6">
                        <p className="text-xs font-bold uppercase tracking-wider text-red-950 mb-1">{t("success.orderIdLabel")}</p>
                        <p className="text-lg font-bold text-red-950 break-all">{successOrderId}</p>
                    </div>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-red-950 hover:bg-red-900 text-amber-300 font-bold uppercase tracking-wider text-xs border border-red-900 transition-colors"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        <span>{t("success.continueShopping")}</span>
                    </Link>
                </div>
            </div>
        );
    }

    // 2. Renderizar carrito vacío (solo si no hay successOrderId)
    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-amber-500 px-4 py-16 flex items-center justify-center border-b border-red-950/20">
                <div className="bg-white border-2 border-red-950 p-8 max-w-md w-full text-center">
                    <h2 className="text-xl font-bold text-red-950 uppercase mb-2">{t("emptyTitle")}</h2>
                    <p className="text-zinc-800 mb-6 text-sm">{t("emptyDescription")}</p>
                    <Link
                        href="/carrito"
                        className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-red-950 hover:bg-red-900 text-amber-300 font-bold uppercase tracking-wider text-xs border border-red-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>{t("returnToCart")}</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-amber-500 text-zinc-900 py-12 px-4 sm:px-6 lg:px-12 border-b border-red-950/20">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">

                {/* Encabezado Superior */}
                <div className="bg-white border-2 border-red-950 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <Link
                        href="/carrito"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-zinc-950 font-bold uppercase tracking-wider text-xs border border-red-950 hover:bg-amber-400 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>{t("returnToCart")}</span>
                    </Link>
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-950 bg-amber-100 border border-red-950/20 px-3.5 py-1.5">
                        <ShieldCheck className="w-4 h-4 text-red-900 shrink-0" />
                        <span>{t("secureBadge")}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Columnas Izquierda: Formularios en Cards Blancas */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        
                        {/* 1. Datos Personales */}
                        <div className="bg-white border-2 border-red-950 p-6 sm:p-8 flex flex-col gap-6">
                            <div className="flex items-center gap-3 border-b border-red-950/10 pb-4">
                                <div className="p-2 bg-red-950 text-amber-300">
                                    <User className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold uppercase tracking-wide text-red-950">{t("contactSection.title")}</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-red-950 mb-1.5">{t("contactSection.firstName")} *</label>
                                    <input required type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="w-full bg-amber-50/30 border border-red-950/30 px-4 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-red-950 focus:ring-1 focus:ring-red-950" placeholder="John" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-red-950 mb-1.5">{t("contactSection.lastName")} *</label>
                                    <input required type="text" name="apellido" value={formData.apellido} onChange={handleChange} className="w-full bg-amber-50/30 border border-red-950/30 px-4 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-red-950 focus:ring-1 focus:ring-red-950" placeholder="Doe" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-red-950 mb-1.5">{t("contactSection.email")} *</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-amber-50/30 border border-red-950/30 px-4 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-red-950 focus:ring-1 focus:ring-red-950" placeholder="john@example.com" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-red-950 mb-1.5">{t("contactSection.phone")} *</label>
                                    <input required type="tel" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full bg-amber-50/30 border border-red-950/30 px-4 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-red-950 focus:ring-1 focus:ring-red-950" placeholder="5512345678" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-red-950 mb-1.5">{t("contactSection.company")} <span className="text-zinc-500 font-normal">({t("optional")})</span></label>
                                    <input type="text" name="empresa" value={formData.empresa} onChange={handleChange} className="w-full bg-amber-50/30 border border-red-950/30 px-4 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-red-950 focus:ring-1 focus:ring-red-950" placeholder={t("contactSection.companyPlaceholder")} />
                                </div>
                            </div>
                        </div>

                        {/* 2. Dirección */}
                        <div className="bg-white border-2 border-red-950 p-6 sm:p-8 flex flex-col gap-6">
                            <div className="flex items-center gap-3 border-b border-red-950/10 pb-4">
                                <div className="p-2 bg-red-950 text-amber-300">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold uppercase tracking-wide text-red-950">{t("addressSection.title")}</h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-red-950 mb-1.5">{t("addressSection.street")} *</label>
                                    <input required type="text" name="direccion" value={formData.direccion} onChange={handleChange} className="w-full bg-amber-50/30 border border-red-950/30 px-4 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-red-950 focus:ring-1 focus:ring-red-950" placeholder="Av. Insurgentes Sur 123" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-red-950 mb-1.5">{t("addressSection.suite")} <span className="text-zinc-500 font-normal">({t("optional")})</span></label>
                                    <input type="text" name="direccion2" value={formData.direccion2} onChange={handleChange} className="w-full bg-amber-50/30 border border-red-950/30 px-4 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-red-950 focus:ring-1 focus:ring-red-950" placeholder="Depto 4B" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-red-950 mb-1.5">{t("addressSection.city")} *</label>
                                    <input required type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} className="w-full bg-amber-50/30 border border-red-950/30 px-4 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-red-950 focus:ring-1 focus:ring-red-950" placeholder="Ciudad de México" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-red-950 mb-1.5">{t("addressSection.state")} *</label>
                                    <input required type="text" name="estado" value={formData.estado} onChange={handleChange} className="w-full bg-amber-50/30 border border-red-950/30 px-4 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-red-950 focus:ring-1 focus:ring-red-950" placeholder="CDMX" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-red-950 mb-1.5">{t("addressSection.zip")} *</label>
                                    <input required type="text" name="cp" value={formData.cp} onChange={handleChange} className="w-full bg-amber-50/30 border border-red-950/30 px-4 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-red-950 focus:ring-1 focus:ring-red-950" placeholder="01000" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-red-950 mb-1.5">{t("addressSection.country")} <span className="text-zinc-500 font-normal">({t("optional")})</span></label>
                                    <select name="pais" value={formData.pais} onChange={handleChange} className="w-full bg-amber-50/30 border border-red-950/30 px-4 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-red-950 focus:ring-1 focus:ring-red-950">
                                        <option value="MX">{t("addressSection.countries.MX")}</option>
                                        <option value="US">{t("addressSection.countries.US")}</option>
                                        <option value="ES">{t("addressSection.countries.ES")}</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* 3. Información de Pago */}
                        <div className="bg-white border-2 border-red-950 p-6 sm:p-8 flex flex-col gap-6">
                            <div className="flex items-center gap-3 border-b border-red-950/10 pb-4">
                                <div className="p-2 bg-red-950 text-amber-300">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold uppercase tracking-wide text-red-950">{t("paymentSection.title")}</h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-3">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-red-950 mb-1.5">{t("paymentSection.cardName")} *</label>
                                    <input required type="text" name="cardName" value={formData.cardName} onChange={handleChange} className="w-full bg-amber-50/30 border border-red-950/30 px-4 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-red-950 focus:ring-1 focus:ring-red-950" placeholder={t("paymentSection.cardNamePlaceholder")} />
                                </div>
                                <div className="sm:col-span-3">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-red-950 mb-1.5">{t("paymentSection.cardNumber")} *</label>
                                    <input required type="text" name="cardNumber" maxLength={16} value={formData.cardNumber} onChange={handleChange} className="w-full bg-amber-50/30 border border-red-950/30 px-4 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-red-950 focus:ring-1 focus:ring-red-950 tracking-widest" placeholder="0000 0000 0000 0000" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-red-950 mb-1.5">{t("paymentSection.cardMonth")} *</label>
                                    <input required type="text" name="cardMonth" maxLength={2} value={formData.cardMonth} onChange={handleChange} className="w-full bg-amber-50/30 border border-red-950/30 px-4 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-red-950 focus:ring-1 focus:ring-red-950 text-center" placeholder="08" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-red-950 mb-1.5">{t("paymentSection.cardYear")} *</label>
                                    <input required type="text" name="cardYear" maxLength={4} value={formData.cardYear} onChange={handleChange} className="w-full bg-amber-50/30 border border-red-950/30 px-4 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-red-950 focus:ring-1 focus:ring-red-950 text-center" placeholder="28" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-red-950 mb-1.5">{t("paymentSection.cvv")} *</label>
                                    <input required type="password" name="cardCvv" maxLength={3} value={formData.cardCvv} onChange={handleChange} className="w-full bg-amber-50/30 border border-red-950/30 px-4 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-red-950 focus:ring-1 focus:ring-red-950 text-center" placeholder="123" />
                                </div>
                            </div>
                        </div>

                        {/* 4. Notas Adicionales */}
                        <div className="bg-white border-2 border-red-950 p-6 sm:p-8 flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-red-950 font-bold text-sm uppercase tracking-wide">
                                <FileText className="w-4 h-4 text-red-900" />
                                <span>{t("notesLabel")}</span>
                                <span className="text-zinc-500 font-normal">({t("optional")})</span>
                            </div>
                            <textarea name="notes" rows={2} value={formData.notes} onChange={handleChange} className="w-full bg-amber-50/30 border border-red-950/30 p-3.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-red-950 focus:ring-1 focus:ring-red-950" placeholder={t("notesPlaceholder")} />
                        </div>
                    </div>

                    {/* Columna Derecha: Resumen Lateral + Cupones + Pagar */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-white border-2 border-red-950 p-6 sm:p-8 flex flex-col gap-6">
                            <h2 className="text-lg font-bold uppercase tracking-wider text-red-950 border-b border-red-950/10 pb-4">
                                {t("summaryTitle")}
                            </h2>

                            {/* Lista de items */}
                            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center text-sm p-3 bg-amber-50/40 border border-red-950/20">
                                        <div className="pr-2">
                                            <p className="font-bold text-red-950">{item.product?.title}</p>
                                            <p className="text-xs text-zinc-600">{t("qtyLabel")}: {item.quantity} {item.product?.sku && `• ${item.price}`}</p>
                                        </div>
                                        <span className="font-bold text-red-950 whitespace-nowrap">{formatPrice(item.subtotal)} MXN</span>
                                    </div>
                                ))}
                            </div>

                            {/* Input de Cupón */}
                            <div className="border-t border-red-950/10 pt-4 flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-red-950 flex items-center gap-1.5">
                                    <Tag className="w-3.5 h-3.5 text-red-900" />
                                    <span>{t("couponLabel")}</span>
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponInput}
                                        onChange={(e) => setCouponInput(e.target.value)}
                                        placeholder={t("couponPlaceholder")}
                                        className="w-full bg-amber-50/30 border border-red-950/30 px-3 py-2 text-sm font-semibold uppercase tracking-wider focus:outline-none focus:border-red-950"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleApplyCoupon}
                                        className="px-4 py-2 bg-red-950 hover:bg-red-900 text-amber-300 text-xs font-bold uppercase tracking-wider transition-colors border border-red-900"
                                    >
                                        {t("applyCoupon")}
                                    </button>
                                </div>

                                {appliedCoupon && (
                                    <div className="mt-2 flex items-center justify-between text-xs bg-amber-100 border border-red-950/20 text-red-950 p-2.5 font-semibold">
                                        <span className="flex items-center gap-1.5">
                                            <CheckCircle2 className="w-4 h-4 text-red-900" />
                                            <span>{t("couponAppliedBadge", { code: appliedCoupon.code })}</span>
                                        </span>
                                        <button type="button" onClick={() => setAppliedCoupon(null)} className="text-zinc-600 hover:text-red-950 underline font-normal">{t("removeCoupon")}</button>
                                    </div>
                                )}
                            </div>

                            {/* Totales con IVA */}
                            <div className="flex flex-col gap-3 border-t border-red-950/10 pt-4 text-sm">
                                <div className="flex justify-between text-zinc-700 font-medium">
                                    <span>{t("subtotal")}</span>
                                    <span>{formatPrice(subtotal)} MXN</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-red-900 font-bold">
                                        <span>{t("discount")}</span>
                                        <span>- {formatPrice(discountAmount)} MXN</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-zinc-600 font-medium">
                                    <span>{t("iva")}</span>
                                    <span>{formatPrice(ivaAmount)} MXN</span>
                                </div>
                                <div className="flex justify-between items-baseline border-t border-red-950/20 pt-3">
                                    <span className="text-base font-bold uppercase tracking-wider text-red-950">{t("totalToPay")}</span>
                                    <span className="text-xl font-black text-red-950">
                                        {formatPrice(finalTotal)} MXN
                                    </span>
                                </div>
                            </div>

                            {/* Botón Final de Pago */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-red-950 hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed text-amber-300 font-bold uppercase tracking-widest text-xs border border-red-900 transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>{t("processingPayment")}</span>
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4" />
                                        <span>{t("payButton", { amount: formatPrice(finalTotal) })}</span>
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-center text-zinc-600 font-medium">
                                {t("termsNotice")}
                            </p>

                            <div className="flex flex-row justify-center items-center gap-6 pt-2">
                                <Image src="/keycop.webp" alt="etomin" width={110} height={28} className="object-contain" />
                                <Image src="/secure-payment.png" alt="secure" width={130} height={20} className="object-contain" />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}