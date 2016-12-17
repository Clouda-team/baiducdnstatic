define({     
//Body
	loadingInfo: "Načítání...",
	emptyInfo: "Žádné položky k zobrazení",
	loadFailInfo: "Nepodařilo se načíst data.",
	loadMore: "Načíst další",
	loadMoreLoading: "Načítání...",
	loadPrevious: "Načíst předchozí",
	loadPreviousLoading: "Načítání...",

//FilterBar
	"clearFilterDialogTitle": "Vymazat filtr",
	"filterDefDialogTitle": "Filtr",
	"defaultRuleTitle": "Pravidlo",
	"ruleTitleTemplate": "Pravidlo ${ruleNumber}",
	"noFilterApplied": "Není použit žádný filtr.",
	"defineFilter": "Definovat filtr",
	"defineFilterAriaLabel": "Definovat filtr: Otevře otevřený filtru pro konfiguraci složitých pravidel filtru. Každé pravidlo filtru je tvořeno kombinací sloupce, podmínky a hodnoty. Při otevření dialogového okna má pole hodnoty fokus klávesnice.",
	"conditionEqual": "rovná se",
	"conditionNotEqual": "nerovná se",
	"conditionLess": "je menší než",
	"conditionLessEqual": "menší nebo rovno",
	"conditionGreater": "je větší než",
	"conditionGreaterEqual": "větší nebo rovno",
	"conditionContain": "obsahuje",
	"conditionIs": "je",
	"conditionStartWith": "začíná na",
	"conditionEndWith": "končí na",
	"conditionNotContain": "neobsahuje",
	"conditionIsNot": "není",
	"conditionNotStartWith": "nezačíná na",
	"conditionNotEndWith": "nekončí na",
	"conditionBefore": "před",
	"conditionAfter": "za",
	"conditionRange": "rozsah",
	"conditionIsEmpty": "je prázdné",
	"conditionIsNotEmpty": "není prázdné",
	"all": "vše",
	"any": "libovolné",
	"relationAll": "všechna pravidla",
	"waiRelAll": "Vyhovovat všem následujícím pravidlům:",
	"relationAny": "libovolné pravidlo",
	"waiRelAny": "Vyhovovat libovolnému z následujících pravidel:",
	"relationMsgFront": "Vyhovovat",
	"relationMsgTail": "",
	"and": "a",
	"or": "nebo",
	"addRuleButton": "Přidat pravidlo",
	"waiAddRuleButton": "Přidat nové pravidlo",
	"removeRuleButton": "Odebrat pravidlo",
	"waiRemoveRuleButtonTemplate": "Odebrat pravidlo ${0}",
	"addRuleButton": "Přidat pravidlo filtru",
	"cancelButton": "Storno",
	"waiCancelButton": "Zrušit toto dialogové okno",
	"clearButton": "Vymazat",
	"waiClearButton": "Vymazat filtr",
	"filterButton": "Filtr",
	"waiFilterButton": "Odeslat filtr",
	"columnSelectLabel": "Sloupec:",
	"columnSelectAriaLabel": "Sloupec: část podmínky ${0} z ${1}",
	"waiColumnSelectTemplate": "Sloupec pro pravidlo ${0}",

	"conditionSelectLabel": "Podmínka:",
	"conditionSelectAriaLabel": "Operátor: část podmínky ${0} z ${1}",
	"waiConditionSelectTemplate": "Podmínka pro pravidlo ${0}",

	"valueBoxLabel": "Hodnota:",
	"valueBoxAriaLabel": "Hodnota: část podmínky ${0} z ${1}",
	"waiValueBoxTemplate": "Zadejte filtrovanou hodnotu pro pravidlo ${0}",
	"rangeTo": "do",
	"rangeTemplate": "od ${0} do ${1}",
	"statusTipHeaderColumn": "Sloupec",
	"statusTipHeaderCondition": "Pravidla",
	"statusTipTitle": "Panel filtru",
	"statusTipMsg": "Klepnutím sem na panel filtru nastavíte filtrování na hodnoty v ${0}.",
	"anycolumn": "libovolný sloupec",
	"statusTipTitleNoFilter": "Panel filtru",
	"statusTipTitleHasFilter": "Filtr",
	"statusTipRelPre": "Vyhovovat",
	"statusTipRelPost": "pravidlům.",
	"statusTipHeaderAll": "Vyhovovat všem pravidlům.",
	"statusTipHeaderAny": "Vyhovovat libovolnému z pravidel.",
	"defaultItemsName": "položek",
	"filterBarMsgHasFilterTemplate": "Zobrazeno ${0} z ${1} ${2}.",
	"filterBarMsgNoFilterTemplate": "Není použit žádný filtr",
	"filterBarDefButton": "Definovat filtr",
	"waiFilterBarDefButton": "Filtrovat tabulku",
	"a11yFilterBarDefButton": "Filtr...",
	"filterBarClearButton": "Vymazat filtr",
	"waiFilterBarClearButton": "Vymazat filtr",
	"closeFilterBarBtn": "Zavřít panel filtru",
	"clearFilterMsg": "Tím odeberete filtr a zobrazíte všechny dostupné záznamy.",
	"anyColumnOption": "Libovolný sloupec",
	"trueLabel": "True",
	"falseLabel": "False",
	"radioTrueLabel": "Hodnota True",
	"radioFalseLabel": "Hodnota False",
	"beginTimeRangeLabel": "Počáteční hodnota rozsahu času",
	"endTimeRangeLabel": "Koncová hodnota rozsahu času",
	"beginDateRangeLabel": "Počáteční hodnota rozsahu dat",
	"endDateRangeLabel": "Koncová hodnota rozsahu dat",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "Jednoduché řazení",
	nestedSort: "Vnořené řazení",
	ascending: "Klepnutím nastavíte řazení vzestupně",
	descending: "Klepnutím nastavíte řazení sestupně",
	sortingState: "${0} - ${1}",
	unsorted: "Neřadit tento sloupec",
	waiSingleSortLabel: "${0} - řazeno podle ${1}. Zvolte řazení podle ${2}",
	waiNestedSortLabel:"${0} - řazeno vnořeně podle ${1}. Zvolte vnořené řazení podle ${2}",

//PaginationBar
	pagerWai: 'Stránkování',

	pageIndex: '${0}',
	pageIndexTitle: 'Stránka ${0}',

	firstPageTitle: 'První stránka',
	prevPageTitle: 'Předchozí stránka',
	nextPageTitle: 'Další stránka',
	lastPageTitle: 'Poslední stránka',

	pageSize: '${0}',
	pageSizeTitle: 'Počet položek na stránce: ${0}',
	pageSizeAll: 'Vše',
	pageSizeAllTitle: 'Všechny položky',

	description: '${0} - ${1} z ${2} položek.',
	descriptionEmpty: 'Mřížka je prázdná.',

	summary: 'Celkem: ${0}',
	summaryWithSelection: 'Celkem: ${0} Vybráno: ${1}',

	gotoBtnTitle: 'Přejít na určitou stránku',

	gotoDialogTitle: 'Přejít na stránku',
	gotoDialogMainMsg: 'Zadejte číslo stránky:',
	gotoDialogPageCount: '(${0} stránek)',
	gotoDialogOKBtn: 'Přejít',
	gotoDialogCancelBtn: 'Storno',
	// for drop down pagination bar
	pageLabel: 'Stránka',
	pageSizeLabel: 'Řádky',

//QuickFilter
	filterLabel: 'Filtr',
	clearButtonTitle: 'Vymazat filtr',
	buildFilterMenuLabel: 'Sestavit filtr…',
	apply: 'Použít filtr',

//Sort
	helpMsg: '${0}: Klepnutím položky seřadíte, klepnutím s podržením klávesy Ctrl můžete položky přidávat do řazení.',
	singleHelpMsg: '${0}: Klepnutím položky seřadíte.',
	priorityOrder: 'priorita řazení ${0}',

//SummaryBar
	summaryTotal: 'Celkem: ${0}',
	summarySelected: 'Vybráno: ${0}',
	summaryRange: 'Rozsah: ${0}-${1}',	//need translation

//Other
	indirectSelectAll: "Stisknutím mezerníku vyberte vše.",	//need translation
	indirectDeselectAll: "Stisknutím mezerníku zrušíte celý výběr.",	//need translation
	treeExpanded: "Ctrl + šipka vlevo sbalí tento řádek.",	//need translation
	treeCollapsed: "Ctrl + šipka vpravo rozbalí tento řádek."	//need translation
});

