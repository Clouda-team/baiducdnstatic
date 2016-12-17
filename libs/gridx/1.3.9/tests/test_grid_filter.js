require([
	'dojo/parser',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'dojo/store/JsonRest',
	'dojo/date/locale',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/core/model/cache/Async',
	'gridx/allModules',
	'dojo/domReady!'
], function(parser, dataSource, storeFactory, JsonRest, locale, Grid){

	store = storeFactory({
		dataSource: dataSource,
		size: 100
	});

	var localDateFormatter = function(rawData) {
		var date = rawData['Download Date'];
		debugger;
		if (rawData === undefined || rawData === null ||
			date === undefined || date === null){
			return "";
		} else {
			var item = new Date(date);
			var localed = locale.format(item, {datePattern: "yyyy/M/d", selector: "date"});
			return localed;
		}
	};
	// DATE_S_FORMAT_OPTIONS: {datePattern: "yyyy/M/d", selector: "date"},

	layout = [
		{id: 'id', field: 'id', name: 'Identity', dataType: 'number'},
		{id: 'Genre', field: 'Genre', name: 'Genre', dataType: 'enum', encode: true,
			enumOptions: ['a', 'b', 'c']
		},
		{id: 'Artist', field: 'Artist', name: 'Artist', dataType: 'enum',
			enumOptions: ['d', 'e', 'f']
		},
		{id: 'Album', field: 'Album', name: 'Album', dataType: 'string', autoComplete: false},
		{id: 'Name', field: 'Name', name: 'Name', dataType: 'string', autoComplete: false},
		{id: 'Year', field: 'Year', name: 'Year', dataType: 'number'},
		{id: 'Length', field: 'Length', name: 'Length', dataType: 'string'},
		{id: 'Track', field: 'Track', name: 'Track', dataType: 'number'},
		{id: 'Composer', field: 'Composer', name: 'Composer', dataType: 'string'},
		{id: 'Download Date', field: 'Download Date', name: 'Download Date', dataType: 'date'},
		{id: 'Date Time', field: 'datetime', name: 'Date Time', dataType: 'datetime'},
		{id: 'Last Played', field: 'Last Played', name: 'Last Played', dataType: 'time'},
		{id: 'Heard', field: 'Heard', name: 'Heard', dataType: 'boolean'}
	];

	window.generateGrid = function() {
		if (grid1) grid1.destroy();

		var preCondition = dojo.byId('preFilterInput').value;
		preCondition = preCondition && JSON.parse(preCondition);

		grid1 = new Grid({
			cacheClass: "gridx/core/model/cache/Sync",
			store: store,
			structure: layout,
			selectRowTriggerOnCell: true,
			filterCaseSensitive: true,
			filterBarMaxRuleCount: 100,
			filterBarExperimental: true,
			filterBarFilterData: preCondition,
			filterBarItemsName: "elements",
			modules: [
				"gridx/modules/Filter",
				"gridx/modules/filter/FilterBar",
				"gridx/modules/SingleSort",
				"gridx/modules/extendedSelect/Row",
				"gridx/modules/IndirectSelectColumn",
				"gridx/modules/VirtualVScroller"
			]
		});
		grid1.placeAt('gridContainer');
		grid1.startup();
	}
	
	parser.parse();
});
