define({     
//Body
	loadingInfo: "تحميل...",
	emptyInfo: "لا توجد بنود ليتم عرضها",
	loadFailInfo: "فشل في تحميل البيانات!",
	loadMore: "تحميل المزيد",
	loadMoreLoading: "تحميل...",
	loadPrevious: "تحميل السابق",
	loadPreviousLoading: "تحميل...",

//FilterBar
	"clearFilterDialogTitle": "محو مرشح البيانات",
	"filterDefDialogTitle": "ترشيح البيانات",
	"defaultRuleTitle": "القاعدة",
	"ruleTitleTemplate": "القاعدة ${ruleNumber}",
	"noFilterApplied": "لا يوجد مرشح بيانات تم تطبيقه.",
	"defineFilter": "تعريف مرشح البيانات",
	"defineFilterAriaLabel": "تعريف مرشح البيانات: يتم فتح مربع حوار مرشح البيانات لتوصيف قواعد ترشيح البيانات المركب. تتكون كل قاعدة مرشح بيانات من مجموعة من الأعمدة والشروط والقيم. عند فتح مربع الحوار، يتم تركيز التأثير على مجال القيمة. ",
	"conditionEqual": "يساوي",
	"conditionNotEqual": "لا يساوي",
	"conditionLess": "‏أقل من‏",
	"conditionLessEqual": "أقل من أو يساوي",
	"conditionGreater": "أكبر من",
	"conditionGreaterEqual": "أكبر من أو يساوي",
	"conditionContain": "يتضمن",
	"conditionIs": "يعتبر",
	"conditionStartWith": "يبدأ بالحروف",
	"conditionEndWith": "ينتهي بالحروف",
	"conditionNotContain": "لا يحتوي",
	"conditionIsNot": "ليس",
	"conditionNotStartWith": "لا يبدأ بواسطة",
	"conditionNotEndWith": "لا ينتهي بواسطة",
	"conditionBefore": "قبل",
	"conditionAfter": "بعد",
	"conditionRange": "المدى",
	"conditionIsEmpty": "خالي",
	"conditionIsNotEmpty": "ليس خالي ",
	"all": "كل",
	"any": "أي",
	"relationAll": "كل القواعد",
	"waiRelAll": "مطابقة كل القواعد التالية:",
	"relationAny": "أية قاعدة",
	"waiRelAny": "مطابقة أي من القواعد التالية:",
	"relationMsgFront": "مطابقة",
	"relationMsgTail": "",
	"and": "و",
	"or": "أو",
	"addRuleButton": "اضافة قاعدة",
	"waiAddRuleButton": "اضافة قاعدة جديدة",
	"removeRuleButton": "ازالة قاعدة",
	"waiRemoveRuleButtonTemplate": "ازالة قاعدة ${0}",
	"addRuleButton": "اضافة قاعدة مرشح البيانات",
	"cancelButton": "الغاء",
	"waiCancelButton": "الغاء مربع الحوار هذا",
	"clearButton": "محو",
	"waiClearButton": "اخلاء مرشح البيانات",
	"filterButton": "ترشيح البيانات",
	"waiFilterButton": "احالة مرشح البيانات",
	"columnSelectLabel": "العمود:",
	"columnSelectAriaLabel": "العمود: جزء الشرط ${0} من ${1}",
	"waiColumnSelectTemplate": "العمود للقاعدة ${0}",

	"conditionSelectLabel": "الشرط:",
	"conditionSelectAriaLabel": "المعامل: جزء الشرط ${0} من ${1}",
	"waiConditionSelectTemplate": "الشرط للقاعدة ${0}",

	"valueBoxLabel": "القيمة:",
	"valueBoxAriaLabel": "القيمة: جزء الشرط ${0} من ${1}",
	"waiValueBoxTemplate": "أدخل قيمة لترشيح البيانات بناءا عليها للقاعدة ${0}",
	"rangeTo": "الى",
	"rangeTemplate": "من ${0} الى ${1}",
	"statusTipHeaderColumn": "العمود",
	"statusTipHeaderCondition": "القواعد",
	"statusTipTitle": "خط مرشح البيانات",
	"statusTipMsg": "اضغط على خط مرشح البيانات هنا لترشيح البيانات بناءا على القيم التي توجد في ${0}.",
	"anycolumn": "أي عمود",
	"statusTipTitleNoFilter": "خط مرشح البيانات",
	"statusTipTitleHasFilter": "ترشيح البيانات",
	"statusTipRelPre": "مطابقة",
	"statusTipRelPost": "القواعد.",
	"statusTipHeaderAll": "مطابقة كل القواعد.",
	"statusTipHeaderAny": "مطابقة أية قاعدة.",
	"defaultItemsName": "بنود",
	"filterBarMsgHasFilterTemplate": "يتم عرض ${0} من ${1} ${2}.",
	"filterBarMsgNoFilterTemplate": "لم يتم تطبيق أي مرشح بيانات",
	"filterBarDefButton": "تعريف مرشح البيانات",
	"waiFilterBarDefButton": "ترشيح بيانات الجدول",
	"a11yFilterBarDefButton": "ترشيح البيانات...",
	"filterBarClearButton": "محو مرشح البيانات",
	"waiFilterBarClearButton": "اخلاء مرشح البيانات",
	"closeFilterBarBtn": "اغلاق خط مرشح البيانات",
	"clearFilterMsg": "سيؤدي هذا الى ازالة مرشح البيانات وكل السجلات المتاحة.",
	"anyColumnOption": "أي عمود",
	"trueLabel": "متحقق",
	"falseLabel": "غير-متحقق",
	"radioTrueLabel": "القيمة True",
	"radioFalseLabel": "القيمة False",
	"beginTimeRangeLabel": "بداية قيمة مدى الوقت",
	"endTimeRangeLabel": "نهاية قيمة مدى الوقت",
	"beginDateRangeLabel": "بداية قيمة مدى التاريخ",
	"endDateRangeLabel": "نهاية قيمة مدى التاريخ",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "فرز منفرد",
	nestedSort: "فرز متداخل",
	ascending: "اضغط للفرز تصاعديا",
	descending: "اضغط للفرز تنازليا",
	sortingState: "${0} - ${1}",
	unsorted: "عدم فرز هذا العمود",
	waiSingleSortLabel: "${0} - تم فرزه بواسطة ${1}. اختر للفرز بواسطة ${2}",
	waiNestedSortLabel:"${0} - تم فرزه بشكل متداخل بواسطة ${1}. اختر للفرز المتداخل بواسطة ${2}",

//PaginationBar
	pagerWai: 'جهاز الاستدعاء الآلي',

	pageIndex: '${0}',
	pageIndexTitle: 'الصفحة ${0}',

	firstPageTitle: 'الصفحة الأولى',
	prevPageTitle: 'الصفحة السابقة',
	nextPageTitle: 'الصفحة التالية',
	lastPageTitle: 'الصفحة الأخيرة',

	pageSize: '${0}',
	pageSizeTitle: '${0} بند/بنود لكل صفحة',
	pageSizeAll: 'كل',
	pageSizeAllTitle: 'كل البنود',

	description: '${0} - ${1} من ${2} بند/بنود.',
	descriptionEmpty: 'الشبكة خالية.',

	summary: 'الاجمالي: ${0}',
	summaryWithSelection: 'الاجمالي: ${0} المحدد: ${1}',

	gotoBtnTitle: 'اذهب الى الصفحة المحددة',

	gotoDialogTitle: 'اذهب الى الصفحة',
	gotoDialogMainMsg: 'حدد رقم الصفحة:',
	gotoDialogPageCount: '(${0} صفحة/صفحات)',
	gotoDialogOKBtn: 'بدء',
	gotoDialogCancelBtn: 'الغاء',
	// for drop down pagination bar
	pageLabel: 'صفحة',
	pageSizeLabel: 'صفوف',

//QuickFilter
	filterLabel: 'ترشيح البيانات',
	clearButtonTitle: 'محو مرشح البيانات',
	buildFilterMenuLabel: 'بناء مرشح بيانات …',
	apply: 'تطبيق مرشح البيانات',

//Sort
	helpMsg: '${0} - اضغط للفرز أو اضغط control- للاضافة للفرز',
	singleHelpMsg: '${0} - اضغط للفرز',
	priorityOrder: 'أولوية الفرز ${0}',

//SummaryBar
	summaryTotal: 'الاجمالي: ${0}',
	summarySelected: 'المحدد: ${0}',
	summaryRange: 'المدى: ${0}-${1}',	//need translation

//Other
	indirectSelectAll: "اضغط SPACE لتحديد الكل.",	//need translation
	indirectDeselectAll: "اضغط SPACE لالغاء تحديد الكل.",	//need translation
	treeExpanded: "Control + مفتاح السهم لليسار لطي هذا الصف.",	//need translation
	treeCollapsed: "Control + مفتاح السهم لليمين لعرض هذا الصف."	//need translation
});

