define({     
//Body
	loadingInfo: "正在装入...",
	emptyInfo: "没有要显示的项目",
	loadFailInfo: "未能装入数据！",
	loadMore: "装入更多",
	loadMoreLoading: "正在装入...",
	loadPrevious: "装入前一项",
	loadPreviousLoading: "正在装入...",

//FilterBar
	"clearFilterDialogTitle": "清除过滤器",
	"filterDefDialogTitle": "过滤",
	"defaultRuleTitle": "规则",
	"ruleTitleTemplate": "规则 ${ruleNumber}",
	"noFilterApplied": "未应用过滤器。",
	"defineFilter": "定义过滤器",
	"defineFilterAriaLabel": "定义过滤器：打开过滤器对话框以配置复杂的过滤规则。每个过滤规则由列、条件和值的组合构成。该对话框打开时，值字段拥有键盘焦点。",
	"conditionEqual": "等于",
	"conditionNotEqual": "不等于",
	"conditionLess": "小于",
	"conditionLessEqual": "小于或等于",
	"conditionGreater": "大于",
	"conditionGreaterEqual": "大于或等于",
	"conditionContain": "包含",
	"conditionIs": "为",
	"conditionStartWith": "开始内容为",
	"conditionEndWith": "结束内容为",
	"conditionNotContain": "不包含",
	"conditionIsNot": "不是",
	"conditionNotStartWith": "开始内容不为",
	"conditionNotEndWith": "结束内容不为",
	"conditionBefore": "之前",
	"conditionAfter": "之后",
	"conditionRange": "范围",
	"conditionIsEmpty": "为空",
	"conditionIsNotEmpty": "非空",
	"all": "所有",
	"any": "任何",
	"relationAll": "所有规则",
	"waiRelAll": "与以下所有规则相匹配：",
	"relationAny": "任何规则",
	"waiRelAny": "与以下任何规则相匹配：",
	"relationMsgFront": "匹配",
	"relationMsgTail": "",
	"and": "和",
	"or": "或者",
	"addRuleButton": "添加规则",
	"waiAddRuleButton": "添加新规则",
	"removeRuleButton": "除去规则",
	"waiRemoveRuleButtonTemplate": "除去规则 ${0}",
	"addRuleButton": "添加过滤规则",
	"cancelButton": "取消",
	"waiCancelButton": "取消此对话框",
	"clearButton": "清除",
	"waiClearButton": "清除过滤器",
	"filterButton": "过滤",
	"waiFilterButton": "提交过滤器",
	"columnSelectLabel": "列：",
	"columnSelectAriaLabel": "列：${1} 的条件部分 ${0}",
	"waiColumnSelectTemplate": "规则 ${0} 的列",

	"conditionSelectLabel": "条件：",
	"conditionSelectAriaLabel": "运算符：${1} 的条件部分 ${0}",
	"waiConditionSelectTemplate": "规则 ${0} 的条件",

	"valueBoxLabel": "值：",
	"valueBoxAriaLabel": "值：${1} 的条件部分 ${0}",
	"waiValueBoxTemplate": "输入按规则 ${0} 进行过滤的值",
	"rangeTo": "到",
	"rangeTemplate": "从 ${0} 到 ${1}",
	"statusTipHeaderColumn": "列",
	"statusTipHeaderCondition": "规则",
	"statusTipTitle": "过滤器栏",
	"statusTipMsg": "单击此处的过滤器栏以过滤 ${0} 中的值。",
	"anycolumn": "任何列",
	"statusTipTitleNoFilter": "过滤器栏",
	"statusTipTitleHasFilter": "过滤",
	"statusTipRelPre": "匹配",
	"statusTipRelPost": "规则。",
	"statusTipHeaderAll": "与所有规则匹配。",
	"statusTipHeaderAny": "与任何规则匹配。",
	"defaultItemsName": "项",
	"filterBarMsgHasFilterTemplate": "已显示 ${1} ${2}中的 ${0} ${2}。",
	"filterBarMsgNoFilterTemplate": "未应用过滤器",
	"filterBarDefButton": "定义过滤器",
	"waiFilterBarDefButton": "对表进行过滤",
	"a11yFilterBarDefButton": "过滤器...",
	"filterBarClearButton": "清除过滤器",
	"waiFilterBarClearButton": "清除过滤器",
	"closeFilterBarBtn": "关闭过滤器栏",
	"clearFilterMsg": "这将除去过滤器并显示所有可用的记录。",
	"anyColumnOption": "任何列",
	"trueLabel": "True",
	"falseLabel": "False",
	"radioTrueLabel": "True 值",
	"radioFalseLabel": "False 值",
	"beginTimeRangeLabel": "时间范围开始值",
	"endTimeRangeLabel": "时间范围结束值",
	"beginDateRangeLabel": "日期范围开始值",
	"endDateRangeLabel": "日期范围结束值",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "单个排序",
	nestedSort: "嵌套排序",
	ascending: "单击以升序排序",
	descending: "单击以降序排序",
	sortingState: "${0} - ${1}",
	unsorted: "不对此列排序",
	waiSingleSortLabel: "${0} - 已按 ${1} 排序。选择按 ${2} 排序",
	waiNestedSortLabel:"${0} - 已按 ${1} 进行嵌套排序。选择按 ${2} 进行嵌套排序",

//PaginationBar
	pagerWai: '页面调度程序',

	pageIndex: '${0}',
	pageIndexTitle: '页 ${0}',

	firstPageTitle: '首页',
	prevPageTitle: '上一页',
	nextPageTitle: '下一页',
	lastPageTitle: '末页',

	pageSize: '${0}',
	pageSizeTitle: '每页 ${0} 项',
	pageSizeAll: '所有',
	pageSizeAllTitle: '所有项',

	description: '${2} 项中的第 ${0} 项 - 第 ${1} 项。',
	descriptionEmpty: '网格为空。',

	summary: '总计：${0}',
	summaryWithSelection: '总计：${0} 已选：${1}',

	gotoBtnTitle: '转至特定页面',

	gotoDialogTitle: '转至页面',
	gotoDialogMainMsg: '指定页数：',
	gotoDialogPageCount: '（${0} 页）',
	gotoDialogOKBtn: '转至',
	gotoDialogCancelBtn: '取消',
	// for drop down pagination bar
	pageLabel: '页面',
	pageSizeLabel: '行',

//QuickFilter
	filterLabel: '过滤',
	clearButtonTitle: '清除过滤器',
	buildFilterMenuLabel: '构建过滤器...',
	apply: '应用过滤器',

//Sort
	helpMsg: '${0} - 单击以排序，或者按 Ctrl 键并单击以添加到排序项',
	singleHelpMsg: '${0} - 单击以排序',
	priorityOrder: '排序优先级 ${0}',

//SummaryBar
	summaryTotal: '总计：${0}',
	summarySelected: '已选：${0}',
	summaryRange: '范围：${0}-${1}',	//need translation

//Other
	indirectSelectAll: "按空格键以全部选择。",	//need translation
	indirectDeselectAll: "按空格键以全部取消选择。",	//need translation
	treeExpanded: "按 Control + 左方向键以折叠此行。",	//need translation
	treeCollapsed: "按 Control + 右方向键以展开此行。"	//need translation
});

