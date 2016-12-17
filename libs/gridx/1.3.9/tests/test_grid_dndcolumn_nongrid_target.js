require([
	'dojo/parser',
	'dojo/_base/Deferred',
	'dojo/ready',
	'dojo/dom',
	'dojo/_base/array',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'dojo/dnd/Target',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/allModules',
	'dojo/domReady!'
], function(parser, Deferred, ready, dom, array, dataSource, storeFactory, dndTarget){

	store = storeFactory({
		path: './support/stores',
		dataSource: dataSource,
		size: 100
	});
	
	layout = dataSource.layouts[0];

	//--------------------------------------------
	var formTarget = new dndTarget("songForm", {
		accept: ['grid/columns'],
		onDropExternal: function(source, nodes, copy){
			dom.byId('draggedColumns').innerHTML = array.map(nodes, function(node){
				return node.getAttribute('columnid');
			}).join(', ');
		}
	});

	Deferred.when(parser.parse(), function(){
		//Fix FF not firing onmouseover during dragging.
		grid.dnd._dnd._fixFF(formTarget, 'songForm');
	});
});
