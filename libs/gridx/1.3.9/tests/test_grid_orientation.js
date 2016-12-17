require([
	'dojo/parser',
	'dojo/_base/Deferred',
	'dojo/query',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/allModules',
	'dojo/domReady!'
], function(parser, Deferred, query, dataSource, storeFactory){

	store = storeFactory({
		dataSource: dataSource,
		size: 100
	});

	layout = [
		{id: 'id', field: 'id', name: 'id:1'},
		{id: 'Genre', field: 'Genre', name: 'Genre:2'},
		{id: 'Artist', field: 'Artist', name: 'Artist:3'},
		{id: 'Album', field: 'Album', name: 'Album:4'},
		{id: 'Name', field: 'Name', name: 'Name:5'},
		{id: 'Year', field: 'Year', name: 'Year:6'},
		{id: 'Length', field: 'Length', name: 'Length:7'},
		{id: 'Track', field: 'Track', name: 'Track:8'},
		{id: 'Composer', field: 'Composer', name: 'Composer:9'},
		{id: 'Download Date', field: 'Download Date', name: 'Download Date:10'},
		{id: 'Last Played', field: 'Last Played', name: 'Last Played:11'},
		{id: 'Heard', field: 'Heard', name: 'Heard:12'}
	];

	Deferred.when(parser.parse(), function(){
		//Adapt height, can be ommited if height is fixed.
		document.body.style.height = window.innerHeight + 'px';
		grid.resize();

		var oldWidth = window.outerWidth;
		grid.connect(window, 'onresize', function(){
			var t1 = new Date;
			if(window.outerWidth < oldWidth){
				//Portrait
				grid.hiddenColumns.add('Genre', 'Artist', 'Album', 'Name', 'Year', 'Composer');
			}else if(window.outerWidth > oldWidth){
				//Lanscape
				grid.hiddenColumns.clear();
			}else{
				//Not changed
				return;
			}
			oldWidth = window.outerWidth;
			console.log("Time used for changing columns: " + (new Date - t1) + 'ms');
			//Adapt height, can be ommited if height is fixed.
            document.body.style.height = window.innerHeight + 'px';
            grid.resize();
		});
	});
});
