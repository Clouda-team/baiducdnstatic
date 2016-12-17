require([
	'dojo/parser',
	'dojo/on',
	'dojo/_base/Deferred',
	'dojo/_base/array',
	'dojo/store/Memory',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'dojo/domReady!'
], function(parser, on, Deferred, array, Memory, Grid){
	window.grid = null;
	var comps = ['Header', 'Row', 'HeaderCell', 'Cell'],
		events = [
			'Click', 'DblClick',
			'MouseDown', 'MouseUp',
			'MouseOver', 'MouseOut',
			'MouseMove', 'ContextMenu',
			'KeyDown', 'KeyPress', 'KeyUp'
		];

	createStore = function(){
		var items = array.map(events, function(evt){
			var item = {id: evt};
			array.forEach(comps, function(comp){
				item[comp] = 0;
			});
			return item;
		});
		return new Memory({
			data: items
		});
	};

	layout = array.map(comps, function(comp){
		return {id: comp, name: comp, width: '100px;', field: comp};
	});
	layout.unshift({id: 'id', width: '100px;', field: 'id', style: 'background-color: #'});

	
	var createGrid = function(){
		if(grid){
			grid.destroy();
		}

		store = createStore();
		grid = new Grid({
			cacheClass: "gridx/core/model/cache/Sync",
			store: store,
			structure: layout,
			autoWidth: true,
			autoHeight: true,
			bodyRowHoverEffect: false
		});
		var bindType, inputs = dojo.query('input[type=radio]'), len = inputs.length, i;

		for(i = 0; i < len; i++){
			if(inputs[i].checked === true){
				bindType = inputs[i].id;
			}
		}

		grid.placeAt('grid');
		grid.startup();

		array.forEach(comps, function(comp){
			array.forEach(events, function(evt){
				switch(bindType){
					case 'grid.connect':
						var evtName = 'on' + comp + evt;
						grid.connect(grid, evtName, function(e){
							var cell = grid.cell(evt, comp);
							cell.setRawData(parseInt(cell.data(), 10) + 1);
						});
						break;
					case 'dojo/connect':
						var evtName = 'on' + comp + evt;
						dojo.connect(grid, evtName, function(e){
							var cell = grid.cell(evt, comp);
							cell.setRawData(parseInt(cell.data(), 10) + 1);
						});
						break;
					case 'dojo/on':
						var evtName = comp.charAt(0).toLowerCase() + comp.substr(1) + evt;
						on(grid.domNode, evtName, function(e){
							var cell = grid.cell(evt, comp);
							cell.setRawData(parseInt(cell.data(), 10) + 1);
						});
						break;
					case 'grid.on':
						var evtName = comp.charAt(0).toLowerCase() + comp.substr(1) + evt;
						grid.on(evtName, function(e){
							var cell = grid.cell(evt, comp);
							cell.setRawData(parseInt(cell.data(), 10) + 1);
						});
						break;
				}
			});
		});
	}

	createGrid();

	dojo.query('input[type=radio]').forEach(function(input){
		on(input, 'click', function(){
			createGrid();
		})
	});

});
