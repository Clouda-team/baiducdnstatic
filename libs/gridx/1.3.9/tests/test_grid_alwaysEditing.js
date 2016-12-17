require([
	'dojo/parser',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'dojo/data/ItemFileWriteStore',
	'dojo/date/locale',
	'dojo/store/Memory',
	'dijit/form/TextBox',
	'dijit/form/ComboBox',
	'dijit/form/ComboButton',
	'dijit/form/DateTextBox',
	'dijit/form/TimeTextBox',
	'dijit/form/NumberTextBox',
	'dijit/form/FilteringSelect',
	'dijit/form/Select',
	'dijit/form/HorizontalSlider',
	'dijit/form/NumberSpinner',
	'dijit/form/CheckBox',
	'dijit/form/ToggleButton',
	'dijit/Calendar',
	'dijit/Menu',
	'dijit/ColorPalette',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	"gridx/allModules",
	'dojo/domReady!'
], function(parser, dataSource, storeFactory, IFWSFactory, IFWStore, locale, Memory,
	TextBox, ComboBox, ComboButton, DateTextBox, TimeTextBox, NumberTextBox, FilteringSelect, Select){

	var getDate = function(d){
		res = locale.format(d, {
			selector: 'date',
			datePattern: 'yyyy/M/d'
		});
		return res;
	};
	var getTime = function(d){
		res = locale.format(d, {
			selector: 'time',
			timePattern: 'hh:mm:ss'
		});
		return res;
	};

	store1 = storeFactory({
		dataSource: dataSource, 
		size: 100
	});

	store2 = storeFactory({
		dataSource: dataSource, 
		size: 100
	});

	//Monitor writing store
	// dojo.connect(store1, 'put', function(){
	// 	console.log('put store1:', arguments);
	// });
	// dojo.connect(store2, 'put', function(){
	// 	console.log('put store2:', arguments);
	// });

	mystore = IFWSFactory({
		dataSource: dataSource, 
		size: 200
	});

	function createSelectStore(field){
		var data = dataSource.getData(100).items;
		//Make the items unique
		var res = {};
		for(var i = 0; i < data.length; ++i){
			res[data[i][field]] = 1;
		}
		data = [];
		for(var d in res){
			data.push({
				id: d
			});
		}
		return new IFWStore({
			data: {
				identifier: 'id',
				label: 'id',
				items: data
			}
		});
	}

	function createMemoryStore(field) {
		var data = dataSource.getData(100).items;
		//Make the items unique
		var res = {};
		for(var i = 0; i < data.length; ++i){
			res[data[i][field]] = 1;
		}
		data = [];
		for(var d in res){
			data.push({
				id: d
			});
		}
		return new Memory({
			data: data
		});
	}

	fsStore = createSelectStore('Album');
	selectStore = createMemoryStore('Length');
	var dropDownCreate = function(){
		return [
			'<div data-dojo-attach-point="combo" data-dojo-type="dijit/form/ComboButton" data-dojo-props="label:\'Select\'">',
			'<div data-dojo-attach-point="sMenu" data-dojo-type="dijit/Menu"></div></div>'
		].join('');
	};

	layout = [
		{id: 'id', field: "id", name:"ID", width: '20px'},
		{id: "Genre", field: "Genre", name:"TextBox", width: '100px', editable: true, alwaysEditing: true},
		{id: 'Artist', field: "Artist", name:"ComboBox", width: '100px', alwaysEditing: true,
			decorator: function(data){
				return "<b>" + data + "</b>";
			},
			canEdit: function(cell){
				return cell.row.index() % 2;
			},
			editor: "dijit.form.ComboBox",
			editorArgs: {
				props: 'store: mystore, searchAttr: "Artist"'
			}
		},
		{id: 'Year', field: "Year", name:"NumberTextBox", width: '100px', alwaysEditing: true,
			editor: "dijit.form.NumberTextBox"
		},
		{id: 'Album', field: "Album", name:"FilteringSelect", width: '100px', alwaysEditing: true,
			editor: FilteringSelect,
			editorArgs: {
				props: 'store: fsStore, searchAttr: "id"'
			}
		},
		{id: 'Length', field: "Length", name:"Select", width: '100px', alwaysEditing: true,
			//FIXME: this is still buggy, hard to set width properly
			editor: Select,
			editorArgs: {
				props: 'store: selectStore, labelAttr: "id"'
			}
		},
		{id: 'Progress', field: "Progress", name:"HorizontalSlider", width: '100px', alwaysEditing: true,
			editor: "dijit.form.HorizontalSlider",
			editorArgs: {
				props: 'minimum: 0, maximum: 1'
			}
		},
		{id: 'Track', field: "Track", name:"Number Spinner",
			// width: '100px',
			alwaysEditing: true,
			width: '50px',
			editor: "dijit.form.NumberSpinner"
		},
		// {id: 'Heard1', field: "Heard", name:"Check Box", width: '30px', alwaysEditing: true,
		// 	editor: "dijit.form.CheckBox",
		// 	editorArgs: {
		// 		props: 'value: true'
		// 	}
		// },
		{id: 'Heard1-1', field: "Heard", name:"Radio Button", width: '30px', alwaysEditing: true,
			editor: "dijit.form.RadioButton",
			editorArgs: {
				props: 'value: true'
			}
		},
		{id: 'Heard2', field: "Heard", name:"ToggleButton", width: '100px', alwaysEditing: true,
			editor: "dijit.form.ToggleButton",
			editorArgs: {
				valueField: 'checked',
				props: 'label: "Press me"'
			}
		},
		{id: 'Download Date', field: "Download Date", name:"DateTextBox", width: '100px', alwaysEditing: true,
			dataType: 'date',
			storePattern: 'yyyy/M/d',
			gridPattern: 'yyyy--MM--dd',
			editor: DateTextBox,
			editorArgs: {
				fromEditor: getDate
			}
		},
		{id: 'Last Played', field: "Last Played", name:"TimeTextBox", width: '100px', alwaysEditing: true,
			dataType: "time",
			storePattern: 'HH:mm:ss',
			formatter: 'hh:mm a',
			editor: TimeTextBox,
			editorArgs: {
				fromEditor: getTime
			}
		}
	];

	parser.parse();
});
