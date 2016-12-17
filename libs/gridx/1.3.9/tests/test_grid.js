require([
	'gridx/Grid',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/TestPane',
	'gridx/allModules',
	'dojo/on'
], function(Grid, dataSource, storeFactory, TestPane, mods, on){

	var columnSetIdx = 0;

	destroy = function(){
		if(window.grid){
			grid.destroy();
			window.grid = undefined;
		}
	};

	create = function(){
		if(!window.grid){
			var store = storeFactory({
				dataSource: dataSource,
				size: 100
			});
			var layout = dataSource.layouts[columnSetIdx];
			grid = new Grid({
				id: 'grid',
				store: store,
				structure: layout,
				modules: [
					"gridx/modules/TouchScroll",
					"gridx/modules/NavigableCell",
					mods.VirtualVScroller
				],
				summary: 'this is the gridx'
			});
			grid.placeAt('gridContainer');
			grid.startup();

			on(grid.domNode, 'rowClick', function(e){
				console.log('dojo/on mouseclick');
				// console.log('event row id is',e.rowId);
			});
			on(grid.domNode, 'rowMouseDown', function(e){
				console.log('dojo/on mousedown');
				// console.log('event row id is',e.rowId);
			});
			on(grid.domNode, 'rowMouseUp', function(e){
				console.log('dojo/on mouseup');
				// console.log('event row id is',e.rowId);
			});
		}
	};

	create();
	
	//Test Functions, must be global
	setStore = function(){
		grid.setStore(storeFactory({
			dataSource: dataSource,
			size: 50 + parseInt(Math.random() * 200, 10)
		}));
	};
	setColumns = function(){
		columnSetIdx = columnSetIdx == 4 ? 0 : 4;
		var columns = dataSource.layouts[columnSetIdx];
		grid.setColumns(columns);
	};
	var idcnt = 10000;
	newRow = function(){
		grid.store.add({
			id: idcnt++
		});
	};

	setRow = function(){
		var item = grid.row(0).item();
		item.Year = parseInt(Math.random() * 1000 + 1000, 10);
		grid.store.put(item);
	};

	deleteRow = function(){
		grid.store.remove(grid.row(0).id);
	};

	toggleHeader = function(){
		grid.header.hidden = !grid.header.hidden;
		grid.header.refresh();
		grid.vLayout.reLayout();
	};

	//Test buttons
	var tp = new TestPane({});
	tp.placeAt('ctrlPane');

	tp.addTestSet('Tests', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: setColumns">Change column structure</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: setStore">Change store</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: newRow">Add an empty new row</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: setRow">Set Year of the first row</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: deleteRow">Delete the first row</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: destroy">Destroy</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: create">Create</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: toggleHeader">Toggle Header</div><br/>'
	].join(''));

	tp.startup();
});
