define({root:
({
//Body
	loadingInfo: "Loading...",
	emptyInfo: "No items to display",
	loadFailInfo: "Failed to load data!",
	loadMore: "Load More",
	loadMoreLoading: "Loading...",
	loadPrevious: "Load Previous",
	loadPreviousLoading: "Loading...",

//FilterBar
	"day": "days",
	"month": "months",
	"year": "years",
	"hour": "hours",

	"clearFilterDialogTitle": "Clear Filter",
	"filterDefDialogTitle": "Filter",
	"defaultRuleTitle": "Rule",
	"ruleTitleTemplate": "Rule ${ruleNumber}",
	"noFilterApplied": "No filter applied.",
	"defineFilter": "Define filter",
	"defineFilterAriaLabel": "Define filter: Opens a filter dialog for configuring complex filter rules. Each filter rule is made up of a combination of column, condition and value. When the dialog opens, the value field has keyboard focus.",
	"conditionEqual": "equals",
	"conditionNotEqual": "does not equal",
	"conditionLess": "is less than",
	"conditionLessEqual": "less than or equal",
	"conditionGreater": "is greater than",
	"conditionGreaterEqual": "greater than or equal",
	"conditionContain": "contains",
	"conditionIs": "is",
	"conditionStartWith": "starts with",
	"conditionEndWith": "ends with",
	"conditionNotContain": "does not contain",
	"conditionIsNot": "is not",
	"conditionNotStartWith": "does not start with",
	"conditionNotEndWith": "does not end with",
	"conditionBefore": "before",
	"conditionAfter": "after",
	"conditionRange": "range",
	"conditionIsEmpty": "is empty",
	"conditionIsNotEmpty": "is not empty",
	"conditionPast": "past",
	
	"all": "all",
	"any": "any",
	"relationAll": "All rules",
	"waiRelAll": "Match all of the following rules:",
	"relationAny": "Any rule",
	"matchCase": "Match case",
	"waiRelAny": "Match any of the following rules:",
	"relationMsgFront": "Match",
	"relationMsgTail": "",
	"and": "and",
	"or": "or",
	
	"addRuleButton": "Add Rule",
	"waiAddRuleButton": "Add a new rule",
	"removeRuleButton": "Remove Rule",
	"waiRemoveRuleButtonTemplate": "Remove rule ${0}",
	
	"addRuleButton": "Add Filter Rule",
	"cancelButton": "Cancel",
	"waiCancelButton": "Cancel this dialog",
	"clearButton": "Clear",
	"waiClearButton": "Clear the filter",
	"filterButton": "Filter",
	"restoreFilterButton": "Restore",
	"waiFilterButton": "Submit the filter",
	
	"columnSelectLabel": "Column:",
	"columnSelectAriaLabel": "Column: condition part ${0} of ${1}",
	"waiColumnSelectTemplate": "Column for rule ${0}",

	"conditionSelectLabel": "Condition:",
	"conditionSelectAriaLabel": "Operator: condition part ${0} of ${1}",
	"waiConditionSelectTemplate": "Condition for rule ${0}",

	"valueBoxLabel": "Value:",
	"valueBoxAriaLabel": "Value: condition part ${0} of ${1}",
	"waiValueBoxTemplate": "Enter value to filter for rule ${0}",
	
	"rangeTo": "to",
	"rangeTemplate": "from ${0} to ${1}",
	"pastHoursConditionTemplate": "${0} hours",
	"pastDaysConditionTemplate": "${0} days",
	"pastMonthsConditionTemplate": "${0} months",
	"pastYearsConditionTemplate": "${0} years",
	
	"statusTipHeaderColumn": "Column",
	"statusTipHeaderCondition": "Rules",
	"statusTipTitle": "Filter Bar",
	"statusTipMsg": "Click the filter bar here to filter on values in ${0}.",
	"anycolumn": "any column",
	"statusTipTitleNoFilter": "Filter Bar",
	"statusTipTitleHasFilter": "Filter",
	"statusTipRelPre": "Match",
	"statusTipRelPost": "rules.",
	"statusTipHeaderAll": "Match all rules.",
	"statusTipHeaderAny": "Match any rules.",
	
	"defaultItemsName": "items",
	"filterBarMsgHasFilterTemplate": "${0} of ${1} ${2} shown.",
	"filterBarMsgNoFilterTemplate": "No filter applied",
	
	"filterBarDefButton": "Define filter",
	"waiFilterBarDefButton": "Filter the table",
	"a11yFilterBarDefButton": "Filter...",
	"filterBarClearButton": "Clear filter",
	"waiFilterBarClearButton": "Clear the filter",
	"closeFilterBarBtn": "Close filter bar",
	
	"clearFilterMsg": "This will remove the filter and show all available records.",
	"anyColumnOption": "Any Column",
	
	"trueLabel": "True",
	"falseLabel": "False",
	"radioTrueLabel": "Value True",
	"radioFalseLabel": "Value False",
	"beginTimeRangeLabel": "Time Range Value Start",
	"endTimeRangeLabel": "Time Range Value End",
	"beginDateRangeLabel": "Date Range Value Start",
	"endDateRangeLabel": "Date Range Value End",
	"datePastLabel": "Past several days",
	"beginNumberRangeLabel": "Number Value Start",
	"endNumberRangeLabel": "Number Value End",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "Single Sort",
	nestedSort: "Nested Sort",
	ascending: "Click to sort Ascending",
	descending: "Click to sort Descending",
	sortingState: "${0} - ${1}",
	unsorted: "Do not sort this column",
	
	waiSingleSortLabel: "${0} - is sorted by ${1}. Choose to sort by ${2}",
	waiNestedSortLabel:"${0} - is nested sorted by ${1}. Choose to nested sort by ${2}",

//PaginationBar
	pagerWai: 'Pager',

	pageIndex: '${0}',
	pageIndexTitle: 'Page ${0}',

	firstPageTitle: 'First page',
	prevPageTitle: 'Previous page',
	nextPageTitle: 'Next page',
	lastPageTitle: 'Last page',

	pageSize: '${0}',
	pageSizeTitle: '${0} items per page',
	pageSizeAll: 'All',
	pageSizeAllTitle: 'All items',

	description: '${0} - ${1} of ${2} items.',
	descriptionEmpty: 'Grid is empty.',

	summary: 'Total: ${0}',
	summaryWithSelection: 'Total: ${0} Selected: ${1}',

	gotoBtnTitle: 'Go to a specific page',

	gotoDialogTitle: 'Go to Page',
	gotoDialogMainMsg: 'Specify the page number:',
	gotoDialogPageCount: '(${0} pages)',
	gotoDialogOKBtn: 'Go',
	gotoDialogCancelBtn: 'Cancel',
	
	// for drop down pagination bar
	pageLabel: 'Page',
	pageSizeLabel: 'Rows',

//QuickFilter
	filterLabel: 'Filter',
	clearButtonTitle: 'Clear Filter',
	buildFilterMenuLabel: 'Build Filter...',
	apply: 'Apply Filter',

//Sort
	helpMsg: '${0} - Click to sort or control-click to add to sort',
	singleHelpMsg: '${0} - Click to sort',
	priorityOrder: 'sort priority ${0}',

//SummaryBar
	summaryTotal: 'Total: ${0}',
	summarySelected: 'Selected: ${0}',
	summaryRange: 'Range: ${0}-${1}',	//need translation

//Other
	indirectSelectInstruction: "Press SPACE to select or deselect this row.",
	indirectSelectAll: "Press SPACE to select all.",	//need translation
	indirectDeselectAll: "Press SPACE to deselect all.",	//need translation
	treeExpanded: "Control + left arrow key to collapse this row.",	//need translation
	treeCollapsed: "Control + right arrow key to expand this row."	//need translation
}),
"ar": true,
"bg": true,
"bs": true,
"ca": true,
"cs": true,
"da": true,
"de": true,
"el": true,
"es": true,
"eu": true,
"fi": true,
"fr": true,
"he": true,
"hr": true,
"hu": true,
"id": true,
"it": true,
"ja": true,
"kk": true,
"ko": true,
"mk": true,
"nb": true,
"nl": true,
"pl": true,
"pt": true,
"pt-pt": true,
"ro": true,
"ru": true,
"sk": true,
"sl": true,
"sr": true,
"sv": true,
"th": true,
"tr": true,
"uk": true,
"zh": true,
"zh-tw": true,
"vi": true
});
