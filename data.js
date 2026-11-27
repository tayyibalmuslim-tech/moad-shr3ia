// =========================================================
// data.js — بيانات خطة «مواد شرعية»: بناء طالب علم متكامل
// الفقه وأصوله والقواعد: المذهب الشافعي — العقيدة: المسار الأثري (منهج أهل الحديث)
// الهيكل: 4 مراحل، كل مرحلة مقسومة لمستويات، وفي المستوى الواحد كتاب واحد بس لكل علم.
// كل كتاب له key ثابت: عليه يتبني حفظ التقدم، وفولدر الملخصات books/<key>/
// لو غيّرت ترتيب أو اسم كتاب، ما تغيّرش الـ key عشان تقدمك ما يضيعش.
// =========================================================
const PLAN = {
  title: "مواد شرعية",
  subtitle: "بناء طالب علم متكامل — الفقه الشافعي والعقيدة الأثرية",
  repo: { owner: "tayyibalmuslim-tech", name: "moad-shr3ia", branch: "main" },

  // القيم الافتراضية (تتعدّل من صفحة الإعدادات جوه التطبيق)
  defaults: { startDate: "2026-11-25", hoursPerDay: 2, realism: 1.3 },

  // المراحل الأربع ومستوياتها — الكتاب بيتربط بالمستوى (level)، والمستوى بمرحلته
  stages: [
    { id: "s1", name: "مرحلة التأسيس الأولى", short: "التأسيس الأولى", desc: "مفاتيح العلوم وفرض العين", levels: [{ id: "s1l1", name: "مقدمات" }, { id: "s1l2", name: "آلة ١" }, { id: "s1l3", name: "آلة ٢" }, { id: "s1l4", name: "مقاصد ١" }] },
    { id: "s2", name: "مرحلة التأسيس الثانية", short: "التأسيس الثانية", desc: "تثبيت الأساس وتوسيعه", levels: [{ id: "s2l1", name: "آلة ٣" }, { id: "s2l2", name: "آلة ٤" }, { id: "s2l3", name: "مقاصد ٢" }, { id: "s2l4", name: "مقاصد ٣" }] },
    { id: "s3", name: "مرحلة التمكين الأولى", short: "التمكين الأولى", desc: "الكتب المتوسطة والمطوّلة الأولى", levels: [{ id: "s3l1", name: "آلة ٥" }, { id: "s3l2", name: "آلة ٦" }, { id: "s3l3", name: "مقاصد ٤" }, { id: "s3l4", name: "مقاصد ٥" }, { id: "s3l5", name: "تخصص ١: أدوات التقييم" }] },
    { id: "s4", name: "مرحلة التمكين الثانية", short: "التمكين الثانية", desc: "المطوّلات والتخصص", levels: [{ id: "s4l1", name: "آلة ٧" }, { id: "s4l2", name: "آلة ٨" }, { id: "s4l3", name: "مقاصد ٦" }, { id: "s4l4", name: "مقاصد ٧" }, { id: "s4l5", name: "تخصص ٢: الترجيح والفرق" }] }
  ],

  // hours: الساعات التقديرية (قراءة + سماع شرح + مراجعة) — null = مرجع أو ورد مستمر (خارج حساب الوتيرة)
  // finish: ✅ آخر كتاب في العلم ده جوه الخطة
  // track: القسم الكبير اللي العلم تابع له (لغة / قرآن / سنة / عقيدة / فقه وأصوله / معقولات / تخصص)
  books: [
    // ── مرحلة التأسيس الأولى ──
    { n: 1, key: "hifz", level: "s1l1", title: "حفظ القرآن الكريم (ورد مستمر)", science: "حفظ القرآن", hours: null, track: "قرآن", alt: "", note: "ورد يومي ثابت طول الخطة، ومش داخل في حساب الوتيرة" },
    { n: 2, key: "thalathat-usul", level: "s1l1", title: "«ثلاثة الأصول» لمحمد بن عبد الوهاب (بشرح)", science: "العقيدة", hours: 15, track: "عقيدة", alt: "", note: "" },
    { n: 3, key: "arbain", level: "s1l1", title: "«الأربعون النووية» (بشرح)", science: "متون الحديث", hours: 30, track: "سنة", alt: "", note: "" },
    { n: 4, key: "safina", level: "s1l1", title: "«سفينة النجاة» لسالم بن سمير الحضرمي (بشرح)", science: "الفقه الشافعي", hours: 15, track: "فقه وأصوله", alt: "«المقدمة الحضرمية» لبافضل", note: "فقه العبادات الأساسي بسرعة — فرض عين قبل أبي شجاع" },
    { n: 5, key: "tuhfat-atfal", level: "s1l2", title: "«تحفة الأطفال» للجمزوري", science: "التجويد", hours: 15, track: "قرآن", alt: "", note: "مع تطبيق عملي على شيخ" },
    { n: 6, key: "ajurrumiyyah", level: "s1l2", title: "الآجرومية (بشرح مسموع)", science: "النحو", hours: 30, track: "لغة", alt: "«التحفة السنية» شرح الآجرومية", note: "مفتاح كل العلوم",
      // قائمة محاضرات الشرح (الأستاذ الدكتور محمد حسن عثمان — قناة «شيخ العمود»):
      // لو الكتاب له lectures، نسبة الإنجاز بتتحسب تلقائيًا = المحاضرات اللي خلصت ÷ إجمالي المحاضرات
      // (إنجاز المحاضرة = مفتاح ilm_moad_{key}_{NN}، نفس اللي بتعلّمه صفحة الملخص أو زرار ✓ في التطبيق)
      lectures: [
        { n: 1, title: "علامات الاسم", dur: "1:11:29" },
        { n: 2, title: "علامات الفعل", dur: "1:19:33" },
        { n: 3, title: "علامات الرفع", dur: "1:12:36" },
        { n: 4, title: "علامات النصب", dur: "1:20:36" },
        { n: 5, title: "الخفض والجزم", dur: "1:19:49" },
        { n: 6, title: "باب الأفعال", dur: "1:24:06" },
        { n: 7, title: "باب الفاعل", dur: "1:28:53" },
        { n: 8, title: "باب المفعول", dur: "1:17:52" },
        { n: 9, title: "المبتدأ والخبر", dur: "1:15:38" },
        { n: 10, title: "كان وإن", dur: "1:14:52" },
        { n: 11, title: "ظن والنعت", dur: "56:15" },
        { n: 12, title: "المعرفة والنكرة", dur: "1:19:17" },
        { n: 13, title: "باب التوكيد", dur: "1:35:59" },
        { n: 14, title: "المفعول", dur: "50:46" },
        { n: 15, title: "ظرفا الزمان والمكان", dur: "1:07:47" },
        { n: 16, title: "الحال", dur: "1:16:33" },
        { n: 17, title: "التمييز والاستثناء", dur: "1:35:37" },
        { n: 18, title: "ختام المتن", dur: "1:03:07" }
      ] },
    { n: 7, key: "tatbiq-sarfi", level: "s1l2", title: "«التطبيق الصرفي» لعبده الراجحي", science: "الصرف", hours: 40, track: "لغة", alt: "«بناء الأفعال» بشرح", note: "" },
    { n: 8, key: "durus-balagha", level: "s1l2", title: "«دروس البلاغة» لحفني ناصف وآخرين", science: "البلاغة", hours: 25, track: "لغة", alt: "«مائة المعاني والبيان» لابن الشحنة", note: "" },
    { n: 9, key: "waraqat", level: "s1l2", title: "«الورقات» للجويني (بشرح)", science: "أصول الفقه", hours: 30, track: "فقه وأصوله", alt: "شرح المحلي على الورقات", note: "أول باب لفهم الاستدلال" },
    { n: 10, key: "qawaid-imla", level: "s1l3", title: "«قواعد الإملاء» لعبد السلام هارون", science: "الإملاء", hours: 10, track: "لغة", alt: "«بهجة الطلاب»", note: "" },
    { n: 11, key: "jazariyyah", level: "s1l3", title: "«المقدمة الجزرية» لابن الجزري (بشرح)", science: "التجويد", hours: 25, finish: true, track: "قرآن", alt: "", note: "" },
    { n: 12, key: "qatr-nada", level: "s1l3", title: "«قطر الندى» لابن هشام", science: "النحو", hours: 80, track: "لغة", alt: "«متممة الآجرومية»", note: "" },
    { n: 13, key: "usul-tafsir", level: "s1l3", title: "«مقدمة في أصول التفسير» لابن تيمية (بشرح)", science: "علوم القرآن", hours: 15, track: "قرآن", alt: "«علم التفسير» من النقاية للسيوطي", note: "" },
    { n: 14, key: "bayquniyyah", level: "s1l3", title: "«المنظومة البيقونية» (بشرح)", science: "علوم الحديث", hours: 15, track: "سنة", alt: "«علم الحديث» من النقاية للسيوطي", note: "" },
    { n: 15, key: "abu-shuja", level: "s1l4", title: "متن أبي شجاع بشرح «فتح القريب» لابن قاسم الغزي", science: "الفقه الشافعي", hours: 80, track: "فقه وأصوله", alt: "شرح أوسع: «الإقناع» للخطيب الشربيني", note: "«فتح القريب» هو «شرح ابن القاسم»، فالمستويين في كتاب واحد" },
    { n: 16, key: "kitab-tawhid", level: "s1l4", title: "«كتاب التوحيد» لمحمد بن عبد الوهاب (بشرح)", science: "العقيدة", hours: 40, track: "عقيدة", alt: "", note: "" },
    { n: 17, key: "jalalayn", level: "s1l4", title: "«تفسير الجلالين»", science: "التفسير", hours: 120, track: "قرآن", alt: "", note: "قراءة مع الرجوع للغريب — أول مرور على تفسير القرآن كله" },

    // ── مرحلة التأسيس الثانية ──
    { n: 18, key: "izzi", level: "s2l1", title: "«تصريف العزّي» للزنجاني (بشرح)", science: "الصرف", hours: 30, track: "لغة", alt: "«المقصود» بشرح", note: "" },
    { n: 19, key: "qiraat-quraniyya", level: "s2l1", title: "«القراءات القرآنية» (مدخل)", science: "القراءات", hours: 30, track: "قرآن", alt: "", note: "تاريخ القراءات وثبوتها قبل متونها" },
    { n: 20, key: "mabahith-quran", level: "s2l1", title: "«مباحث في علوم القرآن» لمناع القطان", science: "علوم القرآن", hours: 50, track: "قرآن", alt: "«مقدمة تفسير ابن جزي» و«مواقع العلوم في مواقع النجوم»", note: "" },
    { n: 21, key: "nuzhat-nazar", level: "s2l1", title: "«نخبة الفكر» بشرحها «نزهة النظر» لابن حجر", science: "علوم الحديث", hours: 60, track: "سنة", alt: "", note: "" },
    { n: 22, key: "luma", level: "s2l1", title: "«اللمع» للشيرازي", science: "أصول الفقه", hours: 60, track: "فقه وأصوله", alt: "", note: "حلقة الوصل بين الورقات ولب الأصول" },
    { n: 23, key: "wasitiyyah", level: "s2l1", title: "«العقيدة الواسطية» لابن تيمية (بشرح)", science: "العقيدة", hours: 40, track: "عقيدة", alt: "", note: "" },
    { n: 24, key: "qawaid-bida", level: "s2l2", title: "«قواعد في معرفة البدع»", science: "أصول البدع", hours: 15, track: "عقيدة", alt: "", note: "" },
    { n: 25, key: "ilm-maqasid", level: "s2l2", title: "«علم المقاصد الشرعية» لنور الدين الخادمي", science: "مقاصد الشريعة", hours: 30, track: "فقه وأصوله", alt: "«مدخل إلى علم المقاصد»", note: "" },
    { n: 26, key: "mutaradifat", level: "s2l2", title: "«رسالة في المترادفات»", science: "المفردات", hours: 10, track: "لغة", alt: "", note: "" },
    { n: 27, key: "banat-suad", level: "s2l2", title: "«بانت سعاد» لكعب بن زهير (بشرح)", science: "الأدب", hours: 10, track: "لغة", alt: "", note: "" },
    { n: 28, key: "ibn-aqil", level: "s2l2", title: "ألفية ابن مالك بشرح ابن عقيل", science: "النحو", hours: 200, track: "لغة", alt: "«أوضح المسالك» لابن هشام", note: "فهم من غير حفظ كامل" },
    { n: 29, key: "zubad", level: "s2l3", title: "«صفوة الزبد» لابن رسلان بشرح «غاية البيان» للرملي", science: "الفقه الشافعي", hours: 120, track: "فقه وأصوله", alt: "متن نثري بدله: «عمدة السالك» لابن النقيب أو «منهج الطلاب»", note: "نظم حوالي 1000 بيت: الحفظ اختياري بالتوازي. مقدمته في العقيدة على طريقة الأشاعرة — ارجع فيها لشيخ" },
    { n: 30, key: "rahbiyyah", level: "s2l3", title: "«الرحبية» (بشرح)", science: "الفرائض", hours: 30, track: "فقه وأصوله", alt: "«البرهانية»", note: "" },
    { n: 31, key: "umdat-ahkam", level: "s2l3", title: "«عمدة الأحكام» لعبد الغني المقدسي (بشرح)", science: "أحاديث الأحكام", hours: 100, track: "سنة", alt: "", note: "" },
    { n: 32, key: "lamiyyat-arab", level: "s2l3", title: "«لامية العرب» للشنفرى (بشرح)", science: "الأدب", hours: 10, track: "لغة", alt: "", note: "" },
    { n: 33, key: "sullam-wusul", level: "s2l4", title: "«سلّم الوصول» لحافظ الحكمي (بشرح)", science: "العقيدة", hours: 40, track: "عقيدة", alt: "«العقيدة الطحاوية» بشرح ابن أبي العز", note: "" },
    { n: 34, key: "riyad", level: "s2l4", title: "«رياض الصالحين» للنووي", science: "متون الحديث", hours: 100, track: "سنة", alt: "", note: "" },
    { n: 35, key: "faraid-bahiyyah", level: "s2l4", title: "«الفرائد البهية في نظم القواعد الفقهية» للأهدل", science: "القواعد الفقهية", hours: 20, track: "فقه وأصوله", alt: "«منظومة القواعد الفقهية» للسعدي", note: "" },

    // ── مرحلة التمكين الأولى ──
    { n: 36, key: "shadha-arf", level: "s3l1", title: "«شذا العرف في فن الصرف» للحملاوي", science: "الصرف", hours: 80, track: "لغة", alt: "«لامية الأفعال» بشرح", note: "" },
    { n: 37, key: "balagha-wadiha", level: "s3l1", title: "«البلاغة الواضحة» لعلي الجارم ومصطفى أمين", science: "البلاغة", hours: 50, track: "لغة", alt: "«الجوهر المكنون» بشرح", note: "" },
    { n: 38, key: "fasih", level: "s3l1", title: "«الفصيح» لثعلب", science: "المفردات", hours: 15, track: "لغة", alt: "", note: "" },
    { n: 39, key: "muallaqat", level: "s3l1", title: "«المعلقات العشر» (بشرح)", science: "الأدب", hours: 40, finish: true, track: "لغة", alt: "", note: "" },
    { n: 40, key: "tawassul", level: "s3l1", title: "«قاعدة جليلة في التوسل والوسيلة» لابن تيمية", science: "العقيدة", hours: 25, track: "عقيدة", alt: "", note: "" },
    { n: 41, key: "lubb-usul", level: "s3l2", title: "«لب الأصول» لزكريا الأنصاري بشرحه «غاية الوصول»", science: "أصول الفقه", hours: 80, track: "فقه وأصوله", alt: "", note: "مختصر «جمع الجوامع»، وتمهيد مباشر لشرح المحلي. مؤلفه أشعري، وفيه مسائل كلامية — ارجع فيها لشيخ" },
    { n: 42, key: "maqasid-ibn-ashur", level: "s3l2", title: "«مقاصد الشريعة الإسلامية» لابن عاشور", science: "مقاصد الشريعة", hours: 60, track: "فقه وأصوله", alt: "", note: "" },
    { n: 43, key: "ikhtisar-ulum", level: "s3l2", title: "«اختصار علوم الحديث» لابن كثير بشرح «الباعث الحثيث»", science: "علوم الحديث", hours: 60, track: "سنة", alt: "«تدريب الراوي» للسيوطي أو «مقدمة ابن الصلاح»", note: "" },
    { n: 44, key: "sullam-munawraq", level: "s3l2", title: "«السلم المنورق» للأخضري (بشرح)", science: "المنطق", hours: 30, finish: true, track: "معقولات", alt: "«إيساغوجي» بشرح", note: "مفتاح مصطلحات المنطق في «جمع الجوامع»" },
    { n: 45, key: "minhaj-talibin", level: "s3l3", title: "«منهاج الطالبين» للنووي بشرح مختصر", science: "الفقه الشافعي", hours: 250, finish: true, track: "فقه وأصوله", alt: "«كنز الراغبين» للمحلي، وللتوسع «مغني المحتاج» للخطيب الشربيني", note: "" },
    { n: 46, key: "subul-salam", level: "s3l3", title: "«بلوغ المرام» بشرح «سبل السلام» للصنعاني", science: "أحاديث الأحكام", hours: 350, track: "سنة", alt: "", note: "الصنعاني بيميل للترجيح المستقل عن المذاهب" },
    { n: 47, key: "ibn-juzay", level: "s3l3", title: "«التسهيل لعلوم التنزيل» لابن جزي", science: "التفسير", hours: 150, track: "قرآن", alt: "«تفسير الإيجي»", note: "" },
    { n: 48, key: "tadmuriyyah", level: "s3l4", title: "«الرسالة التدمرية» لابن تيمية (بشرح)", science: "العقيدة", hours: 40, track: "عقيدة", alt: "«الفتوى الحموية الكبرى» — نفس الباب، فواحدة تكفي في المستوى ده", note: "" },
    { n: 49, key: "usul-tisa", level: "s3l4", title: "«الأصول التسعة» (قراءة سرد)", science: "متون الحديث", hours: 400, finish: true, track: "سنة", alt: "", note: "البخاري ومسلم والسنن الأربعة والموطأ والمسند والدارمي — قراءة مع المراجعة، مش دراسة بشرح" },
    { n: 50, key: "athar-ikhtilaf", level: "s3l5", title: "«أثر الاختلاف في القواعد الأصولية في اختلاف الفقهاء» لمصطفى الخن", science: "تخريج الفروع على الأصول", hours: 60, track: "تخصص", alt: "", note: "بيوريك الخلاف الفقهي جاي منين" },
    { n: 51, key: "adab-bahth", level: "s3l5", title: "«آداب البحث والمناظرة» للشنقيطي", science: "آداب البحث والمناظرة", hours: 40, finish: true, track: "تخصص", alt: "«الرسالة الولدية» ثم «رسالة الآداب»", note: "إزاي تعترض على الاستدلال بانضباط" },
    { n: 52, key: "usul-takhrij", level: "s3l5", title: "«أصول التخريج ودراسة الأسانيد» للطحان", science: "التخريج ودراسة الأسانيد", hours: 50, finish: true, track: "تخصص", alt: "الأعلى: «شرح علل الترمذي» لابن رجب", note: "تحكم على الحديث بنفسك" },
    { n: 53, key: "tarikh-tashri", level: "s3l5", title: "«تاريخ التشريع الإسلامي» لمناع القطان", science: "تاريخ التشريع", hours: 30, finish: true, track: "تخصص", alt: "", note: "نشأة المذاهب وأسباب الخلاف تاريخيًا (إضافة على المنهج الأصلي)" },
    { n: 54, key: "rawai-bayan", level: "s3l5", title: "«روائع البيان في تفسير آيات الأحكام» للصابوني", science: "آيات الأحكام", hours: 100, finish: true, track: "تخصص", alt: "الأعلى: «أحكام القرآن» لابن العربي", note: "" },
    { n: 55, key: "maqalat", level: "s3l5", title: "«مقالات الإسلاميين» لأبي الحسن الأشعري", science: "الفرق والمذاهب", hours: 40, track: "تخصص", alt: "«الملل والنحل» للشهرستاني", note: "عرض أقوال الفرق من مصدر قديم (إضافة على المنهج الأصلي)" },

    // ── مرحلة التمكين الثانية ──
    { n: 56, key: "mahalli-jawami", level: "s4l1", title: "شرح المحلي على «جمع الجوامع» لابن السبكي", science: "أصول الفقه", hours: 300, finish: true, track: "فقه وأصوله", alt: "«منهاج الوصول» للبيضاوي", note: "أهم كتاب أصول في الخطة — ادرسه مع شيخ، وخاتمته في أصول الدين على طريقة الأشاعرة" },
    { n: 57, key: "muwafaqat", level: "s4l1", title: "«الموافقات» للشاطبي", science: "مقاصد الشريعة", hours: 200, finish: true, track: "فقه وأصوله", alt: "«قواعد الأحكام» (القواعد الكبرى) للعز بن عبد السلام", note: "" },
    { n: 58, key: "itisam", level: "s4l1", title: "«الاعتصام» للشاطبي", science: "أصول البدع", hours: 100, finish: true, track: "عقيدة", alt: "", note: "" },
    { n: 59, key: "alfiyyat-iraqi", level: "s4l1", title: "«ألفية العراقي» (التبصرة والتذكرة) بشرح", science: "علوم الحديث", hours: 150, finish: true, track: "سنة", alt: "«ألفية السيوطي»", note: "" },
    { n: 60, key: "siyasa-shariyya", level: "s4l1", title: "«السياسة الشرعية» لابن تيمية", science: "السياسة الشرعية", hours: 20, finish: true, track: "فقه وأصوله", alt: "الأعلى: «الأحكام السلطانية» للماوردي و«غياث الأمم» للجويني", note: "" },
    { n: 61, key: "talkhis", level: "s4l2", title: "«التلخيص في علوم البلاغة» للقزويني (بشرح)", science: "البلاغة", hours: 100, finish: true, track: "لغة", alt: "«جواهر البلاغة» للهاشمي", note: "" },
    { n: 62, key: "itqan", level: "s4l2", title: "«الإتقان في علوم القرآن» للسيوطي", science: "علوم القرآن", hours: 120, finish: true, track: "قرآن", alt: "«البرهان» للزركشي", note: "" },
    { n: 63, key: "kifayat-mutahaffiz", level: "s4l2", title: "«كفاية المتحفظ» لابن الأجدابي", science: "المفردات", hours: 20, finish: true, track: "لغة", alt: "«عمدة الكتّاب»", note: "" },
    { n: 64, key: "kitab-imla", level: "s4l2", title: "«كتاب الإملاء» لحسين والي", science: "الإملاء", hours: 15, finish: true, track: "لغة", alt: "", note: "" },
    { n: 65, key: "shafiyah", level: "s4l2", title: "«الشافية» لابن الحاجب (بشرح)", science: "الصرف", hours: 100, finish: true, track: "لغة", alt: "", note: "" },
    { n: 66, key: "mughni-labib", level: "s4l2", title: "«مغني اللبيب» لابن هشام", science: "النحو", hours: 60, finish: true, track: "لغة", alt: "«تسهيل الفوائد» لابن مالك", note: "الباب الأول (معاني الحروف) أهمه للفقيه، والباقي حسب الوقت" },
    { n: 67, key: "ashbah-suyuti", level: "s4l3", title: "«الأشباه والنظائر» للسيوطي", science: "القواعد الفقهية", hours: 120, finish: true, track: "فقه وأصوله", alt: "«المنثور في القواعد» للزركشي", note: "" },
    { n: 68, key: "muntaqa", level: "s4l3", title: "«منتقى الأخبار» بشرح «نيل الأوطار» للشوكاني", science: "أحاديث الأحكام", hours: 300, finish: true, track: "سنة", alt: "", note: "" },
    { n: 69, key: "tahqiqat-mardiyya", level: "s4l3", title: "«التحقيقات المرضية في المباحث الفرضية» لصالح الفوزان", science: "الفرائض", hours: 40, finish: true, track: "فقه وأصوله", alt: "", note: "" },
    { n: 70, key: "lalakai", level: "s4l3", title: "«شرح أصول اعتقاد أهل السنة والجماعة» للالكائي", science: "العقيدة", hours: 100, track: "عقيدة", alt: "", note: "" },
    { n: 71, key: "shatibiyyah", level: "s4l4", title: "«الشاطبية» (حرز الأماني) للشاطبي", science: "القراءات", hours: 200, finish: true, track: "قرآن", alt: "", note: "بعدها «الدرة المضية» لابن الجزري لو عايز تكمّل العشر" },
    { n: 72, key: "ibn-kathir", level: "s4l4", title: "«تفسير ابن كثير»", science: "التفسير", hours: 300, finish: true, track: "قرآن", alt: "", note: "" },
    { n: 73, key: "iqtida", level: "s4l4", title: "«اقتضاء الصراط المستقيم» لابن تيمية", science: "العقيدة", hours: 60, finish: true, track: "عقيدة", alt: "", note: "" },
    { n: 74, key: "bidayat-mujtahid", level: "s4l5", title: "«بداية المجتهد» لابن رشد", science: "الفقه المقارن", hours: 250, finish: true, track: "تخصص", alt: "", note: "لو عايز تختصر: ابدأ بأبواب العبادات" },
    { n: 75, key: "ijma-ibn-mundhir", level: "s4l5", title: "«الإجماع» لابن المنذر", science: "الإجماع", hours: 20, finish: true, track: "تخصص", alt: "«مراتب الإجماع» لابن حزم", note: "مرجع تتأكد منه قبل ما تقبل أي قول" },
    { n: 76, key: "miftah-wusul", level: "s4l5", title: "«مفتاح الوصول إلى بناء الفروع على الأصول» للتلمساني", science: "تخريج الفروع على الأصول", hours: 60, finish: true, track: "تخصص", alt: "«تخريج الفروع على الأصول» للزنجاني", note: "" },
    { n: 77, key: "minhaj-sunnah", level: "s4l5", title: "«مختصر منهاج السنة» لابن تيمية", science: "الفرق والمذاهب", hours: 80, finish: true, track: "تخصص", alt: "", note: "" },
    { n: 78, key: "majmu-nawawi", level: "s4l5", title: "«المجموع شرح المهذب» للنووي", science: "مراجع المذهب", hours: null, track: "تخصص", alt: "«المغني» لابن قدامة (حنبلي)", note: "مرجع مستمر في كل مسألة، مش للقراءة كاملة" }
  ],

  // ---------------------------------------------------------
  // الملخصات (اختياري): التطبيق بيكتشف أي ملف تترفعه في فولدر الكتاب تلقائيًا.
  // استخدم القائمة دي بس لو عايز تدي ملف عنوان مختلف عن اسمه.
  // مثال:
  // "ajurrumiyyah": [
  //   { n: 1, title: "مقدمة الآجرومية وباب الكلام", file: "books/ajurrumiyyah/01.html" }
  // ]
  // ---------------------------------------------------------
  summaries: {},

  sections: {
    tazkiya: { key: "tazkiya", folder: "tazkiya", icon: "🌿", title: "تزكية",
      desc: "كل اللي بيزكّي القلب ويقرّب من الله: أعمال القلوب، ومعرفة الله، وتدبر القرآن، وسير الصالحين، والأخلاق — العلم اللي بيخلّي الطلب كله لله.",
      tip: "خليها وِرد ثابت جنب الخطة، ولو ربع ساعة في اليوم: «قد أفلح من زكاها».",
      // علوم القسم: كل علم له فولدر tazkiya/NN-key/ وجواه سلاسل (series) زي سلسلة السيرة
      // ودروس العلم المتفرقة (ملفات مباشرة في فولدره) معرّفها moad_{key}_{NN}
      groups: [
        { n: 1, key: "tz-tazkiya",  icon: "🌱", title: "التزكية",
          desc: "تزكية النفس وأعمال القلوب: الإخلاص، والتوبة، والصبر، والشكر، والمراقبة، وعلاج آفات النفس.", books: [
            { key: "sb-wasiyya-sughra", title: "«الوصية الصغرى» لابن تيمية" },
            { key: "sb-kalim-tayyib", title: "«الكلم الطيب» لابن تيمية" },
            { key: "sb-kifayat-mutaabbid", title: "«كفاية المتعبد وتحفة المتزهد» للمنذري" },
            { key: "sb-tabukiyya", title: "«الرسالة التبوكية» لابن القيم" },
            { key: "sb-ubudiyya", title: "«العبودية» لابن تيمية" },
            { key: "sb-daa-dawa", title: "«الداء والدواء» لابن القيم" },
            { key: "sb-minhaj-qasidin", title: "«مختصر منهاج القاصدين» لابن قدامة", alt: "«طريق الهجرتين» أو «إغاثة اللهفان» لابن القيم" },
            { key: "sb-ibn-rajab", title: "مصنفات ابن رجب" },
            { key: "sb-ibn-abi-dunya", title: "مصنفات ابن أبي الدنيا وكتب الزهد" },
            { key: "sb-ibn-jawzi", title: "مصنفات ابن الجوزي" },
            { key: "sb-madarij", title: "«مدارج السالكين» لابن القيم" }
          ], series: [] },
        { n: 2, key: "tz-ilm-billah", icon: "✨", title: "العلم بالله",
          desc: "معرفة الله بأسمائه وصفاته وأفعاله وآثارها في القلب — أصل الخشية والمحبة والتوكل.", series: [] },
        { n: 3, key: "tz-suwar",    icon: "📖", title: "مدارسات سور القرآن",
          desc: "مدارسة السور سورة سورة: مقاصدها وموضوعاتها وهداياتها العملية.", series: [] },
        { n: 4, key: "tz-siyar",    icon: "📜", title: "سير ومناقب",
          desc: "سير الأنبياء والصحابة والتابعين والعلماء والصالحين، ومناقبهم ومواقفهم.", books: [
            { key: "sb-fadail-sahaba", title: "«فضائل الصحابة» للإمام أحمد" },
            { key: "sb-sifat-safwa", title: "«صفة الصفوة» لابن الجوزي" },
            { key: "sb-siyar-nubala", title: "«سير أعلام النبلاء» للذهبي" }
          ], series: [] },
        { n: 5, key: "tz-akhlaq",   icon: "🤝", title: "الأخلاق والآداب",
          desc: "الأخلاق والآداب الشرعية: مع الله، ومع النفس، ومع الناس في البيت والشغل والطريق.", books: [
            { key: "sb-adab-ishra", title: "«آداب العِشرة» للغزي" },
            { key: "sb-makarim", title: "«مكارم الأخلاق»" },
            { key: "sb-rawdat-uqala", title: "«روضة العقلاء» لابن حبان" },
            { key: "sb-muntaqa-makarim", title: "«منتقى مكارم الأخلاق»" },
            { key: "sb-adab-mufrad", title: "«الأدب المفرد» للبخاري" },
            { key: "sb-bahjat-majalis", title: "«بهجة المجالس» لابن عبد البر" }
          ], series: [] },
        { n: 6, key: "tz-talab",    icon: "🎓", title: "طلب العلم وآدابه",
          desc: "تعظيم العلم، وأخلاق العلماء وحملة القرآن، وآداب الطالب مع شيخه ودرسه وكتابه.", books: [
            { key: "sb-taazim-ilm", title: "«خلاصة تعظيم العلم» لصالح العصيمي" },
            { key: "sb-akhlaq-ulama", title: "«أخلاق العلماء» للآجري" },
            { key: "sb-akhlaq-hamalat", title: "«أخلاق حملة القرآن» للآجري" },
            { key: "sb-tadhkirat-sami", title: "«تذكرة السامع والمتكلم» لابن جماعة", alt: "«عُدة الطلب»" },
            { key: "sb-jami-bayan", title: "«جامع بيان العلم وفضله» لابن عبد البر" },
            { key: "sb-jami-khatib", title: "«الجامع لأخلاق الراوي وآداب السامع» للخطيب البغدادي" }
          ], series: [] }
      ] },
    sira:    { key: "sira", folder: "sira", icon: "🕌", title: "السيرة النبوية",
      desc: "سيرة النبي ﷺ: من المولد للبعثة، والهجرة، والغزوات، والشمائل — القدوة العملية للفقه والسلوك.",
      tip: "اقرأ السيرة بسؤال: «إيه اللي أطبّقه من الموقف ده النهارده؟».",
      // سلاسل الشرح جوه القسم: كل سلسلة لها فولدر sira/NN-key/ ومعرّف درسها moad_{key}_{NN}
      books: [
        { key: "sb-urjuza-mayiyya", title: "«الأرجوزة الميئية في ذكر حال أشرف البرية»" },
        { key: "sb-fusul-sira", title: "«الفصول في سيرة الرسول» لابن كثير" },
        { key: "sb-shamail", title: "«مختصر الشمائل المحمدية» للترمذي" },
        { key: "sb-tahdhib-ibn-hisham", title: "«تهذيب سيرة ابن هشام»", alt: "«ألفية العراقي في السيرة» (الدرر السنية)" },
        { key: "sb-zad-maad", title: "«زاد المعاد» لابن القيم" }
      ],
      series: [
        { n: 1, key: "sira-sirjani", title: "السيرة النبوية", by: "د. راغب السرجاني", channel: "أرشيف الشيخ راغب السرجاني",
          note: "سلسلة كاملة من المقدمة لحد الوفاة، بتركيز على بناء الأمة والدروس العملية من كل مرحلة.",
          // dur فاضي = المدة مش متسجلة في القايمة الأصلية
          lectures: [
        { n: 1, title: "مقدمة ج1: السيرة وبناء الأمة", dur: "1:00:09" },
        { n: 2, title: "مقدمة ج2: من الظلمات إلى النور", dur: "1:02:56" },
        { n: 3, title: "مقدمة ج3: من هنا بدأ الإسلام", dur: "1:05:01" },
        { n: 4, title: "بدء الوحي", dur: "1:02:17" },
        { n: 5, title: "الدعوة سرًّا", dur: "58:16" },
        { n: 6, title: "الدعوة جهرًا", dur: "1:05:39" },
        { n: 7, title: "تربية الثبات", dur: "58:42" },
        { n: 8, title: "هجرة الحبشة الأولى", dur: "57:12" },
        { n: 9, title: "هجرة الحبشة الثانية", dur: "1:06:00" },
        { n: 10, title: "إسلام عمر", dur: "1:05:35" },
        { n: 11, title: "عام الحزن", dur: "1:03:30" },
        { n: 12, title: "بيعة العقبة الأولى", dur: "1:00:03" },
        { n: 13, title: "بيعة العقبة الثانية", dur: "1:04:44" },
        { n: 14, title: "الهجرة إلى المدينة", dur: "59:56" },
        { n: 15, title: "قيام الدولة الإسلامية", dur: "1:01:26" },
        { n: 16, title: "مجتمع المدينة", dur: "43:35" },
        { n: 17, title: "المشركون والدولة الإسلامية", dur: "1:00:20" },
        { n: 18, title: "اليهود والدولة الإسلامية", dur: "1:01:33" },
        { n: 19, title: "الطريق إلى بدر", dur: "56:46" },
        { n: 20, title: "أهل بدر", dur: "57:57" },
        { n: 21, title: "يوم بدر", dur: "1:07:38" },
        { n: 22, title: "نصر بدر", dur: "1:02:10" },
        { n: 23, title: "ما بعد بدر", dur: "59:13" },
        { n: 24, title: "الطريق إلى أحد", dur: "1:04:12" },
        { n: 25, title: "يوم أحد", dur: "1:10:58" },
        { n: 26, title: "الخروج من مصيبة أحد", dur: "1:03:10" },
        { n: 27, title: "الطريق إلى الأحزاب", dur: "1:10:06" },
        { n: 28, title: "الأحزاب", dur: "1:08:30" },
        { n: 29, title: "المسلمون بعد الأحزاب", dur: "1:02:35" },
        { n: 30, title: "الطريق إلى الحديبية", dur: "59:05" },
        { n: 31, title: "صلح الحديبية", dur: "1:00:37" },
        { n: 32, title: "ما بعد الحديبية", dur: "1:08:08" },
        { n: 33, title: "عالمية الإسلام", dur: "1:03:10" },
        { n: 34, title: "فتح خيبر", dur: "1:16:59" },
        { n: 35, title: "قوة الإسلام", dur: "1:02:28" },
        { n: 36, title: "نصر مؤتة", dur: "1:19:31" },
        { n: 37, title: "الطريق إلى مكة", dur: "1:15:09" },
        { n: 38, title: "فتح مكة", dur: "1:16:31" },
        { n: 39, title: "إسلام مكة", dur: "1:23:37" },
        { n: 40, title: "يوم حنين", dur: "1:19:19" },
        { n: 41, title: "بين حنين والطائف", dur: "1:04:09" },
        { n: 42, title: "إسلام هوازن", dur: "1:11:14" },
        { n: 43, title: "غزوة تبوك", dur: "1:07:29" },
        { n: 44, title: "ما بعد تبوك", dur: "1:01:03" },
        { n: 45, title: "الوداع", dur: "1:10:02" },
        { n: 46, title: "خاتمة السيرة", dur: "" }
          ] }
      ] }
  }
};

