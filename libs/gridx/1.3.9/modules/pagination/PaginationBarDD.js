define([
	'dojo/_base/declare',
	'dojo/dom-class',
	'./_PaginationBarBase',
	'../../support/DropDownPager',
	'../../support/DropDownSizer'
], function(declare, domClass, _PaginationBarBase, DropDownPager, DropDownSizer){

/*=====
	return declare(_PaginationBarBase, {
		// summary:
		//		module name: paginationBar.
	});
=====*/

	return declare(_PaginationBarBase, {
		_init: function(pos){
			var t = this,
				pagerProt = DropDownPager.prototype,
				sizerProt = DropDownSizer.prototype;
			t._add(DropDownPager, 1, pos, 'stepper', {
				className: 'gridxPagerStepperTD',
				visibleSteppers: t.arg('visibleSteppers'),
				stepperClass: t.arg('stepperClass') || pagerProt.stepperClass,
				stepperProps: t.arg('stepperProps') || pagerProt.stepperProps
			});
			t._add(DropDownSizer, 2, pos, 'sizeSwitch', {
				className: 'gridxPagerSizeSwitchTD',
				sizes: t.arg('sizes'),
				sizeSeparator: t.arg('sizeSeparator'),
				sizerClass: t.arg('sizerClass') || sizerProt.sizerClass,
				sizerProps: t.arg('sizerProps') || sizerProt.sizerProps
			});
		},

		_refresh: function(bar, pos){
			domClass.toggle(bar[1].domNode, 'dijitHidden', !this._exist(pos, 'stepper'));
			domClass.toggle(bar[2].domNode, 'dijitHidden', !this._exist(pos, 'sizeSwitch'));
			bar[2].sizes = this.arg('sizes');
		}
	});
});
