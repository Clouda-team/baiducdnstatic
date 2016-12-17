define([
/*====="../core/Cell", =====*/
	"dojo/_base/declare",
	"dojo/query",
	"dojo/_base/array",
	"dojo/_base/event",
	"dojo/_base/sniff",
	"dojo/dom-class",
	"dojo/keys",
	"dijit/registry",
	"dijit/a11y",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"../core/_Module",
	"./NavigableCell"
], function(/*=====Cell, =====*/declare, query, array, event, has, domClass, keys, 
	registry, a11y, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _Module){

/*=====
	Cell.widget = function(){
		// summary:
		//		Get the cell widget in this cell.
	};

	var CellWidget = declare(_Module, {
		// summary:
		//		module name: cellWidget.
		//		This module makes it possible to efficiently show widgets within a grid cell.
		// description:
		//		Since widget declarations need to be parsed by dojo.parser, it can NOT be directly
		//		created by the decorator function. This module takes advantage of the _TemplatedMixin
		//		and the _WidgetInTemplateMixin so that users can write "templates" containing widgets
		//		in decorator function.
		//		This modules also limits the total number of widgets, so that the performance of grid
		//		can be configured to a tolerable level when there're lots of widgets in grid.

		// backupCount: Integer
		//		The count of backup widgets for every column which contains widgets
		backupCount: 20,

		setCellDecorator: function(rowId, colId, decorator, setCellValue){
			// summary:
			//		This method is used to decorate a specific cell instead of a whole column.
			// rowId: String
			//		The row ID of the cell
			// colId: String
			//		The column ID of the cell
			// decorator: Function(data)
			//		The decorator function for this cell.
			// setCellValue: Function()?
			//		This function can be provided to customiz the way of setting widget value
		},

		restoreCellDecorator: function(rowId, colId){
			// summary:
			//		Remove a cell decorator defined by the "setCellDecorator" method.
			// rowId: String
			//		The row ID of the cell
			// colId: String
			//		The column ID of the cell
		},

		getCellWidget: function(rowId, colId){
			// summary:
			//		Get the CellWidget displayed in the given cell.
			// description:
			//		When this module is used, the string returned from decorator function will be
			//		the template string of a CellWidget. This method gets this widget so that
			//		more control can be applied to it.
			// rowId: string
			//		The row ID of the cell
			// colId: string
			//		The column ID of the cell
		},

		onCellWidgetCreated: function(widget, column){
			// summary:
			//		Fired when a cell widget is created.
			// widget: CellWidget.__CellWidget
			//		The created cell widget.
			// column: gridx.core.Column
			//		The column this cell widget is created for.
			// tags:
			//		callback
		}
	});

	CellWidget.__CellWidget = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		// summary:
		//		The container widget created in a cell.

		// cell: gridx.core.Cell
		cell: null
	});

	CellWidget.__ColumnDefinition = declare([], {
		// summary:
		//		Column definition parameters defined by CellWidget.

		// navigable: Boolean
		//		If a cell is navigable, that means the focusable elements in the cell can be focused.
		//		Use F2 to enter navigation mode, ESC to exit navigation mode and return focus back to cell.
		//		Pressing TAB during navigation mode will focus the next focusalbe element in all cells.
		//		That means if the current focused element is the last one in the current cell, then pressing TAB
		//		will focus the first focusable element in the next cell.
		navigable: true,

		// widgetsInCell: Boolean
		//		Indicating whether this column should use this CellWidget module.
		//		CellWidget module reuses widgets in cell, so if there is no widgets in cell, you don't need this module at all.
		widgetsInCell: false,

		allowEventBubble: false,

		decorator: function(){
			// summary:
			//		This decorator function is slightly different from the one when this module is not used.
			//		This function should return a template string (see the doc for template string in dijit._TemplatedMixin
			//		and dijit._WidgetsInTemplateMixin). 
			//		In the template string, dijits or widgets can be used and they will be properly set value if they
			//		have the CSS class 'gridxHasGridCellValue' in their DOM node.
			//		Since setting value will be done automatically, and the created widgets will be reused between rows,
			//		so there's no arguments for this function.
			//		By default the dijits or widgets will be set value using the grid data (the result of the formatter function,
			//		if there is a formatter function for this column), not the store data (the raw data stored in store).
			//		If you'd like to use store data in some dijit, you can simly add a CSS class 'gridxUseStoreData' to it.
			// returns:
			//		html string.
		},

		setCellValue: function(gridData, storeData, cellWidget){
			// summary:
			//		If the settings in the decorator function can not meet your requirements, you use this function as a kind of complement.
			// gridData: anything
			//		The data shown in grid cell. It's the result of formatter function if that function exists.
			// storeData: anything
			//		The raw data in dojo store.
			// cellWidget: CellWidget.__CellWidget
			//		A widget representing the whole cell. This is the container of the templateString returned by decorator.
			//		So you can access any dojoAttachPoint from it (maybe your special dijit or node, and then set value for them).
		},

		onCellWidgetCreated: function(widget, column){
			// summary:
			//		Fired when a cell widget is created.
			// widget: CellWidget.__CellWidget
			//		The created cell widget.
			// column: gridx.core.Column
			//		The column this cell widget is created for.
			// tags:
			//		callback
		},

		initializeCellWidget: function(widget, cell){
			// summary:
			//		Do special initialization for the current cell.
			//		Called every time a cell widget is applied into a cell, no matter if it is just created or reused.
			// widget: CellWidget.__CellWidget
			//		The created cell widget.
		},

		uninitializeCellWidget: function(widget, cell){
			// summary:
			//		Called every time a cell widget is reused to a cell.
			// widget: CellWidget.__CellWidget
			//		The created cell widget.
		},

		getCellWidgetConnects: function(widget, cell){
			// summary:
			//		Return an array of connection arguments.
			//		CellWidget will take care of connecting/disconnecting them.
			//		Called every time a cell widget is applied into a cell, no matter if it is just created or reused.
			// widget: CellWidget.__CellWidget
			//		The created cell widget.
			// returns:
			//		An array of connection arguments.
		},

		needCellWidget: function(cell){
			// summary:
			//		Decide whether this cell should show cell widget.
			// cell: gridx.core.Cell
			//		The cell object containing this widget.
			// returns:
			//		Boolean
		}
	});

	return CellWidget;
=====*/

	var dummyFunc = function(){ return ''; },

		CellWidget = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

			content: '',

			setCellValue: null,

			cell: null,

			postMixInProperties: function(){
				this.templateString = ['<div class="gridxCellWidget">', this.content, '</div>'].join('');
			},

			postCreate: function(){
				var t = this,
					dn = t.domNode;
				t.connect(dn, 'onmousedown', function(e){
					if(e.target !== dn && !t.cell.column.allowEventBubble){
						e.cancelBubble = true;
					}
				});
				t._cellCnnts = [];
			},

			startup: function(){
				var t = this,
					cell = t.cell,
					cellWidget = cell.grid.cellWidget,
					col = cell.column,
					started = t._started;
				t.inherited(arguments);
				array.forEach(t._cellCnnts, t.disconnect, t);
				if(started){
					//Do not uninitialized on first creation.
					cellWidget.uninitializeCellWidget(t, cell);
				}
				cellWidget.initializeCellWidget(t, cell);
				var output = [];
				cellWidget.collectCellWidgetConnects(t, output);
				t._cellCnnts = array.map(output, function(cnnt){
					return t.connect.apply(t, cnnt);
				});
			},
		
			setValue: function(gridData, storeData, isInit){
				try{
					var t = this;
					query('.gridxHasGridCellValue', t.domNode).map(function(node){
						return registry.byNode(node);
					}).forEach(function(widget){
						if(widget){
							var useStoreData = domClass.contains(widget.domNode, 'gridxUseStoreData'),
								data = useStoreData ? storeData : gridData,
								handleOnChange = widget._handleOnChange;
							//If we are just rendering this cell, setting widget value should not trigger onChange event,
							//which will then trigger edit apply. But things are complicated because onChange is
							//fired asynchronously, and maybe sometimes not fired.
							//FIXME: How to ensure the onChange event does not fire if isInit is true?
							/*var onChange = widget.onChange;
							if(isInit && onChange && !onChange._init && widget.get('value') !== data){
								widget.onChange = function(){
									widget.onChange = onChange;
								};
								widget.onChange._init = true;
							}*/
							widget._handleOnChange = function(){
								widget._handleOnChange = handleOnChange;
							};
							if(!t.setCellValue){
								widget.set('value', data);
							}
						}
					});
					if(t.setCellValue){
						t.setCellValue(gridData, storeData, t, isInit);
					}
				}catch(e){
					console.error('Can not set cell value: ', e);
				}
			}
		});

	return declare(_Module, {
		name: 'cellWidget',

		required: ['navigableCell'],

		cellMixin: {
			widget: function(){
				return this.grid.cellWidget.getCellWidget(this.row.id, this.column.id);
			}
		},

		constructor: function(){
			this._init();
		},

		preload: function(){
			var t = this, body = t.grid.body;
			t.batchConnect(
				[body, 'onAfterRow', '_showDijits'],
				[body, 'onAfterCell', '_showDijit'],
				[body, 'onUnrender', '_onUnrenderRow']);
		},

		destroy: function(){
			this.inherited(arguments);
			var i, id, col, cw, columns = this.grid._columns;
			for(i = columns.length - 1; i >= 0; --i){
				col = columns[i];
				cw = col._cellWidgets;
				if(cw){
					for(id in cw){
						cw[id].destroyRecursive();
					}
					delete col._cellWidgets;
				}
			}
		},

		//Public-----------------------------------------------------------------
		backupCount: 50,

		setCellDecorator: function(rowId, colId, decorator, setCellValue){
			var rowDecs = this._decorators[rowId];
			if(!rowDecs){
				rowDecs = this._decorators[rowId] = {};
			}
			var cellDec = rowDecs[colId];
			if(!cellDec){
				cellDec = rowDecs[colId] = {};
			}
			cellDec.decorator = decorator;
			cellDec.setCellValue = setCellValue;
			cellDec.widget = null;
		},

		restoreCellDecorator: function(rowId, colId){
			var rowDecs = this._decorators[rowId];
			if(rowDecs){
				var cellDec = rowDecs[colId];
				if(cellDec){
					if(cellDec.widget){
						//Because dijit.form.TextBox use setTimeout to fire onInput event, 
						//so we can not simply destroy the widget when ENTER key is pressed for an editing cell!!
						var parentNode = cellDec.widget.domNode.parentNode;
						if(parentNode){
							parentNode.innerHTML = null;
						}
						window.setTimeout(function(){
							cellDec.widget.destroyRecursive();
							cellDec.widget = null;
							cellDec.decorator = null;
							cellDec.setCellValue = null;
						}, 100);
					}
				}
				delete rowDecs[colId];
			}
		},

		getCellWidget: function(rowId, colId){
			var cellNode = this.grid.body.getCellNode({
				rowId: rowId, 
				colId: colId
			});
			if(cellNode){
				var widgetNode = query('.gridxCellWidget', cellNode)[0];
				if(widgetNode){
					return registry.byNode(widgetNode);
				}
			}
			return null;
		},

		onCellWidgetCreated: function(widget, column){
			if(column.onCellWidgetCreated){
				column.onCellWidgetCreated.apply(this, arguments);
			}
		},

		initializeCellWidget: function(widget, cell){
			var column = cell.column;
			if(column.initializeCellWidget){
				column.initializeCellWidget.apply(this, arguments);
			}
		},

		uninitializeCellWidget: function(widget, cell){
			var column = cell.column;
			if(column.uninitializeCellWidget){
				column.uninitializeCellWidget.apply(this, arguments);
			}
		},

		collectCellWidgetConnects: function(widget, output){
			var column = widget.cell.column;
			if(column.getCellWidgetConnects){
				output.push.apply(output, column.getCellWidgetConnects(widget, widget.cell));
			}
		},

		//Private---------------------------------------------------------------
		_init: function(){
			this._decorators = {};
			var i, col, columns = this.grid._columns;
			for(i = columns.length - 1; i >= 0; --i){
				col = columns[i];
				if(col.widgetsInCell){
					col.userDecorator = col.decorator || dummyFunc;
					col.decorator = this._dummyDecorator;
					col._cellWidgets = {};
					col._backupWidgets = [];
				}
			}
		},

		_dummyDecorator: function(data, rowId, visualIndex, cell){
			var column = cell.column;
			if(!column.needCellWidget || column.needCellWidget(cell)){
				return '';
			}
			return data;
		},

		_showDijits: function(row){
			var t = this;
			array.forEach(row.cells(), function(cell){
				var col = cell.column.def();
				if((!col.needCellWidget || col.needCellWidget(cell)) &&
					(col.userDecorator || t._getSpecialCellDec(cell.row.id, col.id))){
					var cellNode = cell.contentNode();
					if(cellNode){
						var cellWidget = t._prepareCellWidget(cell);
						//FIX ME: has('ie')is not working under IE 11
						//use has('trident') here to judget IE 11
						if(has('ie') || has('trident')){
							while(cellNode.childNodes.length){
								cellNode.removeChild(cellNode.firstChild);
							}
						}else{
							cellNode.innerHTML = "";
						}
						cellWidget.placeAt(cellNode);
						cellWidget.startup();
						cellNode.setAttribute('aria-labelledby', cellWidget.id);
						cellNode.removeAttribute('aria-label');
					}
				}
			});
		},

		_showDijit: function(cell){
			var col = cell.column.def();
			if((!col.needCellWidget || col.needCellWidget(cell)) &&
				(col.userDecorator || this._getSpecialCellDec(cell.row.id, col.id))){
				var cellWidget = this._prepareCellWidget(cell),
					cellNode = cell.contentNode();
				cellNode.innerHTML = "";
				cellWidget.placeAt(cellNode);
				cellWidget.startup();
				cellNode.setAttribute('aria-labelledby', cellWidget.id);
				cellNode.removeAttribute('aria-label');
			}
		},

		_prepareCellWidget: function(cell){
			var col = cell.column.def(),
				widget = this._getSpecialWidget(cell);
			if(!widget){
				widget = col._backupWidgets.shift();
				if(!widget){
					widget = new CellWidget({
						content: col.userDecorator(),
						setCellValue: col.setCellValue
					});
					this.onCellWidgetCreated(widget, cell.column);
				}
				col._cellWidgets[cell.row.id] = widget;
			}
			widget.cell = cell;
			widget.setValue(cell.data(), cell.rawData(), true);
			return widget;
		},

		_onUnrenderRow: function(id){
			var cols = this.grid._columns,
				backupCount = this.arg('backupCount'),
				backup = function(col, rowId){
					var w = col._cellWidgets[rowId];
					if(col._backupWidgets.length < backupCount){
						//We still need this widget, so if it is still visible, 
						//we should safely remove it from the DOM tree first,
						//in case some other logic accidently removes it.
						if(w.domNode.parentNode){
							w.domNode.parentNode.removeChild(w.domNode);
						}
						col._backupWidgets.push(w);
					}else{
						w.destroyRecursive();
					}
				};
			for(var i = 0, len = cols.length; i < len; ++i){
				var col = cols[i],
					cellWidgets = col._cellWidgets;
				if(cellWidgets){
					if(this.model.isId(id)){
						if(cellWidgets[id]){
							backup(col, id);
							delete cellWidgets[id];
						}
					}else{
						for(var j in cellWidgets){
							backup(col, j);
						}
						col._cellWidgets = {};
					}
				}
			}
		},

		_getSpecialCellDec: function(rowId, colId){
			var rowDecs = this._decorators[rowId];
			return rowDecs && rowDecs[colId];
		},

		_getSpecialWidget: function(cell){
			var rowDecs = this._decorators[cell.row.id];
			if(rowDecs){
				var cellDec = rowDecs[cell.column.id];
				if(cellDec){
					if(!cellDec.widget && cellDec.decorator){
						try{
							var widget = cellDec.widget = new CellWidget({
								content: cellDec.decorator(cell.data(), cell.row.id, cell.row.visualIndex(), cell),
								setCellValue: cellDec.setCellValue
							});
							this.onCellWidgetCreated(widget, cell.column);
						}catch(e){
							console.error('Edit:', e);
						}
					}
					return cellDec.widget;
				}
			}
			return null;
		}
	});
});
