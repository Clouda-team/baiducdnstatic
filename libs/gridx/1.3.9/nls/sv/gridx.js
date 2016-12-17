define({     
//Body
	loadingInfo: "Läser in...",
	emptyInfo: "Det finns inga objekt att visa",
	loadFailInfo: "Det gick inte att läsa in data!",
	loadMore: "Läs in mer",
	loadMoreLoading: "Läser in...",
	loadPrevious: "Läs in föregående",
	loadPreviousLoading: "Läser in...",

//FilterBar
	"clearFilterDialogTitle": "Rensa filter",
	"filterDefDialogTitle": "Filter",
	"defaultRuleTitle": "Regel",
	"ruleTitleTemplate": "Regel ${ruleNumber}",
	"noFilterApplied": "Inget filter tillämpat.",
	"defineFilter": "Definiera filter",
	"defineFilterAriaLabel": "Definiera filter: Öppnar ett filterfönster för konfigurering av komplexa filterregler. Varje filterregel består av en kombination av kolumn, villkor och värde. När fönstret öppnas är tangentfokus på värdefältet. ",
	"conditionEqual": "lika med",
	"conditionNotEqual": "inte lika med",
	"conditionLess": "mindre än",
	"conditionLessEqual": "mindre än eller lika med",
	"conditionGreater": "större än",
	"conditionGreaterEqual": "större än eller lika med",
	"conditionContain": "innehåller",
	"conditionIs": "är",
	"conditionStartWith": "börjar med",
	"conditionEndWith": "slutar med",
	"conditionNotContain": "innehåller inte",
	"conditionIsNot": "är inte",
	"conditionNotStartWith": "börjar inte med",
	"conditionNotEndWith": "slutar inte med",
	"conditionBefore": "före",
	"conditionAfter": "efter",
	"conditionRange": "intervall",
	"conditionIsEmpty": "är tomt ",
	"conditionIsNotEmpty": "är inte tomt",
	"all": "alla",
	"any": "någon",
	"relationAll": "alla regler",
	"waiRelAll": "Matcha alla följande regler:",
	"relationAny": "någon regel",
	"waiRelAny": "Matcha någon av följande regler:",
	"relationMsgFront": "Matcha",
	"relationMsgTail": "",
	"and": "och",
	"or": "eller",
	"addRuleButton": "Lägg till regel",
	"waiAddRuleButton": "Lägg till ny regel",
	"removeRuleButton": "Ta bort regel",
	"waiRemoveRuleButtonTemplate": "Ta bort regel ${0}",
	"addRuleButton": "Lägg till filterregel",
	"cancelButton": "Avbryt",
	"waiCancelButton": "Stäng fönstret",
	"clearButton": "Rensa",
	"waiClearButton": "Rensa filtret",
	"filterButton": "Filtrera",
	"waiFilterButton": "Filtrera",
	"columnSelectLabel": "Kolumn:",
	"columnSelectAriaLabel": "Kolumn: Villkorsdel ${0} av ${1}",
	"waiColumnSelectTemplate": "Kolumn för regel ${0}",

	"conditionSelectLabel": "Villkor:",
	"conditionSelectAriaLabel": "Operator: Villkorsdel ${0} av ${1}",
	"waiConditionSelectTemplate": "Villkor för regel ${0}",

	"valueBoxLabel": "Värde:",
	"valueBoxAriaLabel": "Värde: Villkorsdel ${0} av ${1}",
	"waiValueBoxTemplate": "Ange värde för filtrering efter regeln ${0}",
	"rangeTo": "till",
	"rangeTemplate": "från ${0} till ${1}",
	"statusTipHeaderColumn": "Kolumn",
	"statusTipHeaderCondition": "Regler",
	"statusTipTitle": "Filterfält",
	"statusTipMsg": "Klicka på filterfältet om du vill filtrera värden i ${0}.",
	"anycolumn": "alla kolumner",
	"statusTipTitleNoFilter": "Filterfält",
	"statusTipTitleHasFilter": "Filter",
	"statusTipRelPre": "Matcha",
	"statusTipRelPost": "regler. ",
	"statusTipHeaderAll": "Matcha alla regler.",
	"statusTipHeaderAny": "Matcha någon regel.",
	"defaultItemsName": "objekt",
	"filterBarMsgHasFilterTemplate": "${0} av ${1} ${2} visas.",
	"filterBarMsgNoFilterTemplate": "Inget filter tillämpat",
	"filterBarDefButton": "Definiera filter",
	"waiFilterBarDefButton": "Filtrera tabellen",
	"a11yFilterBarDefButton": "Filter...",
	"filterBarClearButton": "Rensa filter",
	"waiFilterBarClearButton": "Rensa filtret",
	"closeFilterBarBtn": "Stäng filterfält",
	"clearFilterMsg": "Tar bort filtret och visar alla tillgängliga poster.",
	"anyColumnOption": "Någon kolumn",
	"trueLabel": "Sant",
	"falseLabel": "Falskt",
	"radioTrueLabel": "Värde sant",
	"radioFalseLabel": "Värde falskt",
	"beginTimeRangeLabel": "Startvärde för tidsintervall",
	"endTimeRangeLabel": "Slutvärde för tidsintervall",
	"beginDateRangeLabel": "Startvärde för datumintervall",
	"endDateRangeLabel": "Slutvärde för datumintervall",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "Enkel sortering",
	nestedSort: "Nästlad sortering",
	ascending: "Sortera i stigande ordning",
	descending: "Sortera i fallande ordning",
	sortingState: "${0} - ${1}",
	unsorted: "Sortera inte den här kolumnen",
	waiSingleSortLabel: "${0} - sorteras efter ${1}. Välj för att sortera efter ${2}",
	waiNestedSortLabel:"${0} - är nästlat sorterat efter ${1}. Välj för nästlad sortering efter ${2}",

//PaginationBar
	pagerWai: 'Bläddrare',

	pageIndex: '${0}',
	pageIndexTitle: 'Sida ${0}',

	firstPageTitle: 'Första sidan',
	prevPageTitle: 'Föregående sida',
	nextPageTitle: 'Nästa sida',
	lastPageTitle: 'Sista sidan',

	pageSize: '${0}',
	pageSizeTitle: '${0} objekt per sida',
	pageSizeAll: 'Alla',
	pageSizeAllTitle: 'Alla objekt',

	description: '${0} - ${1} av ${2} objekt.',
	descriptionEmpty: 'Rutnätet är tomt.',

	summary: 'Totalt: ${0}',
	summaryWithSelection: 'Totalt: ${0} Valda: ${1}',

	gotoBtnTitle: 'Gå till en viss sida',

	gotoDialogTitle: 'Gå till sidan',
	gotoDialogMainMsg: 'Ange sidnummer:',
	gotoDialogPageCount: ' (${0} sidor)',
	gotoDialogOKBtn: 'Gå',
	gotoDialogCancelBtn: 'Avbryt',
	// for drop down pagination bar
	pageLabel: 'Sida',
	pageSizeLabel: 'Rader',

//QuickFilter
	filterLabel: 'Filter',
	clearButtonTitle: 'Rensa filter',
	buildFilterMenuLabel: 'Bygg filter...',
	apply: 'Använd filter',

//Sort
	helpMsg: '${0} - Klicka om du vill sortera eller Ctrl-klicka om du vill lägga till i sorteringen',
	singleHelpMsg: '${0} - Klicka om du vill sortera',
	priorityOrder: 'sorteringsprioritet ${0}',

//SummaryBar
	summaryTotal: 'Totalt: ${0}',
	summarySelected: 'Valt: ${0}',
	summaryRange: 'Intervall: ${0}-${1}',	//need translation

//Other
	indirectSelectAll: "Tryck på mellanslag för att markera alla.",	//need translation
	indirectDeselectAll: "Tryck på mellanslag för att avmarkera alla.",	//need translation
	treeExpanded: "Ctrl + vänster piltangent för att komprimera raden.",	//need translation
	treeCollapsed: "Ctrl + höger piltangent för att expandera raden."	//need translation
});

