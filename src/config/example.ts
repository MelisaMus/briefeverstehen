import type { LanguageCode } from "./languages";

export const example = {
  sender: "Jobcenter", category: "Bitte um Unterlagen", date: "2026-11-23", deadline: "2026-12-02",
  appointment: "2026-12-08", time: "10:00", location: "Jobcenter · Musterstraße 12, Musterstadt",
};

export const german = {
  sender: "Das Jobcenter hat dir geschrieben.",
  summary: "Das Jobcenter prüft deinen Antrag auf Bürgergeld. Es fehlen noch Unterlagen. Bitte schicke diese an das Jobcenter.",
  tasks: ["Kontoauszüge der letzten 3 Monate sammeln.", "Eine Kopie deines Mietvertrags machen.", "Die Unterlagen an das Jobcenter schicken."],
  documents: ["Kontoauszüge der letzten 3 Monate", "Dein Mietvertrag (Kopie)"],
  deadline: "Die Unterlagen müssen bis zum 2. Dezember 2026 beim Jobcenter sein.",
  appointment: "Gespräch zu deinem Antrag auf Bürgergeld.",
  warning: "Wenn Unterlagen fehlen, kann das Jobcenter deinen Antrag nicht abschließend prüfen. Du bekommst dann vielleicht vorerst kein Geld.",
};

