define([
	"dojo/_base/declare",
	"../support/Summary",
	"../core/_Module",
	"./Bar"
], function(declare, Summary, _Module){

/*=====
	return declare(_Module, {
		// summary:
		//		module name: summaryBar.
		//		Add summary bar to the bottom of grid.
		// description:
		//		Add summary based on Bar module. This module is only for conveniency and backward compatibility.
		//		Using Bar module directly is recommended.
	});
=====*/

	return declare(_Module, {
		name: 'summaryBar',

		required: ['bar'],

		//message: ''

		preload: function(){
			this.grid.bar.defs.push({
				bar: 'bottom',
				row: 0,
				col: 0,
				pluginClass: Summary,
				className: 'gridxBarSummary',
				message: this.arg('message'),
				hookPoint: this,
				hookName: 'summary'
			});
		}
	});
});
