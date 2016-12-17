require([
	'dojo/ready',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/data/TestData',
	'gridx/tests/support/data/TreeColumnarTestData',
	'gridx/tests/support/data/TreeNestedTestData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/stores/JsonRestStore',
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/stores/TreeJsonRestStore',
	'gridx/tests/support/stores/HugeStore',
	'gridx/allModules',
	'dojo/store/Memory',
	'dojo/store/JsonRest',
	'gridx/tests/support/GridConfig',
	'dijit/Menu',
	'dijit/MenuItem',
	'dijit/MenuSeparator',
	'dijit/PopupMenuItem',
	'dijit/CheckedMenuItem',
	'dojo/domReady!'
], function(ready, Grid,
	SyncCache, AsyncCache,
	musicData, testData, treeColumnarData, treeNestedData,
	itemStore, jsonStore, memoryStore, treeJsonStore, hugeStore,
	mods, Memory, JsonRest, GridConfig){

var treeStore = itemStore({
	dataSource: treeColumnarData,
	maxLevel: 3,
	maxChildrenCount: 10
});
treeStore.hasChildren = function(id, item){
	return item && treeStore.getValues(item, 'children').length;
};
treeStore.getChildren = function(item){
	return treeStore.getValues(item, 'children');
};

var stores = {
	"music store": {
		defaultCheck: true,
		store: itemStore({
			dataSource: musicData,
			size: 200
		}),
		layouts: {
			'layout 1': musicData.layouts[0],
			'layout 2': musicData.layouts[1]
		}
	},
	"test store": {
		store: memoryStore({
			dataSource: testData,
			size: 100
		}), 
		layouts: {
			'layout 1': testData.layouts[0],
			'layout 2': testData.layouts[1]
		}
	},
	"empty store": {
		store: memoryStore({
			dataSource: testData,
			size: 0
		}), 
		layouts: {
			'layout 1': testData.layouts[0],
			'layout 2': testData.layouts[1]
		}
	},
	"error store": {
		isServerSide: true,
		store: new JsonRest({}),
		layouts: {
			'layout 1': testData.layouts[0],
			'layout 2': testData.layouts[1]
		}
	},
	"server store": {
		isServerSide: true,
		store: jsonStore({
			path: './support/stores',
			size: 1000
		}),
		layouts: {
			'layout 1': testData.layouts[0],
			'layout 2': testData.layouts[1]
		},
		onChange: function(checked, cfg){
			if(checked){
				cfg.getHandle('cache', 'Asynchronous Cache').set('checked', true);
			}
		}
	},
	"huge server store": {
		isServerSide: true,
		store: hugeStore({
			path: './support/stores',
			size: 10000000
		}),
		layouts: {
			'layout 1': testData.layouts[1]
		},
		onChange: function(checked, cfg){
			if(checked){
				cfg.getHandle('cache', 'Asynchronous Cache').set('checked', true);
			}
			cfg.getHandle('attr', 'vScrollerLazy').set('checked', checked);
		}
	},
	"tree columnar store": {
		store: treeStore,
		layouts: {
			'layout 1': treeColumnarData.layouts[0]
		},
		onChange: function(checked, cfg){
			cfg.getHandle('mod', 'tree').set('checked', checked);
		}
	},
	"tree store nested": {
		store: itemStore({
			dataSource: treeNestedData,
			maxLevel: 3,
			maxChildrenCount: 10
		}),
		layouts: {
			'layout 1': treeNestedData.layouts[0]
		},
		onChange: function(checked, cfg){
			cfg.getHandle('mod', 'tree').set('checked', checked);
			cfg.getHandle('attr', 'treeNested').set('checked', checked);
		}
	}
//    'tree store country': {
//        store: itemStore({
//            dataSource: treeCountryData
//        }),
//        layouts: {
//            layout1: [
//                {id: '1', name: 'Name', field: 'name', expandField: 'children'},
//                {id: '2', name: 'Type', field: 'type'},
//                {id: '3', name: 'Adults', field: 'adults'},
//                {id: '4', name: 'Population', field: 'popnum'}
//            ]
//        }
//    }
};

var caches = {
	"Asynchronous Cache": {
		defaultCheck: true,
		cache: AsyncCache
	},
	"Synchronous Cache": {
		cache: SyncCache
	}
};

var gridAttrs = {
	cacheSize: {
		type: 'number',
		value: -1
	},
	pageSize: {
		type: 'number',
		value: 100
	},
	baseSort: {
		type: 'json',
		value: '[{attribute: "Genre", descending: true}]'
	},
	moveFieldDescending: {
		type: 'bool'
	},
	autoWidth: {
		type: 'bool'
	},
	autoHeight: {
		type: 'bool'
	},
	autoScrollMargin: {
		type: 'number',
		value: 40
	},
	headerHidden: {
		type: 'bool'
	},
	headerGroups: {
		type: 'json',
		value: '[{name: "group 1", children: 3}, {name: "group 2", children: 2}]'
	},
	bodyRowHoverEffect: {
		type: 'bool'
	},
	bodyStuffEmptyCell: {
		type: 'bool'
	},
	bodyRenderWholeRowOnSet: {
		type: 'bool'
	},
	bodyLoadingInfo: {
		type: 'string',
		value: "I am loading very hard......"
	},
	bodyLoadFailInfo: {
		type: 'string',
		value: "!! something is wrong !!"
	},
	bodyEmptyInfo: {
		type: 'string',
		value: "==EMPTY=="
	},
	bodyMaxPageCount: {
		type: 'number',
		value: 1
	},
	bodyPageSize: {
		type: 'number',
		value: 5
	},
	bodyLoadMoreLabel: {
		type: 'string',
		value: '===Next Page==='
	},
	bodyLoadPreviousLabel: {
		type: 'string',
		value: '===Previous Page==='
	},
	columnWidthDefault: {
		type: 'number',
		value: 50
	},
	columnWidthAutoResize: {
		type: 'bool'
	},
	moveColumnMoveSelected: {
		type: 'bool'
	},
	moveRowMoveSelected: {
		type: 'bool'
	},
	dndColumnDelay: {
		type: 'number',
		value: 1000
	},
	dndColumnEnabled: {
		type: 'bool'
	},
	dndColumnCanRearrange: {
		type: 'bool'
	},
	dndRowDelay: {
		type: 'number',
		value: 1000
	},
	dndRowEnabled: {
		type: 'bool'
	},
	dndRowCanRearrange: {
		type: 'bool'
	},
	vScrollerLazy: {
		type: 'bool'
	},
	vScrollerLazyTimeout: {
		type: 'number',
		value: 200
	},
	vScrollerBuffSize: {
		type: 'number',
		value: 5
	},
	columnResizerMinWidth: {
		type: 'number',
		value: 10
	},
	columnResizerDetectWidth: {
		type: 'number',
		value: 20
	},
	columnResizerStep: {
		type: 'number',
		value: 10
	},
	treeNested: {
		type: 'bool'
	},
	treeExpandoPadding: {
		type: 'number',
		value: 5
	},
	treeExpandLevel: {
		type: 'number',
		value: 1
	},
	columnLockCount: {
		type: 'number',
		value: 2
	},
	rowLockCount: {
		type: 'number',
		value: 2
	},
	hiddenColumnsInit: {
		type: 'json',
		value: '["1", "2"]'
	},
	dodUseAnimation: {
		type: 'bool'
	},
	dodDuration: {
		type: 'number',
		value: 300
	},
	dodDefaultShow: {
		type: 'bool'
	},
	dodShowExpando: {
		type: 'bool'
	},
	dodAutoClose: {
		type: 'bool'
	},
	cellWidgetBackupCount: {
		type: 'number',
		value: 0
	},
	sortInitialOrder: {
		type: 'json',
		value: '[{colId: "id", descending: true}]'
	},
	filterBarMaxRuleCount: {
		type: 'number',
		value:0
	},
	filterBarCloseButton:{
		type: 'bool',
		value: true
	},
	filterBarDefineFilterButton:{
		type: 'bool',
		value: true
	},
	filterBarTooltipDelay:{
		type: 'number',
		value: 300
	},
	filterBarRuleCountToConfirmClearFilter:{
		type: 'number',
		value: 2
	},
	filterBarItemsName: {
		type: 'string',
		value: 'things'
	},
	paginationInitialPage: {
		type: 'number',
		value: 0
	},
	paginationInitialPageSize: {
		type: 'number',
		value: 10
	},
	paginationBarVisibleSteppers: {
		type: 'number',
		value: 5
	},
	paginationBarSizeSeparator: {
		type: 'string',
		value: '|'
	},
	paginationBarPosition: {
		type: 'enum',
		values: {
			'top': 'top',
			'bottom': 'bottom'
		}
	},
	paginationBarSizes: {
		type: 'json',
		value: '[10, 20, 40, 80, 0]'
	},
	paginationBarDescription: {
		type: 'bool'
	},
	paginationBarSizeSwitch: {
		type: 'bool'
	},
	paginationBarStepper: {
		type: 'bool'
	},
	paginationBarGotoButton: {
		type: 'bool'
	},
	rowHeaderWidth: {
		type: 'string',
		value: '20px'
	},
	persistEnabled: {
		type: 'bool'
	},
	persistKey: {
		type: 'string',
		value: 'my-grid-persist'
	},
	indirectSelectAll: {
		type: 'bool'
	},
	indirectSelectWidth: {
		type: 'string',
		value: '40px'
	},
	indirectSelectPosition: {
		type: 'number',
		value: 2
	},
	selectRowTriggerOnCell: {
		type: 'bool'
	},
	selectRowTreeMode: {
		type: 'bool'
	},
	selectRowMultiple: {
		type: 'bool'
	},
	selectRowEnabled: {
		type: 'bool'
	},
	selectRowCanSwept: {
		type: 'bool'
	},
	selectRowHoldingCtrl: {
		type: 'bool'
	},
	selectRowHoldingShift: {
		type: 'bool'
	},
	selectColumnMultiple: {
		type: 'bool'
	},
	selectColumnEnabled: {
		type: 'bool'
	},
	selectColumnCanSwept: {
		type: 'bool'
	},
	selectColumnHoldingCtrl: {
		type: 'bool'
	},
	selectColumnHoldingShift: {
		type: 'bool'
	},
	selectCellEnabled: {
		type: 'bool'
	},
	selectCellMultiple: {
		type: 'bool'
	},
	selectCellCanSwept: {
		type: 'bool'
	},
	selectCellHoldingCtrl: {
		type: 'bool'
	},
	selectCellHoldingShift: {
		type: 'bool'
	}
};

var modelExts = {
    "Make formatted columns sortable": mods.FormatSort
};

var modules = {
	vScroller: {
		//defaultCheck: true,
		virtual: mods.VirtualVScroller,
		touch: mods.TouchVScroller
	},
	columnResizer: {
		'default': mods.ColumnResizer
	},
	persist: {
		'default': mods.Persist
	},
	sort: {
		single: mods.SingleSort,
		nested: mods.NestedSort
	},
	columnLock: {
		"default": mods.ColumnLock
	},
	rowLock: {
		"default": mods.RowLock
	},
	dod: {
		"default": mods.Dod
	},
	header: {
		"groups": mods.GroupHeader
	},
	headerMenu: {
		"default": mods.HeaderMenu
	},
	body: {
		"paged": mods.PagedBody
	},
	hiddenColumns: {
		"default": mods.HiddenColumns
	},
	rowHeader: {
		"defalt": mods.RowHeader
	},
	indirectSelection: {
		"as row header": mods.IndirectSelect,
		"as column": mods.IndirectSelectColumn
	},
	selectRow: {
		basic: mods.SelectRow,
		extended: mods.ExtendedSelectRow
	},
	selectColumn: {
		basic: mods.SelectColumn,
		extended: mods.ExtendedSelectColumn
	},
	selectCell: {
		basic: mods.SelectCell,
		extended: mods.ExtendedSelectCell
	},
	moveRow: {
		"default": mods.MoveRow
	},
	moveColumn: {
		"default": mods.MoveColumn
	},
	dndRow: {
		"default": mods.DndRow
	},
	dndColumn: {
		"default": mods.DndColumn
	},
	pagination: {
		"default": mods.Pagination
	},
	paginationBar: {
		"link button": mods.PaginationBar,
		"drop down": mods.PaginationBarDD
	},
	filter: {
		"default": mods.Filter
	},
	filterBar: {
		"default": mods.FilterBar
	},
	cellWidget: {
		"default": mods.CellWidget
	},
	edit: {
		"default": mods.Edit
	},
	tree: {
		"default": mods.Tree
	},
	menu: {
		"default": mods.Menu
	}
};

function createGrid(args){
	destroyGrid();
	args.id = 'grid';
	var t1 = new Date().getTime();
	window.grid = new Grid(args);
	var t2 = new Date().getTime();
	window.grid.placeAt('gridContainer');
	var t3 = new Date().getTime();
	window.grid.startup();
	var t4 = new Date().getTime();
	console.log('grid:', t2 - t1, t3 - t2, t4 - t3, ' total:', t4 - t1);
	document.getElementById('tutor').style.display = "none";
}

function destroyGrid(){
	if(window.grid){
		window.grid.destroy();
		window.grid = null;
	}
	document.getElementById('tutor').style.display = "";
}
ready(function(){
	var cfg = new GridConfig({
		stores:	stores,
		caches: caches,
		gridAttrs:	gridAttrs,
		modules:	modules,
		modelExts:	modelExts,
		onCreate:	createGrid,
		onDestroy:	destroyGrid
	}, 'gridConfig');
	cfg.startup();
});

});
