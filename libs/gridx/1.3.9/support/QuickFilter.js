define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/dom-class',
	'dojo/keys',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dijit/form/TextBox',
	'dijit/form/Button',
	'dijit/form/ComboButton',
	'dijit/Menu',
	'dijit/MenuItem',
	'../modules/Filter',
	'dojo/text!../templates/QuickFilter.html',
	'dojox/html/entities'
], function(declare, lang, array, domClass, keys,
	_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
	TextBox, Button, ComboButton, Menu, MenuItem,
	F, template, entities){

/*=====
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		// summary:
		//		Quick filter box.

		// grid: [const] gridx.Grid
		//		The grid widget this plugin works for.
		grid: null,

		// autoApply: Boolean
		//		If true, the filter will be applied to grid during typing in the filter box.
		autoApply: true,

		// delay: Integer
		//		The time (in ms) delay before applying the filter after each key stroke in the filter box.
		//		Only effective when autoApply is true, 
		delay: 700
	});
=====*/

	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		templateString: template,

		constructor: function(args){
			var t = this;
			lang.mixin(t, args.grid.nls);
			t._hasFilterBar = args.grid.filterBar ? 'gridxQuickFilterHasFilterBar' : 'gridxQuickFilterNoFilterBar';
			if(t._hasFilterBar){
				t.connect(args.grid.filterBar, 'clearFilter', function(){
					if(t.textBox){
						t.textBox.set('value', '');
					}
				});
			}
			t.connect(args.grid.model, 'setStore', function(){
				t.textBox.set('value', '');
				domClass.remove(t.domNode, 'gridxQuickFilterActive');
			});
		},

		postCreate: function(){
			this.connect(this.textBox, 'onInput', '_onInput');
		},

		grid: null,

		textBoxClass: 'dijit.form.TextBox',

		buttonClass: 'dijit.form.Button',

		comboButtonClass: 'dijit.form.ComboButton',

		menuClass: 'dijit.Menu',

		menuItemClass: 'dijit.MenuItem',

		autoApply: true,

		delay: 700,

		//Private--------------------------------------------------------------------
		_onInput: function(evt){
			var t = this,
				dn = t.domNode,
				tb = t.textBox,
				key = evt.keyCode;
			setTimeout(function(){
				domClass.toggle(dn, 'gridxQuickFilterActive', tb.get('value'));
			}, 0);
			if(t.autoApply && key != keys.TAB){
				clearTimeout(t._handle);
				t._handle = setTimeout(function(){
					t._filter();
				}, key == keys.ENTER ? 0 : t.delay);
			}
		},

		_onKey: function(evt){
			if(evt.keyCode == keys.ENTER){
				this.grid.focus.stopEvent(evt);
				this._clear();
				this.textBox.focus();
			}
		},

		_clear: function(){
			this.textBox.set('value', '');
			domClass.remove(this.domNode, 'gridxQuickFilterActive');
			this._filter();
		},

		_filter: function(){
			var t = this,
				g = t.grid,
				v = t.textBox.get('value'),
				cols = array.filter(g.columns(), function(col){
					return col.filterable !== false;
				}),
				cs = t.grid.filter.arg('caseSensitive');

			clearTimeout(t._handle);
			if(g.filterBar){
				//TODO: is there a better way communicate with FilterBar?
				if(v === ''){
					g.filterBar.clearFilter(true);
				}else{
					g.filterBar.applyFilter({
						conditions: [{
							condition: 'contain',
							value: v
						}]
					});
				}
			}else{
				g.filter.setFilter(v === '' ? 0 : F.or.apply(0, array.map(cols, function(col){
					return col.encode === true? F.contain(F.column(col.id, null, null, null, cs), F.value(entities.encode(v), null, null, cs), cs)
							: F.contain(F.column(col.id, null, null, null, cs), F.value(v, null, null, cs), cs);
				})));
			}
		},

		_showFilterBar: function(){
			var fb = this.grid.filterBar;
			fb.show();
			fb.showFilterDialog();
		}
	});
});
