require([
	'dojo/parser',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'dojo/store/JsonRest',
	'gridx/Grid',
	'gridx/allModules',
	'gridx/core/model/cache/Sync',
	'gridx/core/model/cache/Async',
	'gridx/allModules',
	'dojo/domReady!'
	
], function(parser, dataSource, storeFactory, JsonRest){
	jsonStore = new JsonRest({target: 'support/stores/test_grid_filterTree.php/'});
	
	jsonStore.getValues = function(item, attr){
		if(item && item[attr]){
			return item[attr];
		}
		return 0; 
	};
	
	jsonStore.hasChildren = function(id, item){
		return item && jsonStore.getValues(item, 'children').length;
	};

	jsonStore.getChildren = function(item, req){
		var children = jsonStore.getValues(item, 'children'),
			attr,
			t = this,		//store object
			sorts = req.sort;

		var sorting = function (a, b, index) {
			if (!sorts[index]) return 0;

			var attr = sorts[index].attribute;
			var va = t.getValue(a, attr);
			var vb = t.getValue(b, attr);

			if (va == vb) {
				return sorting(a, b, ++index);
			}
			return !sorts[index].descending ? (va > vb ? 1 : -1) : (va <= vb ? 1 : -1);
		}

		if (sorts && sorts.length) {
			children.sort(function(a, b) {
				return sorting(a, b, 0);
			});
		}

		return children;
	};

	layoutServerSide = [
		{id: 'id', field: 'id', name: 'Identity', dataType: 'number'},
		{id: 'Genre', field: 'Genre', name: 'Genre', dataType: 'string'},
		{id: 'Artist', field: 'Artist', name: 'Artist', dataType: 'string'},
		{id: 'Album', field: 'Album', name: 'Album', dataType: 'string'},
		{id: 'Name', field: 'Name', name: 'Name', dataType: 'string'},
		{id: 'Year', field: 'Year', name: 'Year', dataType: 'number'},
		{id: 'Length', field: 'Length', name: 'Length', dataType: 'string'},
		{id: 'Track', field: 'Track', name: 'Track', dataType: 'number'},
		{id: 'Composer', field: 'Composer', name: 'Composer', dataType: 'string'},
		{id: 'Download Date', field: 'Download Date', name: 'Download Date', dataType: 'date'},
		{id: 'Last Played', field: 'Last Played', name: 'Last Played', dataType: 'time'},
		{id: 'Heard', field: 'Heard', name: 'Heard', dataType: 'boolean'}
	];

	parser.parse();
});
