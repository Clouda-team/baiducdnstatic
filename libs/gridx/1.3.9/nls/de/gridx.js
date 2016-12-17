define({     
//Body
	loadingInfo: "Laden...",
	emptyInfo: "Keine Elemente zum Anzeigen ",
	loadFailInfo: "Daten konnten nicht geladen werden!",
	loadMore: "Mehr laden",
	loadMoreLoading: "Laden...",
	loadPrevious: "Vorherige laden",
	loadPreviousLoading: "Laden...",

//FilterBar
	"clearFilterDialogTitle": "Filter löschen",
	"filterDefDialogTitle": "Filter",
	"defaultRuleTitle": "Regel",
	"ruleTitleTemplate": "Regel ${ruleNumber}",
	"noFilterApplied": "Kein Filter angewendet.",
	"defineFilter": "Filter definieren",
	"defineFilterAriaLabel": "Öffnet einen Filterdialog für die Konfiguration komplexer Filterregeln. Jede Filterregel setzt sich aus einer Kombination von Spalte, Bedingung und Wert zusammen. Nach dem Öffnen des Dialogs befindet sich der Tastaturfokus auf dem Wertfeld.",
	"conditionEqual": "gleich",
	"conditionNotEqual": "ist nicht gleich",
	"conditionLess": "ist kleiner als",
	"conditionLessEqual": "kleiner-gleich",
	"conditionGreater": "ist größer als",
	"conditionGreaterEqual": "größer-gleich",
	"conditionContain": "enthält",
	"conditionIs": "ist",
	"conditionStartWith": "beginnt mit",
	"conditionEndWith": "endet mit",
	"conditionNotContain": "enthält nicht",
	"conditionIsNot": "ist nicht",
	"conditionNotStartWith": "beginnt nicht mit",
	"conditionNotEndWith": "endet nicht mit",
	"conditionBefore": "vor",
	"conditionAfter": "nach",
	"conditionRange": "Bereich",
	"conditionIsEmpty": "ist leer",
	"conditionIsNotEmpty": "ist nicht leer",
	"all": "alle",
	"any": "jede",
	"relationAll": "Alle Regeln",
	"waiRelAll": "Muss mit allen folgenden Regeln übereinstimmen:",
	"relationAny": "Beliebige Regel",
	"waiRelAny": "Muss mit irgendeiner der folgenden Regeln übereinstimmen:",
	"relationMsgFront": "Übereinstimmen",
	"relationMsgTail": "",
	"and": "und",
	"or": "oder",
	"addRuleButton": "Regel hinzufügen",
	"waiAddRuleButton": "Neue Regel hinzufügen",
	"removeRuleButton": "Regel entfernen",
	"waiRemoveRuleButtonTemplate": "Regel ${0} entfernen",
	"addRuleButton": "Filterregel hinzufügen",
	"cancelButton": "Abbrechen",
	"waiCancelButton": "Diesen Dialog abbrechen",
	"clearButton": "Löschen",
	"waiClearButton": "Den Filter löschen",
	"filterButton": "Filter",
	"waiFilterButton": "Den Filter übergeben",
	"columnSelectLabel": "Spalte:",
	"columnSelectAriaLabel": "Spalte: Bedingungsteil ${0} von ${1}",
	"waiColumnSelectTemplate": "Spalte für Regel ${0}",

	"conditionSelectLabel": "Bedingung:",
	"conditionSelectAriaLabel": "Operator: Bedingungsteil ${0} von ${1}",
	"waiConditionSelectTemplate": "Bedingung für Regel ${0}",

	"valueBoxLabel": "Wert:",
	"valueBoxAriaLabel": "Wert: Bedingungsteil ${0} von ${1}",
	"waiValueBoxTemplate": "Filterwert für Regel ${0} eingeben",
	"rangeTo": "bis",
	"rangeTemplate": "von ${0} bis ${1}",
	"statusTipHeaderColumn": "Spalte",
	"statusTipHeaderCondition": "Regeln",
	"statusTipTitle": "Filterleiste",
	"statusTipMsg": "Hier auf die Filterleiste klicken, um nach den Werten in ${0} zu filtern.",
	"anycolumn": "Irgendeine Spalte",
	"statusTipTitleNoFilter": "Filterleiste",
	"statusTipTitleHasFilter": "Filter",
	"statusTipRelPre": "Übereinstimmen",
	"statusTipRelPost": "Regeln.",
	"statusTipHeaderAll": "Muss mit allen Regeln übereinstimmen.",
	"statusTipHeaderAny": "Muss mit irgendeiner Regel übereinstimmen.",
	"defaultItemsName": "Elemente",
	"filterBarMsgHasFilterTemplate": "${0} von ${1} ${2} angezeigt.",
	"filterBarMsgNoFilterTemplate": "Kein Filter angewendet",
	"filterBarDefButton": "Filter definieren",
	"waiFilterBarDefButton": "Tabelle filtern",
	"a11yFilterBarDefButton": "Filter...",
	"filterBarClearButton": "Filter löschen",
	"waiFilterBarClearButton": "Den Filter löschen",
	"closeFilterBarBtn": "Filterleiste schließen",
	"clearFilterMsg": "Hiermit wird der Filter entfernt und alle verfügbaren Sätze werden angezeigt.",
	"anyColumnOption": "Irgendeine Spalte",
	"trueLabel": "True",
	"falseLabel": "False",
	"radioTrueLabel": "Wert True",
	"radioFalseLabel": "Wert False",
	"beginTimeRangeLabel": "Zeitbereichswert Start",
	"endTimeRangeLabel": "Zeitbereichswert End",
	"beginDateRangeLabel": "Datumsbereichswert Start",
	"endDateRangeLabel": "Datumsbereichswert End",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "Einzeln sortieren",
	nestedSort: "Verschachtelt sortieren",
	ascending: "Klicken, um aufsteigend zu sortieren",
	descending: "Klicken, um absteigend zu sortieren",
	sortingState: "${0} - ${1}",
	unsorted: "Diese Spalte nicht sortieren",
	waiSingleSortLabel: "${0} - wird sortiert nach ${1}. Sortieren nach ${2}",
	waiNestedSortLabel:"${0} - wird verschachtelt sortiert nach ${1}. Verschachtelt sortieren nach ${2}",

//PaginationBar
	pagerWai: 'Pager',

	pageIndex: '${0}',
	pageIndexTitle: 'Seite ${0}',

	firstPageTitle: 'Erste Seite',
	prevPageTitle: 'Vorherige Seite',
	nextPageTitle: 'Nächste Seite',
	lastPageTitle: 'Letzte Seite',

	pageSize: '${0}',
	pageSizeTitle: '${0} Elemente pro Seite',
	pageSizeAll: 'Alle',
	pageSizeAllTitle: 'Alle Elemente',

	description: '${0} - ${1} von ${2} Elementen.',
	descriptionEmpty: 'Raster ist leer.',

	summary: 'Gesamt: ${0}',
	summaryWithSelection: 'Summe: ${0} Ausgewählt: ${1}',

	gotoBtnTitle: 'Zu einer bestimmten Seite wechseln',

	gotoDialogTitle: 'Gehe zu Seite',
	gotoDialogMainMsg: 'Seitenzahl angeben:',
	gotoDialogPageCount: '(${0} Seiten)',
	gotoDialogOKBtn: 'Gehe zu',
	gotoDialogCancelBtn: 'Abbrechen',
	// for drop down pagination bar
	pageLabel: 'Seite',
	pageSizeLabel: 'Zeilen',

//QuickFilter
	filterLabel: 'Filter',
	clearButtonTitle: 'Filter löschen',
	buildFilterMenuLabel: 'Filter erstellen…',
	apply: 'Filter anwenden',

//Sort
	helpMsg: '${0} - Klicken Sie zum Sortieren der Tabelle auf den Spaltennamen, oder klicken Sie bei gedrückter Steuertaste auf den Spaltennamen, um die Spalte der verschachtelten Sortierung hinzuzufügen.',
	singleHelpMsg: '${0} Klicken Sie zum Sortieren der Tabelle auf den Spaltennamen.',
	priorityOrder: 'Sortierpriorität ${0}',

//SummaryBar
	summaryTotal: 'Gesamt: ${0}',
	summarySelected: 'Ausgewählt: ${0}',
	summaryRange: 'Bereich: ${0}-${1}',	//need translation

//Other
	indirectSelectAll: "LEERSCHRITT drücken, um alles auszuwählen.",	//need translation
	indirectDeselectAll: "LEERSCHRITT drücken, um alles abzuwählen.",	//need translation
	treeExpanded: "Strg + Linkspfeiltaste, um diese Zeile auszublenden.",	//need translation
	treeCollapsed: "Strg + Rechtspfeiltaste, um diese Zeile einzublenden. "	//need translation
});

