define({     
//Body
	loadingInfo: "Carregando...",
	emptyInfo: "Nenhum item para exibir",
	loadFailInfo: "Falha ao carregar dados!",
	loadMore: "Carregar Mais",
	loadMoreLoading: "Carregando...",
	loadPrevious: "Carregar Anterior",
	loadPreviousLoading: "Carregando...",

//FilterBar
	"clearFilterDialogTitle": "Limpar Filtro",
	"filterDefDialogTitle": "Filtro",
	"defaultRuleTitle": "Regra",
	"ruleTitleTemplate": "Regra ${ruleNumber}",
	"noFilterApplied": "Nenhum filtro aplicado.",
	"defineFilter": "Definir filtro",
	"defineFilterAriaLabel": "Definir filtro: abre um diálogo de filtro para a configuração de regras de filtragem complexas.Cada regra de filtragem é composta de uma combinação de coluna, condição e valor.Quando o diálogo é aberto, o campo de valor tem o foco do teclado.",
	"conditionEqual": "igual",
	"conditionNotEqual": "não é igual",
	"conditionLess": "é menor que",
	"conditionLessEqual": "menor ou igual a",
	"conditionGreater": "é maior que",
	"conditionGreaterEqual": "maior ou igual a",
	"conditionContain": "contém",
	"conditionIs": "é",
	"conditionStartWith": "inicia com",
	"conditionEndWith": "termina com",
	"conditionNotContain": "não contém",
	"conditionIsNot": "não é",
	"conditionNotStartWith": "não inicia com",
	"conditionNotEndWith": "não termina com",
	"conditionBefore": "antes",
	"conditionAfter": "após",
	"conditionRange": "intervalo",
	"conditionIsEmpty": "está vazio",
	"conditionIsNotEmpty": "não está vazio",
	"all": "todos",
	"any": "qualquer",
	"relationAll": "todas as regras",
	"waiRelAll": "Corresponder a todas as regras a seguir:",
	"relationAny": "qualquer regra",
	"waiRelAny": "Corresponder a uma das regras a seguir:",
	"relationMsgFront": "Corresponder",
	"relationMsgTail": "",
	"and": "e",
	"or": "ou",
	"addRuleButton": "Incluir Regra",
	"waiAddRuleButton": "Incluir uma nova regra",
	"removeRuleButton": "Remover Regra",
	"waiRemoveRuleButtonTemplate": "Remover regra ${0}",
	"addRuleButton": "Incluir Regra de Filtro",
	"cancelButton": "Cancelar",
	"waiCancelButton": "Cancelar este diálogo",
	"clearButton": "Limpar",
	"waiClearButton": "Limpar o filtro",
	"filterButton": "Filtro",
	"waiFilterButton": "Submeter o filtro",
	"columnSelectLabel": "Coluna:",
	"columnSelectAriaLabel": "Coluna: parte de condição ${0} de ${1}",
	"waiColumnSelectTemplate": "Coluna para regra ${0}",

	"conditionSelectLabel": "Condição:",
	"conditionSelectAriaLabel": "Operador: parte de condição ${0} de ${1}",
	"waiConditionSelectTemplate": "Condição para a regra ${0}",

	"valueBoxLabel": "Valor:",
	"valueBoxAriaLabel": "Valor: parte de condição ${0} de ${1}",
	"waiValueBoxTemplate": "Insira valor para filtrar para a regra ${0}",
	"rangeTo": "até",
	"rangeTemplate": "de ${0} até ${1}",
	"statusTipHeaderColumn": "Coluna",
	"statusTipHeaderCondition": "Regras",
	"statusTipTitle": "Barra de Filtro",
	"statusTipMsg": "Clique na barra de filtro aqui para filtrar valores em ${0}.",
	"anycolumn": "qualquer coluna",
	"statusTipTitleNoFilter": "Barra de Filtro",
	"statusTipTitleHasFilter": "Filtro",
	"statusTipRelPre": "Corresponder",
	"statusTipRelPost": "regras.",
	"statusTipHeaderAll": "Corresponder a todas as regras.",
	"statusTipHeaderAny": "Corresponder a quaisquer regras.",
	"defaultItemsName": "itens",
	"filterBarMsgHasFilterTemplate": "${0} de ${1} ${2} mostrado(s).",
	"filterBarMsgNoFilterTemplate": "Nenhum filtro aplicado",
	"filterBarDefButton": "Definir filtro",
	"waiFilterBarDefButton": "Filtrar a tabela",
	"a11yFilterBarDefButton": "Filtrar...",
	"filterBarClearButton": "Limpar filtro",
	"waiFilterBarClearButton": "Limpar o filtro",
	"closeFilterBarBtn": "Fechar a barra de filtro",
	"clearFilterMsg": "Isso removerá o filtro e mostrará todos os registros disponíveis.",
	"anyColumnOption": "Qualquer Coluna",
	"trueLabel": "Verdadeiro",
	"falseLabel": "Falso",
	"radioTrueLabel": "Valor Verdadeiro",
	"radioFalseLabel": "Valor Falso",
	"beginTimeRangeLabel": "Início do Valor do Intervalo de Tempo",
	"endTimeRangeLabel": "Final do Valor do Intervalo de Tempo",
	"beginDateRangeLabel": "Início do Valor do Intervalo de Datas",
	"endDateRangeLabel": "Final do Valor do Intervalo de Datas",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "Classificação Única",
	nestedSort: "Classificação Aninhada",
	ascending: "Clique para classificar Ascendente",
	descending: "Clique para classificar Descendente",
	sortingState: "${0} - ${1}",
	unsorted: "Não classificar esta coluna",
	waiSingleSortLabel: "${0} - é classificado por ${1}. Escolha classificar por ${2}",
	waiNestedSortLabel:"${0} - é classificação aninhada por ${1}. Escolha classificação aninhada por ${2}",

//PaginationBar
	pagerWai: 'Paginação',

	pageIndex: '${0}',
	pageIndexTitle: 'Página ${0}',

	firstPageTitle: 'Primeira página',
	prevPageTitle: 'Página anterior',
	nextPageTitle: 'Próxima página',
	lastPageTitle: 'Última página',

	pageSize: '${0}',
	pageSizeTitle: '${0} itens por página',
	pageSizeAll: 'Todos',
	pageSizeAllTitle: 'Todos os itens',

	description: '${0} - ${1} de ${2} itens.',
	descriptionEmpty: 'A grade está vazia.',

	summary: 'Total: ${0}',
	summaryWithSelection: 'Total: ${0} Selecionado: ${1}',

	gotoBtnTitle: 'Acessar uma página específica',

	gotoDialogTitle: 'Acessar Página',
	gotoDialogMainMsg: 'Especifique o número da página:',
	gotoDialogPageCount: '(${0} páginas)',
	gotoDialogOKBtn: 'Ir',
	gotoDialogCancelBtn: 'Cancelar',
	// for drop down pagination bar
	pageLabel: 'Página',
	pageSizeLabel: 'Linhas',

//QuickFilter
	filterLabel: 'Filtro',
	clearButtonTitle: 'Limpar Filtro',
	buildFilterMenuLabel: 'Construir Filtro...',
	apply: 'Aplicar Filtro',

//Sort
	helpMsg: '${0} - Clique para classificar ou control-clique para incluir para classificação',
	singleHelpMsg: '${0} - Clique para classificar',
	priorityOrder: 'prioridade de classificação ${0}',

//SummaryBar
	summaryTotal: 'Total: ${0}',
	summarySelected: 'Selecionado: ${0}',
	summaryRange: 'Intervalo: ${0}-${1}',	//need translation

//Other
	indirectSelectAll: "Pressione ESPAÇO para selecionar todos.",	//need translation
	indirectDeselectAll: "Pressione ESPAÇO para cancelar seleção de todos.",	//need translation
	treeExpanded: "Control + tecla de seta para a esquerda para reduzir esta linha.",	//need translation
	treeCollapsed: "Control + tecla de seta para a direita para expandir esta linha."	//need translation
});

