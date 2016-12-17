require([
	'dojo/parser',
	'dojo/_base/sniff',
	'dojo/_base/Deferred',
	'gridx/tests/support/data/TreeColumnarTestData',
	'gridx/tests/support/data/TreeNestedTestData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/allModules',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/core/model/cache/Async',
	'dijit/ProgressBar',
	'dijit/form/NumberTextBox',
	'dojo/domReady!'
], function(parser, has, Deferred, dataSource, nestedDataSource, storeFactory, modules){

	store = storeFactory({
		dataSource: dataSource, 
		maxLevel: 4,
		tree: true,
		maxChildrenCount: 10,
		minChildrenCount: 10
	});

	storeAsync = storeFactory({
		isAsync: true,
		dataSource: dataSource, 
		maxLevel: 4,
		maxChildrenCount: 10
	});
	storeAsync.hasChildren = function(id, item){
		return item && storeAsync.getValues(item, 'children').length;
	};
	storeAsync.getChildren = function(item){
		var d = new Deferred();
		console.log('getChildren: ', storeAsync.getIdentity(item));
		setTimeout(function(){
			var children = storeAsync.getValues(item, 'children');
			d.callback(children);
		}, 1000);
		return d;
	};

	storeNested = storeFactory({
		dataSource: nestedDataSource, 
		maxLevel: 4,
		maxChildrenCount: 10
	});
	storeNested.hasChildren = function(id, item){
		return item && storeNested.getValues(item, 'children').length;
	};
	storeNested.getChildren = function(item){
		var d = new Deferred();
		setTimeout(function(){
			var children = storeNested.getValues(item, 'children');
			d.callback(children);
		}, 1000);
		return d;
	};

	var progressDecorator = function(){
		return [
			"<div data-dojo-type='dijit.ProgressBar' data-dojo-props='maximum: 10000' ",
			"class='gridxHasGridCellValue' style='width: 100%;'></div>"
		].join('');
	};

	layout1 = [
		//Anything except natual number (1, 2, 3...) means all levels are expanded in this column.
		{id: 'number', name: 'number', field: 'number',
			expandLevel: 'all',
//            width: '200px',
			widgetsInCell: true,
			decorator: progressDecorator,
			editable: true,
			editor: 'dijit/form/NumberTextBox'
		},
		{id: 'id', name: 'id', field: 'id'},
		{id: 'string', name: 'string', field: 'string'},
		{id: 'date', name: 'date', field: 'date'},
		{id: 'time', name: 'time', field: 'time'},
		{id: 'bool', name: 'bool', field: 'bool'}
	];

	parser.parse();
});
