require([
	'dojo/_base/lang',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/allModules',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/TestPane'
], function(lang, Grid, Cache, mods, dataSource, storeFactory, TestPane){

	store = storeFactory({
		dataSource: dataSource, 
		size: 100
	});

	createGrid = function(e, structure){
		if(!window.grid){
			grid = new Grid({
				id: 'grid',
				cacheClass: Cache,
				store: store,
				structure: structure || dataSource.layouts[4],
				modules: [
					mods.Persist,
					mods.SelectColumn,
					mods.MoveColumn,
					mods.DndColumn,
					mods.NestedSort,
					mods.VirtualVScroller,
					mods.Filter,
					mods.FilterBar,
					mods.ColumnResizer
				]
			});
			grid.placeAt('gridContainer');
			grid.startup();
		}
	};
	createGrid();

	createNewColGrid = function(){
		var structure = lang.clone(dataSource.layouts[4]);
		structure.push({
			id: 'newCol', field: 'Genre', name: 'New Column'
		});
		destroyGrid();
		createGrid(null, structure);
	};

	createLessColGrid = function(){
		var structure = lang.clone(dataSource.layouts[4]);
		structure.splice(1, 1);
		destroyGrid();
		createGrid(null, structure);
	};

	destroyGrid = function(){
		if(window.grid){
			grid.destroy();
			window.grid = null;
		}
	};

	enablePersist = function(){
		if(window.grid){
			grid.persist.enabled = true;
		}
	};

	disablePersist = function(){
		if(window.grid){
			grid.persist.enabled = false;
		}
	};

	//Test buttons
	var tp = new TestPane({});
	tp.placeAt('ctrlPane');

	tp.addTestSet('Pesistent Actions', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: createGrid">Create Grid</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: createNewColGrid">Create Grid with new columns</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: createLessColGrid">Create Grid with less columns</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: destroyGrid">Destroy Grid</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: enablePersist">Enable Persist</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: disablePersist">Disable Persist</div><br/>',
	''].join(''));

	tp.startup();
});
