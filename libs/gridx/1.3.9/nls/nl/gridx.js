define({     
//Body
	loadingInfo: "Laden...",
	emptyInfo: "Er zijn geen items beschikbaar om weer te geven.",
	loadFailInfo: "Gegevens kunnen niet geladen worden.",
	loadMore: "Meer laden",
	loadMoreLoading: "Laden...",
	loadPrevious: "Vorige laden",
	loadPreviousLoading: "Laden...",

//FilterBar
	"clearFilterDialogTitle": "Filter verwijderen",
	"filterDefDialogTitle": "Filter",
	"defaultRuleTitle": "Regel",
	"ruleTitleTemplate": "Regel ${ruleNumber}",
	"noFilterApplied": "Geen filter toegepast.",
	"defineFilter": "Filter definiëren",
	"defineFilterAriaLabel": "Filter definiëren: Hiermee opent u een venster waarin u complexe filterregels kunt configureren. Elke filterregel bestaat een combinatie van kolom, voorwaarde en waarde. Wanneer het venster wordt geopend, staat de cursor in het waardeveld. ",
	"conditionEqual": "is gelijk aan",
	"conditionNotEqual": "is niet gelijk aan",
	"conditionLess": "is kleiner dan",
	"conditionLessEqual": "is kleiner dan of gelijk aan",
	"conditionGreater": "is groter dan",
	"conditionGreaterEqual": "is groter dan of gelijk aan",
	"conditionContain": "bevat",
	"conditionIs": "is",
	"conditionStartWith": "begint met",
	"conditionEndWith": "eindigt met",
	"conditionNotContain": "bevat niet",
	"conditionIsNot": "is niet",
	"conditionNotStartWith": "begint niet met",
	"conditionNotEndWith": "eindigt niet met",
	"conditionBefore": "voor",
	"conditionAfter": "na",
	"conditionRange": "bereik",
	"conditionIsEmpty": "is leeg",
	"conditionIsNotEmpty": "is niet leeg",
	"all": "alle",
	"any": "een of meer",
	"relationAll": "alle regels",
	"waiRelAll": "Moet overeenkomen met al deze regels:",
	"relationAny": "een regel",
	"waiRelAny": "Moet overeenkomen met een of meer van deze regels:",
	"relationMsgFront": "Vergelijken van",
	"relationMsgTail": "",
	"and": "en",
	"or": "of",
	"addRuleButton": "Regel toevoegen ",
	"waiAddRuleButton": "Nieuwe regel toevoegen",
	"removeRuleButton": "Regel verwijderen",
	"waiRemoveRuleButtonTemplate": "Regel ${0} verwijderen",
	"addRuleButton": "Filterregel toevoegen",
	"cancelButton": "Annuleren",
	"waiCancelButton": "Dit dialoogvenster annuleren",
	"clearButton": "Leegmaken",
	"waiClearButton": "Filter wissen",
	"filterButton": "Filter",
	"waiFilterButton": "Filter verzenden",
	"columnSelectLabel": "Kolom:",
	"columnSelectAriaLabel": "Kolom: voorwaarde deel ${0} van ${1}",
	"waiColumnSelectTemplate": "Kolom voor regel ${0}",

	"conditionSelectLabel": "Voorwaarde:",
	"conditionSelectAriaLabel": "Operator: voorwaarde deel ${0} van ${1}",
	"waiConditionSelectTemplate": "Voorwaarde voor regel ${0}",

	"valueBoxLabel": "Waarde:",
	"valueBoxAriaLabel": "Waarde: voorwaarde deel ${0} van ${1}",
	"waiValueBoxTemplate": "Geef een waarde op voor het filter voor regel ${0}",
	"rangeTo": "tot",
	"rangeTemplate": "van ${0} tot ${1}",
	"statusTipHeaderColumn": "Kolom",
	"statusTipHeaderCondition": "Regels ",
	"statusTipTitle": "Filterbalk",
	"statusTipMsg": "Klik hier op de filterbalk om te filteren op waarden in ${0}.",
	"anycolumn": "een kolom",
	"statusTipTitleNoFilter": "Filterbalk",
	"statusTipTitleHasFilter": "Filter",
	"statusTipRelPre": "Vergelijken van",
	"statusTipRelPost": "regels.",
	"statusTipHeaderAll": "Moet overeenkomen met alle regels.",
	"statusTipHeaderAny": "Moet overeenkomen met een of meer regels.",
	"defaultItemsName": "items",
	"filterBarMsgHasFilterTemplate": "${0} van ${1} ${2} afgebeeld.",
	"filterBarMsgNoFilterTemplate": "Geen filter toegepast",
	"filterBarDefButton": "Filter definiëren",
	"waiFilterBarDefButton": "De tabel filteren",
	"a11yFilterBarDefButton": "Filteren...",
	"filterBarClearButton": "Filter verwijderen",
	"waiFilterBarClearButton": "Filter wissen",
	"closeFilterBarBtn": "Filterbalk afsluiten",
	"clearFilterMsg": "Hiermee wordt het filter verwijderd en worden alle beschikbare records afgebeeld.",
	"anyColumnOption": "Een kolom",
	"trueLabel": "Waar",
	"falseLabel": "Onwaar",
	"radioTrueLabel": "Waarde waar",
	"radioFalseLabel": "Waarde onwaar",
	"beginTimeRangeLabel": "Waarde voor begin van tijdsbereik",
	"endTimeRangeLabel": "Waarde voor eind van tijdsbereik",
	"beginDateRangeLabel": "Waarde voor begin van datumbereik",
	"endDateRangeLabel": "Waarde voor eind van datumbereik",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "Enkelvoudig sorteren",
	nestedSort: "Genest sorteren",
	ascending: "Klik om opklimmend te sorteren",
	descending: "Klik om aflopend te sorteren",
	sortingState: "${0} - ${1}",
	unsorted: "Deze kolom niet sorteren",
	waiSingleSortLabel: "${0} - is gesorteerd op ${1}. Kies voor sorteren op ${2}",
	waiNestedSortLabel:"${0} - is genest gesorteerd op ${1}. Kies voor genest sorteren op ${2}",

//PaginationBar
	pagerWai: 'Pager',

	pageIndex: '${0}',
	pageIndexTitle: 'Pagina ${0}',

	firstPageTitle: 'Eerste pagina',
	prevPageTitle: 'Vorige pagina',
	nextPageTitle: 'Volgende pagina',
	lastPageTitle: 'Laatste pagina',

	pageSize: '${0}',
	pageSizeTitle: '${0} items per pagina',
	pageSizeAll: 'Alles',
	pageSizeAllTitle: 'Alle items',

	description: '${0} - ${1} van ${2} items.',
	descriptionEmpty: 'Raster is leeg.',

	summary: 'Totaal: ${0}',
	summaryWithSelection: 'Totaal: ${0} Geselecteerd: ${1}',

	gotoBtnTitle: 'Naar een bepaalde pagina gaan',

	gotoDialogTitle: 'Naar pagina gaan',
	gotoDialogMainMsg: 'Geef het paginanummer op:',
	gotoDialogPageCount: '(${0} pagina\'s)',
	gotoDialogOKBtn: 'Go',
	gotoDialogCancelBtn: 'Annuleren',
	// for drop down pagination bar
	pageLabel: 'Pagina',
	pageSizeLabel: 'Rijen',

//QuickFilter
	filterLabel: 'Filter',
	clearButtonTitle: 'Filter verwijderen',
	buildFilterMenuLabel: 'Filter bouwen...',
	apply: 'Filter toepassen',

//Sort
	helpMsg: '${0} - Klik om te sorteren of houd Ctrl ingedrukt en klik om toe te voegen aan sorteren',
	singleHelpMsg: '${0} - Klik om te sorteren',
	priorityOrder: 'sorteervolgorde ${0}',

//SummaryBar
	summaryTotal: 'Totaal: ${0}',
	summarySelected: 'Geselecteerd: ${0}',
	summaryRange: 'Bereik: ${0}-${1}',	//need translation

//Other
	indirectSelectAll: "Druk op spatiebalk om alles te selecteren.",	//need translation
	indirectDeselectAll: "Druk op spatiebalk om alle selecties op te heffen.",	//need translation
	treeExpanded: "Ctrl + pijl naar links om deze rij samen te vouwen.",	//need translation
	treeCollapsed: "Ctrl + pijl naar rechts om deze rij uit te vouwen."	//need translation
});

