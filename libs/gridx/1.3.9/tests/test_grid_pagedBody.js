require([
	'dojo/parser',
	'gridx/tests/support/data/TestData',
//    'gridx/tests/support/data/TreeColumnarTestData',
	'gridx/tests/support/stores/ItemFileWriteStore',
//    'gridx/tests/support/stores/Memory',
//    'gridx/tests/support/stores/JsonRest',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/allModules',
	'gridx/modules/PagedBody',
	'gridx/modules/AutoPagedBody',
	'gridx/modules/TouchVScroller',
	'dojo/domReady!'
], function(parser, dataSource, storeFactory){

	store = storeFactory({
		isAsync: true,
		path: './support/stores',
		dataSource: dataSource,
		size: 100
//        maxLevel: 4,
//        maxChildrenCount: 10
	});
//    store.hasChildren = function(id, item){
//        return item && store.getValues(item, 'children').length;
//    };
//    store.getChildren = function(item){
//        return store.getValues(item, 'children');
//    };

	layout = [
		{id: 'id', name: 'id', field: 'id'},
		{id: 'number', name: 'number', field: 'number'},
		{id: 'string', name: 'string', field: 'string'}
//        {id: 'id', name: 'id', field: 'id', width: '300px'},
//        {id: 'number', name: 'number', field: 'number', width: '300px'},
//        {id: 'string', name: 'string', field: 'string', width: '300px'}
	];

	parser.parse();
});

function deleteRow(){
	grid.store.deleteItem(grid.row(grid.view.rootStart).item());
}
