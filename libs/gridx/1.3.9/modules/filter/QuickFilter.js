define([
	'dojo/_base/declare',
	'dojo/dom-class',
	'dojox/gesture/tap',
	'../../core/_Module',
	'../../support/QuickFilter',
	'../Puller',
	'../Bar'
], function(declare, domClass, tap, _Module, QuickFilter){

/*=====
	return declare(_Module, {
		// summary:
		//		module name: quickFilter.
		//		Directly show gridx/support/QuickFilter in gridx/modules/Bar at the top/right position.
		// description:
		//		This module is only for convenience. For other positions or more configurations, please use gridx/modules/Bar directly.
		//		This module depends on "bar" and "filter" modules.
	});
=====*/

	return declare(_Module, {
		name: 'quickFilter',

		required: ['bar', 'filter', 'puller'],

		autoApply: true,

		delay: 700,

		preload: function(){
			var t = this,
				g = t.grid,
				bar = g.bar,
				prot = QuickFilter.prototype,
				args = {
					bar: 'top',
					row: 0,
					col: 3,
					pluginClass: QuickFilter,
					className: 'gridxBarQuickFilter',
					hookPoint: this,
					hookName: 'quickFilter',
					autoApply: t.arg('autoApply'),
					delay: t.arg('delay'),
					textBoxClass: t.arg('textBoxClass', 'dijit.form.TextBox'),
					buttonClass: t.arg('buttonClass', 'dijit.form.Button'),
					comboButtonClass: t.arg('comboButtonClass', 'dijit.form.ComboButton'),
					menuClass: t.arg('menuClass', 'dijit.Menu'),
					menuItemClass: t.arg('menuItemClass', 'dijit.MenuItem')
				};
			if(g.touch){
				args.bar = 'quickFilter';
				args.priority = 0.5;
				bar.loaded.then(function(){
					g.puller.bind(bar.quickFilterNode);
				});
			}
			bar.defs.push(args);
		}
	});
});
