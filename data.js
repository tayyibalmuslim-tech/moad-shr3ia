// =========================================================
// data.js — بيانات خطة «مواد شرعية» (المسار الشافعي)
// كل كتاب له key ثابت: عليه يتبني حفظ التقدم، وفولدر الملخصات books/NN-key/
// لو غيّرت ترتيب أو اسم كتاب، ما تغيّرش الـ key عشان تقدمك ما يضيعش.
// =========================================================
const PLAN = {
  title: "مواد شرعية",
  subtitle: "خطة تقييم الأقوال الفقهية والاستدلالات — المسار الشافعي",
  repo: { owner: "tayyibalmuslim-tech", name: "moad-shr3ia", branch: "main" },

  // القيم الافتراضية (تتعدّل من صفحة الإعدادات جوه التطبيق)
  defaults: { startDate: "2026-11-25", hoursPerDay: 2, realism: 1.3 },

  levels: [
    { id: "basic", name: "أساسي", desc: "التأسيس: مفاتيح العلوم" },
    { id: "mid",   name: "متوسط", desc: "البناء: الكتب المتوسطة" },
    { id: "adv",   name: "متقدم", desc: "التمكين والتطبيق" }
  ],

  // hours: الساعات التقديرية (قراءة + سماع شرح + مراجعة) — null = مرجع مستمر
  // finish: ✅ الكتاب اللي لما تخلصه تعتبر خلصت العلم ده لهدفك
  books: [
    { n: 1,  key: "ajurrumiyyah",       level: "basic", title: "الآجرومية (بشرح مسموع)", science: "النحو", hours: 30, track: "لغة", alt: "«التحفة السنية» شرح الآجرومية", note: "مفتاح كل العلوم، ابدأ بيه" },
    { n: 2,  key: "abu-shuja",          level: "basic", title: "متن أبي شجاع بشرح «فتح القريب»", science: "الفقه المذهبي", hours: 80, track: "فقه", alt: "شرح أوسع: «الإقناع في حل ألفاظ أبي شجاع» للخطيب الشربيني", note: "بالتوازي مع الآجرومية: فقه عبادتك فرض عين" },
    { n: 3,  key: "tatbiq-sarfi",       level: "basic", title: "«التطبيق الصرفي» لعبده الراجحي", science: "الصرف", hours: 40, track: "لغة", alt: "«متن البناء» بشرح", note: "بعد الآجرومية" },
    { n: 4,  key: "waraqat",            level: "basic", title: "«الورقات» للجويني (بشرح)", science: "أصول الفقه", hours: 30, track: "منهج وآلة", alt: "شرح المحلي على الورقات", note: "أول باب لفهم الاستدلال" },
    { n: 5,  key: "bayquniyyah",        level: "basic", title: "«المنظومة البيقونية» (بشرح)", science: "مصطلح الحديث", hours: 15, track: "ثبوت", alt: "", note: "قصيرة: تعرّفك ألفاظ الصحة والضعف" },
    { n: 6,  key: "faraid-bahiyyah",    level: "basic", title: "«الفرائد البهية في نظم القواعد الفقهية» للأهدل", science: "القواعد الفقهية", hours: 20, track: "منهج وآلة", alt: "«منظومة القواعد الفقهية» للسعدي", note: "القواعد اللي بيتبني عليها الفقه" },
    { n: 7,  key: "dawabit-marifah",    level: "basic", title: "«ضوابط المعرفة» لعبد الرحمن حبنكة الميداني", science: "المنطق وأصول الاستدلال", hours: 50, track: "منهج وآلة", alt: "«السلم المنورق» بشرح", note: "بيعلّمك تكتشف المغالطة في الاستدلال" },
    { n: 8,  key: "umdat-ahkam",        level: "basic", title: "«عمدة الأحكام» لعبد الغني المقدسي (بشرح)", science: "أحاديث الأحكام", hours: 100, track: "مصادر", alt: "", note: "آخر المستوى: بيطبق اللغة والأصول على الأحاديث" },

    { n: 9,  key: "qatr-nada",          level: "mid", title: "«قطر الندى» لابن هشام", science: "النحو", hours: 80, track: "لغة", alt: "«شذور الذهب» لابن هشام", note: "الحد الأدنى في النحو للفقيه" },
    { n: 10, key: "lubb-usul",          level: "mid", title: "«لب الأصول» لزكريا الأنصاري بشرحه «غاية الوصول»", science: "أصول الفقه", hours: 80, track: "منهج وآلة", alt: "لو صعب: «الأصول من علم الأصول» لابن عثيمين كتمهيد", note: "مختصر «جمع الجوامع»، تمهيد مباشر لشرح المحلي — بالتوازي مع قطر الندى" },
    { n: 11, key: "umdat-salik",        level: "mid", title: "«عمدة السالك وعدة الناسك» لابن النقيب (بشرح)", science: "الفقه المذهبي", hours: 120, track: "فقه", alt: "«الياقوت النفيس» للشاطري", note: "مرحلة وسط بين أبو شجاع والمنهاج" },
    { n: 12, key: "taysir-mustalah",    level: "mid", title: "«تيسير مصطلح الحديث» لمحمود الطحان", science: "مصطلح الحديث", hours: 40, track: "ثبوت", alt: "", note: "تمهيد لنزهة النظر" },
    { n: 13, key: "balagha-wadiha",     level: "mid", title: "«البلاغة الواضحة» لعلي الجارم ومصطفى أمين", science: "البلاغة", hours: 50, track: "لغة", alt: "", note: "مدخل سهل للبلاغة" },
    { n: 14, key: "nuzhat-nazar",       level: "mid", title: "«نزهة النظر» لابن حجر", science: "مصطلح الحديث", hours: 60, track: "ثبوت", alt: "", note: "بعد تيسير المصطلح" },
    { n: 15, key: "mabahith-quran",     level: "mid", title: "«مباحث في علوم القرآن» لمناع القطان", science: "علوم القرآن", hours: 50, track: "مصادر", alt: "", note: "الناسخ والمنسوخ وأسباب النزول" },
    { n: 16, key: "ilm-maqasid",        level: "mid", title: "«علم المقاصد الشرعية» لنور الدين الخادمي", science: "مقاصد الشريعة", hours: 30, track: "منهج وآلة", alt: "", note: "مدخل للمقاصد قبل ابن عاشور" },
    { n: 17, key: "athar-ikhtilaf",     level: "mid", title: "«أثر الاختلاف في القواعد الأصولية في اختلاف الفقهاء» لمصطفى الخن", science: "تخريج الفروع على الأصول", hours: 60, track: "تطبيق", alt: "", note: "قبل بداية المجتهد: بيوريك الخلاف جاي منين" },
    { n: 18, key: "bidayat-mujtahid",   level: "mid", title: "«بداية المجتهد» لابن رشد", science: "الفقه المقارن", hours: 250, track: "فقه", alt: "", note: "لو عايز تختصر: ابدأ بأبواب العبادات" },

    { n: 19, key: "ibn-aqil",           level: "adv", title: "شرح ابن عقيل على ألفية ابن مالك", science: "النحو", hours: 200, finish: true, track: "لغة", alt: "«أوضح المسالك» لابن هشام", note: "فهم من غير حفظ كامل، بالتوازي مع شرح المحلي" },
    { n: 20, key: "mahalli-jawami",     level: "adv", title: "شرح المحلي على «جمع الجوامع» لابن السبكي", science: "أصول الفقه", hours: 300, finish: true, track: "منهج وآلة", alt: "للمقارنة: «روضة الناظر» مع «مذكرة الشنقيطي» (حنبلي)", note: "أهم كتاب في الخطة، ادرسه مع شيخ" },
    { n: 21, key: "shadha-arf",         level: "adv", title: "«شذا العرف في فن الصرف» للحملاوي", science: "الصرف", hours: 80, finish: true, track: "لغة", alt: "«لامية الأفعال» بشرح", note: "" },
    { n: 22, key: "mughni-labib",       level: "adv", title: "«مغني اللبيب» لابن هشام: الباب الأول (معاني الحروف)", science: "النحو", hours: 60, finish: true, track: "لغة", alt: "", note: "عليه بيتبني خلاف زي باء ﴿برؤوسكم﴾" },
    { n: 23, key: "adab-bahth",         level: "adv", title: "«آداب البحث والمناظرة» للشنقيطي", science: "المنطق والمناظرة", hours: 40, finish: true, track: "منهج وآلة", alt: "", note: "إزاي تعترض على الاستدلال بانضباط" },
    { n: 24, key: "ibn-salah",          level: "adv", title: "«مقدمة ابن الصلاح»", science: "مصطلح الحديث", hours: 120, finish: true, track: "ثبوت", alt: "«تدريب الراوي» للسيوطي", note: "" },
    { n: 25, key: "usul-takhrij",       level: "adv", title: "«أصول التخريج ودراسة الأسانيد» للطحان", science: "التخريج ودراسة الأسانيد", hours: 50, finish: true, track: "ثبوت", alt: "الأعلى: «شرح علل الترمذي» لابن رجب", note: "تحكم على الحديث بنفسك" },
    { n: 26, key: "jawahir-balagha",    level: "adv", title: "«جواهر البلاغة» للهاشمي", science: "البلاغة", hours: 100, finish: true, track: "لغة", alt: "", note: "ركّز على علم المعاني" },
    { n: 27, key: "rawai-bayan",        level: "adv", title: "«روائع البيان في تفسير آيات الأحكام» للصابوني", science: "آيات الأحكام", hours: 100, finish: true, track: "مصادر", alt: "الأعلى: «أحكام القرآن» لابن العربي", note: "" },
    { n: 28, key: "subul-salam",        level: "adv", title: "«سبل السلام» للصنعاني (شرح بلوغ المرام)", science: "أحاديث الأحكام", hours: 350, finish: true, track: "مصادر", alt: "الأعلى: «نيل الأوطار» للشوكاني", note: "الصنعاني بيميل للترجيح المستقل عن المذاهب" },
    { n: 29, key: "minhaj-talibin",     level: "adv", title: "«منهاج الطالبين» للنووي بشرح مختصر", science: "الفقه المذهبي", hours: 250, finish: true, track: "فقه", alt: "«كنز الراغبين» للمحلي، وللتوسع «مغني المحتاج» للخطيب الشربيني", note: "" },
    { n: 30, key: "ashbah-suyuti",      level: "adv", title: "«الأشباه والنظائر» للسيوطي", science: "القواعد الفقهية", hours: 120, finish: true, track: "منهج وآلة", alt: "«المنثور في القواعد» للزركشي", note: "" },
    { n: 31, key: "maqasid-ibn-ashur",  level: "adv", title: "«مقاصد الشريعة الإسلامية» لابن عاشور", science: "مقاصد الشريعة", hours: 60, finish: true, track: "منهج وآلة", alt: "الأعلى: «الموافقات» للشاطبي", note: "" },
    { n: 32, key: "ijma-ibn-mundhir",   level: "adv", title: "«الإجماع» لابن المنذر", science: "الإجماع", hours: 20, finish: true, track: "مصادر", alt: "«مراتب الإجماع» لابن حزم", note: "مرجع تتأكد منه قبل ما تقبل أي قول" },
    { n: 33, key: "miftah-wusul",       level: "adv", title: "«مفتاح الوصول إلى بناء الفروع على الأصول» للتلمساني", science: "تخريج الفروع على الأصول", hours: 60, finish: true, track: "تطبيق", alt: "«تخريج الفروع على الأصول» للزنجاني", note: "" },
    { n: 34, key: "majmu-nawawi",       level: "adv", title: "«المجموع شرح المهذب» للنووي", science: "الفقه المقارن", hours: null, finish: true, track: "تطبيق", alt: "«المغني» لابن قدامة (حنبلي)", note: "مرجع مستمر في كل مسألة، مش للقراءة كاملة" }
  ],

  // ---------------------------------------------------------
  // الملخصات (اختياري): التطبيق بيكتشف أي ملف تترفعه في فولدر الكتاب تلقائيًا.
  // استخدم القائمة دي بس لو عايز تدي ملف عنوان مختلف عن اسمه.
  // مثال:
  // "ajurrumiyyah": [
  //   { n: 1, title: "مقدمة الآجرومية وباب الكلام", file: "books/01-ajurrumiyyah/01.html" }
  // ]
  // ---------------------------------------------------------
  summaries: {}
};

// مسار فولدر الكتاب: books/01-ajurrumiyyah
PLAN.books.forEach(function (b) {
  b.folder = "books/" + String(b.n).padStart(2, "0") + "-" + b.key;
});
