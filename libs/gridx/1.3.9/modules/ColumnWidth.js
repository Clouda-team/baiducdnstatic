define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/Deferred",
	// "dojo/query",
	'../support/query',
	"dojo/_base/sniff",
	"dojo/dom-geometry",
	"dojo/dom", // dom.byId
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/keys",
	"../core/_Module"
], function(declare, array, Deferred, query, has, domGeometry, dojoDom, domClass, domStyle, keys, _Module){

/*=====
	return declare(_Module, {
		// summary:
		//		module name: columnWidth.
		//		Manages column width distribution, allow grid autoWidth and column autoResize.

		// default: Number
		//		Default column width. Applied when it's not possible to decide accurate column width from user's config.
		'default': 60,

		// autoResize: Boolean
		//		If set to true, the column width should be set to auto or percentage values,
		//		so that the column can automatically resize when the grid width is changed.
		//		(This is the default behavior of an	HTML table).
		autoResize: false,

		onUpdate: function(){
			// summary:
			//		Fired when column widths are updated.
		}
	});
=====*/

	var needHackPadBorder = has('safari') < 6 || (!has('safari') && has('webkit') && has('ios'));

	function calcAutoWidth(autoCols, freeWidth, padBorder, firstLoad){
		autoCols.sort(function(c1, c2){
			return (c1.minWidth || 0) - (c2.minWidth || 0);
		});
		var i = autoCols.length - 1, c;
		for(; i >= 0; --i){
			c = autoCols[i];
			if(c.minWidth && (c.minWidth + padBorder) * (i + 1) > freeWidth){
				c.width = c.minWidth + 'px';
				freeWidth -= c.minWidth + padBorder;
			}else{
				break;
			}
		}
		var len = i + 1;
		if(len){
			var w = Math.floor(freeWidth / len - padBorder);
			var ww = freeWidth - (w + padBorder) * (len - 1) - padBorder;
			if(w < 0){
				w = 0;
			}
			if(ww < 0){
				ww = 0;
			}
			for(i = 0; i < len; ++i){
				c = autoCols[i];
				c.width = (i ? w : ww);
				if(firstLoad){
					var titleNode = dojoDom.byId(c._domId);
					if(titleNode){
						var clientWidth = titleNode.clientWidth - padBorder;
						if(c.width < clientWidth)
							c.width = clientWidth;
					}
				}
				c.width += "px";				
			}			
		}
	}

	return declare(_Module, {
		name: 'columnWidth',

		forced: ['hLayout'],

		constructor: function(){
			this._init();
		},

		load: function(){
			var t = this,
				g = t.grid;
			t.aspect(g.hLayout, 'onUpdateWidth', '_onUpdateWidth');
			t.aspect(g, 'setColumns', '_onSetColumns');
			t._adaptWidth();
			t.loaded.callback();
		},

		//Public-----------------------------------------------------------------------------
		'default': 60,

		autoResize: false,

		onUpdate: function(){},

		//Private-----------------------------------------------------------------------------
		_init: function(){
			var t = this,
				g = t.grid,
				autoResize = t.arg('autoResize'),
				defaultWidth = t.arg('default') + 'px';
			array.forEach(g._columns, function(col){
				if(!col.hasOwnProperty('declaredWidth')){
					col.declaredWidth = col.width = col.width || 'auto';
				}
				if(g.autoWidth && (col.declaredWidth == 'auto' || /%$/.test(col.declaredWidth))){
					//If minWidth exists, check it
					col.width = t['default'] < col.minWidth ? col.minWidth + 'px' : defaultWidth;
				}else if(autoResize && !(/%$/).test(col.declaredWidth)){
					col.width = 'auto';
				}
			});
			if(autoResize){
				domClass.add(g.domNode, 'gridxPercentColumnWidth');
			}
		},

		_onUpdateWidth: function(){
			var t = this,
				g = t.grid;
			if(g.autoWidth){
				t._adaptWidth();
			}else{
				var noHScroller = g.hScrollerNode.style.display == 'none',
					autoResize = t.autoResize;
				t._adaptWidth(!noHScroller, 1);	//1 as true
				if(!autoResize && noHScroller){
					query('.gridxCell', g.bodyNode).forEach(function(cellNode){
						var col = g._columnsById[cellNode.getAttribute('colId')],
							declaredWidth = col.declaredWidth;
						if(autoResize || !declaredWidth || declaredWidth == 'auto' || (/%$/).test(declaredWidth)){
							var s = cellNode.style,
								w = col.width;
							s.width = w;
							s.minWidth = w;
							s.maxWidth = w;
						}
					});
				}
				t.onUpdate();
			}
		},

		_adaptWidth: function(skip, noEvent){
			var t = this,
				g = t.grid,
				dn = g.domNode,
				header = g.header,
				autoResize = t.arg('autoResize'),
				ltr = g.isLeftToRight(),
				marginLead = ltr ? 'marginLeft' : 'marginRight',
				marginTail = ltr ? 'marginRight' : 'marginLeft',
				lead = g.hLayout.lead,
				tail = g.hLayout.tail,
				innerNode = header.innerNode,
				bs = g.bodyNode.style,
				hs = innerNode.style,
				headerBorder = domGeometry.getBorderExtents(header.domNode).w,
				tailBorder = headerBorder,
				mainBorder = 0,
				bodyWidth = (dn.clientWidth || domStyle.get(dn, 'width')) - lead - tail - headerBorder,
				refNode = query('.gridxCell', innerNode)[0],
				padBorder = refNode ? domGeometry.getMarginBox(refNode).w - domGeometry.getContentBox(refNode).w : 0,
				isGroupHeader = g.header.arg('groups'),
				isGridHidden = !dn.offsetHeight;
			t._padBorder = padBorder;
			//FIXME: this is theme dependent. Any better way to do this?
			if(tailBorder === 0){
				tailBorder = 1;
			}else{
				mainBorder = 2;
			}
			hs[marginLead] = lead + 'px';
			hs[marginTail] = (tail > tailBorder ? tail - tailBorder : 0)  + 'px';
			g.mainNode.style[marginLead] = lead + 'px';
			g.mainNode.style[marginTail] = tail + 'px';
			bodyWidth = bodyWidth < 0 ? 0 : bodyWidth;
			if(skip){
				t.onUpdate();
				return;
			}
			if(autoResize){
				if(needHackPadBorder){
					query('.gridxCell', innerNode).forEach(function(node){
						var c = g._columnsById[node.getAttribute('colid')];
						if(/px$/.test(c.declaredWidth)){
							var w = parseInt(c.declaredWidth, 10) + padBorder;
							w = c.width = w + 'px';
							node.style.width = w;
							node.style.minWidth = w;
							node.style.maxWidth = w;
						}
					});
				}
			}
			if(g.autoWidth){
				var headers = query('.gridxCell', innerNode),
					totalWidth = 0;
				headers.forEach(function(node){
					var c = g._columnsById[node.getAttribute('colid')];
					var w = domStyle.get(node, 'width');
					if(isGroupHeader || !needHackPadBorder || !isGridHidden){
						w += padBorder;
					}
					if(w < c.minWidth){
						w = c.minWidth;
					}
					totalWidth += w;
					if(c.width == 'auto' || (/%$/).test(c.width)){
						node.style.width = c.width = w + 'px';
						node.style.minWidth = c.width;
						node.style.maxWidth = c.width;
					}
				});
				bs.width = totalWidth + 'px';
				dn.style.width = (lead + tail + totalWidth + mainBorder) + 'px';
			}else if(autoResize){
				hs.borderWidth = g.vScrollerNode.style.display == 'none' ? 0 : '';
			}else{
				var autoCols = [],
					cols = g._columns,
					fixedWidth = 0;
				if(!isGroupHeader && needHackPadBorder){
					padBorder = 0;
				}
				array.forEach(cols, function(c){
					if(c.declaredWidth == 'auto'){
						autoCols.push(c);
					}else if(/%$/.test(c.declaredWidth)){
						var w = parseFloat(bodyWidth * parseFloat(c.declaredWidth, 10) / 100 - padBorder, 10);
						//Check if less than zero, prevent error in IE.
						if(w < 0){
							w = 0;
						}
						if(typeof c.minWidth == 'number' && w < c.minWidth){
							w = c.minWidth;
						}
						var node = header.getHeaderNode(c.id);
						node.style.width = c.width = w + 'px';
						node.style.minWidth = c.width;
						node.style.maxWidth = c.width;
					}
				});
				array.forEach(cols, function(c){
					if(c.declaredWidth != 'auto'){
						var headerNode = header.getHeaderNode(c.id),
							w = !isGroupHeader && needHackPadBorder ? parseFloat(headerNode.style.width, 10) :
								(domStyle.get(headerNode, 'width') + padBorder);
						if(/%$/.test(c.declaredWidth)){
							c.width = (w > padBorder ? w - padBorder : 0) + 'px';
						}
						fixedWidth += w;
					}
				});
				if(autoCols.length){
					var freeWidth = bodyWidth - fixedWidth;
					if(freeWidth > 0){
						//FIXME: this value is to check the very first load or just resize grid 
						//try to find a better to judge the first loading
						var firstLoad = !this.grid.vScroller.loaded.isResolved();
						calcAutoWidth(autoCols, freeWidth, padBorder, firstLoad);
					}else{
						var w = t.arg('default');
						array.forEach(autoCols, function(c, i){
							var cw = w;
							if(typeof c.minWidth == 'number' && cw < c.minWidth){
								cw = c.minWidth;
							}
							c.width = cw + 'px';
						});
					}
					array.forEach(autoCols, function(c, i){
						var node = header.getHeaderNode(c.id);
						node.style.width = c.width;
						node.style.minWidth = c.width;
						node.style.maxWidth = c.width;
					});
				}
			}
			if(isGroupHeader){
				// If group header is used, the column width might not be set properly 
				// (min-width/max-width not working when colspan cells exist).
				// So the actual width of the node is honored.
				query('.gridxCell', header.innerNode).forEach(function(node){
					var col = g._columnsById[node.getAttribute('colid')];
					if(/px$/.test(col.width)){
						var width = node.clientWidth - domGeometry.getPadExtents(node).w;
						if(parseInt(col.width, 10) != width){
							col.width = width = width + 'px';
							node.style.width = width;
							node.style.minWidth = width;
							node.style.maxWidth = width;
						}
					}
				});
				if(g.autoWidth){
					query('.gridxCell', g.bodyNode).forEach(function(cellNode){
						var col = g._columnsById[cellNode.getAttribute('colId')],
							w = col && col.width,
							s = cellNode.style;
						if(w){
							s.width = w;
							s.minWidth = w;
							s.maxWidth = w;
						}
					});
				}
			}
			g.hScroller.scroll(0);
			header._onHScroll(0);
			g.vLayout.reLayout();
			if(!noEvent){
				t.onUpdate();
			}
		},

		_onSetColumns: function(){
			var t = this,
				g = t.grid;
			t._init();
			//Now header and body can be different, so we should not trigger any onRender event at this inconsistent stage,
			g.header._build();
			t._adaptWidth();
			//FIXME: Is there any more elegant way to do this?
			if(g.cellWidget){
				g.cellWidget._init();
				if(g.edit){
					g.edit._init();
				}
			}
			if(g.tree){
				g.tree._initExpandLevel();
			}
			g.body.refresh();
			//Now header and body are matched, so we can fire onRender.
			g.header.onRender();
		}
	});
});
