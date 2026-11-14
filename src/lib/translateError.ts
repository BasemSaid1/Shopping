const exact: Record<string, string> = {
  // تسجيل الدخول والحساب
  "invalid email or password": "البريد الإلكتروني أو كلمة المرور غير صحيحة",
  "user not found": "لا يوجد حساب بهذا البريد، أو لم يتم تأكيده بعد",
  "user account not found": "الحساب غير موجود",
  "not account recored match this email address":
    "لا يوجد حساب بهذا البريد الإلكتروني",
  "an account with this email address already exists":
    "يوجد حساب مسجّل بهذا البريد الإلكتروني بالفعل",
  "this email account has already been confirmed":
    "تم تأكيد هذا البريد بالفعل",
  "this code provided in incorrect": "الكود غير صحيح",
  "invalid otp": "الكود غير صحيح",
  "this verification code has expired , please resend otp again":
    "انتهت صلاحية الكود، اطلب كودًا جديدًا",
  "otp expired, please request a new one":
    "انتهت صلاحية الكود، اطلب كودًا جديدًا",
  "invalid google token": "تعذر التحقق من حساب جوجل",
  "google email is not verified": "بريد جوجل غير مؤكد",
  "this email is already registered with a different method, please login using your password":
    "هذا البريد مسجّل بطريقة أخرى، سجّل الدخول بكلمة المرور",
  "please provide a valid email format": "صيغة البريد الإلكتروني غير صحيحة",
  "password is required": "كلمة المرور مطلوبة",

  // الجلسة والصلاحيات
  "authorization header is missing": "سجّل الدخول أولاً",
  "invalid authorization schema format , use user <token> admin <token>":
    "سجّل الدخول من جديد",
  "invalid or expired token signature for schema context":
    "انتهت الجلسة، سجّل الدخول من جديد",
  "user account no longer exists in the system": "هذا الحساب لم يعد موجودًا",
  "you do not have permission to perform this action":
    "ليس لديك صلاحية لتنفيذ هذا الإجراء",

  // المنتجات والسلة
  "product not found": "المنتج غير موجود",
  "product not found in cart": "المنتج غير موجود في السلة",
  "cart not found for this user": "السلة غير موجودة",
  "your checkout pipeline failed because your cart is empty": "سلتك فاضية",
  "brand not found": "الماركة غير موجودة",
  "category not found": "الفئة غير موجودة",

  // الطلبات والدفع
  "order not found": "الطلب غير موجود",
  "invalid order id": "رقم الطلب غير صحيح",
  "only pending orders can be cancelled": "يمكن إلغاء الطلبات المعلّقة فقط",
  "this order has already been paid": "تم دفع هذا الطلب بالفعل",
  "no payment intent found for this order":
    "لا توجد عملية دفع مرتبطة بهذا الطلب",
  "invalid payment intent id": "عملية الدفع غير صالحة",

  // الكوبونات
  "oops! coupon is invalid or expired": "كود الخصم غير صالح أو منتهي",
  "coupon not found": "كود الخصم غير موجود",
  "coupon code already exists": "كود الخصم موجود بالفعل",

  // التقييمات
  "you have already reviewed this product": "لقد قمت بتقييم هذا المنتج من قبل",
  "the product you want to review does not exist":
    "المنتج المراد تقييمه غير موجود",

  // الملفات
  "unsupported file format": "صيغة الملف غير مدعومة",
};

const patterns: Array<[RegExp, (m: RegExpMatchArray) => string]> = [
  [
    /^insuffecent stock\. only (\d+) units available$/,
    (m) => `المتاح من هذا المنتج ${m[1]} قطعة فقط`,
  ],
  [
    /^cannot increase quantity\. only (\d+) units available$/,
    (m) => `المتاح من هذا المنتج ${m[1]} قطعة فقط`,
  ],
  [
    /^cannot add\. combined cart total (\d+) exceeds available stock (\d+)$/,
    (m) =>
      `لا يمكن الإضافة: عندك ${m[1]} في السلة والمتاح ${m[2]} قطعة فقط`,
  ],
  [
    /^review not found or you are not authorized to (update|delete) this review$/,
    () => "التقييم غير موجود أو ليس لديك صلاحية تعديله",
  ],
];

const normalize = (message: string) =>
  message.trim().replace(/\s+/g, " ").toLowerCase();

export const GENERIC_ERROR = "حدث خطأ غير متوقع، حاول مرة أخرى";

export function translateError(message: string) {
  const key = normalize(message);

  if (exact[key]) return exact[key];

  for (const [pattern, build] of patterns) {
    const match = key.match(pattern);
    if (match) return build(match);
  }

  // رسالة مش معروفة: بنخبّيها عن المستخدم وبتتسجّل في الـ logs
  console.warn("Untranslated backend error:", message);
  return GENERIC_ERROR;
}