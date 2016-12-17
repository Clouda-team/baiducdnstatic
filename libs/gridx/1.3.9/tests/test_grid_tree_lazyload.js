require([
	'dojo/parser',
	'dojo/_base/Deferred',
	'dojo/store/util/QueryResults',
	'dojo/store/util/SimpleQueryEngine',
	'gridx/tests/support/data/TreeColumnarTestData',
	'gridx/tests/support/stores/Memory',
	'gridx/allModules',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'dijit/ProgressBar',
	'dojo/domReady!'
], function(parser, Deferred, QueryResults, queryEngine, dataSource, storeFactory, modules){

	store = storeFactory({
		dataSource: dataSource,
		maxLevel: 2,
		maxChildrenCount: 200
	});
	store.hasChildren = function(id, item){
		return item && item.children && item.children.length;
	};
	store.getChildren = function(item, options){
		console.log('getChildren: ', store.getIdentity(item), options);
		var logger = document.getElementById('log');
		logger.innerHTML += [
			"Fetch children of row ", item.id,
			": from ", options.start, " to ", options.start + options.count,
			'\r\n'
		].join('');
		var children = QueryResults(queryEngine(options.query, options)(item.children));
		return children;
	};

	layout1 = [
		//Anything except natual number (1, 2, 3...) means all levels are expanded in this column.
		{id: 'id', name: 'id', field: 'id', expandLevel: 'all', width: '200px'},
		{id: 'number', name: 'number', field: 'number'},
		{id: 'string', name: 'string', field: 'string'},
		{id: 'date', name: 'date', field: 'date'},
		{id: 'time', name: 'time', field: 'time'},
		{id: 'bool', name: 'bool', field: 'bool'}
	];

	mods = [
		modules.Tree,
//        modules.Pagination,
//        modules.PaginationBar,
//        modules.ColumnResizer,
//        modules.ExtendedSelectRow,
//        modules.CellWidget,
//        modules.IndirectSelectColumn,
		modules.SingleSort,
		modules.VirtualVScroller
	];

	parser.parse();
});
