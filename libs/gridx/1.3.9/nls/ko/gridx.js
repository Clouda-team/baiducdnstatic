define({     
//Body
	loadingInfo: "로드 중...",
	emptyInfo: "표시할 항목 없음",
	loadFailInfo: "데이터를 로드하지 못했습니다.",
	loadMore: "계속 로드",
	loadMoreLoading: "로드 중...",
	loadPrevious: "이전 로드",
	loadPreviousLoading: "로드 중...",

//FilterBar
	"clearFilterDialogTitle": "필터 지우기",
	"filterDefDialogTitle": "필터",
	"defaultRuleTitle": "규칙",
	"ruleTitleTemplate": "규칙 ${ruleNumber}",
	"noFilterApplied": "필터가 적용되지 않음",
	"defineFilter": "필터 정의",
	"defineFilterAriaLabel": "필터 정의: 복합 필터 규칙을 구성하기 위해 필터 대화 상자를 엽니다. 각 필터 규칙은 열, 조건 및 값의 조합으로 구성됩니다. 대화 상자가 열리면 값 필드에 키보드 초점이 생깁니다. ",
	"conditionEqual": "같음",
	"conditionNotEqual": "!=",
	"conditionLess": "<",
	"conditionLessEqual": "<=",
	"conditionGreater": ">",
	"conditionGreaterEqual": ">=",
	"conditionContain": "포함",
	"conditionIs": "=",
	"conditionStartWith": "다음으로 시작",
	"conditionEndWith": "다음으로 끝남",
	"conditionNotContain": "포함하지 않음",
	"conditionIsNot": "!=",
	"conditionNotStartWith": "다음으로 시작하지 않음",
	"conditionNotEndWith": "다음으로 끝나지 않음",
	"conditionBefore": "전",
	"conditionAfter": "후",
	"conditionRange": "범위",
	"conditionIsEmpty": "비어 있음",
	"conditionIsNotEmpty": "비어 있지 않음",
	"all": "모두",
	"any": "임의",
	"relationAll": "모든 규칙",
	"waiRelAll": "다음 규칙 모두와 일치합니다.",
	"relationAny": "일부 규칙",
	"waiRelAny": "다음 규칙 중 일부와 일치합니다.",
	"relationMsgFront": "일치",
	"relationMsgTail": "",
	"and": "및",
	"or": "또는",
	"addRuleButton": "규칙 추가",
	"waiAddRuleButton": "새 규칙 추가",
	"removeRuleButton": "규칙 제거",
	"waiRemoveRuleButtonTemplate": "규칙 ${0} 제거",
	"addRuleButton": "필터 규칙 추가",
	"cancelButton": "취소",
	"waiCancelButton": "이 대화 상자 취소",
	"clearButton": "지우기",
	"waiClearButton": "필터 지우기",
	"filterButton": "필터",
	"waiFilterButton": "필터 제출",
	"columnSelectLabel": "열:",
	"columnSelectAriaLabel": "열: ${1} 중 ${0} 조건 파트",
	"waiColumnSelectTemplate": "규칙 ${0}에 대한 열",

	"conditionSelectLabel": "조건:",
	"conditionSelectAriaLabel": "연산자: ${1} 중 ${0} 조건 파트",
	"waiConditionSelectTemplate": "규칙 ${0}에 대한 조건",

	"valueBoxLabel": "값:",
	"valueBoxAriaLabel": "값: ${1} 중 ${0} 조건 파트",
	"waiValueBoxTemplate": "규칙 ${0}에 대해 필터할 값 입력",
	"rangeTo": "대상",
	"rangeTemplate": "${0} - ${1}",
	"statusTipHeaderColumn": "열",
	"statusTipHeaderCondition": "규칙",
	"statusTipTitle": "필터 막대",
	"statusTipMsg": "${0}의 값에 대해 필터하려면 이 필터 막대를 클릭하십시오.",
	"anycolumn": "임의 열",
	"statusTipTitleNoFilter": "필터 막대",
	"statusTipTitleHasFilter": "필터",
	"statusTipRelPre": "일치",
	"statusTipRelPost": "규칙.",
	"statusTipHeaderAll": "모든 규칙과 일치합니다.",
	"statusTipHeaderAny": "임의 규칙과 일치합니다.",
	"defaultItemsName": "항목",
	"filterBarMsgHasFilterTemplate": "${0}/${1} ${2} 표시됨.",
	"filterBarMsgNoFilterTemplate": "필터가 적용되지 않음",
	"filterBarDefButton": "필터 정의",
	"waiFilterBarDefButton": "테이블 필터",
	"a11yFilterBarDefButton": "필터...",
	"filterBarClearButton": "필터 지우기",
	"waiFilterBarClearButton": "필터 지우기",
	"closeFilterBarBtn": "필터 막대 닫기",
	"clearFilterMsg": "이렇게 하면 필터가 제거되고 사용 가능한 모든 레코드가 표시됩니다.",
	"anyColumnOption": "임의 열",
	"trueLabel": "True",
	"falseLabel": "False",
	"radioTrueLabel": "true 값",
	"radioFalseLabel": "false 값",
	"beginTimeRangeLabel": "시간 범위 값 시작",
	"endTimeRangeLabel": "시간 범위 값 종료",
	"beginDateRangeLabel": "날짜 범위 값 시작",
	"endDateRangeLabel": "날짜 범위 값 종료",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "단일 정렬",
	nestedSort: "중첩 정렬",
	ascending: "오름차순으로 정렬하려면 클릭",
	descending: "내림차순으로 정렬하려면 클릭",
	sortingState: "${0} - ${1}",
	unsorted: "이 열을 정렬하지 않음",
	waiSingleSortLabel: "${0} - ${1}별로 정렬됩니다. ${2}별로 정렬하도록 선택하십시오.",
	waiNestedSortLabel:"${0} - ${1}별로 중첩 정렬됩니다. ${2}별로 중첩 정렬하도록 선택하십시오.",

//PaginationBar
	pagerWai: '호출기',

	pageIndex: '${0}',
	pageIndexTitle: '${0}페이지',

	firstPageTitle: '첫 페이지',
	prevPageTitle: '이전 페이지',
	nextPageTitle: '다음 페이지',
	lastPageTitle: '마지막 페이지',

	pageSize: '${0}',
	pageSizeTitle: '페이지당 ${0}개 항목',
	pageSizeAll: '모두',
	pageSizeAllTitle: '모든 항목',

	description: '${0} - ${1}/${2}개 항목.',
	descriptionEmpty: '표가 비어 있습니다.',

	summary: '총 항목: ${0}',
	summaryWithSelection: '총 항목: ${0} 선택한 항목: ${1}',

	gotoBtnTitle: '특정 페이지로 이동',

	gotoDialogTitle: '페이지로 이동',
	gotoDialogMainMsg: '페이지 번호 지정:',
	gotoDialogPageCount: '(${0}페이지)',
	gotoDialogOKBtn: '이동',
	gotoDialogCancelBtn: '취소',
	// for drop down pagination bar
	pageLabel: '페이지',
	pageSizeLabel: '행',

//QuickFilter
	filterLabel: '필터',
	clearButtonTitle: '필터 지우기',
	buildFilterMenuLabel: '필터 빌드...',
	apply: '필터 적용',

//Sort
	helpMsg: '${0} - 정렬하려면 클릭하거나 정렬에 추가하려면 Ctrl키와 함께 클릭',
	singleHelpMsg: '${0} - 정렬하려면 클릭',
	priorityOrder: '정렬 우선순위 ${0}',

//SummaryBar
	summaryTotal: '총 항목: ${0}',
	summarySelected: '선택됨: ${0}',
	summaryRange: '범위: ${0}-${1}',	//need translation

//Other
	indirectSelectAll: "SPACE를 눌러 모두 선택합니다.",	//need translation
	indirectDeselectAll: "SPACE를 눌러 모두 선택 취소합니다.",	//need translation
	treeExpanded: "Control+왼쪽 화살표 키로 이 행을 접습니다.",	//need translation
	treeCollapsed: "Control+오른쪽 화살표 키로 이 행을 펼칩니다."	//need translation
});

