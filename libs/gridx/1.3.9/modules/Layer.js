define([
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/sniff",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/query",
	"dojo/keys",
	"../core/_Module"
], function(kernel, declare, lang, has, domClass, domGeometry, query, keys, _Module){
	kernel.experimental('gridx/modules/Layer');

/*=====
	var Layer = declare(_Module, {
		// summary:
		//		module name: Layer.
		//		A drill-down version of tree grid.
		// description:
		//		Add a drill-down button to every row that has children.
		//		Once clicked this button, child level rows slides in and current level rows slides out,
		//		while the parent row slides up and gets locked.
		//		Clicking anywhere in the locked parent row will reverse the above process so as to go back to the parent level.
		//		Especially suitable for mobile tree grid.

		// buttonColumnWidth: String
		//		Width of the drill-down column. Same format as column width in column definition.
		buttonColumnWidth: '20px',

		// buttonColumnArgs: Object
		//		The drill-down column can be customized by providing extra column definition parameters here.
		buttonColumnArgs: null,

		down: function(id){
			// summary:
			//		Drill down one level on the row with the given ID.
			//		Only works if the given row exists in current layer.
			// id: String
			//		A parent row ID.
		},

		up: function(){
			// summary:
			//		Drill up one level, i.e.: go to the parent layer.
		},

		onFinish: function(args){
			// summary:
			//		Fired when a layer operation (down or up) is done.
			// args: __LayerOperationArgs
			//		Some args indicating whether it is drilling down or up, and on which row.
		}
	});

	Layer.__LayerOperationArgs = declare([], {
		// summary:
		//		Some context info for layer operations.

		// isDown: Boolean
		//		If true, the operation is drilling down, otherwise, it is drilling up.
		isDown: true,

		// rowId: String
		//		Only available when isDown is true. Indicating on which row it is drilling down.
		rowId: ''
	});

	return Layer;
=====*/

	var transitionDuration = 700;

	function moveNodes(bn, tmpBn){
		while(bn.childNodes.length){
			tmpBn.appendChild(bn.firstChild);
		}
	}

	var nextLevelButtonColumnId = '__nextLevelButton__';

	return declare(_Module, {
		name: "layer",

		buttonColumnWidth: '20px',

		constructor: function(){
			var t = this,
				g = t.grid,
				n = t._tmpBodyNode = document.createElement('div'),
				cn = t._contextNode = document.createElement('div'),
				wrapper1 = t._wrapper1 = document.createElement('div'),
				wrapper2 = t._wrapper2 = document.createElement('div');
			n.setAttribute('class', 'gridxBody');
			cn.setAttribute('class', 'gridxLayerContext');
			cn.style.overflow = 'hidden';
			
			cn.setAttribute('id', 'testContextNode');
			wrapper1.setAttribute('class', 'gridxLayerWrapper');
			wrapper2.setAttribute('class', 'gridxLayerWrapper');
			t._parentStack = [];
			t.connect(cn, 'onmousedown', 'up');
			function updateColumnWidth(node){
				var columnId = node.getAttribute('colid');
				var headerNode = g.header.getHeaderNode(columnId);
				node.style.width = headerNode.style.width;
				node.style.minWidth = headerNode.style.minWidth;
				node.style.maxWidth = headerNode.style.maxWidth;
			}
			t.aspect(g.columnWidth, 'onUpdate', function(){
				query('.gridxCell', wrapper1).forEach(updateColumnWidth);
				query('.gridxCell', wrapper2).forEach(updateColumnWidth);
				if(cn.firstChild){
					cn.style.height = cn.firstChild.offsetHeight + 'px';
				}
				var marginRight = parseInt(g.header.innerNode.style.marginRight),
					marginLeft = parseInt(g.header.innerNode.style.marginLeft);
				if ( marginRight ){
					marginRight =( marginRight + 1 ) + 'px';
				}
				else{
					marginRight =( marginRight + 0 ) + 'px';
				}
				if ( marginLeft ){
					marginLeft = ( marginLeft + 1 ) + 'px'; 
				}
				else{
					marginLeft = ( marginLeft + 0 ) + 'px';
				}
				cn.style.marginRight = marginRight;	
				cn.style.marginLeft = marginLeft;
			});
			

			var w = t.arg('buttonColumnWidth');
			var col = t._col = lang.mixin({
				id: nextLevelButtonColumnId,
				headerStyle: 'text-align:center;',
				style: function(cell){
					return 'text-align:center;' + (cell.model.hasChildren(cell.row.id) ? 'cursor:pointer;' : '');
				},
				rowSelectable: false,
				sortable: false,
				filterable: false,
				editable: false,
				padding: false,
				ignore: true,
				declaredWidth: w,
				width: w,
				decorator: function(data, rowId){
					if(t.model.hasChildren(rowId)){
						return '<div class="gridxLayerHasChildren"></div>';
					}
					return '';
				}
			}, t.arg('buttonColumnArgs') || {});
			t._onSetColumns();
			t.aspect(g, 'setColumns', '_onSetColumns');
			t.aspect(g, 'setStore', function(){
				t._parentStack = [];
				wrapper1.innerHTML = wrapper2.innerHTML = '';
				if(cn.firstChild){
					cn.removeChild(cn.firstChild);
					cn.style.height = 0;
					g.vLayout.reLayout();
				}
			});

			function onDrillDown(e){
				if(e.columnId == nextLevelButtonColumnId && e.cellNode.childNodes.length){
					g.focus.focusArea('header');
					setTimeout(function(){
						t.down(e.rowId);
					}, 0);
				}
			}
			if(g.touch){
				t.aspect(g, 'onCellTouchStart', onDrillDown);
			}
			t.aspect(g, 'onCellMouseDown', onDrillDown);
		},

		preload: function(){
			this.grid.vLayout.register(this, '_contextNode', 'headerNode', 10);
			
			var t = this,
			g = t.grid;
			//Add this.domNode to be a part of the grid header
			t.aspect(g, 'onHScroll', '_onHScroll');
		},
		
		_onHScroll: function(left){
			var t = this,
				g = t.grid;

			if ( t._contextNode ){
				var innerNode = t._contextNode;
				if((has('webkit') || has('ie') < 8) && !g.isLeftToRight()){
					left = innerNode.scrollWidth - innerNode.offsetWidth - left;
				}
				innerNode.scrollLeft = t._scrollLeft = left;
			}
			
		},

		onReady: function(){},
		onFinish: function(){},

		down: function(id){
			var t = this,
				m = t.model;
			if(!t._lock && m.hasChildren(id) && String(m.parentId(id)) === String(m.layerId())){
				t._lock = 1;
				var g = t.grid,
					bn = g.bodyNode,
					w = bn.offsetWidth,
					tmpBn = t._tmpBodyNode,
					wrapper1 = t._wrapper1,
					wrapper2 = t._wrapper2,
					parentRowNode = g.body.getRowNode({ rowId: id }),
					pos = domGeometry.position(parentRowNode),
					refPos = domGeometry.position(t._contextNode),
					cloneParent = parentRowNode.cloneNode(true);

				domClass.add(parentRowNode, 'gridxLayerLoading');

				wrapper2.appendChild(cloneParent);
				t._parentStack.push(cloneParent);
				cloneParent._pos = g.vScroller.position();
				t._bodyScrollTop = bn.scrollTop;
				moveNodes(bn, tmpBn);

				bn.style.left = w + 'px';
				bn.style.zIndex = 1;
				tmpBn.style.left = 0;
				tmpBn.style.zIndex = 0;
				wrapper2.style.top = (pos.y - refPos.y) + 'px';
				wrapper2.style.zIndex = -1;
				g.vScrollerNode.style.zIndex = 9999;

				m.setLayer(id);
				t._refresh(function(){
					domClass.remove(parentRowNode, 'gridxLayerLoading');
					wrapper2.style.zIndex = 9999;
					g.vScroller.scroll(0);
					domClass.add(wrapper1, 'gridxLayerHSlide');
					domClass.add(wrapper2, 'gridxLayerVSlide');
					bn.style.left = 0;
					tmpBn.style.left = -w + 'px';
					wrapper1.style.left = -w + 'px';
					wrapper2.style.top = 0;
				}, {
					isDown: true,
					rowId: id,
					parentRowNode: cloneParent
				});
			}
		},

		up: function(){
			var t = this,
				m = t.model;
			if(!t._lock && m.isId(m.layerId())){
				t._lock = 1;
				var g = t.grid,
					bn = g.bodyNode,
					tmpBn = t._tmpBodyNode,
					w = bn.offsetWidth,
					wrapper1 = t._wrapper1,
					wrapper2 = t._wrapper2,
					parentRowNode = t._parentStack[t._parentStack.length - 2],
					currentParentRowNode = t._parentStack.pop(),
					parentId = currentParentRowNode.getAttribute('rowid');

				if(parentRowNode){
					wrapper2.appendChild(parentRowNode);
				}
				t._bodyScrollTop = bn.scrollTop;
				moveNodes(bn, tmpBn);

				bn.style.left = -w + 'px';
				bn.style.zIndex = 0;
				tmpBn.style.left = 0;
				tmpBn.style.zIndex = 1;
				wrapper1.style.top = 0;
				wrapper1.style.zIndex = 2;
				wrapper2.style.left = -w + 'px';
				g.vScrollerNode.style.zIndex = 9999;

				m.layerUp();
				t._refresh(function(){
					var pos, refPos;

					if(currentParentRowNode){
						g.vScroller.scroll(currentParentRowNode._pos);
						pos = domGeometry.position(g.body.getRowNode({
							rowId: parentId
						}));
						refPos = domGeometry.position(t._contextNode);
					}
					domClass.add(wrapper1, 'gridxLayerVSlide');
					domClass.add(wrapper2, 'gridxLayerHSlide');
					bn.style.left = 0;
					tmpBn.style.left = w + 'px';
					if(currentParentRowNode){
						wrapper1.style.top = (pos.y - refPos.y) + 'px';
					}
					wrapper2.style.left = 0;
				}, {
					parentRowNode: currentParentRowNode
				});
			}
		},

		//Private--------------------------------------------------------------------
		_onSetColumns: function(){
			var g = this.grid,
				col = this._col;
			col.index = g._columns.length;
			g._columns.push(col);
			g._columnsById[col.id] = col;
		},

		_onTransitionEnd: function(){
			var t = this,
				m = t.model,
				g = t.grid,
				mainNode = g.mainNode,
				bn = g.bodyNode,
				tmpBn = t._tmpBodyNode,
				w = bn.offsetWidth,
				contextNode = t._contextNode,
				wrapper1 = t._wrapper1,
				wrapper2 = t._wrapper2;
			if(t._lock){
				mainNode.removeChild(tmpBn);
				mainNode.removeChild(wrapper1);
				contextNode.appendChild(wrapper2);
				contextNode.style.height = wrapper2.offsetHeight + 'px';
				domClass.remove(tmpBn, 'gridxSlideRefresh');
				domClass.remove(bn, 'gridxSlideRefresh');
				domClass.remove(wrapper1, 'gridxLayerHSlide gridxLayerVSlide');
				domClass.remove(wrapper2, 'gridxLayerHSlide gridxLayerVSlide');
				if(wrapper1.childNodes.length){
					wrapper1.removeChild(wrapper1.firstChild);
				}

				var tmp = t._wrapper1;
				t._wrapper1 = t._wrapper2;
				t._wrapper2 = tmp;

				wrapper1.style.left = 0;
				wrapper1.style.zIndex = '';
				wrapper1.style.top = 0;
				wrapper2.style.left = 0;
				wrapper2.style.zIndex = '';
				wrapper2.style.top = 0;
				bn.style.paddingTop = 0;
				bn.style.zIndex = '';
				tmpBn.style.paddingTop = 0;
				tmpBn.style.zIndex = '';
				g.vScrollerNode.style.zIndex = '';

				g.vLayout.reLayout();
				for(var i = 0; i < tmpBn.childNodes.length; ++i){
					var rowId = tmpBn.childNodes[i].getAttribute('rowid');
					if(m.isId(rowId)){
						g.body.onUnrender(rowId);
					}
				}
				tmpBn.innerHTML = '';
				g.body._skipUnrender = 0;
				t._lock = 0;
			}
		},

		_refresh: function(callback, args){
			var t = this, focusEnabled,
				g = t.grid,
				bn = g.bodyNode,
				tmpBn = t._tmpBodyNode,
				frag = document.createDocumentFragment();
			frag.appendChild(tmpBn);
			frag.appendChild(t._wrapper1);
			frag.appendChild(t._wrapper2);
			g.mainNode.appendChild(frag);
			tmpBn.scrollTop = t._bodyScrollTop;
			tmpBn.style.paddingTop = t._wrapper1.offsetHeight + 'px';
			bn.style.paddingTop = t._wrapper2.offsetHeight + 'px';
			t._contextNode.style.height = 0;
			//temparary disable paging
			t._paging = g.view.paging;
			g.view.paging = 0;
			g.vLayout.reLayout();
			if(args.isDown){
				query('.gridxLayerHasChildren', args.parentRowNode).
					removeClass('gridxLayerHasChildren').
					addClass('gridxLayerLevelUp');
			}else if(args.parentRowNode){
				query('.gridxLayerLevelUp', args.parentRowNode).
					removeClass('gridxLayerLevelUp').
					addClass('gridxLayerHasChildren');
			}
			t.onReady(args);
			g.body._skipUnrender = 1;
			if(args.isDown){
				g.vScroller._lock = 1;
			}
			focusEnabled = g.focus.enabled;
			g.focus.enabled = 0;
			
			g.body.refresh().then(function(){
				g.vScroller._lock = 0;
				g.view.paging = t._paging;
				setTimeout(function(){
					domClass.add(bn, 'gridxSlideRefresh');
					domClass.add(tmpBn, 'gridxSlideRefresh');
					if(g.vScroller._scrollable){
						g.vScroller._scrollable.scrollTo({x: 0});
					}
					callback();
					t._contextNode.style.postion = 'absolute';
					setTimeout(function(){
						t._onTransitionEnd();
						g.vLayout.reLayout();
						g.focus.enabled = focusEnabled;
						g.body._focusCellRow = 0;
						g.body._focusCellCol = 0;
						g.focus.focusArea('body');
						t.onFinish(args);
						t._contextNode.style.postion = 'relative';
					}, transitionDuration);
				}, 10);
			});
		}
	});
});
