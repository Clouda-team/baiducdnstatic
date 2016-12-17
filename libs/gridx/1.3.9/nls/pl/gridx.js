define({     
//Body
	loadingInfo: "Ładowanie...",
	emptyInfo: "Brak elementów do wyświetlenia",
	loadFailInfo: "Ładowanie danych nie powiodło się!",
	loadMore: "Załaduj następne",
	loadMoreLoading: "Ładowanie...",
	loadPrevious: "Załaduj poprzednie",
	loadPreviousLoading: "Ładowanie...",

//FilterBar
	"clearFilterDialogTitle": "Wyczyść filtr",
	"filterDefDialogTitle": "Filtr",
	"defaultRuleTitle": "Reguła",
	"ruleTitleTemplate": "Reguła ${ruleNumber}",
	"noFilterApplied": "Nie zastosowano filtru.",
	"defineFilter": "Zdefiniuj filtr",
	"defineFilterAriaLabel": "Zdefiniuj filtr: Otwiera okno dialogowe filtru służące do konfigurowania złożonych reguł filtrowania. Każda reguła jest kombinacją kolumny, warunku i wartości. Po otwarciu okna dialogowego pole wartości jest aktywne do wprowadzania z klawiatury.",
	"conditionEqual": "równe",
	"conditionNotEqual": "nierówne",
	"conditionLess": "mniejsze niż",
	"conditionLessEqual": "mniejsze lub równe",
	"conditionGreater": "większe niż",
	"conditionGreaterEqual": "większe lub równe",
	"conditionContain": "zawiera",
	"conditionIs": "jest",
	"conditionStartWith": "zaczyna się od",
	"conditionEndWith": "kończy się na",
	"conditionNotContain": "nie zawiera",
	"conditionIsNot": "nie jest",
	"conditionNotStartWith": "nie zaczyna się od",
	"conditionNotEndWith": "nie kończy się na",
	"conditionBefore": "przed",
	"conditionAfter": "po",
	"conditionRange": "zakres",
	"conditionIsEmpty": "jest puste",
	"conditionIsNotEmpty": "nie jest puste",
	"all": "wszystkie",
	"any": "dowolne",
	"relationAll": "wszystkie reguły",
	"waiRelAll": "Dopasuj do wszystkich poniższych reguł:",
	"relationAny": "dowolna reguła",
	"waiRelAny": "Dopasuj do dowolnej z poniższych reguł:",
	"relationMsgFront": "Dopasuj",
	"relationMsgTail": "",
	"and": "i",
	"or": "lub",
	"addRuleButton": "Dodaj regułę",
	"waiAddRuleButton": "Dodaj nową regułę",
	"removeRuleButton": "Usuń regułę",
	"waiRemoveRuleButtonTemplate": "Usuń regułę ${0}",
	"addRuleButton": "Dodaj regułę filtrowania",
	"cancelButton": "Anuluj",
	"waiCancelButton": "Anuluj to okno dialogowe",
	"clearButton": "Wyczyść",
	"waiClearButton": "Wyczyść filtr",
	"filterButton": "Filtruj",
	"waiFilterButton": "Wprowadź filtr",
	"columnSelectLabel": "Kolumna:",
	"columnSelectAriaLabel": "Kolumna: ${0} z ${1} części warunku",
	"waiColumnSelectTemplate": "Kolumna dla reguły ${0}",

	"conditionSelectLabel": "Warunek:",
	"conditionSelectAriaLabel": "Operator: ${0} z ${1} części warunku",
	"waiConditionSelectTemplate": "Warunek dla reguły ${0}",

	"valueBoxLabel": "Wartość:",
	"valueBoxAriaLabel": "Wartość: ${0} z ${1} części warunku",
	"waiValueBoxTemplate": "Wprowadź wartość do filtrowania dla reguły ${0}",
	"rangeTo": "do",
	"rangeTemplate": "od ${0} do ${1}",
	"statusTipHeaderColumn": "Kolumna",
	"statusTipHeaderCondition": "Reguły",
	"statusTipTitle": "Pasek filtru",
	"statusTipMsg": "Kliknij tutaj pasek filtru, aby filtrować wg wartości w ${0}.",
	"anycolumn": "dowolna kolumna",
	"statusTipTitleNoFilter": "Pasek filtru",
	"statusTipTitleHasFilter": "Filtr",
	"statusTipRelPre": "Dopasuj",
	"statusTipRelPost": "reguł(y).",
	"statusTipHeaderAll": "Dopasuj wszystkie reguły.",
	"statusTipHeaderAny": "Dopasuj dowolne reguły.",
	"defaultItemsName": "elem.",
	"filterBarMsgHasFilterTemplate": "Widoczne: ${0} z ${1} ${2}.",
	"filterBarMsgNoFilterTemplate": "Nie zastosowano filtru",
	"filterBarDefButton": "Zdefiniuj filtr",
	"waiFilterBarDefButton": "Filtruj tabelę",
	"a11yFilterBarDefButton": "Filtruj...",
	"filterBarClearButton": "Wyczyść filtr",
	"waiFilterBarClearButton": "Wyczyść filtr",
	"closeFilterBarBtn": "Zamknij pasek filtru",
	"clearFilterMsg": "Spowoduje to usunięcie filtru i wyświetlenie wszystkich dostępnych rekordów.",
	"anyColumnOption": "Dowolna kolumna",
	"trueLabel": "Prawda",
	"falseLabel": "Fałsz",
	"radioTrueLabel": "Wartość Prawda",
	"radioFalseLabel": "Wartość Fałsz",
	"beginTimeRangeLabel": "Początek zakresu godzin",
	"endTimeRangeLabel": "Koniec zakresu godzin",
	"beginDateRangeLabel": "Początek zakresu dat",
	"endDateRangeLabel": "Koniec zakresu dat",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "Pojedyncze sortowanie",
	nestedSort: "Zagnieżdżone sortowanie",
	ascending: "Kliknij, aby sortować rosnąco",
	descending: "Kliknij, aby sortować malejąco",
	sortingState: "${0} - ${1}",
	unsorted: "Nie sortuj tej kolumny",
	waiSingleSortLabel: "${0} - sortowanie wg ${1}. Wybierz, aby sortować wg ${2}",
	waiNestedSortLabel:"${0} - sortowanie zagnieżdżone wg ${1}. Wybierz, aby zastosować sortowanie zagnieżdżone wg ${2}",

//PaginationBar
	pagerWai: 'Strony',

	pageIndex: '${0}',
	pageIndexTitle: 'Strona ${0}',

	firstPageTitle: 'Pierwsza strona',
	prevPageTitle: 'Poprzednia strona',
	nextPageTitle: 'Następna strona',
	lastPageTitle: 'Ostatnia strona',

	pageSize: '${0}',
	pageSizeTitle: '${0} elem. na stronę',
	pageSizeAll: 'Wszystko',
	pageSizeAllTitle: 'Wszystkie elementy',

	description: '${0} - ${1} z ${2} elem.',
	descriptionEmpty: 'Tabela jest pusta.',

	summary: 'Razem: ${0}',
	summaryWithSelection: 'Razem: ${0} Wybrano: ${1}',

	gotoBtnTitle: 'Przejdź do konkretnej strony',

	gotoDialogTitle: 'Przejdź do strony',
	gotoDialogMainMsg: 'Określ numer strony:',
	gotoDialogPageCount: '(stron: ${0})',
	gotoDialogOKBtn: 'Przejdź',
	gotoDialogCancelBtn: 'Anuluj',
	// for drop down pagination bar
	pageLabel: 'Strona',
	pageSizeLabel: 'Wiersze',

//QuickFilter
	filterLabel: 'Filtr',
	clearButtonTitle: 'Wyczyść filtr',
	buildFilterMenuLabel: 'Zbuduj filtr...',
	apply: 'Zastosuj filtr',

//Sort
	helpMsg: '${0} - Kliknij, aby posortować, albo kliknij, przytrzymując klawisz Ctrl, aby dodać do sortowania',
	singleHelpMsg: '${0} - Kliknij, aby posortować',
	priorityOrder: 'priorytet sortowania: ${0}',

//SummaryBar
	summaryTotal: 'Razem: ${0}',
	summarySelected: 'Wybrane: ${0}',
	summaryRange: 'Zakres: ${0}-${1}',	//need translation

//Other
	indirectSelectAll: "Naciśnij SPACJĘ, aby wybrać wszystkie.",	//need translation
	indirectDeselectAll: "Naciśnij SPACJĘ, aby anulować wybór wszystkich.",	//need translation
	treeExpanded: "Control + strzałka w lewo zwija ten wiersz.",	//need translation
	treeCollapsed: "Control + strzałka w prawo rozwija ten wiersz."	//need translation
});

