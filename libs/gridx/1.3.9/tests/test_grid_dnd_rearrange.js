require([
	'dojo/parser',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/allModules',
	'dijit/form/Button',
	'dojo/domReady!'
], function(parser, dataSource, storeFactory){

	store = storeFactory({
		path: './support/stores',
		dataSource: dataSource,
		size: 100
	});

	layout = dataSource.layouts[0];

	parser.parse();
});
