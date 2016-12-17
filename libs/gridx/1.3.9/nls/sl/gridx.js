define({     
//Body
	loadingInfo: "Nalaganje ...",
	emptyInfo: "Ni postavk za prikaz",
	loadFailInfo: "Nalaganje podatkov ni uspelo!",
	loadMore: "Naloži več",
	loadMoreLoading: "Nalaganje ...",
	loadPrevious: "Naloži prejšnje",
	loadPreviousLoading: "Nalaganje ...",

//FilterBar
	"clearFilterDialogTitle": "Počisti filter",
	"filterDefDialogTitle": "Filter",
	"defaultRuleTitle": "Pravilo",
	"ruleTitleTemplate": "Pravilo ${ruleNumber}",
	"noFilterApplied": "Uporabljen ni noben filter.",
	"defineFilter": "Določi filter",
	"defineFilterAriaLabel": "Določi filter: odpre pogovorno okno filtra za konfiguriranje zahtevnih pravil filtra. Vsako pravilo filtra je sestavljeno iz kombinacije stolpca, pogoja in vrednosti. Ko se pogovorno okno odpre, se fokus tipkovnice premakne na polje z vrednostjo.",
	"conditionEqual": "je enako",
	"conditionNotEqual": "ni enako",
	"conditionLess": "je manjše od",
	"conditionLessEqual": "je manjše od ali enako",
	"conditionGreater": "je večje od",
	"conditionGreaterEqual": "je večje od ali enako",
	"conditionContain": "vsebuje",
	"conditionIs": "je",
	"conditionStartWith": "se začne z",
	"conditionEndWith": "se konča z",
	"conditionNotContain": "ne vsebuje",
	"conditionIsNot": "ni",
	"conditionNotStartWith": "se ne začne z",
	"conditionNotEndWith": "se ne konča z",
	"conditionBefore": "pred",
	"conditionAfter": "po",
	"conditionRange": "obseg",
	"conditionIsEmpty": "je prazno",
	"conditionIsNotEmpty": "ni prazno",
	"all": "vse",
	"any": "katero koli",
	"relationAll": "vsa pravila",
	"waiRelAll": "Zagotovi ujemanje z vsemi naslednjimi pravili:",
	"relationAny": "katero koli pravilo",
	"waiRelAny": "Zagotovi ujemanje s katerim koli od naslednjih pravil:",
	"relationMsgFront": "Ujemanje",
	"relationMsgTail": "",
	"and": "in",
	"or": "ali",
	"addRuleButton": "Dodaj pravilo",
	"waiAddRuleButton": "Dodaj novo pravilo",
	"removeRuleButton": "Odstrani pravilo",
	"waiRemoveRuleButtonTemplate": "Odstrani pravilo ${0}",
	"addRuleButton": "Dodaj pravilo filtra",
	"cancelButton": "Prekliči",
	"waiCancelButton": "Prekliči to pogovorno okno",
	"clearButton": "Počisti",
	"waiClearButton": "Počisti filter",
	"filterButton": "Filter",
	"waiFilterButton": "Pošlji filter",
	"columnSelectLabel": "Stolpec:",
	"columnSelectAriaLabel": "Stolpec: del pogoja ${0} od ${1}",
	"waiColumnSelectTemplate": "Stolpec za pravilo ${0}",

	"conditionSelectLabel": "Pogoj:",
	"conditionSelectAriaLabel": "Operator: del pogoja ${0} od ${1}",
	"waiConditionSelectTemplate": "Pogoj za pravilo ${0}",

	"valueBoxLabel": "Vrednost:",
	"valueBoxAriaLabel": "Vrednost: del pogoja ${0} od ${1}",
	"waiValueBoxTemplate": "Vnesite vrednost, ki jo boste filtrirali za pravilo ${0}",
	"rangeTo": "do",
	"rangeTemplate": "od ${0} do ${1}",
	"statusTipHeaderColumn": "Stolpec",
	"statusTipHeaderCondition": "Pravila",
	"statusTipTitle": "Vrstica filtra",
	"statusTipMsg": "Tukaj kliknite vrstico filtra, da filtrirate po vrednostih v ${0}.",
	"anycolumn": "kateri koli stolpec",
	"statusTipTitleNoFilter": "Vrstica filtra",
	"statusTipTitleHasFilter": "Filter",
	"statusTipRelPre": "Ujemanje",
	"statusTipRelPost": "pravila.",
	"statusTipHeaderAll": "Zagotovi ujemanje z vsemi pravili.",
	"statusTipHeaderAny": "Zagotovi ujemanje s katerim koli pravilom.",
	"defaultItemsName": "postavke",
	"filterBarMsgHasFilterTemplate": "${0} od ${1} ${2} je prikazano.",
	"filterBarMsgNoFilterTemplate": "Uporabljen ni noben filter",
	"filterBarDefButton": "Določi filter",
	"waiFilterBarDefButton": "Filtriraj tabelo",
	"a11yFilterBarDefButton": "Filtriraj ...",
	"filterBarClearButton": "Počisti filter",
	"waiFilterBarClearButton": "Počisti filter",
	"closeFilterBarBtn": "Zapri vrstico filtra",
	"clearFilterMsg": "S tem boste odstranili filter in prikazali vse razpoložljive zapise.",
	"anyColumnOption": "Kateri koli stolpec",
	"trueLabel": "True",
	"falseLabel": "False",
	"radioTrueLabel": "Vrednost True",
	"radioFalseLabel": "Vrednost False",
	"beginTimeRangeLabel": "Začetek vrednosti časovnega obsega",
	"endTimeRangeLabel": "Konec vrednosti časovnega obsega",
	"beginDateRangeLabel": "Začetek vrednosti datumskega obsega",
	"endDateRangeLabel": "Konec vrednosti datumskega obsega",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "Posamezno razvrščanje",
	nestedSort: "Ugnezdeno razvrščanje",
	ascending: "Kliknite za naraščajoče razvrščanje",
	descending: "Kliknite za padajoče razvrščanje",
	sortingState: "${0} - ${1}",
	unsorted: "Ne razvrščaj tega stolpca",
	waiSingleSortLabel: "${0} – je razvrščeno po ${1}. Izberite, če želite razvrščati po ${2}",
	waiNestedSortLabel:"${0} – je ugnezdeno razvrščeno po ${1}. Izberite, če želite ugnezdeno razvrščati po ${2}",

//PaginationBar
	pagerWai: 'Pozivnik',

	pageIndex: '${0}',
	pageIndexTitle: 'Stran ${0}',

	firstPageTitle: 'Prva stran',
	prevPageTitle: 'Prejšnja stran',
	nextPageTitle: 'Naslednja stran',
	lastPageTitle: 'Zadnja stran',

	pageSize: '${0}',
	pageSizeTitle: '${0} postavk na stran',
	pageSizeAll: 'Vse',
	pageSizeAllTitle: 'Vse postavke',

	description: '${0} – ${1} od ${2} postavk.',
	descriptionEmpty: 'Mreža je prazna.',

	summary: 'Skupaj: ${0}',
	summaryWithSelection: 'Skupaj: ${0} Izbrano: ${1}',

	gotoBtnTitle: 'Pojdi na določeno stran',

	gotoDialogTitle: 'Pojdi na stran',
	gotoDialogMainMsg: 'Določite številko strani:',
	gotoDialogPageCount: '(${0} strani)',
	gotoDialogOKBtn: 'Pojdi',
	gotoDialogCancelBtn: 'Prekliči',
	// for drop down pagination bar
	pageLabel: 'Stran',
	pageSizeLabel: 'Vrstice',

//QuickFilter
	filterLabel: 'Filter',
	clearButtonTitle: 'Počisti filter',
	buildFilterMenuLabel: 'Izgradi filter...',
	apply: 'Uveljavi filter',

//Sort
	helpMsg: '${0} - Kliknite za razvrščanje ali pa pritisnite ctrl in kliknite, da dodate v razvrščanje',
	singleHelpMsg: '${0} - Kliknite za razvrščanje',
	priorityOrder: 'razvrščanje prednosti ${0}',

//SummaryBar
	summaryTotal: 'Skupaj: ${0}',
	summarySelected: 'Izbrano: ${0}',
	summaryRange: 'Obseg: ${0}-${1}',	//need translation

//Other
	indirectSelectAll: "Pritisnite PRESLEDNICO, da izberete vse.",	//need translation
	indirectDeselectAll: "Pritisnite PRESLEDNICO, da prekličete izbiro vsega.",	//need translation
	treeExpanded: "Pritisnite Control + levo puščično tipko, da strnete to vrstico.",	//need translation
	treeCollapsed: "Pritisnite Control + desno puščično tipko, da razširite to vrstico."	//need translation
});

