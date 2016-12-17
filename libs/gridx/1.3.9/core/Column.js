define([
	"dojo/_base/declare"
], function(declare){

/*=====
	var Column = declare([], {
		// summary:
		//		Represents a column of a grid
		// description:
		//		An instance of this class represents a grid column.
		//		This class should not be directly instantiated by users. It should be returned by grid APIs.

		// id: [readonly] String
		//		The ID of this column
		id: null,

		// grid: [readonly] gridx.Grid
		//		Reference to the grid
		grid: null,

		// model: [readonly] grid.core.model.Model
		//		Reference to this grid model
		model: null,

		index: function(){
			// summary:
			//		Get the index of this column
			// returns:
			//		The index of this column
		},

		def: function(){
			// summary:
			//		Get the definition of this column
			// returns:
			//		The definition of this column
		},

		cell: function(row, isId, parentId){
			// summary:
			//		Get a cell object in this column
			// row: gridx.core.Row|Integer|String
			//		Row index or row ID or a row object
			// returns:
			//		If the params are valid and the row is in cache return a cell object, else return null
		},

		cells: function(start, count, parentId){
			// summary:
			//		Get cells in this column.
			//		If some rows are not in cache, there will be NULLs in the returned array.
			// start: Integer?
			//		The row index of the first cell in the returned array.
			//		If omitted, defaults to 0, so column.cells() gets all the cells.
			// count: Integer?
			//		The number of cells to return.
			//		If omitted, all the cells starting from row 'start' will be returned.
			// returns:
			//		An array of cells in this column
		},

		name: function(){
			// summary:
			//		Get the name of this column.
			// description:
			//		Column name is the string displayed in the grid header cell.
			//		Column names can be anything. Two columns can share one name. But they must have different IDs.
			// returns:
			//		The name of this column
		},

		setName: function(name){
			// summary:
			//		Set the name of this column
			// name: String
			//		The new name
			// returns:
			//		Return self reference, so as to cascade methods
		},

		field: function(){
			// summary:
			//		Get the store field of this column
			// description:
			//		If a column corresponds to a field in store, this method returns the field.
			//		It's possible for a column to have no store field related.
			// returns:
			//		The store field of this column
		},

		getWidth: function(){
			// summary:
			//		Get the width of this column
			// returns:
			//		The CSS value of column width
		}
	});

	Column.__ColumnDefinition = declare([], {
		// summary:
		//		Define a column in the structure parameter of gridx.

		// id: String
		//		Column ID, should be unique within grid.
		id: '',

		// name: String?
		//		Column name, displayed in header cell.
		name: '',

		// field: String?
		//		The corresponding field in store.
		field: '',

		// width: String?
		width: '',

		formatter: function(){
			// summary:
			//		Format the store data, generate grid data.
		},

		decorator: function(){
			// summary:
			//		Decorate cell data.
		}
	});

	return Column;
=====*/

	
	return declare([], {
		constructor: function(grid, id){
			this.grid = grid;
			this.model = grid.model;
			this.id = id;
		},

		index: function(){
			var c = this.def();
			return c ? c.index : -1;
		},

		def: function(){
			return this.grid._columnsById[this.id];
		},

		cell: function(row, isId, parentId){
			return this.grid.cell(row, this, isId, parentId);
		},

		cells: function(start, count, parentId){
			var t = this,
				g = t.grid,
				cells = [],
				total = g.rowCount(parentId),
				i = start || 0,
				end = count >= 0 ? start + count : total;
			for(; i < end && i < total; ++i){
				cells.push(g.cell(i, t, 0, parentId));
			}
			return cells;
		},

		name: function(){
			return this.def().name || '';
		},

		setName: function(name){
			this.def().name = name;
			return this;
		},

		field: function(){
			return this.def().field || null;
		},

		getWidth: function(){
			return this.def().width;
		}
	});
});
