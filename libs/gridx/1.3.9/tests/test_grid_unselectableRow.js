require([
	'dojo/parser',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/modules/Focus',
	'gridx/modules/RowHeader',
	'gridx/modules/select/Row',
	'gridx/modules/extendedSelect/Row',
	// 'gridx/modules/select/UnselectableRow',
	'gridx/modules/VirtualVScroller',	
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/TestPane',
	'gridx/tests/support/data/TreeColumnarTestData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'dojo/NodeList-traverse',
	'dojo/query',
	'dojo/dom-class',
	'gridx/core/model/cache/Sync',
	'dijit/form/Button',
	'dijit/form/NumberTextBox',
	'gridx/allModules',

	'dojo/domReady!'
], function(parser, Grid, Cache, Focus, RowHeader, SelectRow, extendedSelectRow, 
			VirtualVScroller, dataSource, storeFactory, TestPane, treeDataSource, treeStoreFactory, traverse, query, domClass){

	store = storeFactory({
		dataSource: dataSource,
		size: 100
	});
	
	layout = dataSource.layouts[4];
	
	getRowUnselectable = function(gridId, rowId){
		alert('row 5 unselectable: ' + dijit.byId(gridId).row(rowId, 1).isSelectable());
	};
	
	setRowUnselectable = function(gridId, rowId, unselectable){
		dijit.byId(gridId).row(rowId, 1).setSelectable(!unselectable);
	},
	
	getSelected = function(gridId){
		alert('Selected Rows is: ' + dijit.byId(gridId).select.row.getSelected());
	},
	
	getUnselectable = function(gridId){
		alert('Unselectable Rows is: ' + dijit.byId(gridId).select.row._getUnselectableRows());
	},
	//=====================================	grid1 test functions	===============================
	
	getRow6Unselectable = function(){
		alert('row 6 unselectable: ' + dijit.byId('grid1').row(6, 1).isSelectable()); 
	};
	
	setRow5Unselectable = function(){
		dijit.byId('grid1').row(5,1).setSelectable(0);
	},
	
	setRow5Selectable = function(){
		dijit.byId('grid1').row(5,1).setSelectable(1);
	},
	
	getGrid1Selected = function(){
		alert('Selected Rows ' + dijit.byId('grid1').select.row.getSelected());
	},
	
	//=====================================	grid1 test functions	===============================

	
	selectRowsByIndex = function(){
		dijit.byId('grid2').select.row.selectByIndex([1, 20]);
	},
	
	deSelectRowsByIndex = function(){
		dijit.byId('grid2').select.row.deselectByIndex([1,20]);
	},
	
	getSelectedRowid = function(){
		alert('selectd rows: ' + dijit.byId('grid2').select.row.getSelected().toString());
	};
	//Test buttons
   var tp = new TestPane({});
   tp.placeAt('ctrlPane');
   
   tp.addTestSet('Select Row Actions', [
		'<div data-dojo-type="dijit.form.Button" onClick="getRowUnselectable(\'grid1\', 5)">Get Row 5 Selectable</div><br/>',
		'<div data-dojo-type="dijit.form.Button" onClick="getRowUnselectable(\'grid1\', 6)">Get Row 6 Selectable</div><br/>',
		'<div data-dojo-type="dijit.form.Button" onClick="setRowUnselectable(\'grid1\', 5, true)">Set Row 5 Unselectable</div><br/>',
		'<div data-dojo-type="dijit.form.Button" onClick="setRowUnselectable(\'grid1\', 5, false)">Set Row 5 Selectable</div><br/>',
		'<div data-dojo-type="dijit.form.Button" onClick="getUnselectable(\'grid1\')">Get Unselectable Rows</div><br/>',
		'<div data-dojo-type="dijit.form.Button" onClick="getSelected(\'grid1\')">Get Selected</div><br/>',

   ''].join(''));

   tp.startup();
//    
   var tp2 = new TestPane({});
   tp2.placeAt('ctrlPane2');
   tp2.addTestSet('Extended Select Row Actions', [
       '<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: selectRowsByIndex">Select Rows From 1 to 20</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: deSelectRowsByIndex">Deselect Rows From 1 to 20</div><br/>',
		'<div data-dojo-type="dijit.form.Button" onClick="setRowUnselectable(\'grid2\', 5, true)">Set Row 5 Unselectable</div><br/>',
		'<div data-dojo-type="dijit.form.Button" onClick="setRowUnselectable(\'grid2\', 5, false)">Set Row 5 Selectable</div><br/>',
		'<div data-dojo-type="dijit.form.Button" onClick="getUnselectable(\'grid2\')">Get Unselectable Rows</div><br/>',
       '<div data-dojo-type="dijit.form.Button" onClick="getSelected(\'grid2\')">Get Selected</div><br/>',
   ''].join(''));
   tp2.startup();
	
	//tree gridx config
	treeStore = treeStoreFactory({
		dataSource: treeDataSource, 
		maxLevel: 4,
		maxChildrenCount: 10
	});
	treeStore.hasChildren = function(id, item){
		return item && treeStore.getValues(item, 'children').length;
	};
	treeStore.getChildren = function(item){
		return treeStore.getValues(item, 'children');
	};

	var progressDecorator = function(){
		return [
			"<div data-dojo-type='dijit.ProgressBar' data-dojo-props='maximum: 10000' ",
			"class='gridxHasGridCellValue' style='width: 100%;'></div>"
		].join('');
	};

	toggleSelectable = function(e){
		var t = e;
		var node = e.target;
		var row = dojo.query(node).closest('.gridxRow')[0];
		var rowId = row.getAttribute('rowid');
		var unselectable = domClass.contains(row, 'gridxRowUnselectable');
		
		while(!( button = dijit.registry.byNode(node) ) ){
			node = node.parentNode;
		}
		
		var button = dijit.registry.byNode(node);
		
		button.set('label', unselectable? 'set unselectable' : 'set selectable');
		setRowUnselectable('grid4', rowId, !unselectable);
		
		
	};
	
	var buttonDecorator = function(){
		return [
			// "<div data-dojo-type='dijit.form.Button' data-dojo-props:'label: \"set unselectable\", onClick: \"clickButton()\" '" ,
			"<div data-dojo-type='dijit.form.Button' data-dojo-props= 'label: \"set unselectable\", onClick: toggleSelectable' " ,
			"</div>"
		].join('');
	};
	treeLayout = [
		//Anything except natual number (1, 2, 3...) means all levels are expanded in this column.
		{id: 'id', name: 'id', field: 'id', expandLevel: 'all', width: '200px'},
		{id: 'number', name: 'number', field: 'number',
			widgetsInCell: true,
			decorator: progressDecorator
		},
		{id: 'string', name: 'string', field: 'string'},
		{id: 'date', name: 'date', field: 'date'},
		{id: 'time', name: 'time', field: 'time'},
		{id: 'bool', name: 'bool', field: 'bool',
			widgetsInCell: true,
			decorator: buttonDecorator
		}
	];
	
	parser.parse();

	
});
