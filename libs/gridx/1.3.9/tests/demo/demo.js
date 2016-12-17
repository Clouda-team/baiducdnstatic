require([
	'dojo/_base/array',
	'dojo/_base/lang',
	'dojo/_base/query',
	'dojo/ready',
	'dojo/store/Memory',
	'dijit/registry',
	'dojo/dom',
	'dojo/dom-class',
	'dojo/dom-geometry',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/core/model/cache/Async',
	'gridx/tests/demo/util/modules',
	'gridx/tests/demo/util/attrs',
	'gridx/tests/demo/util/data',
	'dijit/form/Button',
	'dijit/form/RadioButton',
	'dijit/form/NumberTextBox',
	'dijit/form/Select',
	'dijit/form/CheckBox',
	'dijit/form/HorizontalSlider',
	'dijit/form/HorizontalRule',
	'dijit/form/HorizontalRuleLabels',
	'dijit/form/NumberSpinner',
	'dojo/domReady!'
], function(array, lang, query, ready, Store, registry, dom, domClass, domGeometry, 
	Grid, SyncCache, AsyncCache, mods, attrs, data){

	//Global vars---------------------------------------------------------
	layoutStore = new Store({
		data: [
			{id: 1, order: 1, cid: 'id', cfield: 'id', cname: 'ID', cwidth: '50px', cedit: false},
			{id: 2, order: 2, cid: 'genre', cfield: 'Genre', cname: 'Genre', cwidth: '100px', cedit: false},
			{id: 3, order: 3, cid: 'artist', cfield: 'Artist', cname: 'Artist', cwidth: '10%', cedit: true},
			{id: 4, order: 4, cid: 'year', cfield: 'Year', cname: 'Year', cwidth: '50px', cedit: false},
			{id: 5, order: 5, cid: 'album', cfield: 'Album', cname: 'Album', cwidth: '150px', cedit: true},
			{id: 6, order: 6, cid: 'name', cfield: 'Name', cname: 'Name', cwidth: '100px', cedit: false},
			{id: 7, order: 7, cid: 'length', cfield: 'Length', cname: 'Length', cwidth: '60px', cedit: false},
			{id: 8, order: 8, cid: 'track', cfield: 'Track', cname: 'Track', cwidth: 'auto', cedit: false},
            {id: 9, order: 9, cid: 'composer', cfield: 'Composer', cname: 'Composer', cwidth: '5em', cedit: false}
		]
	});

	fieldStore = new Store({
		data: [
			{id: 'id'},
			{id: 'Genre'},
			{id: 'Artist'},
			{id: 'Year'},
			{id: 'Album'},
			{id: 'Name'},
			{id: 'Length'},
			{id: 'Track'},
			{id: 'Composer'}
		]
	});

	onSliderChange = function(v){
		var spinner = registry.byId('rowCountSpinner');
		if(spinner.get('value') != v){
			spinner.set('value', v);
		}
	};

	onSpinnerChange = function(){
		setTimeout(function(){
			var v = registry.byId('rowCountSpinner').get('value');
			var slider = registry.byId('rowCountSlider');
			if(slider.get('value') != v){
				slider.set('value', v);
			}
		}, 0);
	};

	moveBtnDec = function(data){
		return '<div class="moveBtns"><span class="upBtn"></span><span class="downBtn"></span></div>';
	};

	onBoolAttrValueChange = function(){
		dom.byId('boolAttrDlg').attr.value = registry.byId('boolAttrValueTrue').get('checked');
		updateCode();
		toggleTab('code');
	};

	onNumberAttrValueChange = function(){
		setTimeout(function(){
			dom.byId('numberAttrDlg').attr.value = registry.byId('numberAttrValue').get('value');
			updateCode();
			toggleTab('code');
		}, 0);
	};

	//////////////////////////////////////////////////////////////////////
	ready(function(){
		var grid = registry.byId('layoutGrid');
		var selectRow = grid.select.row;
		selectRow.selectByIndex([0, grid.rowCount()]);
		grid.connect(selectRow, 'onSelectionChange', function(){
			array.forEach(grid.rows(), function(row){
				var selected = row.isSelected();
				array.forEach(row.cells(), function(cell){
					var editor = cell.editor();
					if(editor){
						editor.set('disabled', !selected);
					}
				});
			});
			updateCode();
			toggleTab('code');
		});
		grid.connect(grid, 'onCellClick', function(e){
			if(e.columnId == 'movebtn'){
				if(domClass.contains(e.target, 'upBtn') && e.rowIndex > 0){
					grid.row(e.rowIndex).moveTo(e.rowIndex - 1);
					updateCode();
					toggleTab('code');
				}else if(domClass.contains(e.target, 'downBtn') && e.rowIndex < grid.rowCount() - 1){
					grid.row(e.rowIndex).moveTo(e.rowIndex + 2);
					updateCode();
					toggleTab('code');
				}
			}
		});
		grid.connect(grid.edit, 'onApply', function(){
			updateCode();
			toggleTab('code');
		});
		updateCode();
	});

	////////////////////////////////////////////////////////////////
	query('#codeTabBtn').on('click', function(){
		closeDialogs();
		toggleTab('code');
	});
	query('#gridTabBtn').on('click', function(){
		closeDialogs();
		toggleTab('gridTab');
		createGrid();
	});
	query('#storeBtn').on('click', function(){
		domClass.toggle('storeBtn', 'storeBtnServer');
		updateCode();
		toggleTab('code');
	});
	query('.codeContainerTitle').on('mouseover', function(e){
		query('.codeContainerTitle').forEach(function(node){
			domClass.toggle(node, 'codeContainerTitleSelected', e.target == node);
		});
		domClass.toggle('jscodeContainer', 'codeHidden', e.target.id != 'jscodeTitle');
		domClass.toggle('htmlcodeContainer', 'codeHidden', e.target.id != 'htmlcodeTitle');
	});
	query('.main').on('mouseover', closeDialogs);
	query('.dlgCloseBtn').on('mouseover', closeDialogs);

	//Local vars-----------------------------------------------------
	var coreMods = array.map(Grid.prototype.coreModules, function(m){
		return m.prototype.name;
	}).concat(['autoScroll', '_dnd']);
	var modules = {};
	var attributes = {};

	createModulePicker();
	createAttrPicker();

	//////////////////////////////////////////////////////////////////////
	function toggleTab(id){
		domClass.add(id == 'code' ? 'codeTabBtn' : 'gridTabBtn', 'tabButtonSelected');
		domClass.remove(id == 'code' ? 'code' : 'gridTab', 'tabHidden');
		domClass.remove(id == 'code' ? 'gridTabBtn' : 'codeTabBtn', 'tabButtonSelected');
		domClass.add(id == 'code' ? 'gridTab' : 'code', 'tabHidden');
	}

	function closeDialogs(){
		query('.dialog').addClass('dialogHidden');
	}

	function getItemNode(e, rootNode, cls){
		rootNode = dom.byId(rootNode);
		var n = e.target;
		while(n != rootNode && !domClass.contains(n, cls)){
			n = n.parentNode;
		}
		return n != rootNode ? n : null;
	}

	function onClickModuleItem(e){
		var n = getItemNode(e, 'modulePicker', 'moduleItem');
		if(n){
			var idx = parseInt(n.getAttribute('modidx'), 10);
			domClass.toggle(n, 'moduleSelected', !modules[idx]);
			if(modules[idx]){
				delete modules[idx];
				removeDependantMods();
			}else{
				modules[idx] = mods[idx];
				addDependantMods(idx);
			}
			updateCode();
			toggleTab('code');
		}
	}

	function onHoverModuleItem(e){
		var n = getItemNode(e, 'modulePicker', 'moduleItem');
		if(n){
			closeDialogs();
			//show module dialog
			var idx = parseInt(n.getAttribute('modidx'), 10);
			var mod = mods[idx];
			var pos = domGeometry.position(n);
			var prot = mod.module.prototype;
			var dlg = dom.byId('moduleDialog');
			query('.moduleDlgPic', dlg).attr('src', mod.pic);
			query('.moduleDlgLabel', dlg)[0].innerHTML = mod.label;
			query('.moduleDlgSourcePath', dlg)[0].innerHTML = mod.mid + '.js';
			query('.moduleDlgNameValue', dlg)[0].innerHTML = mod.module.prototype.name;
			query('.moduleDlgDescription', dlg)[0].innerHTML = mod.description || 'TODO: Need description...';
			var deps = (prot.forced || []).concat(prot.required || []);
			deps = array.map(array.filter(deps, function(dep){
				return array.indexOf(coreMods, dep) < 0;
			}), function(dep){
				return ['<span class="moduleDlgDep">', dep, '</span>'].join('');
			});
			query('.moduleDlgDeps', dlg)[0].innerHTML = deps.length ? deps.join('') : 'None';
			dlg.style.left = (pos.x + pos.w + 20) + 'px';
			dlg.style.top = pos.y + 'px';
			domClass.remove(dlg, 'dialogHidden');
		}
	}

	function createModulePicker(){
		var modPicker = dom.byId('modulePicker');
		modPicker.innerHTML = array.map(mods, function(mod, i){
			return [
				'<div class="moduleItem" modidx="',
				i,
				'"><span class="moduleIcon ',
				mod.iconClass,
				'"></span><span class="moduleLabel">',
				mod.label,
				'</span></div>'
			].join('');
		}).join('');
		query('#modulePicker').on('click', onClickModuleItem);
		query('#modulePicker').on('mouseover', onHoverModuleItem);
	}

	function onClickAttrItem(e){
		var n = getItemNode(e, 'attrPicker', 'attrItem');
		if(n){
			var idx = parseInt(n.getAttribute('attridx'), 10);
			domClass.toggle(n, 'attrSelected', !attributes[idx]);
			if(attributes[idx]){
				delete attributes[idx];
			}else{
				attributes[idx] = attrs[idx];
			}
			updateCode();
			toggleTab('code');
		}
	}

	function onHoverAttrItem(e){
		var n = getItemNode(e, 'attrPicker', 'attrItem');
		if(n){
			closeDialogs();
			//show attr tooltipdialog
			var idx = parseInt(n.getAttribute('attridx'), 10);
			var attr = attrs[idx];
			var pos = domGeometry.position(n);
			var dlg;
			if(attr.type == 'bool'){
				dlg = dom.byId('boolAttrDlg');
				registry.byId(attr.value ? 'boolAttrValueTrue' : 'boolAttrValueFalse').set('checked', true);
			}else if(attr.type == 'number'){
				dlg = dom.byId('numberAttrDlg');
				registry.byId('numberAttrValue').set('value', attr.value);
			}
			if(dlg){
				dlg.attr = attr;
				query('.attrMod', dlg)[0].innerHTML = attr.mod;
				query('.attrName', dlg)[0].innerHTML = attr._name;
				query('.attrDesc', dlg)[0].innerHTML = attr.description || 'TODO: Need description...';
				dlg.style.left = (pos.x - 320) + 'px';
				dlg.style.top = pos.y + 'px';
				domClass.remove(dlg, 'dialogHidden');
			}
		}
	}

	function createAttrPicker(){
		var attrPicker = dom.byId('attrPicker');
		attrPicker.innerHTML = array.map(attrs, function(attr, i){
			var name = attr._name = attr.mod ? attr.name.slice(0, 1).toUpperCase() + attr.name.slice(1) : attr.name;
			attr.label = attr.mod ? attr.mod + name : name;
			return [
				'<div class="attrItem" attridx="', i, 
				'"><span class="attrModName">', attr.mod, 
				'</span><span>', name, 
				'</span></div>'
			].join('');
		}).join('');
		query('#attrPicker').on('click', onClickAttrItem);
		query('#attrPicker').on('mouseover', onHoverAttrItem);
	}

	function removeDependantMods(){
		for(var i in modules){
			var mod = modules[i];
			var forced = mod.module.prototype.forced || [];
			var required = mod.module.prototype.required || [];
			var deps = forced.concat(required);
			for(var j in modules){
				var otherMod = modules[j];
				var pos = array.indexOf(deps, otherMod.module.prototype.name);
				if(pos >= 0){
					deps.splice(pos, 1);
				}
			}
			for(var k = deps.length - 1; k >= 0; --k){
				if(array.indexOf(coreMods, deps[k]) >= 0){
					deps.splice(k, 1);
				}
			}
			if(deps.length){
				delete modules[i];
				query('[modidx="' + i + '"].moduleItem').removeClass('moduleSelected');
			}
		}
	}

	function addDependantMods(idx){
		var mod = modules[idx];
		var forced = mod.module.prototype.forced || [];
		var required = mod.module.prototype.required || [];
		var deps = array.filter(forced.concat(required), function(dep){
			for(var i in modules){
				if(modules[i].module.prototype.name == dep){
					return false;
				}
			}
			return array.indexOf(coreMods, dep) < 0;
		});
		array.forEach(deps, function(dep){
			array.some(mods, function(mod, i){
				if(mod.module.prototype.name == dep){
					modules[i] = mod;
					query('[modidx="' + i + '"].moduleItem').addClass('moduleSelected');
					addDependantMods(i);
					return true;
				}
			});
		});
	}

	function updateCode(){
		updateJSCode();
		updateHTMLCode();
	}

	function getCols(){
		var layoutGrid = registry.byId('layoutGrid');
		var selected = layoutGrid.select.row.getSelected();
		return array.map(array.map(selected, function(id){
			return layoutGrid.model.idToIndex(id);
		}).sort(function(a, b){
			return a - b;
		}), function(index){
			return layoutGrid.row(index).data();
		});
	}

	function updateJSCode(){
		var i, j = 0, sb = [
			'require([\n',
				'\t"gridx/Grid",\n',
				'\t"gridx/core/model/cache/'
		];
		var isAsync = domClass.contains('storeBtn', 'storeBtnServer');
		sb.push(isAsync ? 'Async' : 'Sync', '",\n');
		for(i in modules){
			sb.push('\t"', modules[i].mid, '",\n');
		}
		sb.push(isAsync ? '\t"dojo/store/JsonRest",\n' : '\t"dojo/store/Memory",\n',
				'\t"dojo/domReady!"\n',
			'], function(Grid, Cache, \n');
		for(i in modules){
			++j;
			if(j % 3 == 1){
				sb.push('\t');
			}
			sb.push(modules[i].name, ', ');
			if(j % 3 === 0){
				sb.push('\n');
			}
		}
		sb.push('Store){\n',
				'\n',
				'\t//Create store here...\n',
				'\t//var store = new Store(...);\n',
				'\n',
				'\tvar grid = new Grid({\n',
					'\t\tstore: store,\n',
					'\t\tcacheClass: Cache,\n',
					'\t\tstructure: [\n');
		sb = sb.concat(array.map(getCols(), function(col, i, cols){
			return [
				'\t\t\t{ id: "', col.cid, 
				'",\tfield: "', col.cfield, 
				'",\tname: "', col.cname, 
				'",\twidth: "', col.cwidth, 
				'",\teditable: ', col.cedit, 
			' }', i == cols.length - 1 ? '' : ',', '\n'].join('');
		}));
		sb.push('\t\t],\n');

		for(i in attributes){
			sb.push('\t\t', attributes[i].label, ': ', attributes[i].value, ',\n');
		}

		sb.push('\t\tmodules: [\n');
		for(i in modules){
			sb.push('\t\t\t', modules[i].name, ',\n');
		}
		sb.push('\t\t]\n',
				'\t});\n',
				'\n',
				'\tgrid.placeAt("gridContainerNode");\n',
				'\tgrid.startup();\n',
			'});');

		dom.byId('jscode').innerHTML = sb.join('');
	}

	function updateHTMLCode(){
		var i, sb = [
			'&lt;script type="text/javascript"&gt;\n',
				'\trequire([\n',
					'\t\t"gridx/Grid",\n',
					'\t\t"gridx/core/model/cache/'
		];
		var isAsync = domClass.contains('storeBtn', 'storeBtnServer');
		sb.push(isAsync ? 'Async' : 'Sync', '",\n');
		for(i in modules){
			sb.push('\t\t"', modules[i].mid, '",\n');
		}
		sb.push(isAsync ? '\t\t"dojo/store/JsonRest"\n' : '\t\t"dojo/store/Memory"\n',
				'\t], function(){\n',
					'\t\t//Create store here.\n',
					'\t\t//store = ...\n',
				'\t});\n',
			'&lt;/script&gt;\n',
			'......\n',
			'&lt;div data-dojo-type="gridx/Grid"\n',
				'\tdata-dojo-props="\n',
				'\t\tstore: store,\n',
				'\t\tcacheClass: \'gridx/core/model/cache/',
				isAsync ? 'Async' : 'Sync',
				'\',\n',
				'\t\tstructure: [\n');
		sb = sb.concat(array.map(getCols(), function(col, i, cols){
			return [
				'\t\t\t{ id: \'', col.cid, 
				'\',\tfield: \'', col.cfield, 
				'\',\tname: \'', col.cname, 
				'\',\twidth: \'', col.cwidth, 
				'\',\teditable: ', col.cedit, 
				' }', i == cols.length - 1 ? '' : ',', 
			'\n'].join('');
		}));

		sb.push('\t\t],\n');
		for(i in attributes){
			sb.push('\t\t', attributes[i].label, ': ', attributes[i].value, ',\n');
		}
		sb.push('\t\tmodules: [\n');
		for(i in modules){
			sb.push('\t\t\t\'', modules[i].mid, '\',\n');
		}
		sb.push('\t\t]\n',
			'"&gt;&lt;/div&gt;\n');

		dom.byId('htmlcode').innerHTML = sb.join('');
	}

	function createGrid(){
		grid = registry.byId('grid');
		if(grid){
			grid.destroy();
		}
		var gridContainer = dom.byId('gridContainer');
		gridContainer.innerHTML = '<div class="loader"><img src="images/loader.gif"/><h1>Loading</h1></div>';
		setTimeout(function(){
			var rowCount = registry.byId('rowCountSlider').get('value');
			var store = new Store({
				data: data(rowCount).items
			});
			var args = {
				id: 'grid',
				store: store,
				cacheClass: domClass.contains('storeBtn', 'storeBtnServer') ? AsyncCache : SyncCache,
				structure: array.map(getCols(), function(col){
					return {
						id: col.cid, 
						field: col.cfield, 
						name: col.cname,
						width: col.cwidth,
						editable: col.cedit
					};
				}),
				modules: []
			};
			for(i in attributes){
				args[attributes[i].label] = attributes[i].value;
			}
			for(i in modules){
				args.modules.push(modules[i].module);
			}
			grid = new Grid(args);
			gridContainer.innerHTML = '';
			grid.placeAt(gridContainer);
			grid.startup();
		}, 10);
	}
});
