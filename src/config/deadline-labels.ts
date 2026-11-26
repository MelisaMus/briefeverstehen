import type { LanguageCode } from "./languages";

export const deadlineLabels: Record<LanguageCode, { latest: string; recommendation: string; check: string }> = {
  ro: { latest: "Cel târziu", recommendation: "Recomandare: rezolvă până la", check: "Verifică termenul în scrisoarea originală." },
  bg: { latest: "Най-късно", recommendation: "Препоръка: изпълни до", check: "Провери срока в оригиналното писмо." },
  sr: { latest: "Najkasnije", recommendation: "Preporuka: završi do", check: "Proveri rok u originalnom pismu." },
  hr: { latest: "Najkasnije", recommendation: "Preporuka: završi do", check: "Provjeri rok u izvornom pismu." },
  bs: { latest: "Najkasnije", recommendation: "Preporuka: završi do", check: "Provjeri rok u originalnom pismu." },
  mk: { latest: "Најдоцна", recommendation: "Препорака: заврши до", check: "Провери го рокот во оригиналното писмо." },
  sq: { latest: "Më së voni", recommendation: "Rekomandim: përfundo deri më", check: "Kontrollo afatin në letrën origjinale." },
  tr: { latest: "En geç", recommendation: "Öneri: şu tarihe kadar tamamla", check: "Son tarihi asıl mektupta kontrol et." },
  ar: { latest: "آخر موعد", recommendation: "التوصية: أنجز بحلول", check: "تحقق من الموعد النهائي في الرسالة الأصلية." },
  uk: { latest: "Не пізніше", recommendation: "Рекомендація: виконай до", check: "Перевір строк в оригінальному листі." },
  en: { latest: "At the latest", recommendation: "Recommendation: complete by", check: "Check the deadline in the original letter." },
};