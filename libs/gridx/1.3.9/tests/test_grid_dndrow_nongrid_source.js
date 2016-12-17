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
	'gridx/modules/extendedSelect/Row',
	'gridx/modules/extendedSelect/Column',
	'gridx/modules/move/Row',
	'gridx/modules/move/Column',
	'gridx/modules/dnd/Row',
	'gridx/modules/dnd/Column',
	'gridx/modules/VirtualVScroller',
	'dijit/form/Button',
	'dijit/form/TextBox'
], function(lang, html, array, connect, win, dndTarget, dndSource, Grid, Cache, dataSource, storeFactory, TestPane,
	ExtendedSelectRow, ExtendedSelectColumn, MoveRow, MoveColumn, DndRow, DndColumn, VirtualVScroller
	){
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
				ExtendedSelectRow,
				ExtendedSelectColumn,
				MoveRow,
				MoveColumn,
				DndRow,
				DndColumn,
				VirtualVScroller
			],
			structure: dataSource.layouts[layoutIdx]
		}, args));
		g.placeAt(container);
		g.startup();
		return g;
	}

	grid = create('grid', 'grid1Container', 25, 0, {});

	//--------------------------------------------
	var createSongItemNode = function(item, i){
		return ['<div id="songItem_', i, '" class="dojoDndItem songItem" dndType="grid/rows" itemindex="', i,
			'"><span class="songItemId">', item.id, '</span><span class="songItemName">', item.Name, 
			'</span><span class="songItemArtist">', item.Artist, 
		'</span></div>'].join('');
	};
	var items = dataSource.getData(50).items;
	html.byId('draggableItems').innerHTML = array.map(items.slice(25), function(item, i){
		return createSongItemNode(item, i + 25);
	}).join('');

	var itemSource = new dndSource('draggableItems', {
		accept: ['grid/rows'],
		getGridDndRowData: function(nodes){
			return array.map(nodes, function(node){
				var idx = node.getAttribute('itemindex');
				return items[idx];
			});
		},
		onDropExternal: function(source, nodes, copy){
			if(nodes[0].hasAttribute('rowid')){
				var rowIds = array.map(nodes, function(node){
					return node.getAttribute('rowid');
				});
				var _this = this;
				grid.model.when({id: rowIds}, function(){
					nodes = array.map(rowIds, function(id){
						var node;
						for(var i = 0; i < items.length; ++i){
							if(items[i].id == id){
								return html.toDom(createSongItemNode(items[i], i));
							}
						}
						return null;
					});
					dndSource.prototype.onDropExternal.call(_this, source, nodes, copy);
				}).then(function(){
					grid.dnd.row.onDraggedOut(_this);
				});
			}else{
				dndSource.prototype.onDropExternal.call(this, source, nodes, copy);
			}
		}
	});
	grid.dnd._dnd._fixFF(itemSource);
});
