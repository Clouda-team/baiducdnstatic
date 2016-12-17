define({     
//Body
	loadingInfo: "Indlæser...",
	emptyInfo: "Der er ingen elementer at vise",
	loadFailInfo: "Kan ikke indlæse data.",
	loadMore: "Indlæs mere",
	loadMoreLoading: "Indlæser...",
	loadPrevious: "Indlæs forrige",
	loadPreviousLoading: "Indlæser...",

//FilterBar
	"clearFilterDialogTitle": "Ryd filter",
	"filterDefDialogTitle": "Filter",
	"defaultRuleTitle": "Regel",
	"ruleTitleTemplate": "Regel ${ruleNumber}",
	"noFilterApplied": "Intet filter anvendt.",
	"defineFilter": "Definér filter",
	"defineFilterAriaLabel": "Definér filter: Åbner en filterdialogboks, hvor du kan konfigurere komplekse filterregler. Hver filterregel består af en kombination af kolonne, betingelse og værdi. Når dialogboksen åbnes, er tastaturfokus placeret i værdifeltet.",
	"conditionEqual": "er lig med",
	"conditionNotEqual": "er forskellig fra",
	"conditionLess": "er mindre end",
	"conditionLessEqual": "er mindre end eller lig med",
	"conditionGreater": "er større end",
	"conditionGreaterEqual": "er større end eller lig med",
	"conditionContain": "indeholder",
	"conditionIs": "er",
	"conditionStartWith": "begynder med",
	"conditionEndWith": "slutter med",
	"conditionNotContain": "indeholder ikke",
	"conditionIsNot": "er ikke",
	"conditionNotStartWith": "begynder ikke med",
	"conditionNotEndWith": "slutter ikke med",
	"conditionBefore": "før",
	"conditionAfter": "efter",
	"conditionRange": "interval",
	"conditionIsEmpty": "er tom",
	"conditionIsNotEmpty": "er ikke tom",
	"all": "alle",
	"any": "vilkårlige",
	"relationAll": "alle regler",
	"waiRelAll": "Matcher alle følgende regler:",
	"relationAny": "vilkårlig regel",
	"waiRelAny": "Matcher en eller flere af følgende regler:",
	"relationMsgFront": "Matcher",
	"relationMsgTail": "",
	"and": "og",
	"or": "eller",
	"addRuleButton": "Tilføj regel",
	"waiAddRuleButton": "Tilføj en ny regel",
	"removeRuleButton": "Fjern regel",
	"waiRemoveRuleButtonTemplate": "Fjern reglen ${0}",
	"addRuleButton": "Tilføj filterregel",
	"cancelButton": "Annullér",
	"waiCancelButton": "Annullér denne dialogboks",
	"clearButton": "Ryd",
	"waiClearButton": "Ryd filteret",
	"filterButton": "Filter",
	"waiFilterButton": "Send filteret",
	"columnSelectLabel": "Kolonne:",
	"columnSelectAriaLabel": "Kolonne: betingelsesdel ${0} af ${1}",
	"waiColumnSelectTemplate": "Kolonne for regel ${0}",

	"conditionSelectLabel": "Betingelse:",
	"conditionSelectAriaLabel": "Operator: betingelsesdel ${0} af ${1}",
	"waiConditionSelectTemplate": "Betingelse for regel ${0}",

	"valueBoxLabel": "Værdi:",
	"valueBoxAriaLabel": "Værdi: betingelsesdel ${0} af ${1}",
	"waiValueBoxTemplate": "Angiv værdi for filtrering for regel ${0}",
	"rangeTo": "til",
	"rangeTemplate": "fra ${0} til ${1}",
	"statusTipHeaderColumn": "Kolonne",
	"statusTipHeaderCondition": "Regler",
	"statusTipTitle": "Filterlinje",
	"statusTipMsg": "Klik på filterlinjen for at filtrere efter værdier i ${0}.",
	"anycolumn": "vilkårlig kolonne",
	"statusTipTitleNoFilter": "Filterlinje",
	"statusTipTitleHasFilter": "Filter",
	"statusTipRelPre": "Matcher",
	"statusTipRelPost": "regler.",
	"statusTipHeaderAll": "Matcher alle regler.",
	"statusTipHeaderAny": "Matcher en hvilken som helst regel.",
	"defaultItemsName": "elementer",
	"filterBarMsgHasFilterTemplate": "${0} af ${1} ${2} vist.",
	"filterBarMsgNoFilterTemplate": "Intet filter anvendt",
	"filterBarDefButton": "Definér filter",
	"waiFilterBarDefButton": "Filtrér tabellen",
	"a11yFilterBarDefButton": "Filtrér...",
	"filterBarClearButton": "Ryd filter",
	"waiFilterBarClearButton": "Ryd filteret",
	"closeFilterBarBtn": "Luk filterlinje",
	"clearFilterMsg": "Denne funktion fjerner filteret og viser alle tilgængelige records.",
	"anyColumnOption": "Vilkårlig kolonne",
	"trueLabel": "Sand",
	"falseLabel": "Falsk",
	"radioTrueLabel": "Værdi sand",
	"radioFalseLabel": "Værdi falsk",
	"beginTimeRangeLabel": "Start på tidsintervalværdi",
	"endTimeRangeLabel": "Slut på tidsintervalværdi",
	"beginDateRangeLabel": "Start på datointervalværdi",
	"endDateRangeLabel": "Slut på datointervalværdi",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "Enkel sortering",
	nestedSort: "Indlejret sortering",
	ascending: "Klik for at sortere stigende",
	descending: "Klik for at sortere faldende",
	sortingState: "${0} - ${1}",
	unsorted: "Sortér ikke denne kolonne",
	waiSingleSortLabel: "${0} - er sorteret efter ${1}. Vælg for sortering efter ${2}",
	waiNestedSortLabel:"${0} - er indlejret sorteret efter ${1}. Vælg for indlejret sortering efter ${2}",

//PaginationBar
	pagerWai: 'Sidetal',

	pageIndex: '${0}',
	pageIndexTitle: 'Side ${0}',

	firstPageTitle: 'Første side',
	prevPageTitle: 'Forrige side',
	nextPageTitle: 'Næste side',
	lastPageTitle: 'Sidste side',

	pageSize: '${0}',
	pageSizeTitle: '${0} elementer pr. side',
	pageSizeAll: 'Alle',
	pageSizeAllTitle: 'Alle elementer',

	description: '${0} - ${1} af ${2} elementer.',
	descriptionEmpty: 'Gitter er tomt.',

	summary: 'I alt: ${0}',
	summaryWithSelection: 'I alt: ${0} Valgt: ${1}',

	gotoBtnTitle: 'Gå til en bestemt side',

	gotoDialogTitle: 'Gå til side',
	gotoDialogMainMsg: 'Angiv sidenummeret:',
	gotoDialogPageCount: ' (${0} sider)',
	gotoDialogOKBtn: 'Udfør',
	gotoDialogCancelBtn: 'Annullér',
	// for drop down pagination bar
	pageLabel: 'Side',
	pageSizeLabel: 'Rækker',

//QuickFilter
	filterLabel: 'Filter',
	clearButtonTitle: 'Ryd filter',
	buildFilterMenuLabel: 'Byg filter…',
	apply: 'Anvend filter',

//Sort
	helpMsg: '${0} - Klik for at sortere, eller hold Ctrl-tasten nede og klik for at tilføje til sortering',
	singleHelpMsg: '${0} - Klik for at sortere',
	priorityOrder: 'sorteringsrækkefølge ${0}',

//SummaryBar
	summaryTotal: 'I alt: ${0}',
	summarySelected: 'Valgt: ${0}',
	summaryRange: 'Interval: ${0}-${1}',	//need translation

//Other
	indirectSelectAll: "Tryk på mellemrumstasten for at markere alle.",	//need translation
	indirectDeselectAll: "Tryk på mellemrumstasten for at fjerne markeringen af alle.",	//need translation
	treeExpanded: "Ctrl + venstre piltast for at skjule denne række.",	//need translation
	treeCollapsed: "Ctrl + højre piltast for at udvide denne række."	//need translation
});

