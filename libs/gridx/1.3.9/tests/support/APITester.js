define([
	'dojo/_base/declare',
	'dojo/_base/Deferred',
	'dijit/registry',
	'dijit/_Widget',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin'
], function(declare, Deferred, registry, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin){

var apis = [
	{
		name: 'resize()',
		func: function(grid){
			grid.resize();
		}
	}/*,
	{
		name: 'resize() smaller',
		func: function(grid){
			var h = grid.domNode.offsetHeight * 0.8;
			var w = grid.domNode.offsetWidth * 0.8;
			if(w > 100 && h > 50){
				grid.resize({ w: w, h: h });
			}
		}
	},
	{
		name: 'resize() larger',
		func: function(grid){
			var h = grid.domNode.offsetHeight * 1.2;
			var w = grid.domNode.offsetWidth * 1.2;
			if(w < 1200 && h < 1000){
				grid.resize({ w: w, h: h });
			}
		}
	}*/
];

function testAPIs(grid, logger, timeout){
	logger = logger || function(api, idx){
		console.log(idx, '--', api.name);
	};
	timeout = timeout || 0;
	function f(){
		var idx = Math.floor(Math.random() * apis.length);
		var api = apis[idx];
		logger(api, idx);
		Deferred.when(api.func(grid), function(){
			if(!testAPIs.stop){
				setTimeout(f, timeout);
			}
		});
	}
	setTimeout(f, timeout);
}

var APITester = declare('gridx.tests.support.APITester', [_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {
	templateString: [
		'<div class="apiTester">',
			'<button data-dojo-type="dijit.form.Button" data-dojo-attach-event="onClick: start">Start</button>',
			'<button data-dojo-type="dijit.form.Button" data-dojo-attach-event="onClick: stop">Stop</button>',
			'<button data-dojo-type="dijit.form.Button" data-dojo-attach-event="onClick: clear">Clear</button>',
			'<div class="apiTesterLog" data-dojo-attach-point="log"></div>',
		'</div>'
	].join(''),

	grid: null,

	start: function(){
		var self = this,
			grid = self.grid;
		if(typeof grid == 'string'){
			grid = registry.byId(grid);
		}
		if(grid){
			testAPIs.stop = 0;
			testAPIs(grid, function(api, idx){
				self.log.innerHTML += ' ' + idx;
			}, 10);
		}
	},

	stop: function(){
		testAPIs.stop = 1;
	},

	clear: function(){
		this.log.innerHTML = '';
	}
});

APITester.test = testAPIs;

return APITester;
});
