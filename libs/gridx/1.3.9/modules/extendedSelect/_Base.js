define([
	"dojo/_base/declare",
	"dojo/query",
	"dojo/_base/connect",
	"dojo/_base/Deferred",
	"dojo/_base/sniff",
	"dojo/_base/window",
	"dojo/dom",
	"dojo/keys",
	"../../core/_Module",
//    "dojo/NodeList-dom",
	"../AutoScroll"
], function(declare, query, connect, Deferred, has, win, dom, keys, _Module){

/*=====
	return declare(_Module, {
		// enabled: Boolean
		//		If false, this module is disabled. This parameter is mainly used by DnD to not conflict with selection operations.
		enabled: true,

		// canSwept: Boolean
		//		If false, swept selecting by mouse is disabled. Default to true.
		canSwept: true,

		// holdingCtrl: Boolean
		//		If true, when selecting it'll appear as if the CTRL key is held.
		holdingCtrl: false,

		// holdingShift: Boolean
		//		If true, when selecting it'll appear as if the SHIFT key is held.
		holdingShift: false,

		onSelectionChange: function(newSelectedIds, oldSelectedIds){
			// summary:
			//		Fired when the selection is changed.
			// newSelectedIds: String[]
			//		Current selected ids.
			// oldSelectedIds: String[]
			//		Previous selected ids.
		}
	});
=====*/

	return declare(_Module, {
		required: ['autoScroll'],

		getAPIPath: function(){
			var path = {
				select: {}
			};
			path.select[this._type] = this;
			return path;
		},
		
		load: function(){
			var t = this, g = t.grid, doc = win.doc;
			g.domNode.setAttribute('aria-multiselectable', true);
			t._refSelectedIds = [];
			t.subscribe('gridClearSelection_' + g.id, function(type){
				if(type != t._type){
					t.clear();
				}
			});
			t.batchConnect(
				[g.body, 'onRender', '_onRender'],
				[g.domNode, 'onmouseup', '_end'],
				[g.domNode, 'onkeydown', function(e){
					if(e.keyCode == keys.SHIFT){
						dom.setSelectable(g.domNode, false);
					}
				}],
				[g.domNode, 'onkeyup', function(e){
					if(e.keyCode == keys.SHIFT){
						dom.setSelectable(g.domNode, true);
					}
				}]
			);
			t._init();
			t.loaded.callback();
		},

		//Public ------------------------------------------------------------------
		enabled: true,

		canSwept: true,

		holdingCtrl: false,

		holdingShift: false,

		selectById: function(/* id */){
			return this._subMark('_markById', arguments, true);
		},

		deselectById: function(/* id */){
			return this._subMark('_markById', arguments, false);
		},

		selectByIndex: function(/* start, end */){
			return this._subMark('_markByIndex', arguments, true);
		},

		deselectByIndex: function(/* start, end */){
			return this._subMark('_markByIndex', arguments, false);
		},

		_isSelectable: function(){
			return true;
		},

		onSelectionChange: function(/*newSelectedIds, oldSelectedIds*/){
			// summary:
			//		Event: fired when the selection is changed.
		},

		//Private -----------------------------------------------------------------
		_clear: function(){
			var t = this;
			delete t._lastToSelect;
			delete t._lastStartItem;
			delete t._lastEndItem;
		},

		_subMark: function(func, args, toSelect){
			var t = this;
			if(t.arg('enabled')){
				if(toSelect){
					connect.publish('gridClearSelection_' + t.grid.id, [t._type]);
				}
				t._lastSelectedIds = t.getSelected();

				t._refSelectedIds = [];
				return Deferred.when(t[func](args, toSelect), function(){
					t._onSelectionChange();
				});
			}
		},

		_start: function(item, extending, isRange){
			var t = this,
				g = t.grid,
				m = g.model;
			
			if(!t._selecting && !t._marking && t.arg('enabled') && t._isSelectable(item.rowId)){
				dom.setSelectable(t.grid.domNode, false);
				t._fixFF(1);
				var isSelected = t._isSelected(item) === true;
				isRange = isRange || t.arg('holdingShift');
				if(isRange && t._lastStartItem){
					t._isRange = 1;	//1 as true
					t._toSelect = t._lastToSelect;
					t._startItem = t._lastStartItem;
					t._currentItem = t._lastEndItem;
					t._lastSelectedIds = t.getSelected();
				}else{
					t._startItem = item;
					t._currentItem = null;
					
					if(extending || t.arg('holdingCtrl')){
						t._toSelect = !isSelected;
						if(t._type === 'row' && m.treeMarkMode() && !t._isSelected(item) && t._toSelect){
							t._toSelect = 'mixed';
						}
					}else{
						t._toSelect = 1;	//1 as true 
						if(t._type === 'row' && m.treeMarkMode() && !t._isSelected(item) && t._toSelect){
							t._toSelect = 'mixed';
						}
						t._lastSelectedIds = t.getSelected();
						t.clear(1);
					}
				}
				connect.publish('gridClearSelection_' + t.grid.id, [t._type]);
				t._beginAutoScroll();
				t.grid.autoScroll.enabled = true;
				t._selecting = 1;	//1 as true
				t._highlight(item);
			}
		},

		_highlight: function(target){
			var t = this,
				g = t.grid;
			if(t._selecting && t._lastStartItem != target){
				var type = t._type,
					start = t._startItem,
					current = t._currentItem,
					highlight = function(from, to, toHL){
						from = from[type];
						to = to[type];
						var dir = from < to ? 1 : -1,
							start = g.body.renderStart, 
							end = start + g.body.renderCount;
						for(; from != to; from += dir){
							if (from < start || from > end) continue;
							var item = {};
							item[type] = from;
							t._highlightSingle(item, toHL);
						}
					};
				if(current === null){
					//First time select.
					t._highlightSingle(target, 1);	//1 as true
				}else{
					if(t._inRange(target[type], start[type], current[type])){
						//target is between start and current, some selected should be deselected.
						highlight(current, target, 0);	//0 as false
					}else{
						if(t._inRange(start[type], target[type], current[type])){
							//selection has jumped to different direction, all should be deselected.
							highlight(current, start, 0);	//0 as false
							current = start;
						}
						highlight(target, current, 1);	//1 as true
					}
				}
				t._currentItem = target;
				t._focus(target);
			}
		},

		_end: function(){
			var t = this, g = t.grid;
			if(t._selecting){
				t._fixFF();
				t._endAutoScroll();
				t._selecting = 0;	//0 as false
				t._marking = 1;	//1 as true
				g.autoScroll.enabled = false;
				var d = t._addToSelected(t._startItem, t._currentItem, t._toSelect);
				t._lastToSelect = t._toSelect;
				t._lastStartItem = t._startItem;
				t._lastEndItem = t._currentItem;
				t._startItem = t._currentItem = t._isRange = null;
				Deferred.when(d, function(){
					dom.setSelectable(g.domNode, true);
					t._marking = 0;	//0 as false
					t._onSelectionChange();
				});
			}
		},

		_highlightSingle: function(target, toHighlight){
			toHighlight = toHighlight ? this._toSelect : this._isSelected(target);
			this._doHighlight(target, toHighlight);
		},

		_onSelectionChange: function(){
			var t = this, selectedIds = t.getSelected();
			t.onSelectionChange(selectedIds, t._lastSelectedIds);
			t._lastSelectedIds = selectedIds;
		},

		_inRange: function(value, start, end, isClose){
			return ((value >= start && value <= end) || (value >= end && value <= start)) && (isClose || value != end);
		},

		_fixFF: function(isStart){
			if(has('ff')){
				query('.gridxSortNode', this.grid.headerNode).style('overflow', isStart ? 'visible' : '');
			}
		}
	});
});
