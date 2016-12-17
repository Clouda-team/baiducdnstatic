require([
	'dojo/parser',
	'dojo/on',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/data/TestData',
	'gridx/tests/support/stores/JsonRest',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/core/model/cache/Async',
	"gridx/allModules",
	'dijit/form/ComboButton',
	'dijit/Menu',
	'dijit/MenuItem',
	'dijit/ProgressBar',
	'dijit/form/Button',
	'dijit/form/CheckBox',
	'dijit/form/DropDownButton',
	'dijit/form/TextBox',
	'dijit/form/NumberTextBox',
	'dijit/TooltipDialog',
	'dijit/ColorPalette',
	'dojo/domReady!'
], function(parser, on, dataSource1, storeFactory1, dataSource2, storeFactory2){
	store1 = storeFactory1({
		dataSource: dataSource1,
		size: 100
	});

	layout1 = dataSource1.layouts[1];

	store2 = storeFactory2({
		path: './support/stores',
		dataSource: dataSource2,
		size: 100
	});

	layout2 = dataSource2.layouts[1];

	layout3 = [
		{ field: "id", name:"Index", width: '30px'},
		{ field: "Progress", name:"Progress", dataType:'number', width: '200px',
			widgetsInCell: true, 
			decorator: function(){
				return [
					"<div data-dojo-type='dijit.ProgressBar' data-dojo-props='maximum: 1' ",
					"class='gridxHasGridCellValue' style='width: 100%;'></div>"
				].join('');
			}
		},
		{ field: "Artist", name:"Button", width: '200px',
			widgetsInCell: true,
			navigable: true,
			decorator: function(){
				//Generate cell widget template string
				return [
					'<button data-dojo-type="dijit.form.Button" ',
					'data-dojo-attach-point="btn" ',
					'data-dojo-props="onClick: function(){',
						'alert(this.get(\'label\'));',
					'}"></button>'
				].join('');
			},
			setCellValue: function(data){
				//"this" is the cell widget
				this.btn.set('label', data);
			}
		},
		{ field: "Album", name:"Read-only CheckBox", width: '200px',
			widgetsInCell: true,
			decorator: function(){
				return [
					'<span data-dojo-type="dijit.form.CheckBox" ',
						'data-dojo-attach-point="cb" ',
						'data-dojo-props="readOnly: true"',
					'></span>',
					'<label data-dojo-attach-point="lbl"></label>'
				].join('');
			},
			setCellValue: function(data){
				//"this" is the cell widget
				this.lbl.innerHTML = data;
				this.cb.set('value', data.length % 2);
			}
		},
		{ field: "Genre", name:"ComboButton", width: '200px',
			widgetsInCell: true,
			decorator: function(){
				return [
					'<div data-dojo-type="dijit.form.ComboButton" ',
						'data-dojo-attach-point="btn" ',
						'data-dojo-props="',
							'optionsTitle:\'Save Options\',',
							'iconClass:\'dijitIconFile\',',
							'onClick:function(){ console.log(\'Clicked ComboButton\'); }',
					'">',
					'<div data-dojo-type="dijit.Menu">',
					'<div data-dojo-type="dijit.MenuItem"',
						'data-dojo-props="',
							'iconClass:\'dijitEditorIcon dijitEditorIconSave\',',
							'onClick:function(){ console.log(\'Save\'); }">',
						'Save',
					'</div>',
					'<div data-dojo-type="dijit.MenuItem"',
						'data-dojo-props="onClick:function(){ console.log(\'Save As\'); }">',
						'Save As',
					'</div></div></div>'
				].join('');
			},
			setCellValue: function(data){
				this.btn.set('label', data);
			}
		},
		{ field: "Name", name:"DropDown Button", width: '200px',
			widgetsInCell: true, 
			navigable:true,
			decorator: function(){
				return [
					'<div data-dojo-type="dijit.form.DropDownButton" ',
						'data-dojo-attach-point="btn"',
						'data-dojo-props="iconClass:\'dijitIconApplication\'">',
						'<div data-dojo-type="dijit.TooltipDialog" data-dojo-attach-point="ttd">',
							'hihi',
						'</div>',
					'</div>'
				].join('');
			},
			setCellValue: function(data){
				this.btn.set('label', data);
			}
		}
	];

	layout4 = [
		{ field: "id", name:"ID", width: '20px'},
		{ field: "Color", name:"Color Palatte", width: '205px', editable: true,
			decorator: function(data){
				return [
					'<div style="display: inline-block; border: 1px solid black; ',
					'width: 20px; height: 20px; background-color: ',
					data,
					'"></div>',
					data
				].join('');
			},
			editor: 'dijit.ColorPalette',
			editorArgs: {
				fromEditor: function(v, cell){
					return v || cell.data(); //If no color selected, use the orginal one.
				}
			}
		},
		{ field: "Genre", name:"TextBox", width: '100px', editable: true},
		{ field: "Year", name:"NumberTextBox", width: '100px', editable: true,
			editor: "dijit.form.NumberTextBox"
		}
	];

	layout5 = [
		{ field: "id", name:"ID", width: '20px'},
		{ field: "Color", name:"Color Palatte", width: '205px', alwaysEditing: true,
			decorator: function(data){
				return [
					'<div style="display: inline-block; border: 1px solid black; ',
					'width: 20px; height: 20px; background-color: ',
					data,
					'"></div>',
					data
				].join('');
			},
			editor: 'dijit.ColorPalette',
			editorArgs: {
				fromEditor: function(v, cell){
					return v || cell.data(); //If no color selected, use the orginal one.
				}
			}
		},
		{ field: "Genre", name:"TextBox", width: '100px', alwaysEditing: true},
		{ field: "Year", name:"NumberTextBox", width: '100px', alwaysEditing: true,
			editor: "dijit.form.NumberTextBox"
		}
	];
	
	parser.parse().then(function(){
		on(grid1.domNode, 'rowHeaderClick', function(e){
			console.log('row header with id:', e.rowId, 'clicked');
		})
	});
});
