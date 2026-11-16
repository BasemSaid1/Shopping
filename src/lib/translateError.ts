const exact: Record<string, string> = {
  // تسجيل الدخول والحساب
  "invalid email or password": "البريد الإلكتروني أو كلمة المرور غير صحيحة",
  "user not found": "لا يوجد حساب بهذا البريد، أو لم يتم تأكيده بعد",
  "user account not found": "الحساب غير موجود",
  "not account recored match this email address":
    "لا يوجد حساب بهذا البريد الإلكتروني",
  "an account with this email address already exists":
    "يوجد حساب مسجّل بهذا البريد الإلكتروني بالفعل",
  "this email account has already been confirmed": "تم تأكيد هذا البريد بالفعل",
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

  "product title must be string": "عنوان المنتج غير صالح",
  "product title is required": "عنوان المنتج مطلوب",
  "title must be longer than or equal to 2 characters":
    "العنوان لا يقل عن حرفين",
  "title must be shorter than or equal to 200 characters":
    "العنوان لا يزيد عن 200 حرف",
  "description must be a string": "الوصف غير صالح",
  "price must be a valid number": "السعر لازم يكون رقم",
  "price cannot be zero or negative value": "السعر لازم يكون أكبر من صفر",
  "stock must be a valid number": "المخزون لازم يكون رقم",
  "stock cannot be negative value": "المخزون لا يمكن أن يكون سالبًا",
  "stock must be an integer": "المخزون لازم يكون رقم صحيح",
  "invalid brand id format": "الماركة غير صالحة",
  "invalid category id format": "الفئة غير صالحة",
  "product main image is required": "الصورة الرئيسية مطلوبة",
  "the assigned brand not exists": "الماركة المختارة غير موجودة",
  "unexpected field": "عدد الصور أكبر من المسموح (10 كحد أقصى للمعرض)",

  "brand name is required": "اسم الماركة مطلوب",
  "brand name must be between 2 and 20 characters long":
    "اسم الماركة يجب أن يكون بين 2 و20 حرفًا",
  "brand name already exists": "اسم الماركة مستخدم بالفعل",
  "brand logo is required": "لوجو الماركة مطلوب",
  "categories must be as an array": "اختر فئة واحدة على الأقل",
  "at least one category id must exist": "اختر فئة واحدة على الأقل",
  "each category id must be a valid mongodb objectid": "فئة غير صالحة",

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
  "review not found or you are not authorized to update this review":
    "التقييم غير موجود أو لا تملك صلاحية تعديله",
  "review not found or you are not authorized to delete this review":
    "التقييم غير موجود أو لا تملك صلاحية حذفه",
  "comment must be between 3 and 500 characters":
    "التعليق يجب أن يكون بين 3 و500 حرف",
  "rating must be a positive number": "التقييم يجب أن يكون من 1 إلى 5",
  "rating must be less than or equal to 5": "التقييم يجب أن يكون من 1 إلى 5",

  "category name is required": "اسم الفئة مطلوب",
  "category name must be between 2 and 20 characters long":
    "اسم الفئة يجب أن يكون بين 2 و20 حرفًا",
  "category name already exists": "اسم الفئة مستخدم بالفعل",
  "category logo is required": "لوجو الفئة مطلوب",

  // الملفات
  "unsupported file format": "صيغة الملف غير مدعومة (JPG أو PNG أو WebP)",
  "file too large": "حجم الصورة أكبر من 5 ميجا",

  "invalid order status": "حالة الطلب غير صالحة",
  "invalid status transition": "لا يمكن نقل الطلب لهذه الحالة",
  "card order must be paid first": "طلب البطاقة لازم يتدفع الأول",
  "order status has changed, please refresh":
    "حالة الطلب اتغيرت، حدّث الصفحة وجرّب تاني",
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
    (m) => `لا يمكن الإضافة: عندك ${m[1]} في السلة والمتاح ${m[2]} قطعة فقط`,
  ],
  [
    /^review not found or you are not authorized to (update|delete) this review$/,
    () => "التقييم غير موجود أو ليس لديك صلاحية تعديله",
  ],
  [/^brand with id .+ not found$/, () => "الماركة غير موجودة"],
  [
    /^database integrity failure: one or more provided category ids do not exists ins db$/,
    () => "إحدى الفئات المختارة غير موجودة",
  ],
  [
    /^business role : the brand .+ does not belong to or support specific category$/,
    () => "الماركة المختارة لا تتبع هذه الفئة",
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
