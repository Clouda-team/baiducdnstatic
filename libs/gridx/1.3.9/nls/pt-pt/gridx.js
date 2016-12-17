define({     
//Body
	loadingInfo: "A carregar...",
	emptyInfo: "Não existem artigos a apresentar",
	loadFailInfo: "Falha ao carregar dados!",
	loadMore: "Carregar Mais",
	loadMoreLoading: "A carregar...",
	loadPrevious: "Carregar Anterior",
	loadPreviousLoading: "A carregar...",

//FilterBar
	"clearFilterDialogTitle": "Limpar filtro",
	"filterDefDialogTitle": "Filtro",
	"defaultRuleTitle": "Regra",
	"ruleTitleTemplate": "Regra ${ruleNumber}",
	"noFilterApplied": "Nenhum filtro aplicado.",
	"defineFilter": "Definir filtro",
	"defineFilterAriaLabel": "Definir filtro: Abre uma caixa de diálogo de filtro para configurar regra de filtragem complexas. Cada regra de filtragem é composta de uma combinação de colunas, condições e valores. Quando a caixa de diálogo se abre, o campo de valor tem o foco do teclado.",
	"conditionEqual": "igual",
	"conditionNotEqual": "não é igual",
	"conditionLess": "é inferior a",
	"conditionLessEqual": "é inferior ou igual a",
	"conditionGreater": "é superior a",
	"conditionGreaterEqual": "é superior ou igual a",
	"conditionContain": "contém",
	"conditionIs": "é",
	"conditionStartWith": "começa com",
	"conditionEndWith": "termina com",
	"conditionNotContain": "não contém",
	"conditionIsNot": "não é",
	"conditionNotStartWith": "não começa com",
	"conditionNotEndWith": "não termina com",
	"conditionBefore": "antes",
	"conditionAfter": "depois",
	"conditionRange": "intervalo",
	"conditionIsEmpty": "está vazio",
	"conditionIsNotEmpty": "não está vazio",
	"all": "todas",
	"any": "qualquer",
	"relationAll": "todas as regras",
	"waiRelAll": "Corresponder a todas as regras seguintes:",
	"relationAny": "qualquer regra",
	"waiRelAny": "Corresponder a qualquer das regras seguintes:",
	"relationMsgFront": "Corresponder",
	"relationMsgTail": "",
	"and": "e",
	"or": "ou",
	"addRuleButton": "Adicionar regra",
	"waiAddRuleButton": "Adicionar uma nova regra",
	"removeRuleButton": "Remover Regra",
	"waiRemoveRuleButtonTemplate": "Remover regra ${0}",
	"addRuleButton": "Adicionar Regra de Filtro",
	"cancelButton": "Cancelar",
	"waiCancelButton": "Cancelar esta caixa de diálogo",
	"clearButton": "Limpar",
	"waiClearButton": "Limpar o filtro",
	"filterButton": "Filtro",
	"waiFilterButton": "Submeter o filtro",
	"columnSelectLabel": "Coluna:",
	"columnSelectAriaLabel": "Coluna: parte ${0} de ${1} da condição",
	"waiColumnSelectTemplate": "Coluna para a regra ${0}",

	"conditionSelectLabel": "Condição:",
	"conditionSelectAriaLabel": "Operador: parte ${0} de ${1} da condição",
	"waiConditionSelectTemplate": "Condição para a regra ${0}",

	"valueBoxLabel": "Valor:",
	"valueBoxAriaLabel": "Valor: parte ${0} de ${1} da condição",
	"waiValueBoxTemplate": "Introduza o valor a filtrar para a regra ${0}",
	"rangeTo": "para",
	"rangeTemplate": "de ${0} para ${1}",
	"statusTipHeaderColumn": "Coluna",
	"statusTipHeaderCondition": "Regras",
	"statusTipTitle": "Barra de Filtros",
	"statusTipMsg": "Faça clique na barra de filtros aqui para filtrar valores em ${0}.",
	"anycolumn": "qualquer coluna",
	"statusTipTitleNoFilter": "Barra de Filtros",
	"statusTipTitleHasFilter": "Filtro",
	"statusTipRelPre": "Corresponder",
	"statusTipRelPost": "regras.",
	"statusTipHeaderAll": "Corresponder todas as regras.",
	"statusTipHeaderAny": "Corresponder quaisquer regras.",
	"defaultItemsName": "artigos",
	"filterBarMsgHasFilterTemplate": "${0} de ${1} ${2} apresentado(s).",
	"filterBarMsgNoFilterTemplate": "Nenhum filtro aplicado",
	"filterBarDefButton": "Definir filtro",
	"waiFilterBarDefButton": "Filtrar a tabela",
	"a11yFilterBarDefButton": "Filtrar...",
	"filterBarClearButton": "Limpar filtro",
	"waiFilterBarClearButton": "Limpar o filtro",
	"closeFilterBarBtn": "Fechar barra de filtros",
	"clearFilterMsg": "Esta acção irá remover o filtro e apresentar todos os registos disponíveis.",
	"anyColumnOption": "Qualquer Coluna",
	"trueLabel": "True",
	"falseLabel": "False",
	"radioTrueLabel": "Valor True",
	"radioFalseLabel": "Valor False",
	"beginTimeRangeLabel": "Início do Valor do Intervalo de Hora",
	"endTimeRangeLabel": "Final do Valor do Intervalo de Hora",
	"beginDateRangeLabel": "Início do Valor do Intervalo de Data",
	"endDateRangeLabel": "Final do Valor do Intervalo de Data",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "Ordenação Singular",
	nestedSort: "Ordenação Imbricada",
	ascending: "Faça clique para ordenar de forma Ascendente",
	descending: "Faça clique para ordenar de forma Descendente",
	sortingState: "${0} - ${1}",
	unsorted: "Não ordenar esta coluna",
	waiSingleSortLabel: "${0} - está ordenada por ${1}. Seleccione para ordenar por ${2}",
	waiNestedSortLabel:"${0} - está imbricada por ${1}. Seleccione para ordenar de forma imbricada por ${2}",

//PaginationBar
	pagerWai: 'Pager',

	pageIndex: '${0}',
	pageIndexTitle: 'Página ${0}',

	firstPageTitle: 'Primeira página',
	prevPageTitle: 'Página anterior',
	nextPageTitle: 'Página seguinte',
	lastPageTitle: 'Última página',

	pageSize: '${0}',
	pageSizeTitle: '${0} artigos por página',
	pageSizeAll: 'Tudo',
	pageSizeAllTitle: 'Todos os artigos',

	description: '${0} - ${1} de ${2} artigos.',
	descriptionEmpty: 'A grelha está vazia.',

	summary: 'Total: ${0}',
	summaryWithSelection: 'Total: ${0} Seleccionado(s): ${1}',

	gotoBtnTitle: 'Ir para uma página específica',

	gotoDialogTitle: 'Ir para Página',
	gotoDialogMainMsg: 'Especificar o número da página:',
	gotoDialogPageCount: '(${0} páginas)',
	gotoDialogOKBtn: 'Ir',
	gotoDialogCancelBtn: 'Cancelar',
	// for drop down pagination bar
	pageLabel: 'Página',
	pageSizeLabel: 'Filas',

//QuickFilter
	filterLabel: 'Filtro',
	clearButtonTitle: 'Limpar filtro',
	buildFilterMenuLabel: 'Compilar Filtro...',
	apply: 'Aplicar filtro',

//Sort
	helpMsg: '${0} - Faça clique para ordenar ou carregue na tecla Control e faça clique para adicionar a ordenação',
	singleHelpMsg: '${0} - Faça clique para ordenar',
	priorityOrder: 'prioridade de ordenação ${0}',

//SummaryBar
	summaryTotal: 'Total: ${0}',
	summarySelected: 'Seleccionado(s): ${0}',
	summaryRange: 'Intervalo: ${0}-${1}',	//need translation

//Other
	indirectSelectAll: "Prima Barra de Espaços para seleccionar tudo.",	//need translation
	indirectDeselectAll: "Prima Barra de Espaços para desmarcar tudo.",	//need translation
	treeExpanded: "Control + seta para a esquerda para contrair esta fila.",	//need translation
	treeCollapsed: "Control + seta para a direita para expandir esta fila."	//need translation
});

