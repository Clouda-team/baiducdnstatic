require([
	'dojo/parser',
	'dojo/dom',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'dijit/form/HorizontalSlider',
	'dijit/form/HorizontalRule',
	'dijit/form/HorizontalRuleLabels',
	'dijit/form/VerticalSlider',
	'dijit/form/VerticalRule',
	'dijit/form/VerticalRuleLabels',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/allModules',
	'dojo/domReady!'
], function(parser, dom, dataSource, storeFactory){

	store = storeFactory({
		dataSource: dataSource,
		size: 100
	});

	layout = [
		{id: 'id', field: 'id', name: 'Identity'},
		{id: 'Year', field: 'Year', name: 'Year'},
		{id: 'Length', field: 'Length', name: 'Length'},
		{id: 'Track', field: 'Track', name: 'Track'},
		{id: 'Download Date', field: 'Download Date', name: 'Download Date'},
		{id: 'Last Played', field: 'Last Played', name: 'Last Played'},
		{id: 'Heard', field: 'Heard', name: 'Heard'}
	];


	onHSliderChange = function(val){
		grid1.resize({
			w: val
		});
		dom.byId('container2').style.width = val + 'px';
		grid2.resize();
	};

	onVSliderChange = function(val){
		grid1.resize({
			h: 400 - val
		});
		dom.byId('container2').style.height = (400 - val) + 'px';
		grid2.resize();
	};

	parser.parse();
});


