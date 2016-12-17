define([
	"dojo/_base/kernel",
	"dojo/_base/lang",
	"../core/_Module",
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/dom-class",
	"dojo/aspect",
	"dojo/query"
], function(kernel, lang, _Module, declare, array, domClass, aspect, query){
	kernel.experimental('gridx/modules/RowLock');

/*=====
	return declare(_Module, {
		// summary:
		//		Lock up some rows at the top of the grid body, so that they don't scroll vertically.
		// description:
		//		This module is not compatible with VirtualVScroller.

		lock: function(count){
			// summary:
			//		TODOC
		},

		unlock: function(){
			// summary:
			//		TODOC
		}
	});
=====*/

	return declare(_Module, {
		name: 'rowLock',
		required: ['vLayout'],
		forced: ['hLayout', 'body'],
		count: 0,
		load: function(args, deferStartup){
			this.count = this.arg('count');
			var _this = this, g = this.grid;
			
			deferStartup.then(function(){
				
				if(_this.grid.vScroller){
					_this.connect(g.vScrollerNode, 'onscroll', function(){
						_this._updateRowPosition();
					});
					
					_this.connect(g.bodyNode, 'onscroll', function(){
						_this._updateRowPosition();
					});
					
					_this.connect(g.body, 'onAfterCell', function(cell){
						if(cell.row.visualIndex() < _this.count){
							_this._adjustBody();
							_this._updatePosition();

						}
					});

				}
				
				if(_this.grid.vScroller && _this.grid.rowHeader){
					_this.connect(g.bodyNode, 'onscroll', function(){
						_this._updateRowHeaderPosition();
					});
				}

				if(g.columnResizer){
					//make it compatible with column resizer
					_this.connect(g.columnResizer, 'onResize', '_adjustBody');
					_this.connect(g.columnResizer, 'onResize', '_updatePosition');
				}

 
				
				_this.lock(_this.count);
				_this.loaded.callback();
			});
			
			aspect.before(g.body, 'refresh', function(){
				_this.grid.bodyNode.style.paddingTop = '0px';
			});

			this.connect(g.body, 'refresh', function(){
				//FIX ME
				//the lock can't run before vscroll._doScroll()
				setTimeout(function(){
					_this.lock(_this.count);
				}, 0);
			});
		},
		
		lock: function(count){
			this.unlock(true);
			this.count = count;
			this._foreachLockedRows(function(node){
				node.style.position = 'absolute';
				domClass.add(node, 'gridxLockedRow');
			}, function(rowHeaderNode){
				rowHeaderNode.style.position = 'absolute';
			});
			
			this._adjustBody();
			this._updatePosition();
			this.onLock();
		},
		
		unlock: function(forced){
			var oc = this.count;

			this._foreachLockedRows(function(node){
				node.style.position = 'static';
				domClass.remove(node, 'gridxLockedRow');
			}, function(rowHeaderNode){
				rowHeaderNode.style.position = 'static';
			});
			this.grid.bodyNode.style.paddingTop = '0px';
			if(this.grid.rowHeader){
				this.grid.rowHeader.bodyNode.style.paddingTop = '0px';
			}
			this.count = 0;
			if(!forced){this.onUnlock(oc);}
			
		},
		
		onLock: function(rowCount){},
		
		onUnlock: function(rowCount){},

		_adjustBody: function(){
			// summary:
			//	Called after content is changed or column width is resized, which
			//	may cause row height change of locked rows.
			var h = 0;
			this._foreachLockedRows(function(node){
				h += node.offsetHeight;
			}, function(rowHeaderNode){
				
			});
			this.grid.bodyNode.style.paddingTop = h + 'px';
			if(this.grid.rowHeader){
				this.grid.rowHeader.bodyNode.style.paddingTop = h + 'px';			
			}
		},
		
		_updatePosition: function(){
			// summary:
			//	Update position of locked rows so that they look like locked.
			this._updateRowPosition();
			if(this.grid.rowHeader){
				this._updateRowHeaderPosition();
			}
		},
		
		_updateRowPosition: function(){
			// summary:
			//	Update position of locked rows so that they look like locked.
			if(!this.count){return;}
			var t = this.grid.bodyNode.scrollTop, h = 0, _this = this;
			this._foreachLockedRows(function(node){
				node.style.top = t + h + 'px';
				h += node.offsetHeight;
			}, null);
		},
		
		_updateRowHeaderPosition: function(){
			// summary:
			//	Update position of locked rowHeaders so that they look like locked.
			if(!this.count){return;}
			var t = this.grid.bodyNode.scrollTop, h = 0, _this = this;
			this._foreachLockedRows(null, function(rowHeaderNode){
				rowHeaderNode.style.top = t + h + 'px';
				h += rowHeaderNode.offsetHeight;
			});
		},
				
		_foreachLockedRows: function(callback, rowHeaderCallback){
			// rowHeaderCallback = rowHeaderCallback? rowHeaderCallback : callback;
			var nodes = this.grid.bodyNode.childNodes;
			var rowHeaderNodes = this.grid.rowHeader? this.grid.rowHeader.bodyNode.childNodes : [];
			for(var i = 0; i < this.count; i++){
				if(rowHeaderNodes[i] && rowHeaderCallback){
					rowHeaderCallback(rowHeaderNodes[i]);
				}
				if(nodes[i] && callback){
					callback(nodes[i]);
				}
			}
		}
		
	});
});
