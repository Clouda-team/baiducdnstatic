define({     
//Body
	loadingInfo: "Učitavanje...",
	emptyInfo: "Nema stavki za prikaz",
	loadFailInfo: "Učitavanje podataka nije uspjelo!",
	loadMore: "Učitaj više",
	loadMoreLoading: "Učitavanje...",
	loadPrevious: "Učitaj prethodno",
	loadPreviousLoading: "Učitavanje...",

//FilterBar
	"clearFilterDialogTitle": "Isprazni filter",
	"filterDefDialogTitle": "Filter",
	"defaultRuleTitle": "Pravilo",
	"ruleTitleTemplate": "Pravilo ${ruleNumber}",
	"noFilterApplied": "Nema primijenjenog filtera.",
	"defineFilter": "Definiranje filtera",
	"defineFilterAriaLabel": "Definiranje filtera: Otvara dijalog filtera za konfiguriranje kompleksnih pravila filtera. Svako pravilo filtera se sastoji od kombinacije stupca, uvjeta i vrijednosti. Kada se otvori dijalog, polje vrijednosti ima fokus tipkovnice.",
	"conditionEqual": "jednako",
	"conditionNotEqual": "nije jednako",
	"conditionLess": "manje od",
	"conditionLessEqual": "manje od ili jednako",
	"conditionGreater": "veće od",
	"conditionGreaterEqual": "veće od ili jednako",
	"conditionContain": "sadrži",
	"conditionIs": "je",
	"conditionStartWith": "počinje s",
	"conditionEndWith": "završava s",
	"conditionNotContain": "ne sadrži",
	"conditionIsNot": "nije",
	"conditionNotStartWith": "ne počinje s",
	"conditionNotEndWith": "ne završava s",
	"conditionBefore": "prije",
	"conditionAfter": "nakon",
	"conditionRange": "raspon",
	"conditionIsEmpty": "prazno",
	"conditionIsNotEmpty": "nije prazno",
	"all": "sve",
	"any": "bilo koje",
	"relationAll": "sva pravila",
	"waiRelAll": "Podudaranje sa svim sljedećim pravilima:",
	"relationAny": "bilo koje pravilo",
	"waiRelAny": "Podudaranje s bilo kojim od sljedećih pravila:",
	"relationMsgFront": "Podudaranje",
	"relationMsgTail": "",
	"and": "i",
	"or": "ili",
	"addRuleButton": "Dodaj pravilo",
	"waiAddRuleButton": "Dodaj novo pravilo",
	"removeRuleButton": "Ukloni pravilo",
	"waiRemoveRuleButtonTemplate": "Ukloni pravilo ${0}",
	"addRuleButton": "Dodaj pravilo filtera",
	"cancelButton": "Opoziv",
	"waiCancelButton": "Opozovi ovaj dijalog",
	"clearButton": "Isprazni",
	"waiClearButton": "Isprazni filter",
	"filterButton": "Filter",
	"waiFilterButton": "Predaj filter",
	"columnSelectLabel": "Stupac:",
	"columnSelectAriaLabel": "Stupac: dio uvjeta ${0} od ${1}",
	"waiColumnSelectTemplate": "Stupac za pravilo ${0}",

	"conditionSelectLabel": "Uvjet:",
	"conditionSelectAriaLabel": "Operator: dio uvjeta ${0} od ${1}",
	"waiConditionSelectTemplate": "Uvjet za pravilo ${0}",

	"valueBoxLabel": "Vrijednost:",
	"valueBoxAriaLabel": "Vrijednost: dio uvjeta ${0} od ${1}",
	"waiValueBoxTemplate": "Unesite vrijednost za filter pravila ${0}",
	"rangeTo": "do",
	"rangeTemplate": "od ${0} do ${1}",
	"statusTipHeaderColumn": "Stupac",
	"statusTipHeaderCondition": "Pravila",
	"statusTipTitle": "Traka filtera",
	"statusTipMsg": "Kliknite na traku filtera za filtriranje vrijednosti u ${0}.",
	"anycolumn": "bilo koji stupac",
	"statusTipTitleNoFilter": "Traka filtera",
	"statusTipTitleHasFilter": "Filter",
	"statusTipRelPre": "Podudaranje",
	"statusTipRelPost": "pravila.",
	"statusTipHeaderAll": "Podudaranje sa svim pravilima.",
	"statusTipHeaderAny": "Podudaranje s bilo kojim pravilima.",
	"defaultItemsName": "stavke",
	"filterBarMsgHasFilterTemplate": "${0} od ${1} ${2} prikazano.",
	"filterBarMsgNoFilterTemplate": "Nema primijenjenog filtera",
	"filterBarDefButton": "Definiranje filtera",
	"waiFilterBarDefButton": "Filtriraj tablicu",
	"a11yFilterBarDefButton": "Filter...",
	"filterBarClearButton": "Isprazni filter",
	"waiFilterBarClearButton": "Isprazni filter",
	"closeFilterBarBtn": "Zatvori traku filtera",
	"clearFilterMsg": "Filter će se ukloniti i prikazat će se svi dostupni slogovi.",
	"anyColumnOption": "Bilo koji stupac",
	"trueLabel": "Točno",
	"falseLabel": "Netočno",
	"radioTrueLabel": "Vrijednost je točna",
	"radioFalseLabel": "Vrijednost je netočna",
	"beginTimeRangeLabel": "Početna vrijednost raspona vremena",
	"endTimeRangeLabel": "Završna vrijednost raspona vremena",
	"beginDateRangeLabel": "Početna vrijednost raspona datuma",
	"endDateRangeLabel": "Završna vrijednost raspona datuma",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "Jedno sortiranje",
	nestedSort: "Ugniježđeno sortiranje",
	ascending: "Kliknite za uzlazno sortiranje",
	descending: "Kliknite za silazno sortiranje",
	sortingState: "${0} - ${1}",
	unsorted: "Nemoj sortirati ovaj stupac",
	waiSingleSortLabel: "${0} - se sortira po ${1}. Izaberite sortiranje po ${2}",
	waiNestedSortLabel:"${0} - se ugniježđeno sortira po ${1}. Izaberite ugniježđeno sortiranje po ${2}",

//PaginationBar
	pagerWai: 'Podjela u stranice',

	pageIndex: '${0}',
	pageIndexTitle: 'Stranica ${0}',

	firstPageTitle: 'Prva stranica',
	prevPageTitle: 'Prethodna stranica',
	nextPageTitle: 'Sljedeća stranica',
	lastPageTitle: 'Zadnja stranica',

	pageSize: '${0}',
	pageSizeTitle: '${0} stavki po stranici',
	pageSizeAll: 'Sve',
	pageSizeAllTitle: 'Sve stavke',

	description: '${0} - ${1} od ${2} stavki.',
	descriptionEmpty: 'Mreža je prazna.',

	summary: 'Ukupno: ${0}',
	summaryWithSelection: 'Ukupno: ${0} Izabrano: ${1}',

	gotoBtnTitle: 'Idi na određenu stranicu',

	gotoDialogTitle: 'Idi na stranicu',
	gotoDialogMainMsg: 'Navedite broj stranice:',
	gotoDialogPageCount: '(${0} stranica)',
	gotoDialogOKBtn: 'Idi',
	gotoDialogCancelBtn: 'Opoziv',
	// for drop down pagination bar
	pageLabel: 'Stranica',
	pageSizeLabel: 'Redova',

//QuickFilter
	filterLabel: 'Filter',
	clearButtonTitle: 'Isprazni filter',
	buildFilterMenuLabel: 'Kreiraj filter...',
	apply: 'Primijeni filter',

//Sort
	helpMsg: '${0} - Kliknite za sortiranje ili upotrijebite control-klik za dodavanje u sortiranje',
	singleHelpMsg: '${0} - Kliknite za sortiranje',
	priorityOrder: 'Prioritet sortiranja ${0}',

//SummaryBar
	summaryTotal: 'Ukupno: ${0}',
	summarySelected: 'Izabrano: ${0}',
	summaryRange: 'Raspon: ${0}-${1}',	//need translation

//Other
	indirectSelectAll: "Pritisnite razmaknicu da biste odabrali sve.",	//need translation
	indirectDeselectAll: "Pritisnite razmaknicu da biste odznačili sve.",	//need translation
	treeExpanded: "Control + tipka sa strelicom lijevo za smanjivanje ovog reda.",	//need translation
	treeCollapsed: "Control + tipka sa strelicom desno za proširivanje ovog reda."	//need translation
});

