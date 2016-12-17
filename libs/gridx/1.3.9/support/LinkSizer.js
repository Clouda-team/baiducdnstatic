define([
	"dojo/_base/declare",
	"dojo/query",
	"dojo/_base/event",
	"dojo/string",
	"dojo/dom-class",
	"dojo/keys",
	"./_LinkPageBase"
], function(declare, query, event, string, domClass, keys, _LinkPageBase){

/*=====
	return declare(_LinkPageBase, {
		// summary:
		//		This is a grid bar plugin that can be used to switch page sizes using link buttons.

		// sizeSpearator: String
		//		The string used to separate page sizes.
		sizeSeparator: '|',

		// sizes: Integer[]
		//		An array of available page sizes. Non-positive number means "all"
		sizes: [10, 25, 50, 100, 0],

		refresh: function(){
			// summary:
			//		Refresh the UI using current arguments.
		}
	});
=====*/

	var hasClass = domClass.contains;

	return declare(_LinkPageBase, {
		templateString: '<div class="gridxLinkSizer" role="toolbar" aria-label="switch page size" data-dojo-attach-event="onclick: _changePageSize, onmouseover: _onHover, onmouseout: _onHover"></div>',

		postMixInProperties: function(){
			var t = this;
			t.inherited(arguments);
			t.connect(t.grid.pagination, 'onChangePageSize', '_onChange');
		},

		startup: function(){
			this.inherited(arguments);
			//Set initial page size after pagination module is ready.
			this._onChange(this.grid.pagination.pageSize());
		},


		//Public-----------------------------------------------------------------------------
		sizeSeparator: '|',

		sizes: [10, 25, 50, 100, 0],

		refresh: function(){
			var t = this,
				sb = [],
				tabIndex = t._tabIndex,
				separator = t.sizeSeparator,
				currentSize = t.grid.pagination.pageSize(),
				substitute = string.substitute;
			for(var i = 0, len = t.sizes.length; i < len; ++i){
				var pageSize = t.sizes[i],
					isAll = false;
				//pageSize might be invalid inputs, so be strict here.
				if(!(pageSize > 0)){
					pageSize = 0;
					isAll = true;
				}
				sb.push('<span class="gridxPagerSizeSwitchBtn ',
					currentSize === pageSize ? 'gridxPagerSizeSwitchBtnActive' : '',
					'" pagesize="', pageSize,
					'" title="', isAll ? t.pageSizeAllTitle : substitute(t.pageSizeTitle, [pageSize]),
					'" aria-label="', isAll ? t.pageSizeTitle : substitute(t.pageSizeTitle, [pageSize]),
					'" tabindex="', tabIndex, '">', isAll ? t.pageSizeAll : substitute(t.pageSize, [pageSize]),
					'</span>',
					//Separate the "separator, so we can pop the last one.
					'<span class="gridxPagerSizeSwitchSeparator">' + separator + '</span>');
			}
			sb.pop();
			t.domNode.innerHTML = sb.join('');
			t.grid.vLayout.reLayout();
		},

		//Private----------------------------------------------------------------------------
		_onHover: function(evt){
			this._toggleHover(evt, 'gridxPagerSizeSwitchBtn', 'gridxLinkSizer', 'gridxPagerSizeSwitchBtnHover');
		},

		_onChange: function(size, oldSize){
			var dn = this.domNode,
				n = query('[pagesize="' + size + '"]', dn)[0];
			if(n){
				domClass.add(n, 'gridxPagerSizeSwitchBtnActive');
			}
			n = query('[pagesize="' + oldSize + '"]', dn)[0];
			if(n){
				domClass.remove(n, 'gridxPagerSizeSwitchBtnActive');
			}
		},

		_changePageSize: function(evt){
			var n = this._findNodeByEvent(evt, 'gridxPagerSizeSwitchBtn', 'gridxLinkSizer');
			if(n){
				var pageSize = this._focusPageSize = n.getAttribute('pagesize');
				this.grid.pagination.setPageSize(parseInt(pageSize, 10));
			}
		},
	
		//Focus------------------------
		_onKey: function(evt){
			var t = this,
				p = t.grid.pagination,
				leftKey = t.grid.isLeftToRight() ? keys.LEFT_ARROW : keys.RIGHT_ARROW;
			if(evt.keyCode == keys.LEFT_ARROW || evt.keyCode == keys.RIGHT_ARROW){
				event.stop(evt);
				t._focusNextBtn(true, evt.keyCode == leftKey);
			}else if(evt.keyCode == keys.ENTER &&
				hasClass(evt.target, 'gridxPagerSizeSwitchBtn') &&
				!hasClass(evt.target, 'gridxPagerSizeSwitchBtnActive')){
				event.stop(evt);
				p.setPageSize(parseInt(t._focusPageSize, 10));
			}
		},
	
		_focusNextBtn: function(isMove, isLeft){
			var t = this,
				c = t.domNode,
				n = query('[pagesize="' + t._focusPageSize + '"]', c)[0];
			n = t._focus(query('.gridxPagerSizeSwitchBtn', c), n, isMove, isLeft, function(node){
				return !hasClass(node, 'gridxPagerSizeSwitchBtnActive');
			});
			if(n){
				t._focusPageSize = n.getAttribute('pagesize');
			}
			return n;
		}
	});
});
