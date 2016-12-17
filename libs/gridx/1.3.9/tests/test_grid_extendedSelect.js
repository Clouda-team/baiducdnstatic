require([
	'dojo/_base/connect',
	'dojo/_base/array',
	'dojo/dom',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/TestPane',
	'gridx/modules/Focus',
	'gridx/modules/RowHeader',
	'gridx/modules/ColumnResizer',
	'gridx/modules/extendedSelect/Row',
	'gridx/modules/extendedSelect/Column',
	'gridx/modules/extendedSelect/Cell',
	'gridx/modules/VirtualVScroller',
	'dojo/parser',
	'dijit/form/NumberTextBox',
	'dojo/domReady!'
], function(connect, array, dom, Grid, Cache, dataSource, storeFactory, TestPane, Focus,
		RowHeader, ColumnResizer, ExtendedSelectRow, ExtendedSelectColumn, ExtendedSelectCell, VirtualVScroller, parser){

grid = new Grid({
	id: 'grid',
	cacheClass: Cache,
	store: storeFactory({
		dataSource: dataSource,
		size: 200
	}),
	structure: dataSource.layouts[0],
	modules: [
		Focus,
		RowHeader,
		ColumnResizer,
		ExtendedSelectRow,
		ExtendedSelectColumn,
		ExtendedSelectCell,
		VirtualVScroller
	]
});
grid.placeAt('gridContainer');
grid.startup();

connect.connect(grid.select.row, 'onSelectionChange', function(selected, lastSelected){
	// dom.byId('rowSelectedCount').value = selected.length;
	dom.byId('lastRowStatus').value = lastSelected && lastSelected.join("\n");
});
connect.connect(grid.select.row, 'onSelectionChange', function(selected){
	dom.byId('rowSelectedCount').value = selected.length;
	dom.byId('rowStatus').value = selected.join("\n");
});
connect.connect(grid.select.column, 'onSelectionChange', function(selected){
	dom.byId('colSelectedCount').value = selected.length;
	dom.byId('colStatus').value = selected.join("\n");
});
connect.connect(grid.select.cell, 'onSelectionChange', function(selected){
	dom.byId('cellSelectedCount').value = selected.length;
	selected = array.map(selected, function(cell){
		return ['(', cell[0], ', ', cell[1], ')'].join('');
	});
	dom.byId('cellStatus').value = selected.join("\n");
});
parser.parse();
});
function selectRow(toSelect){
	var start = dijit.byId('rowStart').get('value');
	var end = dijit.byId('rowEnd').get('value');
	var a = Math.max(start, end);
	start = Math.min(start, end);
	end = a;
	grid.select.row[toSelect ? 'selectByIndex' : 'deselectByIndex']([start, end]);
}

function selectAllRow(toSelect){
	if(toSelect){
		grid.select.row.selectByIndex([0, grid.rowCount() - 1]);
	}else{
		grid.select.row.clear();
	}
}

function selectColumn(toSelect){
	var start = dijit.byId('colStart').get('value');
	var end = dijit.byId('colEnd').get('value');
	var a = Math.max(start, end);
	start = Math.min(start, end);
	end = a;
	grid.select.column[toSelect ? 'selectByIndex' : 'deselectByIndex']([start, end]);
}

function selectAllColumn(toSelect){
	if(toSelect){
		grid.select.column.selectByIndex([0, grid.columnCount() - 1]);
	}else{
		grid.select.column.clear();
	}
}

function selectCell(toSelect){
	var start = [dijit.byId('cellStartR').get('value'), dijit.byId('cellStartC').get('value')];
	var end = [dijit.byId('cellEndR').get('value'), dijit.byId('cellEndC').get('value')];
	grid.select.cell[toSelect ? 'selectByIndex' : 'deselectByIndex'](start.concat(end));
}

function selectAllCell(toSelect){
	if(toSelect){
		grid.select.cell.selectByIndex([0, 0, grid.rowCount() - 1, grid.columnCount() - 1]);
	}else{
		grid.select.cell.clear();
	}
}

