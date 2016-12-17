define([
	'dojo/_base/declare',
	'dojo/_base/connect',
	'../../core/_Module'
], function(declare, connect, _Module){

/*=====
	return declare(_Module, {
		// enabled: Boolean
		//		Whether this module is enabled.
		enabled: true,
	
		// multiple: Boolean
		//		Whether multiple selectionis allowe.
		multiple: true,
	
		// holdingCtrl: Boolean
		//		Whether to add to selection all the time (as if the CTRL key is always held).
		holdingCtrl: false,

		onSelected: function(){},

		onDeselected: function(){},

		onHighlightChange: function(){}
	});
=====*/

	return declare(_Module, {
		getAPIPath: function(){
			var path = {
				select: {}
			};
			path.select[this._type] = this;
			return path;
		},

		preload: function(){
			var t = this, g = t.grid;
			t._lastSelectedIds = [];
			t.subscribe('gridClearSelection_' + g.id, function(type){
				//FIX #211
				//Three kinds of selections way should be compatible with each other?
				// if(type != t._type){
				// 	t.clear();
				// }
			});
			t.connect(g.body, 'onRender', '_onRender');
			if(t.arg('multiple')){
				g.domNode.setAttribute('aria-multiselectable', true);
			}
			t._init();
		},

		//Public--------------------------------------------------------------------
		enabled: true,

		multiple: true,

		holdingCtrl: false,

		//Events----------------------------------------------------------------------
		onSelected: function(){},

		onDeselected: function(){},

		onHighlightChange: function(){},

		onSelectionChange: function(){},

		//Private---------------------------------------------------------------------
		_getMarkType: function(){},

		_isSelected: function(){
			return this.isSelected.apply(this, arguments);
		},

		_isSelectable: function(){
			return true;
		},

		_onSelectionChange: function(){
			var t = this, selectedIds = t.getSelected();
			t.onSelectionChange(selectedIds, t._lastSelectedIds);
			t._lastSelectedIds = selectedIds;
		},

		_select: function(item, extending){
			var t = this, toSelect = 1, g = t.grid;
			if(t.arg('enabled') && t._isSelectable(item)){
				if(t.arg('multiple') && (extending || t.arg('holdingCtrl'))){
					toSelect = !t._isSelected(item);
				}else{
					t.clear(item);
				}
				connect.publish('gridClearSelection_' + t.grid.id, [t._type]);
				t._markById(item, toSelect);
			}
		}
	});
});