// مسار فولدر كل سلسلة جوه قسمها: sira/01-sira-sirjani
// ومسار كل علم جوه قسمه: tazkiya/02-tz-ilm-billah — وسلاسله جواه: tazkiya/02-tz-ilm-billah/01-<key>
Object.keys(PLAN.sections).forEach(function (k) {
  var sec = PLAN.sections[k];
  function nn(x) { return String(x.n).padStart(2, "0") + "-" + x.key; }
  (sec.series || []).forEach(function (sr) {
    sr.section = k;
    sr.folder = sec.folder + "/" + nn(sr);
  });
  (sec.groups || []).forEach(function (g) {
    g.section = k;
    g.folder = sec.folder + "/" + nn(g);
    (g.series || []).forEach(function (sr) {
      sr.section = k; sr.group = g.key;
      sr.folder = g.folder + "/" + nn(sr);
    });
  });
});

// المستويات مفرودة بالترتيب (المرحلة ← المستوى)، وكل مستوى عارف مرحلته
PLAN.levels = [];
PLAN.stages.forEach(function (st, si) {
  st.levels.forEach(function (l, li) {
    l.stage = st.id; l.stageIndex = si; l.index = li;
    l.label = st.short + " · المستوى " + (li + 1);
    PLAN.levels.push(l);
  });
});

