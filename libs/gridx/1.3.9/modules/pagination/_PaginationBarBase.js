define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/dom-class',
	'../../core/_Module',
	'../../support/Summary',
	'../Bar'
], function(declare, lang, domClass, _Module, Summary){

/*=====
	return declare(_Module, {
		// sizes: Integer[]
		sizes: [10, 25, 50, 0],

		// position: String
		//		The position of the pagination bar, can be "bottom" (default), "top" or "both" (any other value means "both")
		position: 'bottom',

		// description: Boolean|String
		//		Whether (and where) to show "description" part of the pagination bar UI.
		//		Can be true/false, or "bottom", or "top"
		description: true,

		// stepper: Boolean|String
		//		Whether (and where) to show "page stepper" part of the pagination bar UI.
		//		Can be true/false, or "bottom", or "top"
		stepper: true,

		// sizeSwith: Boolean|String
		//		Whether (and where) to show "page size switcher" part of the pagination bar UI.
		//		Can be true/false, or "bottom", or "top"
		sizeSwitch: true,

		refresh: function(){
			// summary:
			//		Redraw the pagination bar using corrent parameters.
		}
	});
=====*/

	return declare(_Module, {
		name: 'paginationBar',

		required: ['bar', 'pagination'],

		sizes: [10, 25, 50, 0],

		position: 'bottom',

		description: true,

		stepper: true,

		sizeSwitch: true,

		showRange: false,

		showTotal: true,

		//message: '',

		preload: function(){
			for(var t = this, i = 0, positions = ['top', 'bottom']; i < positions.length; ++i){
				var pos = positions[i];
				if(t._exist(pos)){
					t._add(Summary, 0, pos, 'description', {
						className: 'gridxPagerDescriptionTD',
						message: t.arg('message')
					});
					t._init(pos);
				}
			}
		},

		refresh: function(){
			var t = this,
				bar = t.grid.bar,
				update = function(bar, pos){
					if(bar){
						bar = bar[0];
						domClass.toggle(bar[0].domNode, 'dijitHidden', !t._exist(pos, 'description'));
						t._refresh(bar, pos);
						for(var i = 0; i < bar.length; ++i){
							bar[i].refresh();
						}
					}
				};
			update(bar.plugins.pagingtop, 'top');
			update(bar.plugins.pagingbottom, 'bottom');
		},

		//Private--------------------------------------------------------------------------
		_add: function(plugin, col, bar, name, args){
			this.grid.bar.defs.push(lang.mixin({
				bar: 'paging' + bar,
				priority: bar == 'top' ? -1 : 2,
				container: bar == 'top' ? 'headerNode' : 'footerNode',
				barClass: 'gridxPaginationBar',
				row: 0,
				col: col,
				'class': this._exist(bar, name) ? '' : 'dijitHidden',
				pluginClass: plugin,
				showRange: this.arg('showRange')
			}, args));
		},

		_exist: function(pos, argName){
			var v = this.arg(argName || 'position');
			v = v && String(v).toLowerCase();
			return v && ((v != 'top' && v != 'bottom') || v == pos);
		}
	});
});
