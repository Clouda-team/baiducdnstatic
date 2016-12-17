define({     
//Body
	loadingInfo: "Caricamento in corso...",
	emptyInfo: "Nessun elemento da visualizzare",
	loadFailInfo: "Impossibile caricare i dati!",
	loadMore: "Carica altro",
	loadMoreLoading: "Caricamento in corso...",
	loadPrevious: "Carica il precedente",
	loadPreviousLoading: "Caricamento in corso...",

//FilterBar
	"clearFilterDialogTitle": "Cancella filtro",
	"filterDefDialogTitle": "Filtra",
	"defaultRuleTitle": "Regola",
	"ruleTitleTemplate": "Regola ${ruleNumber}",
	"noFilterApplied": "Nessun filtro applicato.",
	"defineFilter": "Definisci filtro",
	"defineFilterAriaLabel": "Definisci filtro: apre una finestra di dialogo del filtro per configurare regole di filtro complesse. Ciascuna regola di filtro è composta da una combinazione di colonna, condizione e valore. Quando si apre la finestra di dialogo, il campo del valore è attivo per l'immissione da tastiera. ",
	"conditionEqual": "uguale a",
	"conditionNotEqual": "diverso da",
	"conditionLess": "è minore di",
	"conditionLessEqual": "minore o uguale a",
	"conditionGreater": "è maggiore di",
	"conditionGreaterEqual": "maggiore o uguale a",
	"conditionContain": "contiene",
	"conditionIs": "è",
	"conditionStartWith": "inizia con",
	"conditionEndWith": "termina con",
	"conditionNotContain": "non contiene",
	"conditionIsNot": "non è",
	"conditionNotStartWith": "non inizia con",
	"conditionNotEndWith": "non termina con",
	"conditionBefore": "prima",
	"conditionAfter": "dopo",
	"conditionRange": "intervallo",
	"conditionIsEmpty": "è vuoto",
	"conditionIsNotEmpty": "non è vuoto",
	"all": "tutti",
	"any": "qualsiasi",
	"relationAll": "tutte le regole",
	"waiRelAll": "Corrisponde a tutte le regole riportate di seguito:",
	"relationAny": "qualsiasi regola",
	"waiRelAny": "Corrisponde a parte delle regole riportate di seguito:",
	"relationMsgFront": "Corrispondenza",
	"relationMsgTail": "",
	"and": "and",
	"or": "or",
	"addRuleButton": "Aggiungi regola",
	"waiAddRuleButton": "Aggiungi una nuova regola",
	"removeRuleButton": "Rimuovi regola",
	"waiRemoveRuleButtonTemplate": "Rimuovi regola ${0}",
	"addRuleButton": "Aggiungi regola filtro",
	"cancelButton": "Annulla",
	"waiCancelButton": "Annulla questa finestra di dialogo",
	"clearButton": "Cancella",
	"waiClearButton": "Cancella il filtro",
	"filterButton": "Filtra",
	"waiFilterButton": "Inoltra il filtro",
	"columnSelectLabel": "Colonna:",
	"columnSelectAriaLabel": "Colonna: parte condizione ${0} di ${1}",
	"waiColumnSelectTemplate": "Colonna per la regola ${0}",

	"conditionSelectLabel": "Condizione:",
	"conditionSelectAriaLabel": "Operatore: parte condizione ${0} di ${1}",
	"waiConditionSelectTemplate": "Condizione per la regola ${0}",

	"valueBoxLabel": "Valore:",
	"valueBoxAriaLabel": "Valore: parte condizione ${0} di ${1}",
	"waiValueBoxTemplate": "Immettere il valore in base a cui filtrare la regola ${0}",
	"rangeTo": "a",
	"rangeTemplate": "da ${0} a ${1}",
	"statusTipHeaderColumn": "Colonna",
	"statusTipHeaderCondition": "Regole",
	"statusTipTitle": "Barra del filtro",
	"statusTipMsg": "Fare clic qui sulla barra del filtro per filtrare i valori in ${0}.",
	"anycolumn": "qualsiasi colonna",
	"statusTipTitleNoFilter": "Barra del filtro",
	"statusTipTitleHasFilter": "Filtra",
	"statusTipRelPre": "Corrispondenza",
	"statusTipRelPost": "regole.",
	"statusTipHeaderAll": "Corrisponde a tutte le regole.",
	"statusTipHeaderAny": "Corrisponde a qualsiasi regola.",
	"defaultItemsName": "elementi",
	"filterBarMsgHasFilterTemplate": "Visualizzato ${0} di ${1} ${2}.",
	"filterBarMsgNoFilterTemplate": "Nessun filtro applicato",
	"filterBarDefButton": "Definisci filtro",
	"waiFilterBarDefButton": "Filtra la tabella",
	"a11yFilterBarDefButton": "Filtra...",
	"filterBarClearButton": "Cancella filtro",
	"waiFilterBarClearButton": "Cancella il filtro",
	"closeFilterBarBtn": "Chiudi barra del filtro",
	"clearFilterMsg": "Questa operazione rimuoverà il filtro e mostrerà tutti i record disponibili.",
	"anyColumnOption": "Qualsiasi colonna",
	"trueLabel": "True",
	"falseLabel": "False",
	"radioTrueLabel": "Valore True",
	"radioFalseLabel": "Valore False",
	"beginTimeRangeLabel": "Valore iniziale intervallo di tempo",
	"endTimeRangeLabel": "Valore finale intervallo di tempo",
	"beginDateRangeLabel": "Valore iniziale intervallo di date",
	"endDateRangeLabel": "Valore finale intervallo di date",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "Singolo ordinamento",
	nestedSort: "Ordinamento nidificato",
	ascending: "Fare clic per applicare ordinamento crescente",
	descending: "Fare clic per applicare ordinamento decrescente",
	sortingState: "${0} - ${1}",
	unsorted: "Non ordinare questa colonna",
	waiSingleSortLabel: "${0} - è ordinato in base a ${1}. Scegliere un ordinamento in base a ${2}",
	waiNestedSortLabel:"${0} - è ordinati in modo nidificato in base a ${1}. Scegliere un ordinamento nidificato in base a ${2}",

//PaginationBar
	pagerWai: 'Pager',

	pageIndex: '${0}',
	pageIndexTitle: 'Pagina ${0}',

	firstPageTitle: 'Prima pagina',
	prevPageTitle: 'Pagina precedente',
	nextPageTitle: 'Pagina successiva',
	lastPageTitle: 'Ultima pagina',

	pageSize: '${0}',
	pageSizeTitle: '${0} elementi per pagina',
	pageSizeAll: 'Tutti',
	pageSizeAllTitle: 'Tutti gli elementi',

	description: '${0} - ${1} di ${2} elementi.',
	descriptionEmpty: 'La griglia è vuota.',

	summary: 'Totale: ${0}',
	summaryWithSelection: 'Totale: ${0} Selezionato: ${1}',

	gotoBtnTitle: 'Vai ad una pagina specifica',

	gotoDialogTitle: 'Vai alla pagina',
	gotoDialogMainMsg: 'Specificare il numero di pagina:',
	gotoDialogPageCount: '(${0} pagine)',
	gotoDialogOKBtn: 'Vai',
	gotoDialogCancelBtn: 'Annulla',
	// for drop down pagination bar
	pageLabel: 'Pagina',
	pageSizeLabel: 'Righe',

//QuickFilter
	filterLabel: 'Filtra',
	clearButtonTitle: 'Cancella filtro',
	buildFilterMenuLabel: 'Crea filtro...',
	apply: 'Applica filtro',

//Sort
	helpMsg: '${0} - Fare clic per ordinare oppure control-clic per aggiungere l\'ordinamento',
	singleHelpMsg: '${0} - Fare clic per ordinare',
	priorityOrder: 'priorità di ordinamento ${0}',

//SummaryBar
	summaryTotal: 'Totale: ${0}',
	summarySelected: 'Selezionato: ${0}',
	summaryRange: 'Intervallo: ${0}-${1}',	//need translation

//Other
	indirectSelectAll: "Premere SPAZIO per selezionare tutto.",	//need translation
	indirectDeselectAll: "Premere SPAZIO per deselezionare tutto.",	//need translation
	treeExpanded: "Utilizzare Control + tasto freccia verso sinistra per comprimere questa riga.",	//need translation
	treeCollapsed: "Utilizzare Control + tasto freccia verso destra per espandere questa riga."	//need translation
});

