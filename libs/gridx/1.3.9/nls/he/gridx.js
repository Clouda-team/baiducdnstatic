define({     
//Body
	loadingInfo: "טעינה מתבצעת...",
	emptyInfo: "אין פריטים להצגה",
	loadFailInfo: "כשל בטעינת הנתונים!",
	loadMore: "טעינת עוד",
	loadMoreLoading: "טעינה מתבצעת...",
	loadPrevious: "טעינת הקודם",
	loadPreviousLoading: "טעינה מתבצעת...",

//FilterBar
	"clearFilterDialogTitle": "ניקוי מסנן",
	"filterDefDialogTitle": "סינון",
	"defaultRuleTitle": "כלל",
	"ruleTitleTemplate": "כלל ${ruleNumber}",
	"noFilterApplied": "לא הוחל מסנן.",
	"defineFilter": "הגדרת מסנן",
	"defineFilterAriaLabel": "הגדרת מסנן: פתיחת דו-שיח המסנן להגדרת כללי מסנן מורכבים. כל כלל מסנן בנוי משילוב של עמודה, תנאי וערך. כשהדו-שיח ייפתח, מיקוד המקלדת נמצא על שדה הערך. ",
	"conditionEqual": "שווה",
	"conditionNotEqual": "אינו שווה",
	"conditionLess": "קטן מ-",
	"conditionLessEqual": "קטן או שווה",
	"conditionGreater": "גדול מ-",
	"conditionGreaterEqual": "גדול או שווה",
	"conditionContain": "מכיל",
	"conditionIs": "הוא",
	"conditionStartWith": "מתחיל עם",
	"conditionEndWith": "מסתיים עם",
	"conditionNotContain": "אינו מכיל",
	"conditionIsNot": "אינו",
	"conditionNotStartWith": "אינו מתחיל עם",
	"conditionNotEndWith": "אינו מסתיים עם",
	"conditionBefore": "לפני",
	"conditionAfter": "אחרי",
	"conditionRange": "טווח",
	"conditionIsEmpty": "הוא ריק",
	"conditionIsNotEmpty": "אינו ריק",
	"all": "הכל",
	"any": "כלשהו",
	"relationAll": "כל הכללים",
	"waiRelAll": "התאמה לכל הכללים שלהלן:",
	"relationAny": "כלל כלשהו",
	"waiRelAny": "התאמה לכלל כלשהו מהכללים שלהלן:",
	"relationMsgFront": "התאמה",
	"relationMsgTail": "",
	"and": "וגם",
	"or": "או",
	"addRuleButton": "הוספת כלל",
	"waiAddRuleButton": "הוספת כלל חדש",
	"removeRuleButton": "סילוק כלל",
	"waiRemoveRuleButtonTemplate": "סילוק הכלל ${0}",
	"addRuleButton": "הוספת כלל מסנן",
	"cancelButton": "ביטול",
	"waiCancelButton": "ביטול דו-שיח זה",
	"clearButton": "ניקוי",
	"waiClearButton": "ניקוי המסנן",
	"filterButton": "סינון",
	"waiFilterButton": "הגשת המסנן",
	"columnSelectLabel": "עמודה:",
	"columnSelectAriaLabel": "עמודה: חלק תנאי ${0} מתוך ${1}",
	"waiColumnSelectTemplate": "עמודה עבור הכלל ${0}",

	"conditionSelectLabel": "תנאי:",
	"conditionSelectAriaLabel": "אופרטור: חלק תנאי ${0} מתוך ${1}",
	"waiConditionSelectTemplate": "תנאי עבור הכלל ${0}",

	"valueBoxLabel": "ערך:",
	"valueBoxAriaLabel": "ערך: חלק תנאי ${0} מתוך ${1}",
	"waiValueBoxTemplate": "ציינו ערך לסינון הכלל ${0}",
	"rangeTo": "עד",
	"rangeTemplate": "${0} עד ${1}",
	"statusTipHeaderColumn": "עמודה",
	"statusTipHeaderCondition": "כללים",
	"statusTipTitle": "סרגל מסנן",
	"statusTipMsg": "לחצו על סרגל המסנן כאן כדי לסנן לפי ערכים בתוך ${0}.",
	"anycolumn": "עמודה כלשהי",
	"statusTipTitleNoFilter": "סרגל מסנן",
	"statusTipTitleHasFilter": "סינון",
	"statusTipRelPre": "התאמה",
	"statusTipRelPost": "כללים.",
	"statusTipHeaderAll": "התאמה לכל הכללים.",
	"statusTipHeaderAny": "התאמה לכלל כלשהו.",
	"defaultItemsName": "פריטים",
	"filterBarMsgHasFilterTemplate": "מוצגים ${0} מתוך ${1} ${2}.‏",
	"filterBarMsgNoFilterTemplate": "לא הוחל מסנן",
	"filterBarDefButton": "הגדרת מסנן",
	"waiFilterBarDefButton": "סינון הטבלה",
	"a11yFilterBarDefButton": "סינון...‏",
	"filterBarClearButton": "ניקוי המסנן",
	"waiFilterBarClearButton": "ניקוי המסנן",
	"closeFilterBarBtn": "סגירת סרגל המסנן",
	"clearFilterMsg": "פעולה זו תסלק את המסנן ותציג את כל הרשומות הזמינות.",
	"anyColumnOption": "עמודה כלשהי",
	"trueLabel": "True",
	"falseLabel": "False",
	"radioTrueLabel": "ערך True",
	"radioFalseLabel": "ערך False",
	"beginTimeRangeLabel": "ערך התחלת של טווח שעות",
	"endTimeRangeLabel": "ערך סיום של טווח שעות",
	"beginDateRangeLabel": "ערך התחלת של טווח תאריכים",
	"endDateRangeLabel": "ערך סיום של טווח תאריכים",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "מיון יחיד",
	nestedSort: "מיון מקונן",
	ascending: "לחצו כדי למיין בסדר עולה",
	descending: "לחצו כדי למיין בסדר יורד",
	sortingState: "${0} - ${1}",
	unsorted: "לא למיין עמודה זו",
	waiSingleSortLabel: "${0} - ממוין לפי ${1}. בחרו כדי למיין לפי ${2}",
	waiNestedSortLabel:"${0} - ממוין בקינון לפי ${1}. בחרו כדי למיין בקינון לפי ${2}",

//PaginationBar
	pagerWai: 'דפדפן',

	pageIndex: '${0}',
	pageIndexTitle: 'דף ${0}',

	firstPageTitle: 'הדף הראשון',
	prevPageTitle: 'הדף הקודם',
	nextPageTitle: 'הדף הבא',
	lastPageTitle: 'הדף האחרון',

	pageSize: '${0}',
	pageSizeTitle: '${0} תמונות בדף',
	pageSizeAll: 'הכל',
	pageSizeAllTitle: 'כל הפריטים',

	description: '${0} - ${1} מתוך ${2} פריטים.',
	descriptionEmpty: 'הסריג ריק.',

	summary: 'סך הכל: ${0}',
	summaryWithSelection: 'סך הכל: ${0} נבחרו: ${1}',

	gotoBtnTitle: 'מעבר לדף מסוים',

	gotoDialogTitle: 'מעבר לדף',
	gotoDialogMainMsg: 'ציינו את מספר הדף:',
	gotoDialogPageCount: '(${0} דפים)',
	gotoDialogOKBtn: 'ביצוע',
	gotoDialogCancelBtn: 'ביטול',
	// for drop down pagination bar
	pageLabel: 'דף',
	pageSizeLabel: 'שורות',

//QuickFilter
	filterLabel: 'סינון',
	clearButtonTitle: 'ניקוי מסנן',
	buildFilterMenuLabel: 'בניית מסנן...‏',
	apply: 'החלת מסנן',

//Sort
	helpMsg: '${0} - לחצו כדי למיין או Ctrl-לחיצה כדי להוסיף למיון',
	singleHelpMsg: '${0} - לחצו כדי למיין',
	priorityOrder: 'קדימות מיון ${0}',

//SummaryBar
	summaryTotal: 'סך הכל: ${0}',
	summarySelected: 'נבחרו: ${0}',
	summaryRange: 'טווח: ${0}-${1}',	//need translation

//Other
	indirectSelectAll: "לחצו על מקש הרווח כדי לבחור הכל.",	//need translation
	indirectDeselectAll: "לחצו על מקש הרווח כדי לבטל את בחירת הכל.",	//need translation
	treeExpanded: "Ctrl + מקש חץ ימני כדי לכווץ שורה זו.",	//need translation
	treeCollapsed: "Ctrl + מקש חץ שמאלי כדי להרחיב שורה זו."	//need translation
});

