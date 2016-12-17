define([
	"dojo/dom-style",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/_base/lang",
	"../core/_Module",
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/window",
	"dojo/query",
	"dojo/_base/sniff"
], function(domStyle, domClass, domGeometry, lang, _Module, declare, array, win, query, has){

/*=====
	return declare(_Module, {
		// summary:
		//		module name: columnLock.
		//		Column lock machinery.
		// description:
		//		This module provides a way to lock consecutive leading columns. 
		//		Columns can be locked in following ways:
		// example:
		//		Columns can be locked when Grid is initially rendered.
		//	|		var grid = new Grid({
		//	|			columnLockCount: 2
		//	|			modules: [
		//	|				"gridx.modules.ColumnLock",
		//	|				...
		//	|			],
		//	|		});
		//		Lock or unlock columns dynamically
		//	|		// lock 2 leading columns
		//	|		grid.columnLock.lock(2)
		//	|		// unlock all columns
		//	|		grid.columnLock.unLock();

		// count: [readonly] Integer
		//		Number of columns that will be locked by default
		count: 0,

		lock: function(count){
			// summary:
			//		Dynamically lock consecutive #count leading columns.
		},

		unlock: function(){
			// summary:
			//		Unlock all columns.
		}
	});
=====*/

	return declare(_Module, {
		name: 'columnLock',
		
		required: ['body'],
		
		count: 0,

		preload: function(){
			var t = this;
			if(t.grid.persist){
				t.count = t.grid.persist.registerAndLoad('columnLock', function(){
					return t.count;
				});
			}
		},
		
		load: function(args, deferStartup){
			this.count = this.arg('count');
			var _this = this, g = this.grid, body = win.body();
			deferStartup.then(function(){
				if(!g.columnWidth || !g.columnWidth.arg('autoResize')){
					_this.connect(g.body, 'onAfterRow', function(row){
						_this._lockColumns(row.node());
					});
					_this.connect(g.columnWidth, 'onUpdate', '_updateHeader');
					_this.connect(g.header, 'onRender', '_updateHeader');
					_this.connect(g.body, 'onRender', '_updateBody');
					//potential cell upate will cause rowHeight changing
					_this.connect(g.body, 'onAfterCell', '_updateBody');

					if(g.columnResizer){
						//make it compatible with column resizer
						_this.connect(g.columnResizer, 'onResize', '_updateHeader');
						_this.connect(g.columnResizer, 'onResize', '_updateBody');
					}

					_this.connect(g, '_onResizeEnd', '_updateHeader');
					_this.connect(g, '_onResizeEnd', '_updateBody');
					_this.connect(g.vScroller, '_onBodyChange', '_updateBody');
					_this.connect(g, 'resize', '_updateUI');
					
					if(g.header){
						g.header.loaded.then(function(){
							_this._updateHeader();
						});
						if(g.move && g.move.column){
							_this.connect(g.move.column, 'move', '_updateHeader');
						}
					}
					_this._hackHScroller();
					if(_this.count){
						_this.lock(_this.count);
					}
				}
				if(g.rowLock){
					_this.connect(g.rowLock, 'onLock', function(){
						_this.grid.hScroller && _this.grid.hScroller._doScroll();
					});
					_this.connect(g.rowLock, 'onUnlock', function(rowCount){
						var rowNodes = _this.grid.bodyNode.childNodes;

						for(var i = 0; i < rowCount; i++){
							_this._lockColumns(rowNodes[i]);
						}
					});
				}
				_this.loaded.callback();
			});
		},
		
		lock: function(/*Integer*/count){
			if(this.grid.columnWidth && this.grid.columnWidth.arg('autoResize')){ return; }
			if(count >= this.grid._columns.length){
				console.warn('Warning: lock count is larger than columns count, do nothing.');
				return;
			}
			var i = 0,
				totalCount = 0;

			for(i = 0; i < count; i++){
				totalCount += 8 + parseInt(this.grid._columns[i].width, 10);
			}
			if(this.grid.bodyNode.clientWidth - totalCount < 10){
				console.warn('Warning: locked total columns width exceed grid width, do nothing.');
				return;
			}
			this.unlock();
			
			if(count){
				domClass.add(this.grid.domNode, 'gridxColumnLock');
			}
			
			this.count = count;
			this._updateUI();
		},
		
		unlock: function(){
			if(this.grid.columnWidth && this.grid.columnWidth.arg('autoResize')){ return; }
			domClass.remove(this.grid.domNode, 'gridxColumnLock');
			
			var rowNode = query('.gridxHeaderRowInner', this.grid.headerNode)[0];
			this._unlockColumns(rowNode);
			
			array.forEach(this.grid.bodyNode.childNodes, this._unlockColumns, this);
			
			this.count = 0;
			this._updateUI();
		},
		
		_unlockColumns: function(rowNode){
			var ltr = this.grid.isLeftToRight();
			var r = rowNode.firstChild.rows[0];
			for(var i = 0; i < this.count; i++){
				var cell = r.cells[i];
				domClass.remove(cell, 'gridxLockedCell');
				domStyle.set(cell, {height: 'auto'});
			}
			rowNode.style[ltr ? 'paddingLeft' : 'paddingRight'] = '0px';
			rowNode.style.width = 'auto';
			rowNode.firstChild.style.height = 'auto';
		},
		
		_updateUI: function(){
			if(this.grid.header){
				this._updateHeader();
			}
			this._updateBody();
			this._updateScroller();
			this.grid.header.onRender();
			this.grid.hScroller && this.grid.hScroller._doScroll();
		},
		
		_lockColumns: function(rowNode){
			// summary:
			//	Lock columns for one row
			if(!this.count || this.count >= this.grid._columns.length){
				return;
			}
			
			var isHeader = domClass.contains(rowNode, 'gridxHeaderRowInner');
			var ltr = this.grid.isLeftToRight();
			var r = rowNode.firstChild.rows[0], i;

			var h1 = domGeometry.getContentBox(r.cells[r.cells.length - 1]).h,
				h2 = domGeometry.getMarginBox(r.cells[r.cells.length - 1]).h;

			rowNode.firstChild.style.height = 'auto';	//Remove the height of the last locked state.
			// debugger;
			for(i = 0; i < this.count; i++){
				domStyle.set(r.cells[i], 'height', 'auto');
			}

			//FIX ME: has('ie')is not working under IE 11
			//use has('trident') here to judget IE 11
			if(has('ie') > 8 || has('trident') > 4 ){
				//in IE 9 +, sometimes computed height will contain decimal pixels like 34.4 px, 
				//so that the locked cells will have different height with the unlocked ones.
				//plus the height by 1 can force IE to ceil the decimal to integer like from 34.4px to 35px
				var h3 = domStyle.getComputedStyle(rowNode.firstChild).height;
				if(String(h3).toString().indexOf('.') >= 0){		//decimal
					h2++;
					h1++;
				}
			}
			domStyle.set(rowNode.firstChild, 'height', h2 + 'px');
			
			var lead = isHeader ? this.grid.hLayout.lead : 0,
				pl = lead,
				cols = this.grid._columns;
			for(i = 0; i < this.count; i++){
				var cell = r.cells[i],
					s;
				domClass.add(cell, 'gridxLockedCell');

				s = {height: h1 + 'px'};
				s[ltr ? 'left' : 'right'] = pl + 'px';
				domStyle.set(cell, s);
				
				pl += cell.offsetWidth;
			}
			rowNode.style[ltr ? 'paddingLeft' : 'paddingRight'] = pl - lead + 'px';
			rowNode.style.width = this.grid.bodyNode.offsetWidth - pl + lead + 'px';
			
			//This is useful for virtual scrolling.
			rowNode.scrollLeft = this.grid.hScroller ? this.grid.hScroller.domNode.scrollLeft : 0;

			if(domClass.contains(rowNode, 'gridxRow')){
				var rowid = rowNode.getAttribute('rowid') + '';
				this.grid.body.onRowHeightChange(rowid);
			}
		},
		
		_updateHeader: function(){
			// summary:
			//	Update the header for column lock
			var rowNode = this.grid.header.innerNode;
			var sl = rowNode.scrollLeft;
			this._lockColumns(rowNode);
			rowNode.scrollLeft = sl;
			this._updateScroller();//used for column dnd to sync hscroller.
		},
		
		_updateBody: function(start, count, aopFucMap){
			// summary:
			//	Update the body for column lock
			if ( !aopFucMap || aopFucMap['_updateBody'] !== false ){
				array.forEach(this.grid.bodyNode.childNodes, this._lockColumns, this);
			}
				
		},
		
		_updateScroller: function(){
			// summary:
			//	Update h-scroller for column lock
			if(this.grid.hScroller){this.grid.hScroller.refresh();}
		},
		
		_hackHScroller: function(){
			// summary:
			//	This method changes behavior of hscroller. It will scroll each row instead of the body node
			//	while some columns are locked.
			var _this = this;
			lang.mixin(this.grid.hScroller, {
				_doScroll: function(){
					// summary:
					//	Sync the grid body with the scroller.
					
					var scrollLeft = this.domNode.scrollLeft;
					if(_this.count){
						array.forEach(this.grid.bodyNode.childNodes, function(rowNode){
							rowNode.scrollLeft = scrollLeft;
							//to be compatible with row lock
							if(rowNode.style.position == 'absolute'){
								var l = 0;
								array.forEach(rowNode.firstChild.rows[0].cells, function(cell){
									if(domClass.contains(cell, 'gridxLockedCell')){
										cell.style.left = scrollLeft + l + 'px';
										l += cell.offsetWidth;
									}
								});
							}
						});
					}else{
						this.grid.bodyNode.scrollLeft = scrollLeft;
					}
					this.grid.onHScroll(this.grid.hScroller._lastLeft);
				}
			});
		}
	});
});