type Translation = { sender: string; summary: string; tasks: [string, string, string]; documents: [string, string]; deadline: string; appointment: string; warning: string };
export const translations: Record<LanguageCode, Translation> = {
  ro: {
    sender: "Jobcenter ți-a trimis o scrisoare.",
    summary: "Jobcenter verifică cererea ta pentru ajutorul social Bürgergeld. Mai lipsesc documente. Trimite aceste documente la Jobcenter.",
    tasks: ["Adună extrasele de cont din ultimele 3 luni.", "Fă o copie a contractului tău de închiriere.", "Trimite documentele la Jobcenter."],
    documents: ["Extrasele de cont din ultimele 3 luni", "Contractul tău de închiriere (copie)"],
    deadline: "Documentele trebuie să ajungă la Jobcenter până la 2 decembrie 2026.",
    appointment: "Discuție despre cererea ta pentru ajutorul social Bürgergeld.",
    warning: "Dacă lipsesc documente, Jobcenter nu poate finaliza verificarea cererii tale. Este posibil să nu primești bani deocamdată.",
  },
  bg: {
    sender: "Jobcenter ти е изпратил писмо.",
    summary: "Jobcenter проверява молбата ти за социалната помощ Bürgergeld. Липсват документи. Изпрати тези документи на Jobcenter.",
    tasks: ["Събери банковите извлечения за последните 3 месеца.", "Направи копие на договора си за наем.", "Изпрати документите на Jobcenter."],
    documents: ["Банкови извлечения за последните 3 месеца", "Договор за наем (копие)"],
    deadline: "Документите трябва да пристигнат в Jobcenter до 2 декември 2026 г.",
    appointment: "Разговор за молбата ти за социалната помощ Bürgergeld.",
    warning: "Ако липсват документи, Jobcenter не може да приключи проверката. Възможно е засега да не получиш пари.",
  },
  sr: {
    sender: "Jobcenter ti je poslao pismo.",
    summary: "Jobcenter proverava tvoj zahtev za socijalnu pomoć Bürgergeld. Nedostaju dokumenti. Pošalji ove dokumente u Jobcenter.",
    tasks: ["Prikupi izvode računa za poslednja 3 meseca.", "Napravi kopiju ugovora o zakupu.", "Pošalji dokumente u Jobcenter."],
    documents: ["Izvodi računa za poslednja 3 meseca", "Ugovor o zakupu (kopija)"],
    deadline: "Dokumenti moraju stići u Jobcenter do 2. decembra 2026.",
    appointment: "Razgovor o tvom zahtevu za socijalnu pomoć Bürgergeld.",
    warning: "Ako dokumenti nedostaju, Jobcenter ne može da završi proveru. Možda za sada nećeš dobiti novac.",
  },
  mk: {
    sender: "Jobcenter ти испрати писмо.",
    summary: "Jobcenter го проверува твоето барање за социјална помош Bürgergeld. Недостигаат документи. Испрати ги документите до Jobcenter.",
    tasks: ["Собери изводи од сметка за последните 3 месеци.", "Направи копија од договорот за наем.", "Испрати ги документите до Jobcenter."],
    documents: ["Изводи од сметка за последните 3 месеци", "Договор за наем (копија)"],
    deadline: "Документите мора да пристигнат до 2 декември 2026 година.",
    appointment: "Разговор за твоето барање за социјална помош Bürgergeld.",
    warning: "Ако недостигаат документи, Jobcenter не може да ја заврши проверката. Можеби засега нема да добиеш пари.",
  },
  sq: {
    sender: "Jobcenter të ka dërguar një letër.",
    summary: "Jobcenter po kontrollon kërkesën tënde për ndihmën sociale Bürgergeld. Mungojnë dokumente. Dërgoji këto dokumente te Jobcenter.",
    tasks: ["Mblidh pasqyrat bankare të 3 muajve të fundit.", "Bëj një kopje të kontratës së qirasë.", "Dërgoji dokumentet te Jobcenter."],
    documents: ["Pasqyrat bankare të 3 muajve të fundit", "Kontrata e qirasë (kopje)"],
    deadline: "Dokumentet duhet të mbërrijnë te Jobcenter deri më 2 dhjetor 2026.",
    appointment: "Bisedë për kërkesën tënde për ndihmën sociale Bürgergeld.",
    warning: "Nëse mungojnë dokumente, Jobcenter nuk mund ta përfundojë kontrollin. Ndoshta nuk do të marrësh para për momentin.",
  },
  tr: {
    sender: "Jobcenter sana bir mektup gönderdi.",
    summary: "Jobcenter, Bürgergeld sosyal yardım başvurunu inceliyor. Bazı belgeler eksik. Bu belgeleri Jobcenter'a gönder.",
    tasks: ["Son 3 ayın banka hesap dökümlerini topla.", "Kira sözleşmenin bir kopyasını hazırla.", "Belgeleri Jobcenter'a gönder."],
    documents: ["Son 3 ayın banka hesap dökümleri", "Kira sözleşmen (kopya)"],
    deadline: "Belgeler 2 Aralık 2026'ya kadar Jobcenter'a ulaşmalı.",
    appointment: "Bürgergeld sosyal yardım başvurun hakkında görüşme.",
    warning: "Belgeler eksikse Jobcenter incelemeyi tamamlayamaz. Şimdilik para alamayabilirsin.",
  },
  ar: {
    sender: "أرسل لك مركز العمل رسالة.",
    summary: "يراجع مركز العمل طلبك للحصول على الإعانة الاجتماعية Bürgergeld. هناك مستندات ناقصة. أرسل هذه المستندات إلى مركز العمل.",
    tasks: ["اجمع كشوف حسابك البنكي لآخر 3 أشهر.", "جهّز نسخة من عقد الإيجار.", "أرسل المستندات إلى مركز العمل."],
    documents: ["كشوف الحساب البنكي لآخر 3 أشهر", "عقد الإيجار (نسخة)"],
    deadline: "يجب أن تصل المستندات إلى مركز العمل بحلول 2 ديسمبر 2026.",
    appointment: "محادثة حول طلبك للحصول على الإعانة الاجتماعية Bürgergeld.",
    warning: "إذا كانت المستندات ناقصة، لا يستطيع مركز العمل إكمال المراجعة. قد لا تحصل على المال في الوقت الحالي.",
  },
  uk: {
    sender: "Jobcenter надіслав тобі листа.",
    summary: "Jobcenter перевіряє твою заяву на соціальну допомогу Bürgergeld. Бракує документів. Надішли ці документи до Jobcenter.",
    tasks: ["Збери банківські виписки за останні 3 місяці.", "Зроби копію договору оренди.", "Надішли документи до Jobcenter."],
    documents: ["Банківські виписки за останні 3 місяці", "Договір оренди (копія)"],
    deadline: "Документи мають надійти до Jobcenter до 2 грудня 2026 року.",
    appointment: "Розмова про твою заяву на соціальну допомогу Bürgergeld.",
    warning: "Якщо бракує документів, Jobcenter не може завершити перевірку. Можливо, ти поки не отримаєш грошей.",
  },
  en: {
    sender: "The Jobcenter sent you a letter.",
    summary: "The Jobcenter is checking your application for Bürgergeld support. Some documents are missing. Please send these documents to the Jobcenter.",
    tasks: ["Collect your bank statements from the last 3 months.", "Make a copy of your rental agreement.", "Send the documents to the Jobcenter."],
    documents: ["Bank statements from the last 3 months", "Your rental agreement (copy)"],
    deadline: "The documents must reach the Jobcenter by 2 December 2026.",
    appointment: "A meeting about your application for Bürgergeld support.",
    warning: "If documents are missing, the Jobcenter cannot finish checking your application. You may not receive money for now.",
  },
};