define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/event",
	"dojo/query",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/_base/Deferred",
	"dojo/keys",
	"../core/_Module",
	"./RowHeader"
], function(declare, array, event, query, lang, domClass, Deferred, keys, _Module){

/*=====
	return declare(_Module, {
		// summary:
		//		module name: indirectSelect.
		//		This module shows a checkbox(or radiobutton) on the row header when row selection is used.
		// description:
		//		This module depends on "rowHeader" and "selectRow" modules.
		//		This module will check whether the SelectRow module provides the functionality of "select rows by index" 
		//		(which means the "selectByIndex" method exists). If so, a "select all" checkbox can be provided 
		//		in the header node of the row header column.
		//		This module will also check whether the SelectRow module is configured to "single selection" mode
		//		(which means the "multiple" attribute is set to false). If so, radio button instead of checkbox
		//		will be used in row headers.

		// all: Boolean
		//		Whether the "select all" checkbox is allowed to appear.
		all: true
	});
=====*/

	return declare(_Module, {
		name: 'indirectSelect',

		required: ['rowHeader', 'selectRow'],

		preload: function(){
			var t = this,
				g = t.grid,
				focus = g.focus,
				sr = g.select.row,
				rowHeader = g.rowHeader;
			rowHeader.rowHeaderCellAriaLabel = this.grid.nls.indirectSelectInstruction;
			rowHeader.cellProvider = lang.hitch(t, t._createSelector);
			t.batchConnect(
				[sr,'onHighlightChange', '_onHighlightChange' ],
				[sr,'clear', '_onClear' ],
				[sr, 'onSelectionChange', '_onSelectionChange'],
				// defect 13758
				// todo: refine the function of selecting all
				//[g.body, 'onRender', '_onSelectionChange'],
				[g, 'onRowKeyDown', '_onKeyDown'],
				[g, 'onHeaderKeyDown', '_onKeyDown'],
				g.filter && [g.filter, 'onFilter', '_onSelectionChange']);
			g.select.row.holdingCtrl = true;
			if(sr.selectByIndex && t.arg('all')){
				t._allSelected = {};
				rowHeader.headerProvider = lang.hitch(t, t._createSelectAllBox);
				rowHeader.loaded.then(function(){
					if(focus){
						t._initFocus();
					}
					t.connect(g, 'onRowHeaderHeaderMouseDown', '_onSelectAll');
					t.connect(g, 'onRowHeaderHeaderKeyDown', function(evt){
						if(evt.keyCode == keys.SPACE){
							event.stop(evt);
							t._onSelectAll();
						}
					});
				});
			}
		},

		all: true,

		//Private----------------------------------------------------------
		_createSelector: function(row){
			var rowNode = row.node(),
				selected = rowNode && domClass.contains(rowNode, 'gridxRowSelected'),
				isUnselectable =  !this.grid.row(row.id, 1).isSelectable(),
				partial = rowNode && domClass.contains(rowNode, 'gridxRowPartialSelected');
			return this._createCheckBox(selected, partial, isUnselectable);
		},

		_createCheckBox: function(selected, partial, isUnselectable){
			var dijitClass = this._getDijitClass(),
				suffix = '';
			if(isUnselectable){
				if(selected){
					suffix = 'CheckedDisabled';
				}else if(partial){
					suffix = 'PartialDisabld';
				}else{
					suffix = 'Disabled';
				}
			}
			
			return ['<span role="', this._isSingle() ? 'radio' : 'checkbox',
				'" class="gridxIndirectSelectionCheckBox dijitReset dijitInline ',
				dijitClass, ' ',
				isUnselectable? dijitClass + suffix : '',
				selected ? dijitClass + 'Checked' : '',
				partial ? dijitClass + 'Partial' : '',
				'" aria-checked="', selected ? 'true' : partial ? 'mixed' : 'false',
				'"><span class="gridxIndirectSelectionCheckBoxInner">',
				//in high contrast mode, change to radio-liked character for single select mode
				this._isSingle()? (selected? '&#x25C9;' : '&#x25CC;'):
									(selected ? '&#10003;' : partial ? '&#9646;' : '&#9744;'),
				'</span></span>'
			].join('');
		},

		_createSelectAllBox: function(){
			var allSelected = this._allSelected[this._getPageId()];
			this.grid.rowHeader.headerCellNode.setAttribute('aria-label', allSelected ? this.grid.nls.indirectDeselectAll : this.grid.nls.indirectSelectAll);
			return this._createCheckBox(allSelected);
		},

		_getPageId: function(){
			return this.grid.view.rootStart + ',' + this.grid.view.rootCount;
		},

		_onClear: function(reservedRowId){
			var dijitCls = this._getDijitClass(),
				cls = dijitCls + 'Checked',
				partialCls = dijitCls + 'Partial',
				g = this.grid;
			query('.' + cls, g.rowHeader.bodyNode).removeClass(cls);
			query('.' + partialCls, g.rowHeader.bodyNode).removeClass(partialCls);
			if(g.select.row.isSelected(reservedRowId)){
				query('[rowid="' + g._escapeId(reservedRowId) + '"].gridxRowHeaderRow .gridxIndirectSelectionCheckBox', g.rowHeader.bodyNode).addClass(cls);
			}
			query('.' + cls, g.rowHeader.headerCellNode).removeClass(cls).attr('aria-checked', 'false');
			this._allSelected = {};
		},

		_onHighlightChange: function(target, toHighlight){
			var row = query('[visualindex="' + target.row + '"].gridxRowHeaderRow', this.grid.rowHeader.bodyNode)[0],
				node = row? query('.gridxIndirectSelectionCheckBox', row)[0] : undefined;
			if(node){
				var dijitClass = this._getDijitClass(),
					partial = toHighlight == 'mixed',
					selected = toHighlight && !partial,
					rowId = row.getAttribute('rowid'),
					isUnselectable = !this.grid.row(rowId, 1).isSelectable();
					
				domClass.toggle(node, dijitClass + 'Checked', selected);
				domClass.toggle(node, dijitClass + 'Partial', partial);
				domClass.toggle(node, dijitClass + 'CheckedDisabled', selected && isUnselectable);
				domClass.toggle(node, dijitClass + 'PartialDisabled', partial && isUnselectable);
				domClass.toggle(node, dijitClass + 'Disabled', !selected && !partial && isUnselectable);
				node.setAttribute('aria-checked', selected ? 'true' : partial ? 'mixed' : 'false');
				if(this._isSingle()){
					node.firstChild.innerHTML = selected ? '&#x25C9' : '&#x25CC';
				}else{
					node.firstChild.innerHTML = selected ? '&#10003;' : partial ? '&#9646;' : '&#9744;';
				}
			}
		},

		_getDijitClass: function(){
			return this._isSingle() ? 'dijitRadio' : 'dijitCheckBox';
		},

		_isSingle: function(){
			var select = this.grid.select.row;
			return select.hasOwnProperty('multiple') && !select.arg('multiple');
		},

		_onSelectAll: function(){
			var t = this,
				g = t.grid;
			g.select.row[t._allSelected[t._getPageId()] ? 
				'deselectByIndex' :
				'selectByIndex'
			]([0, g.view.visualCount - 1]);
		},

		_onSelectionChange: function(){
			var t = this, d,
				g = t.grid,
				allSelected,
				view = t.grid.view,
				model = t.model,
				start = view.rootStart,
				count = view.rootCount;
			if(g.select.row.selectByIndex && t.arg('all')){
				var selectedRoot = array.filter(g.select.row.getSelected(), function(id){
					return !model.parentId(id);
				});
				var unselectableRows = g.select.row._getUnselectableRows();
				var unselectableRoots = array.filter(unselectableRows, function(id){
					return !model.parentId(id) && !g.select.row.isSelected(id);
				});
				if(count === model.size()){
					allSelected = count && count - unselectableRoots.length == selectedRoot.length;
				}else{
					d = new Deferred();
					model.when({
						start: start,
						count: count
					}, function(){
						var indexes = array.filter(array.map(selectedRoot, function(id){
							return model.idToIndex(id);
						}), function(index){
							return index >= start && index < start + count;
						});
						unselectableRoots = array.filter(unselectableRoots, function(id){
							var index = model.idToIndex(id);
							return index >= start && index < start + count;
						});
						allSelected = count - unselectableRoots.length == indexes.length;
						d.callback();
					});
				}
				Deferred.when(d, function(){
					t._allSelected[t._getPageId()] = allSelected;
					var node = t.grid.rowHeader.headerCellNode.firstChild;
					if(node){
						domClass.toggle(node, t._getDijitClass() + 'Checked', allSelected);
						node.setAttribute('aria-checked', allSelected ? 'true' : 'false');
						node.firstChild.innerHTML = allSelected ? '&#10003;' : '&#9744;';
						t.grid.rowHeader.headerCellNode.setAttribute('aria-label',
							allSelected ? g.nls.indirectDeselectAll : g.nls.indirectSelectAll);
					}
				});
			}
		},

		//Focus------------------------------------------------------
		_initFocus: function(){
			var g = this.grid,
				rowHeader = g.rowHeader,
				headerCellNode = rowHeader.headerCellNode,
				focus = function(evt){
					if(g.header.hidden){
						return false;
					}
					domClass.add(headerCellNode, 'gridxHeaderCellFocus');
					headerCellNode.focus();
					g.focus.stopEvent(evt);
					return true;
				},
				blur = function(){
					domClass.remove(headerCellNode, 'gridxHeaderCellFocus');
					return true;
				};
			g.focus.registerArea({
				name: 'selectAll',
				priority: -0.1,
				focusNode: rowHeader.headerNode,
				doFocus: focus,
				doBlur: blur,
				// onFocus: focus,
				onBlur: blur
			});
		},
		_onKeyDown: function(evt){
			// CTRL - A
			if(this.grid.select.row.selectByIndex && this.arg('all') && evt.keyCode == 65 && this.grid._isCtrlKey(evt) && !evt.shiftKey){
				if(!this._allSelected[this._getPageId()]){
					this._onSelectAll();
				}
				event.stop(evt);
			}
		}
	});
});
