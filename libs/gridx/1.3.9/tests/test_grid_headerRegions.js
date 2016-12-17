require([
	'dojo/parser',
	'dojo/_base/Deferred',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'dojo/dom-construct',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/allModules',
	'gridx/modules/HeaderRegions',
	'dojo/domReady!'
], function(parser, Deferred, dataSource, storeFactory, domConstruct){

	store = storeFactory({
		dataSource: dataSource,
		size: 100
	});
//    layout = [
//        {id: 'id', field: 'id', name: 'id:1'},
//        {id: 'Genre', field: 'Genre', name: 'Genre:2', width: '30px'},
//        {id: 'Artist', field: 'Artist', name: 'Artist:3', width: '150px'},
//        {id: 'Album', field: 'Album', name: 'Album:4', width: '200px'},
//        {id: 'Name', field: 'Name', name: 'Name:5', width: '200px'},
//        {id: 'Year', field: 'Year', name: 'Year:6'},
//        {id: 'Length', field: 'Length', name: 'Length:7', width: '30px'},
//        {id: 'Track', field: 'Track', name: 'Track:8'},
//        {id: 'Composer', field: 'Composer', name: 'Composer:9', width: '200px'},
//        {id: 'Download Date', field: 'Download Date', name: 'Download Date:10', width: '100px'},
//        {id: 'Last Played', field: 'Last Played', name: 'Last Played:11'},
//        {id: 'Heard', field: 'Heard', name: 'Heard:12'}
//    ];

	layout1 = [
		{id: 'id', field: 'id', name: 'id:1'},
		{id: 'Genre', field: 'Genre', name: 'Genre:2'},
		{id: 'Artist', field: 'Artist', name: 'Artist:3'},
		{id: 'Album', field: 'Album', name: 'Album:4'},
		{id: 'Name', field: 'Name', name: 'Name:5'},
		{id: 'Year', field: 'Year', name: 'Year:6'},
		{id: 'Length', field: 'Length', name: 'Length:7'},
		{id: 'Track', field: 'Track', name: 'Track:8'},
		{id: 'Composer', field: 'Composer', name: 'Composer:9'}
	];

	layout2 = [
		{id: 'id', field: 'id', name: 'id:1'},
		{id: 'Genre', field: 'Genre', name: 'Genre:2', headerFormatter: function(col){
			return col.name + '<br>' + '<a href="#">filter</a>';
		}},
		{id: 'Artist', field: 'Artist', name: 'Artist:3'},
		{id: 'Album', field: 'Album', name: 'Album:4'},
		{id: 'Name', field: 'Name', name: 'Name:5'},
		{id: 'Year', field: 'Year', name: 'Year:6'},
		{id: 'Length', field: 'Length', name: 'Length:7'},
		{id: 'Track', field: 'Track', name: 'Track:8'},
		{id: 'Composer', field: 'Composer', name: 'Composer:9'}
	];

	Deferred.when(parser.parse(), function(){
		var hr = grid1.headerRegions;
		hr.add(function(col){
			return domConstruct.create('div', {
				style: 'height: 13px; width: 10px; background-color: red;'
			});
		}, 0, 0);
		hr.add(function(col){
			return domConstruct.create('div', {
				style: 'height: 13px; width: 10px; background-color: green;'
			});
		}, 1, 0);
		hr.add(function(col){
			return domConstruct.create('div', {
				style: 'height: 13px; width: 10px; background-color: blue;'
			});
		}, 2, 0);
		hr.refresh();
	});
});
