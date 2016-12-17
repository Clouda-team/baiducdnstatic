require([
	'dojo/parser',
	'dojo/_base/Deferred',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/allModules',
	'gridx/tests/support/data/ComputerData',
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/TestPane',
	'dijit/registry',
	'gridx/support/printer',
	'dijit/form/CheckBox',
	'dijit/form/NumberSpinner',
	'dijit/form/SimpleTextarea',
	'dijit/form/Button',
	'dijit/ProgressBar',
	'dijit/Dialog'
], function(parser, Deferred, Grid, Cache, mods, dataSource, storeFactory, TestPane, registry, printer){

	store = storeFactory({
		path: './support/stores',
		dataSource: dataSource, 
		size: 1000
	});
	layout = dataSource.layouts[1];
	modules = [
		mods.CellWidget,
		mods.ExtendedSelectRow,
		mods.ExtendedSelectColumn,
		mods.SingleSort,
		mods.NestedSort,
		mods.Filter,
		mods.FilterBar,
		mods.Pagination,
		mods.PaginationBar,
		mods.MoveRow,
		mods.MoveColumn,
		mods.DndRow,
		mods.DndColumn,
		mods.VirtualVScroller
	];

	function showResult(result){
		var win = window.open();
		win.document.write(result);
		win.document.close();
	}

	function onError(err){
		console.error('Fatal error: ', err);
	}

	function onProgress(progress){
		registry.byId('exportProgress').set('value', progress);
		var s = registry.byId('exportProgress').domNode.style;
		if(progress < 1){
			s.display = 'block';
		}else{
			setTimeout(function(){
				s.display = 'none';
			}, 500);
		}
	}

	function getArgs(){
		var args = {
			selectedOnly: registry.byId('selectedRows').get('checked'),
			omitHeader: registry.byId('omitHeader').get('checked'),
			useStoreData: registry.byId('useStoreData').get('checked')
		};
		if(registry.byId('allowTitle').get('checked')){
			args.title = registry.byId('title').get('value');
		}
		if(registry.byId('allowDescription').get('checked')){
			args.description = registry.byId('description').get('value');
		}
		if(registry.byId('cssFile').get('checked')){
			args.styleSrc = 'support/test_grid_printer.css';
		}
		if(registry.byId('allowCssString').get('checked')){
			args.style = registry.byId('cssString').get('value');
		}
		if(registry.byId('natualWidth').get('checked')){
			args.natualWidth = true;
		}
		if(registry.byId('allowColumnWidth').get('checked')){
			var cw = args.columnWidth = {};
			grid.columns().forEach(function(c){
				if(registry.byId('allowCW-' + c.id).get('checked')){
					cw[c.id] = registry.byId('cw-' + c.id).get('value');
				}
			});
		}
		if(registry.byId('allowStartIndex').get('checked')){
			args.start = registry.byId('startIndex').get('value');
		}
		if(registry.byId('allowRowCount').get('checked')){
			args.count = registry.byId('rowCount').get('value');
		}
		if(registry.byId('allowProgressStep').get('checked')){
			args.progressStep = registry.byId('progressStep').get('value');
		}
		if(registry.byId('filter').get('checked')){
			args.filter = function(row){
				var p = /Windows/;
				return p.test(row.data().platform);
			};
		}
		if(registry.byId('allowFormatters').get('checked')){
			var fs = args.formatters = {};
			if(registry.byId('formatStatus').get('checked')){
				fs.status = function(cell){
					return '<span class="' + {
						Warning: 'testDataWarningStatus',
						Critical: 'testDataCriticalStatus',
						Normal: 'testDataNormalStatus'
					}[cell.data()] + '"></span>' + cell.data();
				};
			}
			if(registry.byId('formatProgress').get('checked')){
				fs.progress = function(cell){
					return cell.data() * 100 + '%';
				};
			}
		}
		if(registry.byId('allowChooseColumns').get('checked')){
			var cols = args.columns = [];
			grid.columns().forEach(function(c){
				if(registry.byId('col-' + c.id).get('checked')){
					cols.push(c.id);
				}
			});
		}
		console.log(args);
		return args;
	}

	printGrid = function(){
		printer(grid, getArgs()).then(null, onError, onProgress);
	};

	printPreview = function(){
		printer.toHTML(grid, getArgs()).then(showResult, onError, onProgress);
	};

	//Test
	toggleTitle = function(){
		registry.byId('title').domNode.style.display = this.get('checked') ? 'block' : 'none';
	};
	toggleDescription = function(){
		registry.byId('description').domNode.style.display = this.get('checked') ? 'block' : 'none';
	};
	toggleCssString = function(){
		registry.byId('cssString').domNode.style.display = this.get('checked') ? 'block' : 'none';
	};
	toggleColumnWidth = function(){
		document.getElementById('columnwidth').style.display = this.get('checked') ? 'block' : 'none';
	};
	toggleSingleColumnWidth = function(){
		registry.byId('cw-' + this.id.split('-')[1]).set('disabled', !this.get('checked'));
	};
	toggleProgressStep = function(){
		registry.byId('progressStep').set('disabled', !this.get('checked'));
	};
	toggleStartIndex = function(){
		registry.byId('startIndex').set('disabled', !this.get('checked'));
	};
	toggleRowCount = function(){
		registry.byId('rowCount').set('disabled', !this.get('checked'));
	};
	toggleFormatters = function(){
		document.getElementById('formatters').style.display = this.get('checked') ? 'block' : 'none';
	};
	toggleChooseColumns = function(){
		document.getElementById('choosecolumns').style.display = this.get('checked') ? 'block' : 'none';
	};

	var tests = [
		'<div style="font-weight: bolder; padding: 5px;">Print Arguments</div>',
		'<input id="allowTitle" type="checkbox" data-dojo-type="dijit.form.CheckBox" data-dojo-props="',
			'onChange: toggleTitle',
		'"/><label for="allowTitle">Use Title</label><br />',
			'<input id="title" type="text" data-dojo-type="dijit.form.TextBox" data-dojo-props="',
				'value: \'System Report\'',
			'" style="display: none;"/>',
		'<input id="allowDescription" type="checkbox" data-dojo-type="dijit.form.CheckBox" data-dojo-props="',
			'onChange: toggleDescription',
		'"/><label for="allowDescription">Use Description</label><br />',
			'<textarea id="description" data-dojo-type="dijit.form.SimpleTextarea" data-dojo-props="',
				'value: \'<h1>System Report</h1>\'',
			'" style="display: none;"></textarea>',
		'<input id="cssFile" type="checkbox" data-dojo-type="dijit.form.CheckBox"/>',
			'<label for="cssFile">Use CSS File</label><br />',
		'<input id="allowCssString" type="checkbox" data-dojo-type="dijit.form.CheckBox" data-dojo-props="',
			'onChange: toggleCssString',
		'"/><label for="allowCssString">Use CSS String</label><br />',
			'<textarea id="cssString" data-dojo-type="dijit.form.SimpleTextarea" data-dojo-props="',
				'value: \'[colid=\\\'server\\\'] {color: red;}\'',
			'" style="display: none;"></textarea>',
		'<input id="natualWidth" type="checkbox" data-dojo-type="dijit.form.CheckBox"/>',
			'<label for="natualWidth">Natual Column Width</label><br />',
		'<input id="allowColumnWidth" type="checkbox" data-dojo-type="dijit.form.CheckBox" data-dojo-props="',
			'onChange: toggleColumnWidth',
		'"/><label for="allowColumnWidth">Custom Column Width</label><br />',
		'<div id="columnwidth" style="padding: 5px; display: none;"><table><tbody>'
	];

	Deferred.when(parser.parse(), function(){
		tests = tests.concat(grid.columns().map(function(c){
			return [
				'<tr><td>',
				'<input id="allowCW-', c.id, '" type="checkbox" data-dojo-type="dijit.form.CheckBox" data-dojo-props="',
					'checked: true,',
					'onChange: toggleSingleColumnWidth',
				'"/><label for="allowCW-', c.id, '">', c.name(), ':</label></td>',
				'<td><input id="cw-', c.id, '" type="text" data-dojo-type="dijit.form.TextBox" style="width: 50px;" data-dojo-props="',
					'value: \'100px\'',
				'"/></td></tr>'
			].join('');
		}));
		tests.push([
			'</tbody></table></div>',
			'<div style="font-weight: bolder; padding: 5px;">Export Arguments</div>',
			'<input id="allowProgressStep" type="checkbox" data-dojo-type="dijit.form.CheckBox" data-dojo-props="',
				'onChange: toggleProgressStep',
			'"/>',
				'<span id="progressStep" data-dojo-type="dijit.form.NumberSpinner" style="width: 50px;" data-dojo-props="',
					'value: 20,',
					'constraints: {min: 1, max: 200},',
					'disabled: true',
				'"></span><label for="allowProgressStep">Progress Step</label><br />',

			'<input id="allowStartIndex" type="checkbox" data-dojo-type="dijit.form.CheckBox" data-dojo-props="',
				'onChange: toggleStartIndex',
			'"/>',
				'<span id="startIndex" data-dojo-type="dijit.form.NumberSpinner" style="width: 50px;" data-dojo-props="',
					'value: 0,',
					'constraints: {min: 0, max: 999},',
					'disabled: true',
				'"></span><label for="allowStartIndex">Start Row Index</label><br />',

			'<input id="allowRowCount" type="checkbox" data-dojo-type="dijit.form.CheckBox" data-dojo-props="',
				'onChange: toggleRowCount',
			'"/>',
				'<span id="rowCount" data-dojo-type="dijit.form.NumberSpinner" style="width: 50px;" data-dojo-props="',
					'value: 100,',
					'constraints: {min: 1, max: 1000},',
					'disabled: true',
				'"></span><label for="allowRowCount">Row Count</label><br />',

			'<input id="omitHeader" type="checkbox" data-dojo-type="dijit.form.CheckBox"/>',
				'<label for="omitHeader">Omit Header</label><br />',

			'<input id="selectedRows" type="checkbox" data-dojo-type="dijit.form.CheckBox"/>',
				'<label for="selectedRows">Selected Rows Only</label><br />',

			'<input id="filter" type="checkbox" data-dojo-type="dijit.form.CheckBox"/>',
				'<label for="filter">Filter "Windows"</label><br />',

			'<input id="useStoreData" type="checkbox" data-dojo-type="dijit.form.CheckBox"/>',
				'<label for="useStoreData">Use Store Data</label><br />',

			'<input id="allowFormatters" type="checkbox" data-dojo-type="dijit.form.CheckBox" data-dojo-props="',
				'onChange: toggleFormatters',
			'"/><label for="allowFormatters">Use Formatters</label><br />',
			'<div id="formatters" style="padding: 5px; display: none;">',
				'<input id="formatStatus" type="checkbox" data-dojo-type="dijit.form.CheckBox" data-dojo-props="',
					'checked: true',
				'"/><label for="formatStatus">Format Column "Status"</label><br />',
				'<input id="formatProgress" type="checkbox" data-dojo-type="dijit.form.CheckBox" data-dojo-props="',
					'checked: true',
				'"/><label for="formatProgress">Format Column "Progress"</label><br />',
			'</div>',

			'<input id="allowChooseColumns" type="checkbox" data-dojo-type="dijit.form.CheckBox" data-dojo-props="',
				'onChange: toggleChooseColumns',
			'"/><label for="allowChooseColumns">Choose Columns</label><br />',
			'<div id="choosecolumns" style="padding: 5px; display: none;">'
		].join(''));
		tests = tests.concat(grid.columns().map(function(c){
			return [
				'<input id="col-', c.id,
				'" type="checkbox" data-dojo-type="dijit.form.CheckBox" data-dojo-props="checked: true"/><label for="col-',
				c.id, '">', c.name(), '</label><br />'
			].join('');
		}));
		tests.push([
			'</div><div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: printPreview">Print Preview</div><br />',
			'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: printGrid">Print</div><br />',
			'<div id="exportProgress" data-dojo-type="dijit.ProgressBar" style="display: none;" data-dojo-props="',
				'minimum: 0, maximum: 1',
			'"></div>'
		].join(''));

		var tp = new TestPane({});
		tp.placeAt('ctrlPane');
		tp.addTestSet('Print', tests.join(''));
		tp.startup();
	});
});
