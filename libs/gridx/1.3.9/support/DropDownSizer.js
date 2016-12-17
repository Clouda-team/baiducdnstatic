define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dijit/_WidgetBase",
	"dijit/_FocusMixin",
	"dijit/_TemplatedMixin",
	"dijit/form/Select"
], function(declare, lang, _WidgetBase, _FocusMixin, _TemplatedMixin, Select){

/*=====
	return declare([_WidgetBase, _FocusMixin, _TemplatedMixin], {
		// summary:
		//		This grid bar plugin is to switch page sizes using select widget.

		// grid: [const] gridx.Grid
		//		The grid widget this plugin works for.
		grid: null,

		// sizes: Integer[]
		//		An array of available page sizes. Non-positive number means "all"
		sizes: [10, 25, 50, 100, 0],

		// sizerClass: Function
		//		The constructor of the select widget
		sizerClass: Select,

		// sizerProps: Object
		//		The properties passed to select widget when creating it.
		sizerProps: null,

		refresh: function(){}
	});
=====*/

	return declare([_WidgetBase, _FocusMixin, _TemplatedMixin], {
		templateString: '<div class="gridxDropDownSizer"><label class="gridxPagerLabel">${pageSizeLabel}</label></div>',

		constructor: function(args){
			lang.mixin(this, args.grid.nls);
		},

		postCreate: function(){
			var t = this;
			t.connect(t.grid.pagination, 'onChangePageSize', '_onChange');
			t.grid.pagination.loaded.then(function(){
				t.refresh();
			});
		},
		startup: function(){
			this.inherited(arguments);
			//Set initial page size after pagination module is ready.
			this._onChange(this.grid.pagination.pageSize());
		},

		//Public-----------------------------------------------------------------------------
		grid: null,

		sizes: [10, 25, 50, 100, 0],

		sizerClass: Select,

		sizerProps: null,

		refresh: function(){
			var t = this,
				options = [],
				p = t.grid.pagination,
				currentSize = p.pageSize(),
				sizeSwitch = t._sizeSwitchSelect,
				sizes = t.sizes;
			for(var i = 0, len = sizes.length; i < len; ++i){
				var pageSize = sizes[i],
					isAll = !(pageSize > 0);
				options.push({
					label: String(isAll ? t.pageSizeAll : pageSize),
					value: String(isAll ? -1 : pageSize),
					selected: currentSize == pageSize || (isAll && p.isAll())
				});
			}
			if(!sizeSwitch){
				var cls = t.sizerClass,
					props = lang.mixin({
						options: options,
						'class': 'gridxPagerSizeSwitchWidget',
						'aria-label': 'switch page size',
						onChange: function(ps){
							ps = parseInt(ps, 10);
							p.setPageSize(ps < 0 ? 0 : ps);
						}
					}, t.sizerProps || {});
				sizeSwitch = t._sizeSwitchSelect = new cls(props);
				sizeSwitch.placeAt(t.domNode, "last");
				sizeSwitch.startup();
			}else{
				sizeSwitch.removeOption(sizeSwitch.getOptions());
				sizeSwitch.addOption(options);
			}
		},

		//Private----------------------------------------------------------------------------
		_onChange: function(size){
			var select = this._sizeSwitchSelect;
			if(this.grid.pagination.isAll()){
				size = -1;
			}
			if(select && select.get('value') != size){
				select.set('value', size);
			}
		}
	});
});
