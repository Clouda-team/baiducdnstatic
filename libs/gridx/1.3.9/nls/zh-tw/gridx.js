define({     
//Body
	loadingInfo: "載入中...",
	emptyInfo: "沒有項目可顯示",
	loadFailInfo: "無法載入資料！",
	loadMore: "載入更多",
	loadMoreLoading: "載入中...",
	loadPrevious: "載入前一個",
	loadPreviousLoading: "載入中...",

//FilterBar
	"clearFilterDialogTitle": "清除過濾器",
	"filterDefDialogTitle": "過濾器",
	"defaultRuleTitle": "規則",
	"ruleTitleTemplate": "規則 ${ruleNumber}",
	"noFilterApplied": "未套用任何過濾器。",
	"defineFilter": "定義過濾器",
	"defineFilterAriaLabel": "定義過濾器：開啟過濾器對框，以配置複雜過濾規則。每項過濾規則皆由欄、條件及值組成。當對話框開啟時，鍵盤焦點會位在值欄位上。",
	"conditionEqual": "等於",
	"conditionNotEqual": "不等於",
	"conditionLess": "小於",
	"conditionLessEqual": "小於或等於",
	"conditionGreater": "大於",
	"conditionGreaterEqual": "大於或等於",
	"conditionContain": "包含",
	"conditionIs": "是",
	"conditionStartWith": "開頭是",
	"conditionEndWith": "結尾是",
	"conditionNotContain": "不包含",
	"conditionIsNot": "不是",
	"conditionNotStartWith": "開頭不是",
	"conditionNotEndWith": "結尾不是",
	"conditionBefore": "之前",
	"conditionAfter": "之後",
	"conditionRange": "範圍",
	"conditionIsEmpty": "是空的",
	"conditionIsNotEmpty": "不是空的",
	"all": "全部",
	"any": "任何",
	"relationAll": "所有規則",
	"waiRelAll": "符合下列所有規則：",
	"relationAny": "任何規則",
	"waiRelAny": "符合下列任一規則：",
	"relationMsgFront": "符合",
	"relationMsgTail": "",
	"and": "及",
	"or": "或",
	"addRuleButton": "新增規則",
	"waiAddRuleButton": "新增規則",
	"removeRuleButton": "移除規則",
	"waiRemoveRuleButtonTemplate": "移除規則 ${0}",
	"addRuleButton": "新增過濾規則",
	"cancelButton": "取消",
	"waiCancelButton": "取消此對話框",
	"clearButton": "清除",
	"waiClearButton": "清除過濾器",
	"filterButton": "過濾器",
	"waiFilterButton": "提交過濾器",
	"columnSelectLabel": "欄：",
	"columnSelectAriaLabel": "欄：條件組件 ${1} 之 ${0}",
	"waiColumnSelectTemplate": "規則 ${0} 的欄",

	"conditionSelectLabel": "條件：",
	"conditionSelectAriaLabel": "運算子：條件組件 ${1} 之 ${0}",
	"waiConditionSelectTemplate": "規則 ${0} 的條件",

	"valueBoxLabel": "值：",
	"valueBoxAriaLabel": "值：條件組件 ${1} 之 ${0}",
	"waiValueBoxTemplate": "輸入規則 ${0} 的過濾器值",
	"rangeTo": "至",
	"rangeTemplate": "從 ${0} 至 ${1}",
	"statusTipHeaderColumn": "欄",
	"statusTipHeaderCondition": "規則",
	"statusTipTitle": "過濾器列",
	"statusTipMsg": "按一下這裡的過濾器列，以過濾 ${0} 中的值。",
	"anycolumn": "任何欄",
	"statusTipTitleNoFilter": "過濾器列",
	"statusTipTitleHasFilter": "過濾器",
	"statusTipRelPre": "符合",
	"statusTipRelPost": "規則。",
	"statusTipHeaderAll": "符合所有規則。",
	"statusTipHeaderAny": "符合任一規則。",
	"defaultItemsName": "項目",
	"filterBarMsgHasFilterTemplate": "已顯示 ${0}（共 ${1} 個）${2}。",
	"filterBarMsgNoFilterTemplate": "未套用任何過濾器",
	"filterBarDefButton": "定義過濾器",
	"waiFilterBarDefButton": "過濾表格",
	"a11yFilterBarDefButton": "過濾...",
	"filterBarClearButton": "清除過濾器",
	"waiFilterBarClearButton": "清除過濾器",
	"closeFilterBarBtn": "關閉過濾器列",
	"clearFilterMsg": "這會移除過濾器並顯示所有可用的記錄。",
	"anyColumnOption": "任何欄",
	"trueLabel": "True",
	"falseLabel": "False",
	"radioTrueLabel": "值 True",
	"radioFalseLabel": "值 False",
	"beginTimeRangeLabel": "時間範圍起始值",
	"endTimeRangeLabel": "時間範圍結束值",
	"beginDateRangeLabel": "日期範圍起始值",
	"endDateRangeLabel": "日期範圍結束值",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "單一排序",
	nestedSort: "巢狀排序",
	ascending: "按一下以遞增排序",
	descending: "按一下以遞減排序",
	sortingState: "${0} - ${1}",
	unsorted: "不排序此欄",
	waiSingleSortLabel: "${0} 的排序依據為 ${1}。您可以選擇依 ${2} 進行排序",
	waiNestedSortLabel:"${0} 的巢狀排序依據為 ${1}。您可以選擇依 ${2} 進行巢狀排序",

//PaginationBar
	pagerWai: '分頁器',

	pageIndex: '${0}',
	pageIndexTitle: '第 ${0} 頁',

	firstPageTitle: '第一頁',
	prevPageTitle: '上一頁',
	nextPageTitle: '下一頁',
	lastPageTitle: '最後一頁',

	pageSize: '${0}',
	pageSizeTitle: '每頁 ${0} 個項目',
	pageSizeAll: '全部',
	pageSizeAllTitle: '所有項目',

	description: '${0} - ${1}（共 ${2} 個項目）',
	descriptionEmpty: '網格是空的。',

	summary: '總計：${0}',
	summaryWithSelection: '總計：${0} 已選取：${1}',

	gotoBtnTitle: '前往特定頁面',

	gotoDialogTitle: '前往頁',
	gotoDialogMainMsg: '指定頁碼：',
	gotoDialogPageCount: '（共 ${0} 頁）',
	gotoDialogOKBtn: '執行',
	gotoDialogCancelBtn: '取消',
	// for drop down pagination bar
	pageLabel: '頁面',
	pageSizeLabel: '列數',

//QuickFilter
	filterLabel: '過濾器',
	clearButtonTitle: '清除過濾器',
	buildFilterMenuLabel: '建置過濾器…',
	apply: '套用過濾器',

//Sort
	helpMsg: '${0} - 按一下以進行排序，或按住 Ctrl 同時用滑鼠按一下以新增至排序',
	singleHelpMsg: '${0} - 按一下以進行排序',
	priorityOrder: '排序優先順序 ${0} ',

//SummaryBar
	summaryTotal: '總計：${0}',
	summarySelected: '已選取：${0}',
	summaryRange: '範圍：${0}-${1}',	//need translation

//Other
	indirectSelectAll: "按空格鍵可以全選。",	//need translation
	indirectDeselectAll: "按空格鍵可以取消全選。",	//need translation
	treeExpanded: "按 Ctrl+向左箭頭可以收合此列。",	//need translation
	treeCollapsed: "按 Ctrl+向右箭頭可以展開此列。"	//need translation
});

