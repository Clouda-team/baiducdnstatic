define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"dojo/DeferredList",
	"dojo/query",
	"dojo/keys",
	"../core/_Module"
//    "dojo/NodeList-dom",
//    "dojo/NodeList-traverse"
], function(declare, array, domClass, domGeometry, lang, Deferred, DeferredList, query, keys, _Module){

/*=====
	Row.canExpand = function(){
		// summary:
		//		Whether this row can be expanded.
		// returns:
		//		True if can, false if can not.
	};
	Row.isExpanded = function(){
		// summary:
		//		Whether this row is expanded.
		// returns:
		//		True if expanded. False if not.
	};
	Row.expand = function(){
		// summary:
		//		Expand this row.
		// returns:
		//		A Deferred object
	};
	Row.collapse = function(){
		// summary:
		//		Collapse this row.
		// returns:
		//		A Deferred object
	};
	Row.expandRecursive = function(){
		// summary:
		//		Recursively expand this row.
		// returns:
		//		A Deferred object
	};
	Row.collapseRecursive = function(){
		// summary:
		//		Recursively collapse this row.
		// returns:
		//		A Deferred object
	};

	var Tree = declare(_Module, {
		// summary:
		//		module name: tree.
		//		This module manages row expansion/collapsing in tree grid.
		// description:
		//		To use tree grid, the store must have 2 extra methods: hasChildren and getChildren.
		//		Please refer to Tree.__TreeStoreMixin for more details on these 2 methods.
		//		
		//		In tree grid, an expando appears on a row that has child rows. By clicking the expando,
		//		the row is expanded to show its child rows below it, and the expando becomes expanded status.
		//		By clicking the expanded expando, the expanded row is then collapsed and all its child rows 
		//		are hidden. If a descentant row of a collapsed row is expanded, it will appear expanded when that
		//		collapsed row is expanded (that means the child row expansion status is maintained).
		//		
		//		Different levels of expandos can either appear in one column or in several different columns.
		//		If different expandos appear in different columns, it is called "nested". This can be set using
		//		the "nested" Boolean parameter.
		//		
		//		The default position of the expando is in the first column, but this position can also be changed
		//		by setting the "expandLevel" parameter in column definition. If "nested" is false, the expandos will 
		//		appear in the first column with truthy "expandLevel" parameter. If "nested" is true, the expando
		//		of any 1st level row will be shown in the column with "expandLevel" equal to 1, and the expando of 
		//		any 2nd level row will be shown in the column with "expandLevel" equal to 2, and so on.
		//		
		//		The expansion/collapsing of a row can also be controlled by keyboard when the focus is on the cell 
		//		with the expando. CTRL+RIGHT_ARROW to expand and CTRL+LEFT_ARROW to collapse. If in RTL mode, the ARROW
		//		keys are reversed.
		// example:
		//		Define the hasChildren and getChildren methods for store (suppose the "children" field contains the child rows):
		//		If the store is ItemFileReadStore:
		//	|	store.hasChildren = function(id, item){
		//	|		return item && store.getValues(item, 'children').length;
		//	|	};
		//	|	store.getChildren = function(item){
		//	|		return store.getValues(item, 'children');
		//	|	};
		//		If the store is Memory store:
		//	|	store.hasChildren = function(id, item){
		//	|		return item && item.children && item.children.length;
		//	|	};
		//	|	store.getChildren = function(item){
		//	|		return item.children;
		//	|	};
		//		If the child rows need to be fetched from server side:
		//	|	store.hasChildren = function(id, item){
		//	|		return item&& item.children;	//This children field only indicates whether the row has children.
		//	|	};
		//	|	store.getChildren = function(item){
		//	|		var d = new Deferred();
		//	|		var children = [];
		//	|		dojo.request(...).then(function(){
		//	|			//get the child rows here and populate them into an array.
		//	|			d.callback(children);
		//	|		});
		//	|		return d;
		//	|	};

		// nested: Boolean
		//		If set to true, the tree nodes can be shown in nested mode.
		nested: false,

		// expandoPadding: Integer
		//		The padding added for each level of expando. Unit is pixel. Default to 18.
		expandoPadding: 18,

		// expandLevel: Integer
		//		The maximum allowed expand level of this tree grid.
		//		If less than 1, then this is not a tree grid at all.
		expandLevel: 1 / 0,

		// clearOnSetStore: Boolean
		//		Whether to clear all the recorded expansion info after setStore.
		clearOnSetStore: true,

		onExpand: function(id){
			// summary:
			//		Fired when a row is expanded.
			// tags:
			//		callback
			// id: String
			//		The ID of the expanded row
		},

		onCollapse: function(id){
			// summary:
			//		Fired when a row is collapsed.
			// tags:
			//		callback
			// id: String
			//		The ID of the collapsed row.
		},

		canExpand: function(id){
			// summary:
			//		Check whether a row can be expanded.
			// id: String
			//		The row ID
			// returns:
			//		Whether the row can be expanded.
		},
	
		isExpanded: function(id){
			// summary:
			//		Check whether a row is already expanded.
			// id: String
			//		The row ID
			// returns:
			//		Whether the row is expanded.
		},

		isPaddingCell: function(rowId, columnId){
			// summary:
			//		Check wheter a cell is padding cell. Only meaningful in "nested" tree grid.
			//		By default, in "nested" tree grid, the cells before the current expando cell are all padding cells.
			//		A padding cell is an empty cell, nothing is shown in the cell, decorator and formatter functions
			//		are not called on it either.
			// rowId: String|Number
			//		The row ID of the cell
			// columnId: String|Number
			//		The column ID of the cell
		},

		expand: function(id, skipUpdateBody){
			// summary:
			//		Expand the row.
			// id: String
			//		The row ID
			// skipUpdateBody: Boolean
			//		If set to true the grid will not automatically refresh itself after this method,
			//		so that several grid operations can be executed altogether.
			// returns:
			//		A deferred object indicating whether this expanding process has completed.
		},

		collapse: function(id, skipUpdateBody){
			// summary:
			//		Collapse a row.
			// id: String
			//		The row ID
			// skipUpdateBody: Boolean
			//		If set to true the grid will not automatically refresh itself after this method,
			//		so that several grid operations can be executed altogether.
			// returns:
			//		A deferred object indicating whether this collapsing process has completed.
		},

		expandRecursive: function(id, skipUpdateBody){
			// summary:
			//		Recursively expand a row and all its descendants.
			// id: String
			//		The row ID
			// skipUpdateBody: Boolean
			//		If set to true the grid will not automatically refresh itself after this method,
			//		so that several grid operations can be executed altogether.
			// returns:
			//		A deferred object indicating whether this expanding process has completed.
		},

		collapseRecursive: function(id, skipUpdateBody){
			// summary:
			//		Recursively collapse a row recursively and all its descendants.
			// id: String
			//		The row ID
			// skipUpdateBody: Boolean
			//		If set to true the grid will not automatically refresh itself after this method,
			//		so that several grid operations can be executed altogether.
			// returns:
			//		A deferred object indicating whether this collapsing process has completed.
		}
	});

	Tree.__ColumnDefinition = declare(Column.__ColumnDefinition, {
		// expandLevel: Number
		//		If tree grid is "nested", the expando will be shown in the column whose "expandLevel" equals the
		//		level of the row. For example, the expando of a root row will be shown in the column whose "expandLevel"
		//		equals 1. And the child rows of the root row will show their expando in the column with "expandLevel" equals 2,
		//		and so on.
		//		If no "expandLevel" is provided for a "nested" tree grid, the first column has "expandLevel" 1, second 2, and so on.
		//		If tree grid is not "nested", all the expandos will be shown in the first column with truthy "expandLevel".
		//		If no "expandLevel" is provided for a non-nested tree grid, the first column has all the expandos by default.
		expandLevel: 0,

		// padding: Boolean
		//		By default, in "nested" tree grid, the cells before the current expando cell are all padding cells.
		//		But if some cell matching this condition should not be padding, then this parameter should be
		//		explicitly set to false for the column of this cell.
		padding: undefined
	});

	Tree.__TreeStoreMixin = declare([], {
		// summary:
		//		The extra methods for tree store.
		// description:
		//		Since the dojo store does not support tree structure by default, some extra methods should be defined to 
		//		help grid retrieve the child level items.

		hasChildren: function(id, item){
			// summary:
			//		Check whether a row has child rows. This function should not throw any error.
			// id: String|Number
			//		The row ID
			// item: Object
			//		The store item
			// returns:
			//		True if the given row has children, false otherwise.
		},

		getChildren: function(item){
			// summary:
			//		Get an array of the child items of the given row item.
			// item: Object
			//		The store item
			// returns:
			//		An array of the child items of the given row item.
		}
	});

	return Tree;
=====*/

	function isExpando(cellNode){
		var n = cellNode.firstChild;
		return n && n.className && domClass.contains(n, 'gridxTreeExpandoCell') &&
			!domClass.contains(n, 'gridxTreeExpandoLoading');
	}

	return declare(_Module, {
		name: "tree",

		forced: ['view'],

		preload: function(){
			var t = this,
				g = t.grid;
			g.domNode.setAttribute('role', 'treegrid');
			t.aspect(g.body, 'collectCellWrapper', '_createCellWrapper');
			t.aspect(g.body, 'onAfterRow', '_onAfterRow');
			t.aspect(g.body, 'onCheckCustomRow', function(row, output){
				if(!t.nested && t.mergedParentRow){
					output[row.id] = row.canExpand();
				}
			});
			t.aspect(g.body, 'onBuildCustomRow', function(row, output){
				output[row.id] = row.id;
			});
			t.aspect(g, 'onCellClick', '_onCellClick');
			t.aspect(g, 'onRowClick', function(e){
				if(!t.nested && t.mergedParentRow){
					if(t.canExpand(e.rowId)){
						if(t.isExpanded(e.rowId)){
							t.collapse(e.rowId);
						}else{
							t.expand(e.rowId);
						}
					}
				}
			});

			//disable expand recursive onfilter when on server side mode
			if(!t.grid.arg || !t.grid.filter.arg("serverMode")){
				if(t.arg('autoExpandOnFilter') === true && g.filter){
					t.aspect(g.filter, 'onFilter', function(msg){
						t.expandRecursive();
					});
				}
			}

			if(t.arg('showHover') === false)
				t.showHover = false;

			t._initExpandLevel();
			t._initFocus();
		},

		rowMixin: {
			canExpand: function(){
				return this.grid.tree.canExpand(this.id);
			},
			isExpanded: function(){
				return this.grid.tree.isExpanded(this.id);
			},
			expand: function(){
				return this.grid.tree.expand(this.id);
			},
			collapse: function(){
				return this.grid.tree.collapse(this.id);
			},
			expandRecursive: function(){
				return this.grid.tree.expandRecursive(this.id);
			},
			collapseRecursive: function(){
				return this.grid.tree.collapseRecursive(this.id);
			}
		},

		nested: false,

		expandoWidth: 16,

		expandoPadding: 18,

		expandLevel: 1 / 0,

		clearOnSetStore: true,

		mergedParentRow: false,

		autoExpandOnFilter: true,

		showHover: true,

		onExpand: function(id){},

		onCollapse: function(id){},

		canExpand: function(id){
			var t = this,
				m = t.model,
				level = m.treePath(id).length,
				expandLevel = t.arg('expandLevel');
			return m.hasChildren(id) && (!(expandLevel > 0) || level <= expandLevel);
		},

		isExpanded: function(id){
			return this.model.isId(id) && !!this.grid.view._openInfo[id];
		},

		isPaddingCell: function(rowId, colId){
			var t = this,
				level = t.model.treePath(rowId).length,
				c = t.grid._columnsById[colId];
			if(t.arg('nested') && level > 1 && c.padding !== false){
				for(var i = 0; i < t.grid._columns.length; ++i){
					var col = t.grid._columns[i];
					if(col.expandLevel == level){
						return c.index < col.index;
					}
				}
			}
			return false;
		},

		expand: function(id, skipUpdateBody){
			var d = new Deferred(),
				t = this;
			if(!t.isExpanded(id) && t.canExpand(id)){
				t._beginLoading(id);
				t.grid.view.logicExpand(id).then(function(){
					Deferred.when(t._updateBody(id, skipUpdateBody, true), function(){
						t._endLoading(id);
						d.callback();
						t.onExpand(id);
					});
				});
			}else{
				d.callback();
			}
			return d;
		},

		collapse: function(id, skipUpdateBody){
			var d = new Deferred(),
				t = this;
			if(t.isExpanded(id)){
				t.grid.view.logicCollapse(id);
				Deferred.when(t._updateBody(id, skipUpdateBody), function(){
					d.callback();
					t.onCollapse(id);
				});
			}else{
				d.callback();
			}
			return d;
		},

		expandRecursive: function(id, skipUpdateBody){
			var t = this,
				m = t.model,
				d = new Deferred();
			t._beginLoading(id);
			t.expand(id, 1).then(function(){
				var i, dl = [], size = m.size(id);
				m.when({start: 0, parentId: id}, function(){
					for(i = 0; i < size; ++i){
						var childId = m.indexToId(i, id);
						dl.push(t.expandRecursive(childId, 1));
					}
				}).then(function(){
					new DeferredList(dl).then(function(){
						Deferred.when(t._updateBody(id, skipUpdateBody), function(){
							t._endLoading(id);
							d.callback();
						});
					});
				});
			});
			return d;
		},

		loadChildRecursive: function(id){
			var d = new Deferred(),
				t = this,
				m = t.model;

			var i, size = m.size(id);
			m.when({start: 0, count: 1, parentId: id}, function(){
				size = m.size(id);
				for(i = 0; i < size; ++i){
					var childId = m.indexToId(i, id);
					t.loadChildRecursive(childId);
				}
			}).then(function(){
				d.callback();
			});
			return d;
		},

		collapseRecursive: function(id, skipUpdateBody){
			var d = new Deferred(),
				success = lang.hitch(d, d.callback),
				fail = lang.hitch(d, d.errback),
				t = this,
				view = t.grid.view,
				info = view._openInfo[id || ''],
				i, dl = [];
			if(info){
				for(i = info.openned.length - 1; i >= 0; --i){
					dl.push(t.collapseRecursive(info.openned[i], 1));
				}
				new DeferredList(dl).then(function(){
					if(id){
						t.collapse(id, skipUpdateBody).then(success, fail);
					}else{
						Deferred.when(t._updateBody('', skipUpdateBody), success, fail);
					}
				});
			}else{
				success();
			}
			return d;
		},

		//Private-------------------------------------------------------------------------------
		_initExpandLevel: function(){
			var cols = array.filter(this.grid._columns, function(col){
				return !col.ignore;
			});
			if(!array.some(cols, function(col){
				return col.expandLevel;
			})){
				if(this.arg('nested')){
					array.forEach(cols, function(col, i){
						col.expandLevel = i + 1;
					});
				}else if(cols.length){
					cols[0].expandLevel = 1;
				}
			}
		},

		_createCellWrapper: function(wrappers, rowId, colId){
			var t = this,
				col = t.grid._columnsById[colId];
			if(!col || col.expandLevel){
				var isNested = t.arg('nested'),
					level = t.model.treePath(rowId).length,
					expandLevel = t.arg('expandLevel');
				if((!isNested || (col && col.expandLevel == level)) && 
						(!(expandLevel > 0) || level <= expandLevel + 1)){
					var hasChildren = t.model.hasChildren(rowId),
						isOpen = t.isExpanded(rowId),
						pad = 0,
						expandoWidth = t.arg('expandoWidth'),
						singlePad = t.arg('expandoPadding'),
						ltr = t.grid.isLeftToRight();
					if(!isNested){
						pad = (level - 1) * singlePad;
					}
					if(level == expandLevel + 1){
						//This is one level beyond the last level, there should not be expando
						if(isNested){
							//If nested, no indent needed
							return;
						}
						//If not nested, this level still needs indent
						hasChildren = false;
					}
					wrappers.push({
						priority: 0,
						wrap: function(cellData){
							return ["<div class='gridxTreeExpandoCell ",
								isOpen ? "gridxTreeExpandoCellOpen" : "",
								"' style='padding-", ltr ? 'left' : 'right', ": ", pad + expandoWidth, "px;'>",
								"<div class='gridxTreeExpandoIcon ",
								hasChildren ? '' : 'gridxTreeExpandoIconNoChildren',
								"' ",
								"style='margin-", ltr ? 'left' : 'right', ": ", pad, "px;'>",
								"<div class='gridxTreeExpandoInner'>",
								isOpen ? "-" : "+",
								"</div></div><div class='gridxTreeExpandoContent gridxCellContent'>",
								cellData,
								"</div></div>"
							].join('');
						}
					});
				}
			}
		},

		_onCellClick: function(e){
			if(isExpando(e.cellNode)){
				var t = this,
					pos = domGeometry.position(query('.gridxTreeExpandoIcon', e.cellNode)[0]);
				if(e.clientX >= pos.x && e.clientX <= pos.x + pos.w && e.clientY >= pos.y && e.clientY <= pos.y + pos.h){
					if(t.isExpanded(e.rowId)){
						t.collapse(e.rowId);
					}else{
						t.expand(e.rowId);
					}
				}
			}
		},

		_beginLoading: function(id){
			var rowNode = this.grid.body.getRowNode({rowId: id});
			if(rowNode){
				query('.gridxTreeExpandoCell', rowNode).addClass('gridxTreeExpandoLoading');
				query('.gridxTreeExpandoIcon', rowNode).forEach(function(node){
					node.firstChild.innerHTML = 'o';
				});
			}
		},

		_endLoading: function(id){
			var rowNode = this.grid.body.getRowNode({rowId: id}),
				isOpen = this.isExpanded(id);
			if(rowNode){
				var nls = this.grid.nls;
				query('.gridxTreeExpandoCell', rowNode).
					removeClass('gridxTreeExpandoLoading').
					toggleClass('gridxTreeExpandoCellOpen', isOpen).
					closest('.gridxCell').
					attr('aria-expanded', String(isOpen)).
					attr('title', this.showHover? (isOpen ? nls.treeExpanded : nls.treeCollapsed) : "");
				query('.gridxTreeExpandoIcon', rowNode).forEach(function(node){
					node.firstChild.innerHTML = isOpen ? '-' : '+';
				});
				rowNode.setAttribute('aria-expanded', String(isOpen));
			}
		},

		_updateBody: function(id, skip, refreshPartial){
			var t = this,
				view = t.grid.view,
				body = t.grid.body;
			if(!skip){
				var visualIndex = refreshPartial && id ? 
					view.getRowInfo({
						rowIndex: t.model.idToIndex(id),
						parentId: t.model.parentId(id)
					}).visualIndex : -1;
				//When collapsing, the row count in current view decrease, if only render partially,
				//it is possible that the vertical scroll bar disappear, then the upper unrendered rows will be lost.
				//So refresh the whole body here to make the upper row also visible.
				//FIXME: need better solution here.
				return body.refresh(refreshPartial && visualIndex + 1);
			}
			return null;
		},

		_onAfterRow: function(row){
			var hasChildren = this.model.hasChildren(row.id);
			if(hasChildren){
				var rowNode = row.node(),
					expanded = this.isExpanded();
				rowNode.setAttribute('aria-expanded', expanded);
				//This is only to make JAWS readk
				var nls = this.grid.nls;
				query('.gridxTreeExpandoCell', rowNode).closest('.gridxCell').
					attr('aria-expanded', String(expanded)).
					attr('title', this.showHover? (expanded ? nls.treeExpanded : nls.treeCollapsed) : "");
			}
		},

		//Focus------------------------------------------------------------------
		_initFocus: function(){
			this.connect(this.grid, 'onCellKeyDown', '_onKey'); 
		},

		_onKey: function(e){
			var t = this;
			if(e.keyCode == keys.ESCAPE){
				var m = t.model,
					treePath = m.treePath(e.rowId),
					parentId = treePath.pop(),
					parentLevel = treePath.length,
					grid = t.grid;
				if(parentId){
					var i, col, visualIndex;
					for(i = grid._columns.length - 1; i >= 0; --i){
						col = grid._columns[i];
						if(col.expandLevel && (!t.arg('nested') || col.expandLevel == parentLevel)){
							break;
						}
					}
					m.when({id: parentId}, function(){
						visualIndex = grid.view.getRowInfo({
							parentId: treePath.pop(), 
							rowIndex: m.idToIndex(parentId)
						}).visualIndex;
					}).then(function(){
						grid.vScroller.scrollToRow(visualIndex).then(function(){
							grid.body._focusCell(null, visualIndex, col.index);
						});
					});
				}
			}else if(t.grid._isCtrlKey(e) && isExpando(e.cellNode)){
				var ltr = t.grid.isLeftToRight();
				if(e.keyCode == (ltr ? keys.LEFT_ARROW : keys.RIGHT_ARROW) && t.isExpanded(e.rowId)){
					t.collapse(e.rowId);
				}else if(e.keyCode == (ltr ? keys.RIGHT_ARROW : keys.LEFT_ARROW) && !t.isExpanded(e.rowId)){
					t.expand(e.rowId);
				}
			}
		}
	});
});
