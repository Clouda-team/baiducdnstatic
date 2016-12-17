define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/event",
	"dojo/keys",
	"dojo/aspect",
	"dojo/query",
	"dojo/string",
	"dojo/dom-class",
	"dojo/dom-construct",
	"../core/_Module",
	"./HiddenColumns"
], function(declare, array, lang, event, keys, aspect, query, string, domClass, domConstruct, _Module, HiddenColumns, Sort, nls){

	/*=====
	return declare(HiddenColumns, {
		// summary:
		//		module name: expandableColumn.
		//		Expandable column including group headers.

		expand: function(colId){
			// summary:
			//		Expand a column by id.

		},
		collapse: function(colId){
			// summary:
			//		Collapse a column by id.
		}
	});
=====*/

	return declare(HiddenColumns, {
		name: 'expandedColumn',
		_parentCols: null,

		required: ['header'],

		preload: function(){
			this.inherited(arguments);
		},

		load: function(args, startup){
			var t = this,
				g = t.grid;
			t._cols = g._columns.slice();
			t._parentCols = {};

			var toHide = [];
			array.forEach(t._cols, function(col){
				if(col.expanded){
					toHide.push(col.id);
				}else if(col.parentColumn){
					t._parentCols[col.parentColumn] = 1;
					var parentCol = this._colById(col.parentColumn);

					if(!parentCol.expanded){
						toHide.push(col.id);
						parentCol.expanded = false;	//Force expanded false for later use.
					}else{
					}
				}
			}, this);

			this.expandoBar = domConstruct.create('div', {className: 'gridxColumnExpandoBar'});

			this.connect(g.columnWidth, 'onUpdate', '_updateUI');
			this.grid.vLayout.register(this, 'expandoBar', 'headerNode', 1);

			this.connect(g, 'onHeaderCellMouseOver', function(evt){
				domClass.add(this._expandoCellByColumnId(evt.columnId), 'gridxColumnExpandoHighlight');
			}, this);

			this.connect(g, 'onHeaderCellMouseOut', function(evt){
				domClass.remove(this._expandoCellByColumnId(evt.columnId), 'gridxColumnExpandoHighlight');
			}, this);

			this.connect(this.expandoBar, 'onmouseover', function(evt){
				var expandoCell = null;
				if(/td/i.test(evt.target.tagName)){
					expandoCell = evt.target;
				}else if(domClass.contains(evt.target, 'gridxColumnExpando')){
					expandoCell = evt.target.parentNode;
				}
				if(expandoCell){
					var colId = expandoCell.getAttribute('data-column-id');
					domClass.add(expandoCell, 'gridxColumnExpandoHighlight');
					domClass.add(this._headerCellByColumnId(colId), 'gridxCellHighlight');
				}
			}, this);

			this.connect(this.expandoBar, 'onmouseout', function(evt){
				var expandoCell = null;
				if(/td/i.test(evt.target.tagName)){
					expandoCell = evt.target;
				}else if(domClass.contains(evt.target, 'gridxColumnExpando')){
					expandoCell = evt.target.parentNode;
				}
				if(expandoCell){
					var colId = expandoCell.getAttribute('data-column-id');
					domClass.remove(expandoCell, 'gridxColumnExpandoHighlight');
					domClass.remove(this._headerCellByColumnId(colId), 'gridxCellHighlight');
				}
			}, this);

			this.connect(this.expandoBar, 'onclick', function(evt){
				if(domClass.contains(evt.target, 'gridxColumnExpando')){
					var colId = evt.target.parentNode.getAttribute('data-column-id');
					this.expand(colId);
				}
			}, this);

			this.connect(this.grid.header.innerNode, 'onkeyup', function(evt){
				//Bind short cut key to expand/coallapse the column: shift + ctrl + e
				var colId;

				if(evt.keyCode == 77 && evt.ctrlKey){
					var node = evt.target;
					if(domClass.contains(node, 'gridxGroupHeader')){
						colId = node.getAttribute('groupid').split('-').pop();
						colId = this._colById(colId).parentColumn;
						this.collapse(colId);
						this._focusById(colId);

					}else if(domClass.contains(node, 'gridxCell')){
						colId = node.getAttribute('colid');
						if(this._parentCols[colId]){
							//expandable
							this.expand(colId);
							this._focusById(colId);
						}
					}
					event.stop(evt);
				}
			}, this);

			this.connect(this.grid.header, 'refresh', function(){
				if(g.header.hidden){
					g.header.domNode.parentNode.style.overflow = 'hidden';
					this.expandoBar.style.display = 'none';
				}else{
					g.header.domNode.parentNode.style.overflow = 'visible';
					this.expandoBar.style.display = 'block';
				}
			});

			this.connect(this.grid, 'onHScroll', function(left){
				this.expandoBar.scrollLeft = left;
			}, this);

			if(toHide.length){
				startup.then(function(){
					t.add.apply(t, toHide);
					t._refreshHeader();
					t.loaded.callback();
				});
			}else{
				t.loaded.callback();
			}
			
			t.aspect(g, 'setColumns', '_onSetColumns');
		},
		
		_onSetColumns: function(){
			var t = this,
				g = t.grid;
			t._cols = g._columns.slice();
			t._parentCols = {};
			
			var toHide = [];
			array.forEach(t._cols, function(col){
				if(col.expanded){
					toHide.push(col.id);
				}else if(col.parentColumn){
					t._parentCols[col.parentColumn] = 1;
					var parentCol = this._colById(col.parentColumn);

					if(!parentCol.expanded){
						toHide.push(col.id);
						parentCol.expanded = false;	//Force expanded false for later use.
					}else{
					}
				}
			}, this);
			
			g.header._build();
			g.body.refresh();
			// g.header.onRender();
			
			if(toHide.length){
				t.add.apply(t, toHide);
				t._refreshHeader();
			}
		},

		expand: function(colId){
			var children = array.filter(this._cols, function(col){
				return col.parentColumn == colId;
			});
			
			this.add(colId);
			this.remove.apply(this, children);
			this._colById(colId).expanded = true;
			this._refreshHeader();

		},

		collapse: function(colId){
			var children = array.filter(this._cols, function(col){
				return col.parentColumn == colId;
			});

			this.remove(colId);
			this.add.apply(this, children);
			this._colById(colId).expanded = false;
			this._refreshHeader();
		},

		_updateUI: function(){
			// summary:
			//	Called when the header is changed, need to sync expando bar.

			//Build expando bar
			var sb = ['<table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr>'];
			array.forEach(this.grid._columns, function(col){
				sb.push('<td data-column-id="', col.id,'" aria-readonly="true" tabindex="-1" class="gridxColumnExpandoCell">');
				if(this._parentCols[col.id]){
					//expandable
					sb.push('<span class="gridxColumnExpando"></span>');
				}
				sb.push('</td>');
			}, this);

			sb.push('</tr></table>');
			this.expandoBar.innerHTML = sb.join('');
			if(!this.grid._columns.length){
				//empty columns
				return;
			}
			this.expandoBar.style.marginRight = this.grid.header.innerNode.style.marginRight;
			this.expandoBar.style.marginLeft = this.grid.header.innerNode.style.marginLeft;
			//Adjust width of the expando cells
			var headerCells = query('table', this.grid.headerNode)[0].rows[0].cells,
				expandoCells = this.expandoBar.firstChild.rows[0].cells;

			array.forEach(expandoCells, function(cell, i){
				var colId = cell.getAttribute('data-column-id'),
					col = this.grid._columnsById[colId];
				if(col){
					cell.style.width = col.width;
					cell.style.minWidth = col.width;
					cell.style.maxWidth = col.width;
				}
			}, this);
		},

		_createExpandNode: function(i, col){
			console.log('creating expand node for:', col.id);
			var div = domConstruct.create('div', {innerHTML: '', className: 'gridxColumnExpandNode'});
			if(this._parentCols[col.id]){
				div.innerHTML = '<span class="gridxColumnExpandNodeIcon"></span>';
				var self = this;
				div.onclick = function(){
					self.expand(col.id);
				};
			}else{
				console.log(col.id, ' is not expandable');
				div.innerHTML = '';
			}
			return div;
		},

		_headerCellByColumnId: function(colId){
			var cell = query('td[colid="' + colId + '"]', this.grid.headerNode)[0];
			if(!cell){
				cell = query('td[data-map-column-id="' + colId + '"]', this.grid.headerNode)[0];
			}
			return cell;
		},

		_expandoCellByColumnId: function(colId){
			return query('td[data-column-id="' + colId + '"]', this.expandoBar)[0];
		},

		_refreshHeader: function(){
			var headerGroups = [],
				cols = this.grid._columns,
				currentGroup = null,
				c = 0;

			for(var i = 0; i < cols.length; i++){
				var col = cols[i];
				if(col.parentColumn){
					//if column has parent
					if(c > 0){
						headerGroups.push(c);
						c = 0;
					}
					if(!currentGroup || currentGroup._colId != col.parentColumn){
						if(currentGroup && currentGroup._colId != col.parentColumn){
							headerGroups.push(currentGroup);
						}

						currentGroup = {
							_colId: col.parentColumn,
							name: this._colById(col.parentColumn).name,
							children: 0
						};
					}
					currentGroup.children++;
				}else{
					if(currentGroup){
						headerGroups.push(currentGroup);
					}
					c++;
					currentGroup = null;
				}
			}
			console.log('headerGroups: ', headerGroups);
			delete this.grid.header.groups;
			this.grid.headerGroups = headerGroups;
			this.grid.header.refresh();

			//add expand arrow the the group header
			var self = this;
			query('.gridxGroupHeader', this.grid.headerNode).forEach(function(td){
				var colId = td.getAttribute('groupid').split('-').pop();
				colId = self._colById(colId).parentColumn;
				td.setAttribute('data-map-column-id', colId);

				var div = domConstruct.create('div', {
					innerHTML: '<span class="gridxColumnCollapseNodeIcon"></span>', 
					className: 'gridxColumnCollapseNode'});

				div.onclick = function(){
					self.collapse(colId);
				};
				td.firstChild.insertBefore(div, td.firstChild.firstChild);
			});
		},

		_colById: function(id){
			return this.grid._columnsById[id] || array.filter(this._cols, function(col){
				return col.id == id;
			})[0];
		},

		_focusById: function(colId){
			// summary:
			//	Focus the column header cell by column id

			var headerCell = this._headerCellByColumnId(colId);
			if(headerCell){
				this.grid.header._focusNode(headerCell);
			}
		}
	});
});
