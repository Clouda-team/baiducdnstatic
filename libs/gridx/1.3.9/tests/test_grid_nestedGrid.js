require([
	'dojo/dom-construct',
	'dojo/parser',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/TestPane',
	'gridx/modules/Focus',
	'gridx/modules/VirtualVScroller',
	'gridx/modules/ColumnResizer',
	'gridx/modules/Dod',
	'gridx/modules/select/Row',
	'gridx/modules/RowHeader',
	'gridx/modules/IndirectSelect',
	'dojox/charting/themes/Julie',
	'dojox/charting/Chart',
	'dojox/charting/axis2d/Default',
	'dojox/charting/plot2d/ClusteredBars',
	'dojox/charting/plot2d/ClusteredColumns',
	'dojox/charting/plot2d/Default',
	'dojox/charting/plot2d/StackedAreas',
	'dojox/charting/plot2d/Bubble',
	'dojox/charting/plot2d/Candlesticks',
	'dojox/charting/plot2d/OHLC',
	'dojox/charting/plot2d/Pie',
	'dijit/form/Button',
	'dojo/domReady!',
	'gridx/allModules'
], function(domConstruct, parser,
			Grid, Cache, dataSource, storeFactory,
			TestPane, focus, VirtualVScroller, ColumnResizer, Dod, 
			SelectRow, RowHeader, IndirectSelect, JulieTheme){
	
	var mainStructure = [
			{id: 'id', field: 'id', name: 'Identity', dataType: 'number'},
			{id: 'Genre', field: 'Genre', name: 'Genre', dataType: 'enum',
				enumOptions: ['a', 'b', 'c']},
			{id: 'Artist', field: 'Artist', name: 'Artist', dataType: 'string'},
			{id: 'Album', field: 'Album', name: 'Album', dataType: 'string'},
			{id: 'Name', field: 'Name', name: 'Name', dataType: 'string'},
	];
	
	
	globalCache = Cache;
	globalStore = storeFactory({
				dataSource: dataSource, 
				size: 5
	});
	globalStructure =[
			{id: 'id', field: 'id', name: 'Identity', dataType: 'number', width: '33.3%'},
			{id: 'Genre', field: 'Genre', name: 'Genre', dataType: 'enum', width: '33.3%',
				enumOptions: ['a', 'b', 'c']},
			{id: 'Artist', field: 'Artist', name: 'Artist', dataType: 'string', width: '33.3%'}
	];
	
	window.defaultShow = false;
	window.showExpando = true;
	window.useAnimation = false;
	window.isP = true;			//isProgramatically
	
	window.contentType = 'form';
	window.detailProvider = function(grid, rowId, detailNode, renderred){
		if(!isP){
			setFormContentDeclaritively(detailNode, renderred);
		}else{
			setFormContentProgrammatically(detailNode, renderred);
		}
	};

	function setFormContentProgrammatically(node, renderred){
		var rowNode = node.parentNode;
		var rowId = rowNode.getAttribute('rowid');
		
		if(rowId % 2){			//odd
			var num = 2;
			var width = (100 / num) + '%';
			
			for(var i = 0; i < num; i++){
				var grid = new Grid({
					cacheClass:globalCache,
					store: globalStore,
					structure: globalStructure,
					modules: [	
								// 'gridx/modules/Pagination',
					],
					headerHidden: true,
					autoHeight: true,
					style: 'width: ' + width + '; float: left'
				});
				grid.placeAt(node);
				grid.startup();
				// break;
			}
			
		}else{			//even
			var subSt = new Date().getTime();
			var grid = new Grid({
				cacheClass:globalCache,
				store: globalStore,
				structure: globalStructure,
				modules: [	
						// 'gridx/modules/Pagination',
				],
				headerHidden: true,
				autoHeight: true,
				style: 'width: 100%; float: left'
			});
			grid.placeAt(node);
			grid.startup();		
		}
		setTimeout(function(){
			renderred.callback();
		}, 1000);
	}
	
	function setFormContentDeclaritively(node, renderred){
		node.innerHTML = [
			'<div style="margin: 10px; background:white;padding: 10px;"><table style="width:400px">',
				'<tr>',
				'	<td><label for="name">Name:</label></td>',
				'	<td><input data-dojo-type="dijit.form.ValidationTextBox"',
				'		data-dojo-props=\'required:true, name:"name" \'/></td>',
				'</tr>',
				'<tr id="newRow" style="display: none;">',
				'	<td><label for="lastName">Last Name:</label></td>',
				'	<td><input /></td>',
				'</tr>',
				'<tr>',
				'	<td><label for="birth">Birthdate (before 2006-12-31):</label></td>',
				'	<td><div><input data-dojo-type="dijit.form.DateTextBox" data-dojo-props=\'value:"2000-01-01",',
				'		required:true, name:"birth", constraints:{min:"1900-01-01", max:"2006-12-31"} \'/> <br>',
				'	</div></td>',
				'</tr>',
				'<tr>',
				'	<td><label for="notes">Notes (optional)</label></td>',
				'	<td><input data-dojo-type="dijit.form.TextBox"',
				'		data-dojo-props=\'name:"notes" \'/></td>',
				'</tr>',
				'<tr id="newRow2" style="display: none;">',
				'	<td><label for="color">Favorite Color</label></td>',
				'	<td><select id="color">',
				'		<option value="red">Red</option>',
				'		<option value="yellow">Yellow</option>',
				'		<option value="blue">Blue</option>',
				'	</select></td>',
				'</tr>',
			'</table></div>',
			// '<div style="height: 300px"></div>',
			// '<table><tr><td>',
			'<div data-dojo-type="gridx/Grid" style="width: 49%; float: left"',
			'			data-dojo-props="cacheClass:globalCache,',
			'							store: globalStore,',
			'							structure: globalStructure,',
			'							modules: [',
			'								\'gridx/modules/Pagination\',',
			'								\'gridx/modules/pagination/PaginationBar\',',
			'								\'gridx/modules/RowHeader\'',
			']"></div>',
			// '</td>',
			// '<td>',
			'<div data-dojo-type="gridx/Grid" style="width: 49%; float: left"',
			'			data-dojo-props="cacheClass:globalCache,',
			'							store: globalStore,',
			'							structure: globalStructure,',
			'							modules: [',
			'								\'gridx/modules/Pagination\',',
			'								\'gridx/modules/pagination/PaginationBar\',',
			'								\'gridx/modules/RowHeader\'',
			']"></div>',
			// '</td></tr></table>'
			].join('');
			
			var currentGrid = dijit.registry.byNode(dojo.query(node).closest('.gridx')[0]);
			parser.parse(node).then(function(){
					renderred.callback();
					// setTimeout(function(){
						var gridNodes = dojo.query('.gridx', node);
						var ws = [];
						for(var i = 0; i < gridNodes.length; i++){
							var w = dijit.byNode(gridNodes[i]);
							ws.push(w);
							console.log(w.body);
							w.body.refresh();
							console.log(w.domNode);
						};
						console.log(ws.domNode);
			});
	}

	window.createGrid = function(){
		if(window.grid){
			window.grid.destroy();
		}
		grid = new Grid({
			id: 'grid',
			cacheClass: Cache,
			store: storeFactory({
				dataSource: dataSource, 
				size: 10
			}),
			modules: [
				VirtualVScroller,
				{
					moduleClass: Dod,
					defaultShow: defaultShow,
					useAnimation: useAnimation,
					showExpando: showExpando,
					detailProvider: detailProvider
				},
				ColumnResizer
			],
			// structure: dataSource.layouts[1],
			structure: mainStructure,
			autoHeight: true
		});
		grid.placeAt('gridContainer');
		grid.startup();
	};
	
	createGrid();

});