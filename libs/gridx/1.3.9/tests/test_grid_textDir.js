require([
	'dojo/parser',
	'dojo/_base/Deferred',
	'dijit/registry',
	'doh/runner',
	'dojo/dom',
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/data/ItemFileWriteStore',
	'dojo/store/Memory',
	'gridx/support/printer',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/allModules',
	'dijit/form/ComboBox',
	'dijit/form/Select',
	'dijit/form/Button',
	'dojo/domReady!'
], function(parser, Deferred, registry, runner, dom, lang, array, ItemFileWriteStore, Memory, printer){

	var items = [
		{"TextBox1":"First value!",	"TextBox2": "First value!",	"ComboBox":"First value!", "Select":"First value!"},
		{"TextBox1":"Second value!", "TextBox2":"\u05e9\u05dc\u05d5\u05dd Second value!", "ComboBox":"\u05e9\u05dc\u05d5\u05dd Second value!",	"Select":"\u05e9\u05dc\u05d5\u05dd Second value!"},
		{"TextBox1":"Third value!",	"TextBox2":"Third value!", "ComboBox":"Third value!", "Select":"Third value!"},
		{"TextBox1":"Forth value!",	"TextBox2":"\u05e9\u05dc\u05d5\u05dd Forth value!", "ComboBox":"Forth value!","Select":"Forth value!"},
		{"TextBox1":"Fifth value!",	"TextBox2":"Fifth value!", "ComboBox":"Fifth value!", "Select":"Fifth value!"}
	];

	dataItems = [];
	var selectItems = [];
	for(var i = 0; i < items.length; ++i){
		dataItems.push(lang.mixin({id: i}, items[i]));
		selectItems.push({id: items[i].Select});
	}

	comboStore = new Memory({
		data: {
			identifier: 'id', 
			label: 'id', 
			items: dataItems
		}
	});

	selectStore = new ItemFileWriteStore({
		data: {
			identifier: 'id', 
			label: 'id', 
			items: selectItems
		}
	});
	
	layout = [
		{id: 'TextBox1', field: 'TextBox1', name: 'TextBox rtl(inherited!', width: '140px', alwaysEditing: true},
		{id: 'TextBox2', field: 'TextBox2', name: 'TextBox auto editable!', width: '140px', editable: true, textDir: 'auto'},
		{id: 'ComboBox', field: 'ComboBox', name: 'ComboBox rtl(inherited', width: '140px', alwaysEditing: true,
			editor: "dijit.form.ComboBox",
			editorArgs: {
				props: 'store: comboStore, searchAttr: "ComboBox"'
			}
		},
		{id: 'Select', field: 'Select', name: 'Select auto', width: '135px', alwaysEditing: true, textDir: 'auto',
			editor:  "dijit.form.Select",
			editorArgs: {
				props: 'store: selectStore, labelAttr: "id"'
			}
		},
		{ id: "Button", field: 'Button', name:"Button rtl(inherited!", width: '120px', alwaysEditing: true,
			editor: "dijit.form.Button",
			editorArgs: {
				props: 'label: "\u05e9\u05dc\u05d5\u05dd Hello!"'
			}
		}
	];

	toggleTextDir = function(){
		grid.set("textDir",(grid.get("textDir") !== "rtl") ? "rtl" : "ltr");
	};

	printPreview = function(){
		printer.toHTML(grid, {
			title: "Report",
			styleSrc: 'support/test_grid_printer.css'
		}).then(function (result){
			var win = window.open();
			win.document.write(result);
			win.document.close();
		});
	};

	Deferred.when(parser.parse(), function(){
		runner.register("gridx.tests.grid_textDir", [
			{
				name: "GridX , Bidi",
				runTest: function(){
					var element = registry.byId('dijit_form_TextBox_0');
					if(element) {
						runner.is("rtl", element.get("textDir"), "TextBox 'textDir' property should coinside with that of grid");
					}
					if(grid.column(1).textDir === 'auto'){
						if(grid.cell(0, 1).data().charCodeAt(0) < 122)
							runner.is("ltr", grid.cell(0, 1).node().style.direction, "widget 'direction' style should be 'ltr' since text starts with english character");

						if(grid.cell(1, 1).data().charCodeAt(0) > 122)
							runner.is("rtl", grid.cell(1, 1).node().style.direction, "widget 'direction' style should be 'rtl' since text starts with Hebrew character");
					}

					element = registry.byId('dijit_form_ComboBox_0');
					if(element) {
						runner.is("rtl", element.get("textDir"), "ComboBox 'textDir' property should coinside with that of grid");
					}
				}
			}
		]);
		runner.register("log", function(){
			dom.byId('failures').innerHTML = runner._failureCount;
			dom.byId('errors').innerHTML = runner._errorCount;
		});
		runner.run();
	});
}); 
