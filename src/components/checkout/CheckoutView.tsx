"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useFormik } from "formik";
import {
  FaPhone,
  FaTag,
  FaCreditCard,
  FaMoneyBillWave,
  FaSpinner,
  FaShoppingCart,
  FaExclamationTriangle,
  FaImage,
} from "react-icons/fa";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { getImageUrl } from "@/lib/image";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/useCart";
import { zodValidate } from "@/lib/zodValidate";
import {
  checkoutSchema,
  type CheckoutValues,
} from "@/lib/validations/checkout";
import FormInput from "@/components/FormInput";
import type { ApiResponse, CartItem, Product } from "@/types";

type AvailableItem = CartItem & { product: Product };
type AppliedCoupon = { code: string; discountPercentage: number };

const methods = [
  {
    value: "CARD",
    label: "الدفع بالبطاقة",
    hint: "دفع آمن أونلاين",
    icon: <FaCreditCard />,
  },
  {
    value: "CASH",
    label: "الدفع عند الاستلام",
    hint: "ادفع كاش عند وصول الطلب",
    icon: <FaMoneyBillWave />,
  },
] as const;

export default function CheckoutView() {
  const router = useRouter();
  const { cart, loading, error: loadError, retry } = useCart("/checkout");

  const [serverError, setServerError] = useState("");
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [applied, setApplied] = useState<AppliedCoupon | null>(null);
  const [couponMsg, setCouponMsg] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const formik = useFormik<CheckoutValues>({
    initialValues: {
      shippingAddress: "",
      phone: "",
      paymentMethod: "CARD",
      coupon: "",
    },
    validate: zodValidate(checkoutSchema),
    onSubmit: async (values) => {
      setServerError("");

      try {
        let orderId = pendingOrderId;

        // المرحلة 1: إنشاء الطلب (بيتعمل مرة واحدة بس)
        if (!orderId) {
          const { data } = await api.post<ApiResponse<{ _id: string }>>(
            "/orders",
            {
              shippingAddress: values.shippingAddress.trim(),
              phone: values.phone.trim(),
              paymentMethod: values.paymentMethod,
              appliedCoupon: applied?.code,
            },
          );
          orderId = data.data._id;
          setPendingOrderId(orderId);
          router.refresh(); // علشان عدّاد السلة يتصفّر
        }

        if (values.paymentMethod === "CASH") {
          router.push("/checkout/success");
          return;
        }

        // المرحلة 2: جلسة الدفع وتحويل المستخدم
        const { data } = await api.post<ApiResponse<{ url: string | null }>>(
          `/orders/${orderId}/session`,
        );

        if (!data.data.url) {
          setServerError("تعذر بدء عملية الدفع، حاول مرة أخرى");
          return;
        }

        window.location.href = data.data.url;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.push("/login?redirect=/checkout");
          return;
        }
        setServerError(getErrorMessage(err));
      }
    },
  });

  async function applyCoupon() {
    const code = formik.values.coupon.trim();
    if (!code) return;

    setCouponLoading(true);
    setCouponMsg(null);

    try {
      const { data } = await api.post<ApiResponse<AppliedCoupon>>(
        "/coupon/validate",
        { code },
      );
      setApplied(data.data);
      setCouponMsg({
        ok: true,
        text: `تم تطبيق خصم ${data.data.discountPercentage.toLocaleString("ar-EG")}%`,
      });
    } catch (err) {
      setApplied(null);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push("/login?redirect=/checkout");
        return;
      }
      setCouponMsg({ ok: false, text: "كود الخصم غير صالح أو منتهي الصلاحية" });
    } finally {
      setCouponLoading(false);
    }
  }

  if (loading) {
    return <div className="h-96 animate-pulse rounded-2xl bg-gray-100" />;
  }

  if (loadError || !cart) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-red-50 py-16 text-red-600">
        <FaExclamationTriangle className="text-4xl" />
        <p className="font-semibold">{loadError || "تعذر تحميل السلة"}</p>
        <button
          type="button"
          onClick={retry}
          className="text-sm font-semibold underline"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  const items = cart.items.filter(
    (item): item is AvailableItem => item.product !== null,
  );

  if (items.length === 0 && !pendingOrderId) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-gray-50 py-20 text-center">
        <FaShoppingCart className="text-6xl text-gray-300" />
        <p className="text-lg font-semibold text-gray-700">
          سلتك فاضية، مفيش حاجة تدفع تمنها
        </p>
        <Link
          href="/products"
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          تصفّح المنتجات
        </Link>
      </div>
    );
  }

  const subTotal = cart.totalPrice;
  const discount = applied ? (subTotal * applied.discountPercentage) / 100 : 0;
  const total = subTotal - discount;

  const addressError =
    formik.touched.shippingAddress && formik.errors.shippingAddress;

  const submitLabel = pendingOrderId
    ? "إعادة محاولة الدفع"
    : formik.values.paymentMethod === "CASH"
      ? "تأكيد الطلب"
      : "الدفع الآن";

  return (
    <form
      noValidate
      onSubmit={formik.handleSubmit}
      className="grid gap-8 lg:grid-cols-[1fr_24rem]"
    >
      <div className="space-y-6">
        {serverError && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {serverError}
          </p>
        )}

        {pendingOrderId && (
          <p className="rounded-lg bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            تم إنشاء طلبك لكن عملية الدفع لم تكتمل. اضغط «إعادة محاولة الدفع».
          </p>
        )}

        <fieldset
          disabled={Boolean(pendingOrderId)}
          className="min-w-0 space-y-6"
        >
          <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-800">بيانات الشحن</h2>

            <div>
              <textarea
                rows={3}
                placeholder="العنوان بالتفصيل (المحافظة، المدينة، الشارع، رقم المبنى)"
                {...formik.getFieldProps("shippingAddress")}
                className={`w-full rounded-lg border px-4 py-3 outline-none ${
                  addressError
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />
              {addressError && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.shippingAddress}
                </p>
              )}
            </div>

            <FormInput
              icon={<FaPhone />}
              type="tel"
              inputMode="tel"
              dir="ltr"
              placeholder="01012345678"
              {...formik.getFieldProps("phone")}
              error={formik.touched.phone && formik.errors.phone}
            />
          </section>

          <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-800">طريقة الدفع</h2>

            <div className="grid gap-3 sm:grid-cols-2">
              {methods.map((method) => (
                <label key={method.value} className="cursor-pointer">
                  <input
                    type="radio"
                    {...formik.getFieldProps({
                      name: "paymentMethod",
                      type: "radio",
                      value: method.value,
                    })}
                    className="peer sr-only"
                  />
                  <div className="flex items-center gap-3 rounded-xl border-2 border-gray-200 p-4 transition peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-300">
                    <span className="text-2xl text-blue-600">
                      {method.icon}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {method.label}
                      </p>
                      <p className="text-xs text-gray-500">{method.hint}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </section>

          <section className="space-y-3 rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-800">كود الخصم</h2>

            <div className="flex gap-2">
              <div className="flex-1">
                <FormInput
                  icon={<FaTag />}
                  dir="ltr"
                  placeholder="CODE"
                  {...formik.getFieldProps("coupon")}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setApplied(null);
                    setCouponMsg(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      applyCoupon();
                    }
                  }}
                  error={formik.touched.coupon && formik.errors.coupon}
                />
              </div>
              <button
                type="button"
                onClick={applyCoupon}
                disabled={couponLoading || !formik.values.coupon.trim()}
                className="flex h-12 items-center gap-2 rounded-lg bg-gray-800 px-5 text-sm font-semibold text-white transition hover:bg-gray-900 disabled:opacity-50"
              >
                {couponLoading && <FaSpinner className="animate-spin" />}
                تطبيق
              </button>
            </div>

            {couponMsg && (
              <p
                className={`text-sm font-semibold ${
                  couponMsg.ok ? "text-green-600" : "text-red-600"
                }`}
              >
                {couponMsg.text}
              </p>
            )}
          </section>
        </fieldset>
      </div>

      <aside className="h-fit space-y-4 rounded-2xl border border-gray-200 bg-white p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-bold text-gray-800">ملخص الطلب</h2>

        <ul className="max-h-64 space-y-3 overflow-y-auto">
          {items.map((item) => {
            const image = getImageUrl(item.product.image);
            return (
              <li key={item.product._id} className="flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 text-gray-300">
                  {image ? (
                    <img
                      src={image}
                      alt={item.product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FaImage />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-semibold text-gray-800">
                    {item.product.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    الكمية: {item.quantity.toLocaleString("ar-EG")}
                  </p>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {formatPrice(item.subTotal)}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="space-y-2 border-t border-gray-200 pt-4 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>المجموع</span>
            <span>{formatPrice(subTotal)}</span>
          </div>
          {applied && (
            <div className="flex justify-between text-green-600">
              <span>
                خصم ({applied.discountPercentage.toLocaleString("ar-EG")}%)
              </span>
              <span>- {formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-gray-200 pt-3">
            <span className="font-semibold text-gray-800">الإجمالي</span>
            <span className="text-xl font-bold text-blue-600">
              {formatPrice(total)}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {formik.isSubmitting && <FaSpinner className="animate-spin" />}
          {formik.isSubmitting ? "جاري المعالجة..." : submitLabel}
        </button>
      </aside>
    </form>
  );
}
