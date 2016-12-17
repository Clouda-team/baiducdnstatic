require([
	'dojo/parser',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/allModules',
	'dijit/form/HorizontalSlider',
	'dijit/form/HorizontalRule',
	'dijit/form/HorizontalRuleLabels',
	'dojo/domReady!'
], function(parser, dataSource, storeFactory){

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

	headerGroups1 = [
		{name: 'Group 1', children: 3},
		{name: 'Group 2', children: 5},
		{name: 'Group 3', children: 4}
	];
	headerGroups2 = [
		1,
		{name: 'Group 1', children: 2},
		2,
		{name: 'Group 2', children: 2},
		{name: 'Group 3', children: 2}
	];
	headerGroups3 = [
		{name: 'Group 1',
			children: [
				{name: 'Group 1-1',
					children: [
						{name: 'Group 1-1-1', children: 1},
						{name: 'Group 1-1-2', children: 2}
					]
				},
				{name: 'Group 1-2',
					children: [
						{name: 'Group 1-2-1', children: 1},
						{name: 'Group 1-2-2', children: 2}
					]
				}
			]
		},
		{name: 'Group 2',
			children: [
				{name: 'Group 2-1',
					children: [
						{name: 'Group 2-1-1', children: 2},
						{name: 'Group 2-1-2', children: 1}
					]
				},
				{name: 'Group 2-2',
					children: [
						{name: 'Group 2-2-1', children: 2},
						{name: 'Group 2-2-2', children: 1}
					]
				}
			]
		}
	];
	headerGroups4 = [
		2,
		{name: 'Group 1',
			children: [
				{name: 'Group 1-1',
					children: [
						{name: 'Group 1-1-1', children: 2},
						{name: 'Group 1-1-2', children: 2}
					]
				},
				1,
				{name: 'Group 1-2', children: 2}
			]
		}
	];
	headerGroups5 = [];

	onHSliderChange = function(val){
		grid6.resize({
			w: val
		});
	};

	parser.parse();
});
