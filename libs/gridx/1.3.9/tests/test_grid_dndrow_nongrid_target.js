require([
	'dojo/_base/lang',
	'dojo/_base/html',
	'dojo/_base/array',
	'dojo/_base/connect',
	'dojo/_base/window',
	'dojo/dnd/Target',
	'dojo/dnd/Source',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/TestPane',
	'gridx/allModules',
	'dijit/form/Button',
	'dijit/form/TextBox',
	'dojo/domReady!'
], function(lang, html, array, connect, win, dndTarget, dndSource, Grid, Cache, dataSource, storeFactory, TestPane, mods){

	function create(id, container, size, layoutIdx, args){
		var g = new Grid(lang.mixin({
			id: id,
			cacheClass: Cache,
			store: storeFactory({
				path: './support/stores',
				dataSource: dataSource,
				size: size 
			}),
			selectRowTriggerOnCell: true,
			modules: [
				mods.ExtendedSelectRow,
				mods.ExtendedSelectColumn,
				mods.MoveRow,
				mods.MoveColumn,
				mods.DndRow,
				mods.DndColumn,
				mods.VirtualVScroller,
				mods.ColumnResizer
			],
			structure: dataSource.layouts[layoutIdx]
		}, args));
		g.placeAt(container);
		g.startup();
		return g;
	}

	grid = create('grid', 'grid1Container', 25, 6, {});

	//--------------------------------------------
	var formTarget = new dndTarget("songForm", {
		accept: ['grid/rows'],
		onDropExternal: function(source, nodes, copy){
			var model = source.grid.model,
				rowId = nodes[0].getAttribute('rowid');
			model.when({id: rowId}, function(){
				var rowData = model.byId(rowId).rawData;
				html.byId("inputName").value = rowData['Name'];
				html.byId("inputYear").value = rowData['Year'];
				html.byId("inputGenre").value = rowData['Genre'];
				html.byId("inputArtist").value = rowData['Artist'];
				html.byId("inputAlbum").value = rowData['Album'];
				html.byId("inputComposer").value = rowData['Composer'];
				html.byId("inputLength").value = rowData['Length'];
				html.byId("inputTrack").value = rowData['Track'];
			});
		}
	});
	grid.dnd._dnd._fixFF(formTarget, 'songForm');

	//----------------------------------------------
	var trashTarget = new dndTarget('trashcan', {
		accept: ['grid/rows'],
		onDropExternal: function(source, nodes, copy){
			source.grid.dnd.row.onDraggedOut(this);
			html.byId('trashcan').innerHTML += array.map(nodes, function(node){
				return '<span class="trashItem">' + node.getAttribute('rowid') + '</span>';
			}).join('');
		}
	});
	grid.dnd._dnd._fixFF(trashTarget);
});
