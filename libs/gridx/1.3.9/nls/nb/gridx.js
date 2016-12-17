define({     
//Body
	loadingInfo: "Laster inn...",
	emptyInfo: "Ingen elementer å vise.",
	loadFailInfo: "Kunne ikke laste inn data!",
	loadMore: "Last inn mer",
	loadMoreLoading: "Laster inn...",
	loadPrevious: "Last inn forrige",
	loadPreviousLoading: "Laster inn...",

//FilterBar
	"clearFilterDialogTitle": "Tøm filter",
	"filterDefDialogTitle": "Filtrer",
	"defaultRuleTitle": "Regel",
	"ruleTitleTemplate": "Regel ${ruleNumber}",
	"noFilterApplied": "Ingen filtre brukt.",
	"defineFilter": "Definer filter",
	"defineFilterAriaLabel": "Definer filter: Åpner en filterdialogboks for konfigurering av komplekse filterregler. Hver filterregel består av en kombinasjon av kolonne, betingelse og verdi. Når dialogboksen åpnes, har verdifeltet fokus for tastaturet.",
	"conditionEqual": "lik",
	"conditionNotEqual": "er ikke lik",
	"conditionLess": "er mindre enn",
	"conditionLessEqual": "er mindre enn eller lik",
	"conditionGreater": "er større enn",
	"conditionGreaterEqual": "er større enn eller lik",
	"conditionContain": "inneholder",
	"conditionIs": "er",
	"conditionStartWith": "starter med",
	"conditionEndWith": "slutter med",
	"conditionNotContain": "inneholder ikke",
	"conditionIsNot": "er ikke",
	"conditionNotStartWith": "starter ikke med",
	"conditionNotEndWith": "slutter ikke på",
	"conditionBefore": "før",
	"conditionAfter": "etter",
	"conditionRange": "område",
	"conditionIsEmpty": "er tomt",
	"conditionIsNotEmpty": "er ikke tom",
	"all": "alle",
	"any": "hvilke som helst",
	"relationAll": "alle regler",
	"waiRelAll": "Samsvar med alle disse reglene:",
	"relationAny": "en hvilken som helst regel",
	"waiRelAny": "Samsvar med noen av følgende regler:",
	"relationMsgFront": "Samsvar",
	"relationMsgTail": "",
	"and": "og",
	"or": "eller",
	"addRuleButton": "Legg til regel",
	"waiAddRuleButton": "Legg til en ny regel",
	"removeRuleButton": "Fjern regel",
	"waiRemoveRuleButtonTemplate": "Fjern regelen ${0}",
	"addRuleButton": "Legg til filterregel",
	"cancelButton": "Avbryt",
	"waiCancelButton": "Avbryt denne dialogboksen",
	"clearButton": "Tøm",
	"waiClearButton": "Tøm filteret",
	"filterButton": "Filtrer",
	"waiFilterButton": "Send filteret",
	"columnSelectLabel": "Kolonne:",
	"columnSelectAriaLabel": "Kolonne: betingelsesdel ${0} av ${1}",
	"waiColumnSelectTemplate": "Kolonne for regelen ${0}",

	"conditionSelectLabel": "Betingelse:",
	"conditionSelectAriaLabel": "Operator: betingelsesdel ${0} av ${1}",
	"waiConditionSelectTemplate": "Betingelse for regelen ${0}",

	"valueBoxLabel": "Verdi:",
	"valueBoxAriaLabel": "Verdi: betingelsesdel ${0} av ${1}",
	"waiValueBoxTemplate": "Oppgi verdi som skal filtreres for regelen ${0}",
	"rangeTo": "til",
	"rangeTemplate": "fra ${0} til ${1}",
	"statusTipHeaderColumn": "Kolonne",
	"statusTipHeaderCondition": "Regler",
	"statusTipTitle": "Filtreringsfelt",
	"statusTipMsg": "Klikk på filtreringsfeltet her for å filtrere verdiene i ${0}.",
	"anycolumn": "en hvilken som helt kolonne",
	"statusTipTitleNoFilter": "Filtreringsfelt",
	"statusTipTitleHasFilter": "Filtrer",
	"statusTipRelPre": "Samsvar",
	"statusTipRelPost": "regler.",
	"statusTipHeaderAll": "Samsvar med alle regler.",
	"statusTipHeaderAny": "Samsvar med en hvilken som helt regel.",
	"defaultItemsName": "elementer",
	"filterBarMsgHasFilterTemplate": "${0} av ${1} ${2} vist.",
	"filterBarMsgNoFilterTemplate": "Ingen filtre er brukt",
	"filterBarDefButton": "Definer filter",
	"waiFilterBarDefButton": "Filtrer tabellen",
	"a11yFilterBarDefButton": "Filtrer...",
	"filterBarClearButton": "Tøm filter",
	"waiFilterBarClearButton": "Tøm filteret",
	"closeFilterBarBtn": "Lukk filtreringsfeltet",
	"clearFilterMsg": "Dette vil fjerne filteret og vise alle tilgjengelige poster.",
	"anyColumnOption": "En hvilken som helst kolonne",
	"trueLabel": "True",
	"falseLabel": "False",
	"radioTrueLabel": "Verdien sann",
	"radioFalseLabel": "Verdien usann",
	"beginTimeRangeLabel": "Startverdi for tidsrom",
	"endTimeRangeLabel": "Sluttverdi for tidsrom",
	"beginDateRangeLabel": "Startverdi for datoområde",
	"endDateRangeLabel": "Sluttverdi for datoområde",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "Enkel sortering",
	nestedSort: "Nestet sortering",
	ascending: "Klikk for å sortere stigende",
	descending: "Klikk for å sortere synkende",
	sortingState: "${0} - ${1}",
	unsorted: "Ikke sorter denne kolonnen",
	waiSingleSortLabel: "${0} - er sortert etter ${1}. Velg å sortere etter ${2}",
	waiNestedSortLabel:"${0} - er sortert med nestet sortering etter ${1}. Velg å sortere med nestet sortering etter ${2}",

//PaginationBar
	pagerWai: 'Sidevelger',

	pageIndex: '${0}',
	pageIndexTitle: 'Side ${0}',

	firstPageTitle: 'Første side',
	prevPageTitle: 'Forrige side',
	nextPageTitle: 'Neste side',
	lastPageTitle: 'Siste side',

	pageSize: '${0}',
	pageSizeTitle: '${0} elementer per side',
	pageSizeAll: 'Alle',
	pageSizeAllTitle: 'Alle elementer',

	description: '${0} - ${1} av ${2} elementer.',
	descriptionEmpty: 'Rutenettet er tomt.',

	summary: 'Totalt: ${0}',
	summaryWithSelection: 'Totalt: ${0} Valgt: ${1}',

	gotoBtnTitle: 'Gå til en bestemt side',

	gotoDialogTitle: 'Gå til side',
	gotoDialogMainMsg: 'Angi sidetall:',
	gotoDialogPageCount: '(${0} sider)',
	gotoDialogOKBtn: 'Utfør',
	gotoDialogCancelBtn: 'Avbryt',
	// for drop down pagination bar
	pageLabel: 'Side',
	pageSizeLabel: 'Rader',

//QuickFilter
	filterLabel: 'Filtrer',
	clearButtonTitle: 'Tøm filter',
	buildFilterMenuLabel: 'Bygg filter...',
	apply: 'Bruk filter',

//Sort
	helpMsg: '${0} - Klikk for å sortere eller Ctrl+klikk for å legge til sortering',
	singleHelpMsg: '${0} - Klikk for å sortere',
	priorityOrder: 'sorteringsprioritet ${0}',

//SummaryBar
	summaryTotal: 'Totalt: ${0}',
	summarySelected: 'Valgt: ${0}',
	summaryRange: 'Område: ${0}-${1}',	//need translation

//Other
	indirectSelectAll: "Trykk på mellomromstasten for å velge alle.",	//need translation
	indirectDeselectAll: "Trykk på mellomromstasten for å oppheve valget av alle.",	//need translation
	treeExpanded: "Trykk på Ctrl+Pil venstre for å komprimere denne raden.",	//need translation
	treeCollapsed: "Trykk på Ctrl+Pil høyre for å utvide denne raden."	//need translation
});