// مسار فولدر الكتاب: books/ajurrumiyyah (من غير رقم، عشان تغيير الترتيب ما يكسرش الروابط)
PLAN.books.forEach(function (b) {
  b.folder = "books/" + b.key;
  b.stage = b.level.slice(0, 2);
});

// =========================================================
// جسر أداة بطاقات Anki المشتركة ilm-anki.js (آلية العمل 5.11 — البند 9-ص)
// الأداة نسخة مطابقة من مستودع Albinaa_Almanhaji ولا تُعدَّل هنا.
// الجسر ده بيبني لها SITE_DATA من PLAN، فيطلع الوسم والرزمة آليًا:
//   الوسم:  مواد_شرعية::مرحلة_التأسيس_الأولى::النحو::الآجرومية::محاضرة_01  + أولوية_N
//   الرزمة: فوائد::🔴🔴🔴::مواد شرعية::<رزمة الأولوية>
// اسم الكتاب في الوسم = عنوانه بعد حذف ما بين القوسين وعلامات «»، ولو عايز اسم أقصر
// ضيف للكتاب حقل ankiName. ما تغيّرش أي حاجة هنا بعد استيراد بطاقات، عشان الوسوم تفضل ثابتة.
// =========================================================
var SITE_DATA = (function () {
  // الوسم بيستخدم اسم المرحلة (مثلًا: مواد_شرعية::مرحلة_التأسيس_الأولى::النحو::الآجرومية::محاضرة_01)
  var LEVEL_NAMES = {};
  PLAN.stages.forEach(function (st) { LEVEL_NAMES[st.id] = st.name; });
  var stages = {};
  PLAN.books.forEach(function (b) {
    var lectures = [];
    for (var i = 1; i <= 99; i++) lectures.push({ id: "moad_" + b.key + "_" + String(i).padStart(2, "0") });
    stages["moad" + b.n] = {
      name: b.science,
      level: LEVEL_NAMES[b.stage],
      subjects: [{ key: b.key, name: b.ankiName || b.title.replace(/\([^)]*\)/g, "").replace(/[«»]/g, "").trim(), lectures: lectures }]
    };
  });
  return { anki: { program: "مواد شرعية", deck: "مواد شرعية" }, stages: stages };
})();
