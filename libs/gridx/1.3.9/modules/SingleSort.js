define([
/*====="../core/Column", =====*/
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/keys",
	"../core/model/extensions/Sort",
	"../core/_Module"
], function(/*=====Column, =====*/declare, lang, domClass, keys, Sort, _Module){

/*=====
	Column.sort = function(isDescending, skipUpdateBody){
		// summary:
		//		Sort this column.
	};

	Column.isSorted = function(){
		// summary:
		//		Check wheter this column is sorted.
	};

	Column.clearSort = function(skipUpdateBody){
		// summary:
		//		Clear sort on this column
	};

	Column.isSortable = function(){
		// summary:
		//		Check whether this column is sortable.
	};

	Column.setSortable = function(isSortable){
		// summary:
		//		Set sortable for this column
	};

	var SingleSort = declare(_Module, {
		// summary:
		//		module name: sort.
		//		This module provides the single column sorting functionality for grid.

		// initialOrder: Object|Array
		//		The initial sort order when grid is created.
		//		This is of the same format of the sort argument of the store fetch function.
		//		If an array of sort orders is provided, only the first will be used.
		initialOrder: null,

		sort: function(colId, isDescending, skipUpdateBody){
			// summary:
			//		Sort the grid on given column.
			// colId: String
			//		The column ID
			// isDescending: Boolean?
			//		Whether to sort the column descendingly
			// skipUpdateBody: Boolean?
			//		If set to true, the grid body will not automatically be refreshed after this call,
			//		so that several grid operations could be done altogether
			//		without refreshing the grid over and over.
		},

		isSorted: function(colId){
			// summary:
			//		Check wheter (and how) the grid is sorted on the given column.
			// colId: String
			//		The columnn ID
			// returns:
			//		Positive number if the column is sorted ascendingly;
			//		Negative number if the column is sorted descendingly;
			//		Zero if the column is not sorted.
		},

		clear: function(skipUpdateBody){
			// summary:
			//		Clear sort.
			// skipUpdateBody:
			//		If set to true, the grid body will not automatically be refreshed after this call,
			//		so that several grid operations could be done altogether
			//		without refreshing the grid over and over.
		},

		getSortData: function(){
			// summary:
			//		Get an array of objects that can be accepted by the store's "sort" argument.	
			// returns:
			//		An array containing the sort info
		}
	});

	SingleSort.__ColumnDefinition = declare([], {
		// sortable: Boolean
		sortable: true
	});

	return SingleSort;
=====*/

	return declare(_Module, {
		name: 'sort',

		forced: ['header'],

		modelExtensions: [Sort],

		preload: function(){
			var t = this,
				g = t.grid, sort,
				refresh = function(){
					var columnsById = t.grid._columnsById;
					for(var colId in columnsById){
						t._initHeader(colId);
					}
					if(t._sortId && columnsById[t._sortId]){
						t._updateHeader(t._sortId, t._sortDescend);
					}
				};
			t.connect(t.grid.header, 'onRender', refresh);
			t.connect(g, 'onHeaderCellClick', '_onClick');
			t.connect(g, 'onHeaderCellKeyDown', '_onKey');
			//persistence support
			if(g.persist){
				sort = g.persist.registerAndLoad('sort', function(){
					return [{
						colId: t._sortId,
						descending: t._sortDescend 
					}];
				});
			}
			//Presort...
			sort = sort || t.arg('initialOrder');
			if(lang.isArrayLike(sort)){
				sort = sort[0];
			}
			if(sort && sort.colId){
				t._sortId = sort.colId;
				t._sortDescend = sort.descending;
				//sort here so the body can render correctly.
				t.model.sort([sort]);
			}
		},

		columnMixin: {
			sort: function(isDescending, skipUpdateBody){
				this.grid.sort.sort(this.id, isDescending, skipUpdateBody);
				return this;
			},

			isSorted: function(){
				return this.grid.sort.isSorted(this.id);
			},

			clearSort: function(skipUpdateBody){
				if(this.isSorted()){
					this.grid.sort.clear(skipUpdateBody);
				}
				return this;
			},

			isSortable: function(){
				var col = this.grid._columnsById[this.id];
				return col.sortable || col.sortable === undefined;
			},

			setSortable: function(isSortable){
				this.grid._columnsById[this.id].sortable = !!isSortable;
				return this;
			}
		},

		//Public--------------------------------------------------------------
		sort: function(colId, isDescending, skipUpdateBody){
			var t = this,
				g = t.grid,
				col = g._columnsById[colId];
			if(col && (col.sortable || col.sortable === undefined)){
				if(t._sortId != colId || t._sortDescend == !isDescending){
					t._updateHeader(colId, isDescending);
				}
				t.model.sort([{colId: colId, descending: isDescending}]);
				if(!skipUpdateBody){
					g.body.refresh();
				}
			}
		},

		isSorted: function(colId){
			if(colId == this._sortId){
				return this._sortDescend ? -1 : 1;
			}
			return 0;
		},

		clear: function(skipUpdateBody){
			var t = this;
			if(t._sortId !== null){
				var headerCell = t.grid.header.getHeaderNode(t._sortId);
				if(headerCell){
					domClass.remove(headerCell, 'gridxCellSorted');
					domClass.remove(headerCell, 'gridxCellSortedAsc');
					domClass.remove(headerCell, 'gridxCellSortedDesc');
				}
				t._sortId = t._sortDescend = null;
				t.model.sort();
				if(!skipUpdateBody){
					t.grid.body.refresh();
				}
			}
		},

		getSortData: function(){
			return this._sortId ? [{
				colId: this._sortId,
				descending: this._sortDescend
			}] : null;
		},

		//Private--------------------------------------------------------------
		_sortId: null,

		_sortDescend: null,

		_initHeader: function(colId){
			var g = this.grid,
				headerCell = g.header.getHeaderNode(colId),
				col = g.column(colId, 1),
				sb = [];
			if(col.isSortable()){
				sb.push("<div role='presentation' class='gridxArrowButtonNode'>",
					"<div class='gridxArrowButtonCharAsc'>&#9652;</div>",
					"<div class='gridxArrowButtonCharDesc'>&#9662;</div>",
				"</div>");
				headerCell.setAttribute('aria-sort', 'none');
			}
			sb.push("<div class='gridxSortNode'>", col.name(), "</div>");
			headerCell.innerHTML = sb.join('');
		},

		_updateHeader: function(colId, isDescending){
			var t = this,
				g = t.grid,
				headerCell;
			if(t._sortId && t._sortId != colId){
				headerCell = g.header.getHeaderNode(t._sortId);
				if(headerCell){
					domClass.remove(headerCell, 'gridxCellSorted');
					domClass.remove(headerCell, 'gridxCellSortedAsc');
					domClass.remove(headerCell, 'gridxCellSortedDesc');
					headerCell.setAttribute('aria-sort', 'none');
				}
			}
			t._sortId = colId;
			t._sortDescend = isDescending = !!isDescending;
			headerCell = g.header.getHeaderNode(colId);
			domClass.add(headerCell, 'gridxCellSorted');
			domClass.toggle(headerCell, 'gridxCellSortedAsc', !isDescending);
			domClass.toggle(headerCell, 'gridxCellSortedDesc', isDescending);
			headerCell.setAttribute('aria-sort', isDescending ? 'descending' : 'ascending');
			g.vLayout.reLayout();
		},

		_onClick: function(e){
			// for Clicking on the divider for resizing a column without moving the mouse (no resize is done), causes a column sort
			// which should not be allowed
			if (this.grid._eventFlags.onHeaderCellMouseDown !== "columnResizer") {
				this.sort(e.columnId, this._sortId != e.columnId ? 0 : !this._sortDescend);
			}
		},

		_onKey: function(e){
			if(e.keyCode == keys.ENTER){
				this._onClick(e);
			}
		}
	});
});
