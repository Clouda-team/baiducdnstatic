define([
/*====="gridx/core/Column",=====*/
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/query",
	"dojo/_base/event",
	"dojo/_base/sniff",
	"dojo/string",
	"dojo/keys",
	"dojo/dom",
	"dojo/dom-class",
	"../core/model/extensions/Sort",
	"../core/_Module"
], function(/*=====Column, =====*/declare, array, query, event, has, string, keys, dom, domClass, Sort, _Module){

/*=====
	Column.sort = function(isDescending, isAdd){
		// summary:
		//		
	};
	Column.isSorted = function(){
		// summary:
		//		
	};
	Column.clearSort = function(){
		// summary:
		//		
	};
	Column.isSortable = function(){
		// summary:
		//		
	};
	Column.setSortable = function(sortable){
		// summary:
		//		
	};

	return declare(_Module, {
		// summary:
		//		module name: sort.
		//		A sort module suitable for both nested sort and single sort.

		// initialOrder: Object[]
		//		The initial sort order when grid is created.
		//		This is of the same format of the sort argument of the store fetch function.
		initialOrder: null,

		// nested: Boolean
		//		Whether nested sort is allowed.
		//		If true, CTRL+click does nested sort.
		//		If false, only single sort.
		nested: true,

		sort: function(sortData){
			// summary:
			//		
		},

		isSorted: function(colId){
			// summary:
			//		
		},

		clear: function(){
			// summary:
			//		
		},

		getSortData: function(){
			// summary:
			//		
		}
	});
=====*/

	return _Module.register(
	declare(_Module, {
		name: 'sort',

		forced: ['header'],

		modelExtensions: [Sort],

		constructor: function(){
			this._sortData = [];
		},

		preload: function(){
			var t = this,
				g = t.grid, sort;
			domClass.add(g.domNode, 'gridxSort');
			t.aspect(g, 'onHeaderCellClick', '_onClick');
			t.aspect(g, 'onHeaderCellMouseOver', 'reLayout', g.vLayout);
			t.aspect(g, 'onHeaderCellMouseOut', 'reLayout', g.vLayout);
			t.aspect(g.header, 'onRender', '_update');
			t.connect(g, 'onHeaderCellTouchStart', function(evt){
				query('.gridxHeaderCellTouch', g.header.domNode).removeClass('gridxHeaderCellTouch');
				domClass.add(evt.headerCellNode, 'gridxHeaderCellTouch');
			});
			t.connect(g, 'onHeaderCellTouchEnd', function(evt){
				domClass.remove(evt.headerCellNode, 'gridxHeaderCellTouch');
			});
			//persistence support
			if(g.persist){
				sort = g.persist.registerAndLoad('sort', function(){
					return t._sortData;
				});
			}
			//Presort...
			sort = sort || t.arg('initialOrder');
			if(sort && sort.length){
				t._sortData = sort;
				//sort here so the body can render correctly.
				t.model.sort(sort);
			}
		},

		load: function(){
			var t = this,
				g = t.grid;
			if(has('ff')){
				//Only in FF, there will be a selection border on the header node when clicking it holding CTRL.
				dom.setSelectable(g.header.domNode, false);
			}
			t._initFocus();
			t.loaded.callback();
		},

		columnMixin: {
			sort: function(isDescending, isAdd){
				var sort = this.grid.sort;
				sort._prepareSortData(this.id, isAdd);
				return sort.sort(sort._sortData);
			},

			isSorted: function(){
				return this.grid.sort.isSorted(this.id);
			},

			clearSort: function(){
				this.grid.sort.clear();
				return this;
			},

			isSortable: function(){
				var col = this.grid._columnsById[this.id];
				return col.sortable || col.sortable === undefined;
			},

			setSortable: function(isSortable){
				this.grid._columnsById[this.id].sortable = isSortable;
				return this;
			}
		},

		//Public--------------------------------------------------------------
		nested: true,

		sort: function(sortData){
			//A column is always sortable programmatically. The sortable attribute is only meaningful for UI
			this._sortData = sortData || [];
			this.model.sort(sortData);
			this._updateHeader();
			return this.grid.body.refresh();
		},

		isSorted: function(colId){
			for(var i = this._sortData.length - 1; i >= 0; --i){
				var s = this._sortData[i];
				if(s.colId === colId){
					return s.decending ? -1 : 1;
				}
			}
			return 0;
		},

		clear: function(){
			this.sort();
		},

		getSortData: function(){
			return this._sortData;
		},

		//Private--------------------------------------------------------------
		_sortData: null,

		_onClick: function(e){
			event.stop(e);
			this._sort(e.columnId,
				query(e.target).closest('.gridxArrowButtonNode', this.grid.header.domNode).length,
				this.grid._isCtrlKey(e));
		},

		_sort: function(id, isSortArrow, isNested){
			var g = this.grid;
			this._focusHeaderId = id;
			this._focusSortArrow = isSortArrow;
			if(g.column(id, 1).isSortable() && (isSortArrow || !g.select || !g.select.column)){
				this._prepareSortData(id,  isNested);
				this.sort(this._sortData);
			}
		},

		_prepareSortData: function(colId, isAdd){
			var t = this,
				oneway = true,
				desc = false,
				sortable = t.grid._columnsById[colId].sortable;
			isAdd = t.arg('nested') && isAdd;
			if(sortable == 'descend'){
				desc = true;
			}else if(sortable != 'ascend'){
				oneway = false;
			}
			for(var s, i = t._sortData.length - 1; i >= 0; --i, s = 0){
				s = t._sortData[i];
				if(s.colId === colId){
					s.descending = oneway ? desc : !s.descending;
					break;
				}
			}
			if(!s){
				s = {
					colId: colId,
					descending: oneway && desc
				};
				t._sortData.push(s);
			}
			if(!isAdd){
				t._sortData = [s];
			}
		},

		_getSortModeCls: function(col){
			return {
				ascend: 'gridxSortAscendOnly',
				descend: 'gridxSortDescendOnly'
			}[col.isSortable()] || '';
		},

		_initHeader: function(col){
			var	n = col.headerNode();
			n.innerHTML = ["<div class='gridxSortNode'><div role='presentation' tabindex='0' class='gridxArrowButtonNode ",
				this._getSortModeCls(col),
				"'></div><div class='gridxColCaption'>",
				col.name(),
				"</div></div>"
			].join('');
			n.removeAttribute('aria-sort');
			this._setTitle(n, col);
		},

		_update: function(){
			var t = this,
				g = t.grid;
			query('.gridxCell', g.header.domNode).forEach(function(node){
				var col = g.column(node.getAttribute('colid'), 1);
				if(col.isSortable()){
					t._initHeader(col);
				}
				t._setTitle(node, col);
			});
			t._updateHeader();
		},

		_setTitle: function(headerCellNode, col){
			if(col.isSortable()){
				headerCellNode.setAttribute('title', string.substitute(
					this.arg('nested') ? this.grid.nls.helpMsg : this.grid.nls.singleHelpMsg,
				//If column name includes HTML tags, can provide tooltip instead.
				[col.def().tooltip || col.name()]));
			}
		},

		_updateHeader: function(){
			var g = this.grid;
			query('[aria-sort]', g.header.domNode).forEach(function(n){
				this._initHeader(g.column(n.getAttribute('colid'), 1));
			}, this);
			var sortData = array.filter(this._sortData, function(s){
				return g._columnsById[s.colId];
			});
			for(var i = 0, len = sortData.length; i < len; ++i){
				var s = sortData[i],
					col = g.column(s.colId, 1),
					n = col.headerNode();
				n.innerHTML = ["<div class='gridxSortNode ",
					(s.descending ? 'gridxSortDown' : 'gridxSortUp'),
					"'><div role='presentation' tabindex='0' class='gridxArrowButtonNode ",
					this._getSortModeCls(col), "'>",
					"<div class='gridxArrowButtonChar'>",
					(s.descending ? "&#9662;" : "&#9652;"),
					"</div></div><div class='",
					len == 1 ? "gridxSortSingle" : "gridxSortNested",
					"'>", i + 1,
					"</div><div class='gridxColCaption'>", col.name(),
					"</div></div>"
				].join('');
				n.setAttribute('aria-sort', s.descending ? 'descending' : 'ascending');
				//FIXME: it there any better way to set aria sort priority?
				if(this.arg('nested')){
					var priority = string.substitute(g.nls.priorityOrder, [i + 1]);
					n.setAttribute('aria-label', (col.def().tooltip || col.name()) + ', ' + priority);
				}
			}
			g.vLayout.reLayout();
			if(g.focus && g.focus.currentArea() == 'header'){
				this._focus(this._focusHeaderId);
			}
		},

		//Keyboard support-----------------------------------------------------------------
		_focusHeaderId: null,

		_focusSortArrow: false,

		_initFocus: function(){
			var g = this.grid, focus = g.focus;
			if(focus){
				if(g.select && g.select.column){
					focus.registerArea({
						name: 'header',
						priority: 0,
						focusNode: g.header.domNode,
						scope: this,
						doFocus: this._doFocus,
						onFocus: this._onFocus,
//                        doBlur: hitch(this, this._doBlur),
//                        onBlur: hitch(this, this._onBlur),
						connects: [this.connect(g, 'onHeaderCellKeyDown', '_onKeyDown')]
					});
				}else{
					this.connect(g, 'onHeaderCellKeyDown', function(evt){
						if(evt.keyCode == keys.ENTER){
							this._sort(evt.columnId, false, g._isCtrlKey(evt));
						}
					});
				}
			}
		},

		_doFocus: function(evt){
			var id = this._focusHeaderId = this._focusHeaderId || this.grid._columns[0].id;
			this._focus(id, evt);
			return true;
		},

		_onFocus: function(evt){
			this._focusSortArrow = false;
			return true;
		},

//        _doBlur: function(){
//            return true;
//        },

//        _onBlur: function(){
//            return true;
//        },

		_onKeyDown: function(e){
			switch(e.keyCode){
				case keys.RIGHT_ARROW:
				case keys.LEFT_ARROW:
					this._moveFocus(e);
					break;
				case keys.ENTER:
					this._sort(this._focusHeaderId, true, this.grid._isCtrlKey(e));
			}
		},

		_moveFocus: function(evt){
			if(this._focusHeaderId){	//Only need to move focus when we are already focusing on a column
				var col, g = this.grid, dir = g.isLeftToRight() ? 1 : -1,
					delta = evt.keyCode == keys.LEFT_ARROW ? -dir : dir,
					focusSortArrow = this._focusSortArrow;
				event.stop(evt);	//Prevent scrolling the whole page.
				col = g.column(this._focusHeaderId, 1);
				var sortable = col.isSortable();
				col = g.column(col.index() + delta);
				if(col){
					this._focusHeaderId = col.id;
					this._focusSortArrow = col.isSortable() && !focusSortArrow;
					this._focus(col.id, evt);
				}
			}
		},

		_focus: function(id, evt){
			var header = this.grid.header,
				headerNode = header.getHeaderNode(id);
			header._focusNode(headerNode);
			if(evt){
				header.onMoveToHeaderCell(id, evt);
			}
			this._focusArrow(id);
		},

		_focusArrow: function(id){
			var header = this.grid.header;
			query('.gridxArrowButtonFocus', header.domNode).forEach(function(node){
				domClass.remove(node, 'gridxArrowButtonFocus');
			});
			if(this._focusSortArrow){
				var arrowNode = query('.gridxArrowButtonNode', header.getHeaderNode(id))[0];
				if(arrowNode){
					domClass.add(arrowNode, 'gridxArrowButtonFocus');
					arrowNode.focus();
				}
			}
		}
	}));
});

