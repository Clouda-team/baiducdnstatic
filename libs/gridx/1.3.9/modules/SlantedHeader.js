define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/event",
	"dojo/query",
	"dojo/string",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/keys",
	"../core/_Module",
	"./GroupHeader"
], function(declare, array, lang, event, query, string, domClass, domConstruct, keys, _Module, Sort, nls){

/*=====
	return declare(_Module, {
		// summary:
		//		module name: slantedheader.
		//		Slant headers including group headers.

	});
=====*/
	
	return declare(_Module, {
		name: 'slantedheader',

		_actionAreaHolder: null,

		required: ['header'],

		load: function(args, deferStartup){
			domClass.add(this.grid.domNode, 'gridxSlantedHeader');
			var self = this;

			window.setTimeout(function(){
				//Need a timeout so that the header height is available.
				//Skew the header node, and use translate to align columns
				self._updateTransform();
			},0);
			this.connect(this.grid, 'resize', '_updateTransform');
			this.loaded.callback();
		},

		_updateTransform: function(){
			var n = this.grid.header.domNode;
			var headerHeight = n.offsetHeight;
			console.log('header height: ', headerHeight);
			var translateX = Math.round(headerHeight/2) - 1; //TODO: 1 is the top border width
			n.style.transform = n.style.msTransform = n.style.mozTransform
				= n.style.webkitTransform = 'translate(' + translateX
				 + 'px, 0px) skew(-45deg,0deg)';
		}
	});
});
