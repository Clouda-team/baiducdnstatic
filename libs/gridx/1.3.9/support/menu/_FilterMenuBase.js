define([
	"dojo/_base/declare",
	"dijit/Menu",
	"../../modules/Filter"
], function(declare, Menu, Filter){

/*=====
	return declare(Menu, {
		// summary
		//		This menu base is used for adaptive filter.

		// grid: [const] gridx.Grid
		//		The grid widget this plugin works for.
		grid: null,
		
		// colId: Integer|String
		// 		The column id the menu attached to.
		colId: null,
		
		// leftClickToOpen: Boolean
		//		Whether left or right mouse click to open the menu.
		leftClickToOpen: true,

		bindGrid: function(grid, col){
			// summary:
			//		When the menu is created, bind the grid to the menu. So that menu logic
			//		could do the filter for the grid.
		},

	});
=====*/

	return declare(Menu, {
		// summary:
		//		

		// grid: gridx/Grid
		//		
		grid: null,

		// colId: String
		//		
		colId: null,

		leftClickToOpen: true,

		postCreate: function(){
			this.inherited(arguments);
			this._createMenuItems();
		},

		bindGrid: function(grid, col){
			//summary:
			//	Attach the menu with grid, so that it could do filter actions
			this.grid = grid;
			this.colId = col.id;
			grid.filter._rules = grid.filter._rules || {};
		},

		_addFilter: function(key, rule){
			this.grid.filter._rules[key] = rule;
			this._doFilter();
		},

		_removeFilter: function(key){
			delete this.grid.filter._rules[key];
			this._doFilter();
		},

		_doFilter: function(){
			var filter = this.grid.filter,
				rules = filter._rules;
			filter.setFilter(function(row){
				for(var key in rules){
					if(!rules[key](row)){
						return 0;
					}
				}
				return 1;
			});
		}
	});
});
