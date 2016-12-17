define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"./_Base",
	"../../core/model/extensions/Mark"
], function(declare, lang, _Base, Mark){

/*=====
	return declare(_Base, {
	});
=====*/

	return declare(_Base, {
		modelExtensions: [Mark],

		selectById: function(rowId, columnId){
			var t = this,
				m = t.model,
				type = t._getMarkType(columnId),
				item = t._type == 'row' ? rowId : [rowId, columnId];
			if(t.arg('enabled') && t._isSelectable(item)){
				if(!t.arg('multiple')){
					m.clearMark(type);
				}
				m.markById(rowId, 1, type);
				m.when();
			}
		},

		deselectById: function(rowId, columnId){
			var t = this,
				m = t.model,
				item = t._type == 'row' ? rowId : [rowId, columnId];
			if(t.arg('enabled') && t._isSelectable(item)){
				m.markById(rowId, 0, t._getMarkType(columnId));
				m.when();
			}
		},

		isSelected: function(rowId, columnId){
			//Mixed status is not selected
			return this.model.getMark(rowId, this._getMarkType(columnId)) === true;
		},

		//Private-----------------------------------------------------------------
		_init: function(){
			var t = this, m = t.model;
			t.connect(m, 'onMarkChange', '_onMark');
		}
	});
});
