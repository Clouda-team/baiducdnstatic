define({     
//Body
	loadingInfo: "Cargando...",
	emptyInfo: "No hay elementos para visualizar",
	loadFailInfo: "No se han podido cargar los datos.",
	loadMore: "Cargar más",
	loadMoreLoading: "Cargando...",
	loadPrevious: "Cargar anterior",
	loadPreviousLoading: "Cargando...",

//FilterBar
	"clearFilterDialogTitle": "Borrar filtro",
	"filterDefDialogTitle": "Filtrar",
	"defaultRuleTitle": "Regla",
	"ruleTitleTemplate": "Regla ${ruleNumber}",
	"noFilterApplied": "No se ha aplicado ningún filtro.",
	"defineFilter": "Definir filtro",
	"defineFilterAriaLabel": "Definir filtro: Abre un diálogo de filtro para configurar reglas de filtro complejas. Ca regla de filtro está formada por una combinación de columna, condición y valor. Cuando se abre el diálogo, el campo de valor está activado.",
	"conditionEqual": "igual que",
	"conditionNotEqual": "no es igual a",
	"conditionLess": "es menor que",
	"conditionLessEqual": "menor o igual que",
	"conditionGreater": "es mayor que",
	"conditionGreaterEqual": "mayor o igual que",
	"conditionContain": "contiene",
	"conditionIs": "es",
	"conditionStartWith": "comienza por",
	"conditionEndWith": "finaliza por",
	"conditionNotContain": "no contiene",
	"conditionIsNot": "no es",
	"conditionNotStartWith": "no comienza por",
	"conditionNotEndWith": "no termina en",
	"conditionBefore": "antes del",
	"conditionAfter": "después de",
	"conditionRange": "rango",
	"conditionIsEmpty": "está vacío",
	"conditionIsNotEmpty": "no está vacío",
	"all": "todo",
	"any": "cualquiera",
	"relationAll": "todas las reglas",
	"waiRelAll": "Correlacionar con todas las reglas siguientes:",
	"relationAny": "cualquier regla",
	"waiRelAny": "Correlacionar con cualquiera de las reglas siguientes:",
	"relationMsgFront": "Coincidencia",
	"relationMsgTail": "",
	"and": "y",
	"or": "o",
	"addRuleButton": "Añadir regla",
	"waiAddRuleButton": "Añadir una regla nueva",
	"removeRuleButton": "Eliminar regla",
	"waiRemoveRuleButtonTemplate": "Eliminar regla ${0}",
	"addRuleButton": "Añadir regla de filtro",
	"cancelButton": "Cancelar",
	"waiCancelButton": "Cancelar este diálogo",
	"clearButton": "Borrar",
	"waiClearButton": "Borrar el filtro",
	"filterButton": "Filtrar",
	"waiFilterButton": "Enviar el filtro",
	"columnSelectLabel": "Columna:",
	"columnSelectAriaLabel": "Columna: parte de condición ${0} de ${1}",
	"waiColumnSelectTemplate": "Columna para regla ${0}",

	"conditionSelectLabel": "Condición:",
	"conditionSelectAriaLabel": "Operador: parte de condición ${0} de ${1}",
	"waiConditionSelectTemplate": "Condición para regla ${0}",

	"valueBoxLabel": "Valor:",
	"valueBoxAriaLabel": "Valor: parte de condición ${0} de ${1}",
	"waiValueBoxTemplate": "Especificar valor para filtrar para regla ${0}",
	"rangeTo": "hasta",
	"rangeTemplate": "de ${0} a ${1}",
	"statusTipHeaderColumn": "Columna",
	"statusTipHeaderCondition": "Reglas",
	"statusTipTitle": "Barra de filtro",
	"statusTipMsg": "Pulse la barra de filtro aquí para filtrar según los valores en ${0}.",
	"anycolumn": "cualquier columna",
	"statusTipTitleNoFilter": "Barra de filtro",
	"statusTipTitleHasFilter": "Filtrar",
	"statusTipRelPre": "Coincidencia",
	"statusTipRelPost": "reglas.",
	"statusTipHeaderAll": "Correlacionar con todas las reglas.",
	"statusTipHeaderAny": "Correlacionar con cualquier regla.",
	"defaultItemsName": "elementos",
	"filterBarMsgHasFilterTemplate": "Se muestran ${0} de ${1} ${2}.",
	"filterBarMsgNoFilterTemplate": "No se ha aplicado ningún filtro",
	"filterBarDefButton": "Definir filtro",
	"waiFilterBarDefButton": "Filtrar la tabla",
	"a11yFilterBarDefButton": "Filtro...",
	"filterBarClearButton": "Borrar filtro",
	"waiFilterBarClearButton": "Borrar el filtro",
	"closeFilterBarBtn": "Cerra barra de filtro",
	"clearFilterMsg": "Esto eliminará el filtro y mostrará todos los registros disponibles.",
	"anyColumnOption": "Cualquier columna",
	"trueLabel": "Verdadero",
	"falseLabel": "Falso",
	"radioTrueLabel": "Valor verdadero",
	"radioFalseLabel": "Valor falso",
	"beginTimeRangeLabel": "Inicio de valores de rango de tiempo",
	"endTimeRangeLabel": "Fin de valores de rango de tiempo",
	"beginDateRangeLabel": "Inicio de valores de rango de fechas",
	"endDateRangeLabel": "Fin de valores de rango de fechas",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "Ordenación única",
	nestedSort: "Ordenación anidada",
	ascending: "Pulse para ordenar en sentido ascendente",
	descending: "Pulse para ordenar en sentido descendente",
	sortingState: "${0} - ${1}",
	unsorted: "No ordenar esta columna",
	waiSingleSortLabel: "${0} - está ordenado por ${1}. Elija ordenar por ${2}",
	waiNestedSortLabel:"${0} - está ordenado de forma anidada por ${1}. Elija ordenación anidada por ${2}",

//PaginationBar
	pagerWai: 'Paginador',

	pageIndex: '${0}',
	pageIndexTitle: 'Página ${0}',

	firstPageTitle: 'Primera página',
	prevPageTitle: 'Página anterior',
	nextPageTitle: 'Página siguiente',
	lastPageTitle: 'Última página',

	pageSize: '${0}',
	pageSizeTitle: '${0} elementos por página',
	pageSizeAll: 'Todo',
	pageSizeAllTitle: 'Todos los elementos',

	description: '${0} - ${1} de ${2} elementos.',
	descriptionEmpty: 'La cuadrícula está vacía.',

	summary: 'Total: ${0}',
	summaryWithSelection: 'Total: ${0} Seleccionados: ${1}',

	gotoBtnTitle: 'Ir a una página específica',

	gotoDialogTitle: 'Ir a la página',
	gotoDialogMainMsg: 'Especifique el número de página:',
	gotoDialogPageCount: '(${0} páginas)',
	gotoDialogOKBtn: 'Ir',
	gotoDialogCancelBtn: 'Cancelar',
	// for drop down pagination bar
	pageLabel: 'Página',
	pageSizeLabel: 'Filas',

//QuickFilter
	filterLabel: 'Filtrar',
	clearButtonTitle: 'Borrar filtro',
	buildFilterMenuLabel: 'Crear filtro...',
	apply: 'Aplicar filtro',

//Sort
	helpMsg: '${0} - Pulse para ordenar o realice pulsación+control para añadir a la ordenación',
	singleHelpMsg: '${0} - Pulse para ordenar',
	priorityOrder: 'prioridad de ordenación ${0}',

//SummaryBar
	summaryTotal: 'Total: ${0}',
	summarySelected: 'Seleccionados: ${0}',
	summaryRange: 'Rango: ${0}-${1}',	//need translation

//Other
	indirectSelectAll: "Pulse ESPACIO para seleccionar todo.",	//need translation
	indirectDeselectAll: "Pulse ESPACIO para deseleccionar todo.",	//need translation
	treeExpanded: "Control + flecha izquierda para contraer esta fila.",	//need translation
	treeCollapsed: "Control + fila derecha para expandir esta fila."	//need translation
});

