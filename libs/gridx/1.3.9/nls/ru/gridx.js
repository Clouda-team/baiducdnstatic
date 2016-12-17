define({     
//Body
	loadingInfo: "Загрузка...",
	emptyInfo: "Нет элементов для показа",
	loadFailInfo: "Не удалось загрузить данные!",
	loadMore: "Загрузить еще",
	loadMoreLoading: "Загрузка...",
	loadPrevious: "Загрузить предыдущие",
	loadPreviousLoading: "Загрузка...",

//FilterBar
	"clearFilterDialogTitle": "Очистить фильтр",
	"filterDefDialogTitle": "Фильтр",
	"defaultRuleTitle": "Правило",
	"ruleTitleTemplate": "Правило ${ruleNumber}",
	"noFilterApplied": "Никакой фильтр не применен.",
	"defineFilter": "Определить фильтр",
	"defineFilterAriaLabel": "Определить фильтр: открывает диалоговое окно фильтра для конфигурирования сложных правил фильтров. Каждое правило фильтра состоит из сочетания столбца, условия и значения. При открытии диалогового окна фокус клавиатуры находится на поле значения.",
	"conditionEqual": "равно",
	"conditionNotEqual": "не равно",
	"conditionLess": "меньше чем",
	"conditionLessEqual": "меньше или равно",
	"conditionGreater": "больше чем",
	"conditionGreaterEqual": "больше или равно",
	"conditionContain": "содержит",
	"conditionIs": "является",
	"conditionStartWith": "начинается с",
	"conditionEndWith": "заканчивается на",
	"conditionNotContain": "не содержит",
	"conditionIsNot": "не",
	"conditionNotStartWith": "не начинается с",
	"conditionNotEndWith": "не оканчивается на",
	"conditionBefore": "до",
	"conditionAfter": "после",
	"conditionRange": "диапазон",
	"conditionIsEmpty": "пусто",
	"conditionIsNotEmpty": "не пусто",
	"all": "все",
	"any": "любой",
	"relationAll": "все правила",
	"waiRelAll": "Отвечает всем следующим правилам:",
	"relationAny": "любое правило",
	"waiRelAny": "Отвечает любому из следующих правил:",
	"relationMsgFront": "Соответствие",
	"relationMsgTail": "",
	"and": "до",
	"or": "или",
	"addRuleButton": "Добавить правило",
	"waiAddRuleButton": "Добавить новое правило",
	"removeRuleButton": "Удалить правило",
	"waiRemoveRuleButtonTemplate": "Удалить правило ${0}",
	"addRuleButton": "Добавить правило фильтра",
	"cancelButton": "Отмена",
	"waiCancelButton": "Отменить этот диалог",
	"clearButton": "Очистить",
	"waiClearButton": "Очистить фильтр",
	"filterButton": "Фильтр",
	"waiFilterButton": "Передать фильтр",
	"columnSelectLabel": "Столбец:",
	"columnSelectAriaLabel": "Столбец: часть условия ${0} из ${1}",
	"waiColumnSelectTemplate": "Столбец для правила ${0}",

	"conditionSelectLabel": "Условие:",
	"conditionSelectAriaLabel": "Оператор: часть условия ${0} из ${1}",
	"waiConditionSelectTemplate": "Условие для правила ${0}",

	"valueBoxLabel": "Значение:",
	"valueBoxAriaLabel": "Значение: часть условия ${0} из ${1}",
	"waiValueBoxTemplate": "Введите значение для фильтрации по правилу ${0}",
	"rangeTo": "по",
	"rangeTemplate": "От ${0} до ${1}",
	"statusTipHeaderColumn": "Столбец",
	"statusTipHeaderCondition": "Правила",
	"statusTipTitle": "Полоса фильтра",
	"statusTipMsg": "Щелкните по полосе фильтра здесь, чтобы отфильтровать значения в ${0}.",
	"anycolumn": "любой столбец",
	"statusTipTitleNoFilter": "Полоса фильтра",
	"statusTipTitleHasFilter": "Фильтр",
	"statusTipRelPre": "Соответствие",
	"statusTipRelPost": "правил.",
	"statusTipHeaderAll": "Отвечает всем правилам.",
	"statusTipHeaderAny": "Отвечает любым правилам.",
	"defaultItemsName": "элементов",
	"filterBarMsgHasFilterTemplate": "Показаны ${0} из ${1} ${2}.",
	"filterBarMsgNoFilterTemplate": "Никакой фильтр не применен",
	"filterBarDefButton": "Определить фильтр",
	"waiFilterBarDefButton": "Применить фильтр к таблице",
	"a11yFilterBarDefButton": "Фильтр...",
	"filterBarClearButton": "Очистить фильтр",
	"waiFilterBarClearButton": "Очистить фильтр",
	"closeFilterBarBtn": "Закрыть полосу фильтра",
	"clearFilterMsg": "Это удалит фильтр и покажет все доступные записи.",
	"anyColumnOption": "Любой столбец",
	"trueLabel": "True",
	"falseLabel": "False",
	"radioTrueLabel": "Значение True",
	"radioFalseLabel": "Значение False",
	"beginTimeRangeLabel": "Начало значения временного диапазона",
	"endTimeRangeLabel": "Конец значения временного диапазона",
	"beginDateRangeLabel": "Начало значения диапазона дат",
	"endDateRangeLabel": "Конец значения диапазона дат",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "Простая сортировка",
	nestedSort: "Вложенная сортировка",
	ascending: "Щелкните, чтобы отсортировать по возрастанию",
	descending: "Щелкните, чтобы отсортировать по убыванию",
	sortingState: "${0} - ${1}",
	unsorted: "Не сортировать этот столбец",
	waiSingleSortLabel: "${0} - отсортировано по ${1}. Выберите, чтобы отсортировать по ${2}",
	waiNestedSortLabel:"${0} - вложенно отсортировано по ${1}. Выберите, чтобы отсортировать вложенно по ${2}",

//PaginationBar
	pagerWai: 'Пейджер',

	pageIndex: '${0}',
	pageIndexTitle: 'Стр. ${0}',

	firstPageTitle: 'Первая страница',
	prevPageTitle: 'Предыдущая страница',
	nextPageTitle: 'Следующая страница',
	lastPageTitle: 'Последняя страница',

	pageSize: '${0}',
	pageSizeTitle: '${0} элем. на странице',
	pageSizeAll: 'Все',
	pageSizeAllTitle: 'Все элементы',

	description: '${0} - ${1} из ${2} элементов.',
	descriptionEmpty: 'Сетка пуста.',

	summary: 'Всего: ${0}',
	summaryWithSelection: 'Всего: ${0} Выбрано: ${1}',

	gotoBtnTitle: 'Перейти на определенную страницу',

	gotoDialogTitle: 'Перейти на страницу',
	gotoDialogMainMsg: 'Укажите номер страницы:',
	gotoDialogPageCount: '(${0} стр.)',
	gotoDialogOKBtn: 'Перейти',
	gotoDialogCancelBtn: 'Отмена',
	// for drop down pagination bar
	pageLabel: 'Страница',
	pageSizeLabel: 'Строки',

//QuickFilter
	filterLabel: 'Фильтр',
	clearButtonTitle: 'Очистить фильтр',
	buildFilterMenuLabel: 'Собрать фильтр...',
	apply: 'Применить фильтр',

//Sort
	helpMsg: '${0} - Щелкните, чтобы отсортировать, или щелкните при нажатой клавише Ctrl, чтобы добавить к сортировке',
	singleHelpMsg: '${0} - Щелкните, чтобы отсортировать',
	priorityOrder: 'приоритет сортировки ${0}',

//SummaryBar
	summaryTotal: 'Всего: ${0}',
	summarySelected: 'Выбрано: ${0}',
	summaryRange: 'Диапазон: ${0}-${1}',	//need translation

//Other
	indirectSelectAll: "Нажмите пробел, чтобы выбрать все.",	//need translation
	indirectDeselectAll: "Нажмите пробел, чтобы отменить выбор всех.",	//need translation
	treeExpanded: "Нажмите Control и левую стрелку, чтобы свернуть эту строку.",	//need translation
	treeCollapsed: "Нажмите Control и правую стрелку, чтобы развернуть эту строку."	//need translation
});

