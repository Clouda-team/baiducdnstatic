define([
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/_base/sniff",
	"dojo/dom-class",
	"dojo/keys",
	"dojo/query",
	"./Header"
], function(kernel, declare, lang, array, has, domClass, keys, query, Header){
	kernel.experimental('gridx/modules/GroupHeader');

/*=====
	var GroupHeader = declare(Header, {
		// summary:
		//		module name: header.
		//		The header UI of grid. This implementation supports header groups (also called "column groups").
		//		This module is not compatible with IE7 and below.
		//		This module is not compatible with ColumnLock and HiddenColumns.
		// description:
		//		This module inherites the default Header module, adding support of column groups.
		//		Several adjacent headers can be grouped together by configuring the "groups" parameter of this module.
		//		Header groups are shown as higher level headers with colspan.
		// example:
		//		Simple single level groups:
		//	|	var grid = new Grid({
		//	|		......
		//	|		structure: [
		//	|			{ id: 'column1', name: 'Column 1' },
		//	|			{ id: 'column2', name: 'Column 2' },
		//	|			{ id: 'column3', name: 'Column 3' },
		//	|			{ id: 'column4', name: 'Column 4' },
		//	|			{ id: 'column5', name: 'Column 5' },
		//	|			{ id: 'column6', name: 'Column 6' },
		//	|			{ id: 'column7', name: 'Column 7' },
		//	|			{ id: 'column8', name: 'Column 8' },
		//	|			{ id: 'column9', name: 'Column 9' }
		//	|		],
		//	|		headerGroups: [
		//	|			{ name: "Group 1", children: 3 }, //This group contains 3 real columns (Column1, 2, and 3).
		//	|			{ name: "Group 2", children: 2 }, //This group contains 2 real columns (Column 4, and 5).
		//	|			{ name: "Group 3", children: 4 }, //This group contains 4 real columns (Column 6, 7, 8, and 9).
		//	|		],
		//	|		modules: [
		//	|			......
		//	|			"gridx/modules/GroupHeader"
		//	|		],
		//	|		......
		//	|	});
		//		Multi-level groups:
		//		(structure and other settings are the same as the previous sample)
		//	|	var grid = new Grid({
		//	|		......
		//	|		headerGroups: [
		//	|			{ name: "Group 1", children: [
		//	|				{ name: "Group 1-1", children: 2},	//Contains Column 1 and 2
		//	|				{ name: "Group 1-2", children: 2}	//Contains Column 3 and 4
		//	|			]},
		//	|			{ name: "Group 2", children: [
		//	|				{ name: "Group 2-1", children: 2},	//Contains Column 5 and 6
		//	|				{ name: "Group 2-2", children: 3}	//Contains Column 7, 8, and 9
		//	|			]}
		//	|		],
		//	|		......
		//	|	});
		//		Complicated group structure (colspan and rowspan):
		//		(structure and other settings are the same as the previous sample)
		//	|	var grid = new Grid({
		//	|		......
		//	|		headerGroups: [
		//	|			1,		//Column 1
		//	|			{ name: "Group 1", children: [
		//	|				{ name: "Group 1-1", children: 2 },		//Contains Column 2 and 3
		//	|				1,		Column 4
		//	|				{ name: "Group 1-2", children: [
		//	|					{ name: "Group 1-2-1", children: 2 },	//Contains Column 5 and 6
		//	|					{ name: "Group 1-2-2", children: 2 }	//Contains Column 7 and 8
		//	|				]}
		//	|			]}
		//	|			//If not all columns are included in previous groups, the remaining are automatically added here.
		//	|			//So the final is Column 9, same level as Column 1 and "Group 1".
		//	|		],
		//	|		......
		//	|	});

		// groups: (Integer|GroupHeader.__HeaderGroup)[]
		//		Configure the header group structure. Must be an array.
		groups: null
	});

	GroupHeader.__HeaderGroup = declare([], {
		// summary:
		//		Definition of a header group.
		// description:
		//		Defines the content shown in this header group and the children included in this group.

		// id: String
		//		The identity of this header group.
		//		If not provided, default to "group-" + group_level + "-" + id_of_first_column_in_this_group
		//		where group_level starts from 0 (the highest groups).
		id: '',

		// name: String
		//		The content shown in this header group.
		name: '',

		// children: Integer|(Integer|GroupHeader.__HeaderGroup)[]
		//		The children included in this header group. Can be other header groups or real columns.
		//		If to include real columns, a number is given to indicate how many real columns are located here.
		//		For example: [3, { name: "child group", children: 4 }] means this group includes 3 real columns
		//		followed by a child group whose "name" is "child group" and whose children is 4 real columns.
		children: []
	});

	return GroupHeader;
=====*/

	return declare(Header, {
		preload: function(args){
			this.inherited(arguments);
			var t = this,
				g = t.grid,
				escapeId = g._escapeId;
			if(g.columnResizer){
				t.aspect(g.columnResizer, 'onResize', function(colId){
					var w = (query('[colid="' + escapeId(colId) + '"]', g.headerNode)[0].offsetWidth - g.columnWidth._padBorder) + 'px';
					if(w != g._columnsById[colId].width){
						query('[colid="' + escapeId(colId) + '"]', g.domNode).forEach(function(cell){
							var cs = cell.style;
							cs.width = w;
							cs.minWidth = w;
							cs.maxWidth = w;
						});
					}
				});
			}
		},

		refresh: function(){
			this.inherited(arguments);
			this._curNode = 0;
		},

		_parse: function(){
			var columns = this.grid._columns,
				columnCount = columns.length,
				cnt = 0,
				maxLevel = 0,
				groups = this.arg('groups', []),
				groupsById = this._groupsById = {},
				check = function(struct, level, groupId){
					if(!lang.isArrayLike(struct)){
						struct = [struct];
					}
					if(level > maxLevel){
						maxLevel = level;
					}
					var colCount = 0;
					for(var i = 0; i < struct.length;){
						var item = struct[i];
						if(cnt >= columnCount){
							//There's already no more columns
							struct.splice(i, 1);
						}else if(typeof item == 'number' && item > 0){
							//After adding some columns, it is overloaded
							if(cnt + item > columnCount){
								item = struct[i] = columnCount - cnt;
							}
							for(var j = 0; j < item; ++j){
								columns[cnt + j].groupId = groupId;
							}
							colCount += item;
							cnt += item;
							++i;
						}else if(item && lang.isObject(item)){
							//This is a column group
							if(!lang.isArrayLike(item.children)){
								item.children = [item.children];
							}
							item.groupId = groupId;
							item.id = item.id || 'group-' + level + '-' + columns[cnt].id;
							item.level = level;
							item.start = cnt;
							var colSpan = check(item.children, level + 1, item.id);
							if(item.children.length){
								groupsById[item.id] = item;
								item.colCount = colSpan;
								colCount += colSpan;
								++i;
							}else{
								//No children for this group
								struct.splice(i, 1);
							}
						}else{
							//the format of this item is not recognizable.
							struct.splice(i, 1);
						}
					}
					return colCount;
				};
			check(groups, 0);
			if(cnt < columnCount){
				groups.push(columnCount - cnt);
			}
			return maxLevel;
		},

		_configMoveColumn: function(){
			var t = this,
				g = t.grid;
			if(g.move && g.move.column){
				//Compatiblity with move/Column
				var constraints = g.move.column.arg('constraints', {});
				for(var id in t._groupsById){
					var group = t._groupsById[id];
					var end = group.start + group.colCount - 1;
					if(typeof constraints[group.start] != 'number' || end < constraints[group.start]){
						constraints[group.start] = end;
					}
				}
				var gPrev = -1,
					gStart = 0;
				array.forEach(g._columns, function(col, i){
					if(!col.groupId){
						if(i != gPrev + 1){
							gStart = i;
						}
						gPrev = i;
						constraints[gStart] = i;
					}
				});
			}
		},

		_build: function(){
			var t = this,
				g = t.grid,
				f = g.focus,
				columns = g._columns.slice(),
				currentLevel = 0,
				level = t._parse(),
				q = t.groups.slice(),
				sb = ['<table role="presentation" border="0" cellpadding="0" cellspacing="0">'];
			t._configMoveColumn();
			function build(){
				sb.push('<tr>');
				var prevColCount = 0;
				for(var i = 0, len = q.length; i < len; ++i){
					var item = q.shift();
					if(typeof item == 'number'){
						for(var j = 0; j < item; ++j){
							var col = columns[prevColCount + j],
								cls = col.headerClass,
								style = col.headerStyle,
								width = col.width;
							col._domId = (g.id + '-' + col.id).replace(/\s+/, '');
							sb.push('<td role="columnheader" aria-readonly="true" tabindex="-1" id="', col._domId,
								'" colid="', col.id,
								level - currentLevel ? '" rowspan="' + (level - currentLevel + 1) : '',
								'" class="gridxCell ',
								currentLevel ? 'gridxSubHeader' : '',
								f && f.currentArea() == 'header' && col.id == t._focusHeaderId ? t._focusClass : '',
								(cls && lang.isFunction(cls) ? cls(col) : cls) || '',
								'" style="width:', width, ';min-width:', width, ';max-width:', width, ';',
								g.getTextDirStyle(col.id, col.name),
								(style && lang.isFunction(style) ? style(col) : style) || '',
								'"><div class="gridxSortNode">',
								col.name || '',
								'</div></td>');
						}
						columns.splice(prevColCount, item);
					}else{
						prevColCount += item.colCount;
						q = q.concat(item.children);
						sb.push('<td tabindex="-1" colspan="', item.colCount,
							'" class="gridxGroupHeader', currentLevel ? ' gridxSubHeader' : '',
							'" groupid="', item.id,
							'"><div class="gridxSortNode">', item.name || '', '</div></td>');
					}
				}
				sb.push('</tr>');
				currentLevel++;
			}
			while(q.length){
				build();
			}
			sb.push('</table>');
			t._curNode = 0;
			t.innerNode.innerHTML = sb.join('');
			domClass.toggle(t.domNode, 'gridxHeaderRowHidden', t.arg('hidden'));
			domClass.add(g.domNode, 'gridxGH');
		},

		_initFocus: function(){
			var t = this, g = t.grid;
			if(g.focus){
				g.focus.registerArea({
					name: 'header',
					priority: 0,
					focusNode: t.innerNode,
					scope: t,
					doFocus: t._doFocus,
					doBlur: t._blurNode,
					onBlur: t._blurNode,
					connects: [
						t.connect(t.domNode, 'onkeydown', '_onKeyDown'),
						t.connect(t.domNode, 'onmousedown', function(evt){
							t._focusNode(query(evt.target).closest('td', t.domNode)[0]);
							g.focus.currentArea();
						})
					]
				});
			}
		},

		_doFocus: function(evt, step){
			var t = this,
				n = t._curNode || query('td', t.domNode)[0];
			t._focusNode(n);
			return n;
		},
		
		_focusNode: function(node){
			if(node){
				var t = this, g = t.grid,
					fid = t._focusHeaderId = node.getAttribute('colid');
				if(!fid){
					fid = t._focusGroupId = node.getAttribute('groupid');
					var group = t._groupsById[fid];
					if(group){
						//If the group node is half visible, should scroll to the farther end column to make it fully visible.
						//Otherwise, it'll cause header-body mismatch in IE.
						var colIdx = node.offsetLeft + node.offsetWidth > t.innerNode.scrollLeft + t.innerNode.clientWidth ?
								group.start + group.colCount - 1 :
								group.start;
						fid = g._columns[colIdx].id;
					}
				}
				if(fid && g._columnsById[fid]){
					t._blurNode();
					if(g.hScroller){
						g.hScroller.scrollToColumn(fid);
					}
					g.body._focusCellCol = g._columnsById[fid].index;

					t._curNode = node;
					domClass.add(node, t._focusClass);
					//If no timeout, the header and body may be mismatch.
					setTimeout(function(){
						//For webkit browsers, when moving column using keyboard, the header cell will lose this focus class,
						//although it was set correctly before this setTimeout. So re-add it here.
						if(has('webkit')){
							domClass.add(node, t._focusClass);
						}
						node.focus();
						if(t._isMSIE()){
							t.innerNode.scrollLeft = t._scrollLeft;
						}
					}, 0);
					return true;
				}
			}
			return false;
		},
		
		//dojo has not well support IE version check for IE11 currently, should remove when it's ready
		_isMSIE: function(){
            var ua = navigator.userAgent.toLowerCase();
            return ((/msie/.test(ua)||/trident/.test(ua)) && !/opera/.test(ua));
        },

		_blurNode: function(){
			var t = this, n = query('.' + t._focusClass, t.innerNode)[0];
			if(n){
				domClass.remove(n, t._focusClass);
			}
			return true;
		},

		_getUpNode: function(node){
			var colId = node.getAttribute('colid'),
				groupId = node.getAttribute('groupid'),
				item = this.grid._columnsById[colId] || this._groupsById[groupId];
			return item && query('[groupid="' + item.groupId + '"]', this.domNode)[0];
		},

		_getDownNode: function(node, last){
			var item = this._groupsById[node.getAttribute('groupid')];
			if(item){
				var child = item.children[0];
				if(typeof child == 'number'){
					var col = this.grid._columns[item.start];
					return this.getHeaderNode(col.id);
				}else{
					var nodes = query('[groupid="' + child.id + '"]', this.domNode);
					return last ? nodes[nodes.length - 1] : nodes[0];
				}
			}
		},

		_getPrevNode: function(node){
			var n = node.previousSibling;
			if(!n){
				n = this._getUpNode(node);
				n = n && this._getPrevNode(n);
				n = n && this._getDownNode(n, 1) || n;
			}
			return n;
		},

		_getNextNode: function(node){
			var n = node.nextSibling;
			if(!n){
				n = this._getUpNode(node);
				n = n && this._getNextNode(n);
				n = n && this._getDownNode(n) || n;
			}
			return n;
		},

		_onKeyDown: function(evt){
			var t = this, g = t.grid, col,
				node = t._curNode;
			if(!g._isCtrlKey(evt) && !evt.altKey &&
				(evt.keyCode == keys.LEFT_ARROW || evt.keyCode == keys.RIGHT_ARROW)){
				//Prevent scrolling the whole page.
				g.focus.stopEvent(evt);
				var isPrev = g.isLeftToRight() ^ evt.keyCode == keys.RIGHT_ARROW;
				var n = isPrev ? t._getPrevNode(node) : t._getNextNode(node);
				if(n){
					t._focusHeaderId = n.getAttribute('colid');
					t._focusGroupId = n.getAttribute('groupid');
					t._focusNode(n);
					if(t._focusHeaderId){
						t.onMoveToHeaderCell(t._focusHeaderId, evt);
					}
				}
			}else if(evt.keyCode == keys.UP_ARROW){
				//Prevent scrolling the whole page.
				g.focus.stopEvent(evt);
				t._focusNode(t._getUpNode(node));
			}else if(evt.keyCode == keys.DOWN_ARROW){
				//Prevent scrolling the whole page.
				g.focus.stopEvent(evt);
				t._focusNode(t._getDownNode(node));
			}
		}
	});
});
