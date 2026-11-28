import type { LanguageCode } from "./languages";

// Prepared locally: consent never needs an AI request or document transmission.
export const consentGerman = "Wir möchten deinen Brief mit einem Computer-Programm erklären lassen. Vorher machen wir Namen und Nummern schwarz. Der Brief geht kurz an eine Firma in den USA (OpenAI). Postkompass speichert nichts. Du musst nicht zustimmen. Bist du einverstanden?";
export const consentTranslations: Record<LanguageCode, string> = {
  ro: "Dorim să explicăm scrisoarea ta cu ajutorul unui program de calculator. Mai întâi acoperim numele și numerele cu negru. Scrisoarea este trimisă pentru scurt timp unei firme din SUA (OpenAI). Postkompass nu salvează nimic. Nu ești obligat să accepți. Ești de acord?",
  bg: "Искаме да обясним писмото ти с компютърна програма. Първо закриваме имената и номерата с черно. Писмото се изпраща за кратко до фирма в САЩ (OpenAI). Postkompass не запазва нищо. Не си длъжен да се съгласиш. Съгласен ли си?",
  sr: "Želimo da objasnimo tvoje pismo pomoću računarskog programa. Prvo prekrivamo imena i brojeve crnom bojom. Pismo se nakratko šalje firmi u SAD (OpenAI). Postkompass ništa ne čuva. Ne moraš da pristaneš. Da li pristaješ?",
  hr: "Želimo objasniti tvoje pismo pomoću računalnog programa. Prvo prekrivamo imena i brojeve crnom bojom. Pismo se nakratko šalje tvrtki u SAD-u (OpenAI). Postkompass ništa ne pohranjuje. Ne moraš pristati. Jesi li suglasan?",
  bs: "Želimo objasniti tvoje pismo pomoću računarskog programa. Prvo prekrivamo imena i brojeve crnom bojom. Pismo se nakratko šalje firmi u SAD-u (OpenAI). Postkompass ništa ne čuva. Ne moraš pristati. Da li pristaješ?",
  mk: "Сакаме да го објасниме твоето писмо со компјутерска програма. Прво ги покриваме имињата и броевите со црно. Писмото накратко се испраќа до фирма во САД (OpenAI). Postkompass не зачувува ништо. Не мора да се согласиш. Дали се согласуваш?",
  sq: "Duam ta shpjegojmë letrën tënde me një program kompjuterik. Fillimisht i mbulojmë emrat dhe numrat me të zezë. Letra i dërgohet për pak kohë një kompanie në SHBA (OpenAI). Postkompass nuk ruan asgjë. Nuk je i detyruar të pranosh. A je dakord?",
  tr: "Mektubunu bir bilgisayar programıyla açıklamak istiyoruz. Önce isimleri ve numaraları siyahla kapatıyoruz. Mektup kısa süreliğine ABD'deki bir şirkete (OpenAI) gönderiliyor. Postkompass hiçbir şey kaydetmiyor. Kabul etmek zorunda değilsin. Kabul ediyor musun?",
  ar: "نريد شرح رسالتك باستخدام برنامج كمبيوتر. أولاً نغطي الأسماء والأرقام باللون الأسود. تُرسل الرسالة لفترة قصيرة إلى شركة في الولايات المتحدة (OpenAI). لا يحفظ Postkompass أي شيء. لست مجبراً على الموافقة. هل توافق؟",
  uk: "Ми хочемо пояснити твій лист за допомогою комп’ютерної програми. Спочатку закриваємо імена та номери чорним кольором. Лист ненадовго надсилається компанії у США (OpenAI). Postkompass нічого не зберігає. Ти не зобов’язаний погоджуватися. Ти згоден?",
  en: "We would like to explain your letter using a computer program. First, we cover names and numbers in black. The letter is briefly sent to a company in the USA (OpenAI). Postkompass does not save anything. You do not have to agree. Do you agree?",
};
export const ownConsent = "Ich bin einverstanden, dass mein geschwärzter Brief an einen KI-Dienst (OpenAI, über Lovable) gesendet wird, damit eine Erklärung und Übersetzung entstehen. Der Brief kann Gesundheitsdaten oder andere besonders schützenswerte Angaben enthalten. Postkompass speichert nichts. Ich kann jederzeit abbrechen.";
export const helperConsent = "Die Person, um deren Brief es geht, wurde informiert und ist ausdrücklich einverstanden.";
export const consentPrintLabels: Record<LanguageCode, { title: string; date: string; signature: string }> = {
  ro: { title: "Consimțământ", date: "Data", signature: "Semnătura" },
  bg: { title: "Съгласие", date: "Дата", signature: "Подпис" },
  sr: { title: "Saglasnost", date: "Datum", signature: "Potpis" },
  hr: { title: "Suglasnost", date: "Datum", signature: "Potpis" },
  bs: { title: "Saglasnost", date: "Datum", signature: "Potpis" },
  mk: { title: "Согласност", date: "Датум", signature: "Потпис" },
  sq: { title: "Pëlqimi", date: "Data", signature: "Nënshkrimi" },
  tr: { title: "Onay", date: "Tarih", signature: "İmza" },
  ar: { title: "الموافقة", date: "التاريخ", signature: "التوقيع" },
  uk: { title: "Згода", date: "Дата", signature: "Підпис" },
  en: { title: "Consent", date: "Date", signature: "Signature" },
};