define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/store/Memory",
	"dojo/query",
	"dojo/dom-attr",
	"dijit/_WidgetBase",
	"dijit/_FocusMixin",
	"dijit/_TemplatedMixin",
	"dijit/form/FilteringSelect"
], function(declare, lang, Store, query, domAttr, _WidgetBase, _FocusMixin, _TemplatedMixin, FilteringSelect){

/*=====
	return declare([_WidgetBase, _FocusMixin, _TemplatedMixin], {
		// summary:
		//		This grid bar plugin is to switch pages using select widget.

		// grid: [const] gridx.Grid
		//		The grid widget this plugin works for.
		grid: null,

		// stepperClass: Function
		//		The constructor of the select widget
		stepperClass: FilteringSelect,

		// stepperProps: Object
		//		The properties passed to select widget when creating it.
		stepperProps: null,

		refresh: function(){}
	});
=====*/

	return declare([_WidgetBase, _FocusMixin, _TemplatedMixin], {
		templateString: '<div class="gridxDropDownPager"><label class="gridxPagerLabel">${pageLabel}</label></div>',

		constructor: function(args){
			lang.mixin(this, args.grid.nls);
		},

		postCreate: function(){
			var t = this,
				g = t.grid,
				c = 'connect',
				p = g.pagination;
			t[c](p, 'onSwitchPage', '_onSwitchPage');
			t[c](p, 'onChangePageSize', 'refresh');
			t[c](g.model, 'onSizeChange', 'refresh');
			g.pagination.loaded.then(function(){
				t.refresh();
				//Set initial page after pagination module is ready.
				t._onSwitchPage(g.pagination.currentPage());
			});
		},

		//Public-----------------------------------------------------------------------------
		grid: null,

		stepperClass: FilteringSelect,

		stepperProps: null,

		refresh: function(){
			var t = this, mod = t.module,
				items = [],
				selectedItem,
				p = t.grid.pagination,
				pageCount = p.pageCount(),
				currentPage = p.currentPage(),
				stepper = t._pageStepperSelect,
				i, v, item;
			for(i = 0; i < pageCount; ++i){
				v = i + 1;
				item = {
					id: v,
					label: v,
					value: v
				};
				items.push(item);
				if(currentPage == i){
					selectedItem = item;
				}
			}
			var store = new Store({data: items});
			if(!stepper){
				var cls = t.stepperClass,
					props = lang.mixin({
						store: store,
						searchAttr: 'label',
						item: selectedItem,
						'class': 'gridxPagerStepperWidget',
						onChange: function(page){
							p.gotoPage(page - 1);
						}
					}, t.stepperProps || {});
				stepper = t._pageStepperSelect = new cls(props);
				stepper.placeAt(t.domNode, "last");
				stepper.startup();
				
				domAttr.set(query('.gridxPagerLabel', t.domNode)[0], 'for', stepper.id); 
			}else{
				stepper.set('store', store);
				stepper.set('value', currentPage + 1);
			}
			stepper.set('disabled', pageCount <= 1);
		},

		//Private----------------------------------------------------------------------------
		_onSwitchPage: function(page){
			this._pageStepperSelect.set('value', page + 1);
		}
	});
});
