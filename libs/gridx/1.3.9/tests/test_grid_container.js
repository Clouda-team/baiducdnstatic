require([
	'dojo/parser',
	'dojo/_base/array',
	'dojo/_base/Deferred',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/allModules',
	'dijit/layout/BorderContainer',
	'dijit/layout/TabContainer',
	'dijit/layout/AccordionContainer',
	'dijit/layout/ContentPane',
	'dijit/TitlePane',
	'dojo/domReady!'
], function(parser, array, Deferred, Grid, Cache, dataSource, storeFactory, mods){
	window.store = storeFactory({
		dataSource: dataSource,
		size: 10
	});
	window.structure = dataSource.layouts[0];

	var createGrid = function(){
		return new Grid({
			store: window.store,
			structure: window.structure,
			cacheClass: Cache,
			//query: {Genre: 'E*'},
			modules: [
				mods.VirtualVScroller,
				mods.RowHeader,
				mods.IndirectSelect,
				mods.NestedSort,
				mods.ExtendedSelectRow,
				mods.ExtendedSelectColumn,
				mods.ExtendedSelectCell,
				mods.Filter,
				mods.FilterBar,
				mods.Pagination,
				mods.PaginationBar
			]
		});
	};

	Deferred.when(parser.parse(), function(){
		array.forEach(['centerPane', 'rightPane', 'bottomPane'], function(pane, i){
			dijit.byId(pane).set('content', createGrid());
		});
		array.forEach(new Array(5), function(a, i){
			dijit.byId('tabPane').addChild(new dijit.layout.ContentPane({
				title: "Tab " + (i + 1),
				content: createGrid()
			}));
		});
		array.forEach(new Array(3), function(a, i){
			dijit.byId('accPane').addChild(new dijit.layout.ContentPane({
				title: "Accordion " + (i + 1),
				content: createGrid()
			}));
		});
	});
});
