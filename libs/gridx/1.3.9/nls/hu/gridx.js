define({     
//Body
	loadingInfo: "Betöltés...",
	emptyInfo: "Nincsenek megjelenítendő elemek",
	loadFailInfo: "Az adatokat nem sikerült betölteni!",
	loadMore: "Továbbiak betöltése",
	loadMoreLoading: "Betöltés...",
	loadPrevious: "Előző betöltése",
	loadPreviousLoading: "Betöltés...",

//FilterBar
	"clearFilterDialogTitle": "Szűrő törlése",
	"filterDefDialogTitle": "Szűrő",
	"defaultRuleTitle": "Szabály",
	"ruleTitleTemplate": "${ruleNumber}. szabály",
	"noFilterApplied": "Nincs alkalmazott szűrő.",
	"defineFilter": "Szűrő meghatározása",
	"defineFilterAriaLabel": "Szűrő meghatározása: Megnyit egy szűrő párbeszédpanelt az összetett szűrőszabályok beállításához. Minden egyes szűrőszabály oszlop, feltétel és érték kombinációja. A párbeszédpanel megnyitásakor az érték mezőn van a billentyűzet fókusza.",
	"conditionEqual": "egyenlő",
	"conditionNotEqual": "nem egyenlő",
	"conditionLess": "kisebb",
	"conditionLessEqual": "kisebb vagy egyenlő",
	"conditionGreater": "nagyobb",
	"conditionGreaterEqual": "nagyobb vagy egyenlő",
	"conditionContain": "tartalmaz",
	"conditionIs": "azonos",
	"conditionStartWith": "következővel kezdődik",
	"conditionEndWith": "következőre végződik",
	"conditionNotContain": "nem tartalmaz",
	"conditionIsNot": "nem azonos",
	"conditionNotStartWith": "nem a következővel kezdődik",
	"conditionNotEndWith": "nem a következőre végződik",
	"conditionBefore": "előtt",
	"conditionAfter": "után",
	"conditionRange": "tartomány",
	"conditionIsEmpty": "üres",
	"conditionIsNotEmpty": "nem üres",
	"all": "mind",
	"any": "bármely",
	"relationAll": "minden szabály",
	"waiRelAll": "Az összes következő szabálynak megfelel:",
	"relationAny": "bármely szabály",
	"waiRelAny": "Bármely következő szabálynak megfelel:",
	"relationMsgFront": "Egyeztetés",
	"relationMsgTail": "",
	"and": "és",
	"or": "vagy",
	"addRuleButton": "Szabály hozzáadása",
	"waiAddRuleButton": "Új szabály hozzáadása",
	"removeRuleButton": "Szabály eltávolítása",
	"waiRemoveRuleButtonTemplate": "${0} szabály eltávolítása",
	"addRuleButton": "Szűrőszabály hozzáadása",
	"cancelButton": "Mégse",
	"waiCancelButton": "Párbeszédablak bezárása",
	"clearButton": "Törlés",
	"waiClearButton": "A szűrő törlése",
	"filterButton": "Szűrő",
	"waiFilterButton": "Szűrő elküldése",
	"columnSelectLabel": "Oszlop:",
	"columnSelectAriaLabel": "Oszlop: ${0} / ${1} feltétel rész",
	"waiColumnSelectTemplate": "A(z) ${0} szabály oszlopa",

	"conditionSelectLabel": "Feltétel:",
	"conditionSelectAriaLabel": "Operátor: ${0} / ${1} feltétel rész",
	"waiConditionSelectTemplate": "A(z) ${0} szabály feltétele",

	"valueBoxLabel": "Érték:",
	"valueBoxAriaLabel": "Érték: ${0} / ${1} feltétel rész",
	"waiValueBoxTemplate": "Adjon meg értéket a(z) ${0} szabály szűréséhez",
	"rangeTo": "vég",
	"rangeTemplate": "kezdet: ${0}, vég: ${1}",
	"statusTipHeaderColumn": "Oszlop",
	"statusTipHeaderCondition": "Szabályok",
	"statusTipTitle": "Szűrősáv",
	"statusTipMsg": "Kattintson ide a szűrősávon a(z) ${0} értékeire végzett szűréshez.",
	"anycolumn": "bármely oszlop",
	"statusTipTitleNoFilter": "Szűrősáv",
	"statusTipTitleHasFilter": "Szűrő",
	"statusTipRelPre": "Egyeztetés",
	"statusTipRelPost": "szabályokkal.",
	"statusTipHeaderAll": "Egyeztetés az összes szabállyal.",
	"statusTipHeaderAny": "Egyeztetés bármely szabállyal.",
	"defaultItemsName": "elem",
	"filterBarMsgHasFilterTemplate": "${0} / ${1} ${2} megjelenítve.",
	"filterBarMsgNoFilterTemplate": "Nincs alkalmazott szűrő",
	"filterBarDefButton": "Szűrő meghatározása",
	"waiFilterBarDefButton": "Táblázat szűrése",
	"a11yFilterBarDefButton": "Szűrés...",
	"filterBarClearButton": "Szűrő törlése",
	"waiFilterBarClearButton": "A szűrő törlése",
	"closeFilterBarBtn": "Szűrősáv bezárása",
	"clearFilterMsg": "Ez a művelet eltávolítja a szűrőt és minden elérhető rekordot megjelenít.",
	"anyColumnOption": "Bármely oszlop",
	"trueLabel": "Igaz",
	"falseLabel": "Hamis",
	"radioTrueLabel": "Igaz érték",
	"radioFalseLabel": "Hamis érték",
	"beginTimeRangeLabel": "Időtartomány-érték kezdete",
	"endTimeRangeLabel": "Időtartomány-érték vége",
	"beginDateRangeLabel": "Dátumtartomány-érték kezdete",
	"endDateRangeLabel": "Dátumtartomány-érték vége",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "Egyszeri rendezés",
	nestedSort: "Beágyazott rendezés",
	ascending: "Kattintson ide a növekvő sorrend szerinti rendezéshez",
	descending: "Kattintson ide a csökkenő sorrend szerinti rendezéshez",
	sortingState: "${0} - ${1}",
	unsorted: "Ne rendezze ezt az oszlopot",
	waiSingleSortLabel: "${0} - ${1} szerint van rendezve. Válassza ki a(z) ${2} szerinti rendezéshez",
	waiNestedSortLabel:"${0} - ${1} szerint van beágyazott módon rendezve. Válassza ki a(z) ${2} szerinti beágyazott rendezéshez",

//PaginationBar
	pagerWai: 'Lapozó',

	pageIndex: '${0}',
	pageIndexTitle: '${0}. oldal',

	firstPageTitle: 'Első oldal',
	prevPageTitle: 'Előző oldal',
	nextPageTitle: 'Következő oldal',
	lastPageTitle: 'Utolsó oldal',

	pageSize: '${0}',
	pageSizeTitle: '${0} elem oldalanként',
	pageSizeAll: 'Összes',
	pageSizeAllTitle: 'Összes elem',

	description: '${0} - ${1} / ${2} elem.',
	descriptionEmpty: 'A rács üres.',

	summary: 'Összesen: ${0}',
	summaryWithSelection: 'Összesen: ${0}, kiválasztva: ${1}',

	gotoBtnTitle: 'Ugrás egy adott oldalra',

	gotoDialogTitle: 'Ugrás oldalra',
	gotoDialogMainMsg: 'Adja meg az oldalszámot:',
	gotoDialogPageCount: '(${0} oldal)',
	gotoDialogOKBtn: 'Ugrás',
	gotoDialogCancelBtn: 'Mégse',
	// for drop down pagination bar
	pageLabel: 'Oldal',
	pageSizeLabel: 'Sorok',

//QuickFilter
	filterLabel: 'Szűrő',
	clearButtonTitle: 'Szűrő törlése',
	buildFilterMenuLabel: '... összeépítés-szűrő',
	apply: 'Szűrő alkalmazása',

//Sort
	helpMsg: '${0} - Kattintson ide a rendezéshez, vagy használja a Ctrl-kattintás kombinációt a rendezéshez hozzáadáshoz',
	singleHelpMsg: '${0} - Kattintson ide a rendezéshez',
	priorityOrder: 'rendezési prioritás: ${0}',

//SummaryBar
	summaryTotal: 'Összesen: ${0}',
	summarySelected: 'Kiválasztva: ${0}',
	summaryRange: 'Tartomány: ${0}-${1}',	//need translation

//Other
	indirectSelectAll: "Az összes kijelöléséhez nyomja meg a SZÓKÖZ gombot.",	//need translation
	indirectDeselectAll: "Az összes kijelölésének megszüntetéséhez nyomja meg a SZÓKÖZ gombot.",	//need translation
	treeExpanded: "A Control + balra mutató nyíl gombbal összehúzhatja ezt a sort.",	//need translation
	treeCollapsed: "A Control + jobbra mutató nyíl gombbal kibonthatja ezt a sort."	//need translation
});

