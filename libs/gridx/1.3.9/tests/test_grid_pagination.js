require([
	'dojo/parser',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/allModules',
	'dojo/domReady!'
], function(parser, dataSource, storeFactory){

	store = storeFactory({
		dataSource: dataSource,
		size: 100
	});

	layout = dataSource.layouts[7];

	first = function(){
		grid1.pagination.gotoPage(0);
	};
	last = function(){
		grid1.pagination.gotoPage(grid1.pagination.pageSize() - 1);
	};
	prev = function(){
		grid1.pagination.gotoPage(grid1.pagination.currentPage() - 1);
	};
	next = function(){
		grid1.pagination.gotoPage(grid1.pagination.currentPage() + 1);
	};

	parser.parse();
});
