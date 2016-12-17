define([
	'dojo/_base/declare',
	'./Grid',
	'./core/model/cache/Sync',
	'./modules/CellWidget',
	'./modules/Edit',
	'./modules/ColumnResizer',
	'./modules/SingleSort',
	'./modules/TouchScroll',
	'./modules/extendedSelect/Row',
	'./modules/Filter',
	'./modules/move/Row',
	'./modules/move/Column',
	'./modules/ColumnLock'
], function(declare, Grid, Cache,
	CellWidget, Edit, ColumnResizer,
	SingleSort, TouchScroll,
	SelectRow, Filter, MoveRow,
	MoveColumn, ColumnLock){

	return declare(Grid, {
		// summary:
		//		This is a common configuration for grid with synchronous store
		//		(client side store such as dojo/store/Memory).
		//		Several useful modules are included by default so that users without special
		//		requirements can directly use.
		//		Note: 
		//		1. cacheClass is no need to be provided.
		//			gridx/core/model/cache/Sync will be used by default.
		//		2. The exact modules used here might change without notification across Gridx versions.
		//		3. The default modules will be loaded here no matter you use them or not. So if code size
		//			is critical to your project, please use base class gridx/Grid instead.
		// example:
		//		|	var grid = new GridCommon({
		//		|		store: store,
		//		|		structure: structure
		//		|	});
		cacheClass: Cache,
		coreModules: Grid.prototype.coreModules.concat([
			CellWidget,
			Edit,
			ColumnResizer,
			SingleSort,
			TouchScroll,
			SelectRow,
			Filter,
			MoveRow,
			MoveColumn,
			ColumnLock
		])
	});
});
