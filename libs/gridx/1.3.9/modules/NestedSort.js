define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/event",
	"dojo/query",
	"dojo/string",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/keys",
	"../core/_Module",
	"../core/model/extensions/Sort",
	"./HeaderRegions"
], function(declare, array, lang, event, query, string, domClass, domConstruct, keys, _Module, Sort){

/*=====
	return declare(_Module, {
		// summary:
		//		module name: sort.
		//		Sort multiple columns in a nested way.

		getSortData: function(){
			// summary:
			//		TODOC
		},

		sort: function(sortData){
			// summary:
			//		TODOC
		},

		isSorted: function(colId){
			// summary:
			//		TODOC
		},

		clear: function(){
			// summary:
			//	Clear the sorting state
		},

		isSortable: function(colId){
			// summary:
			//		TODOC
		}
	});
=====*/
	
	var filter = array.filter,
		indexOf = array.indexOf,
		removeClass = domClass.remove,
		addClass = domClass.add,
		a11yText = {
			'dojoxGridDescending': '<span class="gridxNestedSortBtnText">&#9662;</span>',
			'dojoxGridAscending': '<span class="gridxNestedSortBtnText">&#9652;</span>',
			'dojoxGridAscendingTip': '<span class="gridxNestedSortBtnText">&#1784;</span>',
			'dojoxGridDescendingTip': '<span class="gridxNestedSortBtnText">&#1783;</span>',
			'dojoxGridUnsortedTip': '<span class="gridxNestedSortBtnText">x</span>' //'&#10006;'
		};

	return declare(_Module, {
		name: 'sort',

		required: ['headerRegions'],

		modelExtensions: [Sort],

		preload: function(args){
			var t = this,
				g = t.grid;
			t._sortData = t.arg('initialOrder', []);
			if(g.persist){
				var d = g.persist.registerAndLoad('sort', function(){
					return t._sortData;
				});
				if(d){
					t._sortData = d;
				}
			}
			t._sortData = filter(t._sortData, function(d){
				return t.isSortable(d.colId);
			});
			if(t._sortData.length){
				g.model.sort(t._sortData);
			}
			
			t.connect(g.headerRegions, 'refresh', t._updateUI);

			g.headerRegions.add(lang.hitch(t, t._createBtn, 1), 10, 1);
			g.headerRegions.add(lang.hitch(t, t._createBtn, 0), 11, 1);
		},

		columnMixin: {
			isSorted: function(){
				return this.grid.sort.isSorted(this.id);
			},
			isSortable: function(){
				return this.grid.sort.isSortable(this.id);
			}
		},

		getSortData: function(){
			return this._sortData;
		},

		sort: function(sortData){
			var t = this;
			t._sortData = filter(sortData, function(d){
				return t.isSortable(d.colId);
			});
			t._doSort();
		},

		isSorted: function(colId){
			var ret = 0;
			array.some(this._sortData, function(d){
				if(d.colId == colId){
					ret = d.descending ? -1 : 1;
					return 1;
				}
			});
			return ret;
		},

		isSortable: function(colId){
			var col = this.grid._columnsById[colId];
			return col && (col.sortable || col.sortable === undefined);
		},

		clear: function(){
			this._sortData.length = 0;
			this._doSort();
		},

		//Private---------------------------------------------------------------------------
		_createBtn: function(isSingle, col){
			var t = this,
				nls = t.grid.nls;
			if(t.isSortable(col.id)){
				var btn = domConstruct.create('div', {
					'class': 'gridxSortBtn gridxSortBtn' + (isSingle ? 'Single' : 'Nested'),
					tabIndex: -1,
					title: isSingle ?
						nls.singleSort + ' - ' + nls.ascending :
						nls.nestedSort + ' - ' + nls.ascending,
					innerHTML: isSingle ?
						a11yText.dojoxGridAscendingTip + '&nbsp;' :
						t._sortData.length + 1 + a11yText.dojoxGridAscendingTip
				});
				t.connect(btn, 'onmousedown', function(){
					t._sort(col, btn, isSingle);
				});
				t.connect(btn, 'onkeydown', function(e){
					if(e.keyCode == keys.ENTER){
						event.stop(e);
						t._sort(col, btn, isSingle);
					}
				});
				return btn;
			}
		},

		_sort: function(col, btn, isSingle){
			var t = this, d,
				sortData = t._sortData;
			if(isSingle){
				if(sortData.length > 1){
					sortData.length = 0;
				}
				d = filter(sortData, function(data){
					return data.colId === col.id;
				})[0];
				sortData.length = 0;
				if(d){
					sortData.push(d);
				}
			}else{
				d = filter(sortData, function(d){
					return d.colId === col.id;
				})[0];
			}
			if(d){
				if(d.descending){
					sortData.splice(indexOf(sortData, d), 1);
				}
				d.descending = !d.descending;
			}else{
				d = {
					colId: col.id,
					descending: false
				};
				sortData.push(d);
			}
			t._doSort();
		},

		_doSort: function(){
			var g = this.grid,
				d = this._sortData;
			this._updateUI();
			g.model.sort(d.length ? d : null);
			g.body.refresh();
		},

		_updateUI: function(){
			var t = this,
				g = t.grid,
				nls = g.nls,
				dn = g.domNode,
				sortData = array.filter(t._sortData, function(s){
					return g._columnsById[s.colId];
				});
			removeClass(dn, 'gridxSingleSorted');
			removeClass(dn, 'gridxNestedSorted');
			if(sortData.length == 1){
				addClass(dn, 'gridxSingleSorted');
			}else if(sortData.length > 1){
				addClass(dn, 'gridxNestedSorted');
			}
			query('.gridxCell', g.header.domNode).forEach(function(cell){
				var colid = cell.getAttribute('colid');
				if(t.isSortable(colid)){
					array.forEach(['', 'Desc', 'Asc', 'Main'], function(s){
						removeClass(cell, 'gridxCellSorted' + s);
					});
					var singleBtn = query('.gridxSortBtnSingle', cell)[0],
						nestedBtn = query('.gridxSortBtnNested', cell)[0];
					singleBtn.title = nls.singleSort + ' - ' + nls.ascending;
					nestedBtn.title = nls.nestedSort + ' - ' + nls.ascending;
					singleBtn.innerHTML = a11yText.dojoxGridAscendingTip + '&nbsp;';
					nestedBtn.innerHTML = sortData.length + 1 + a11yText.dojoxGridAscendingTip;
					var d = filter(sortData, function(data){
						return data.colId === colid;
					})[0];
					t._setWaiState(cell, colid, d);
					if(d){
						nestedBtn.innerHTML = indexOf(sortData, d) + 1;
						addClass(cell, 'gridxCellSorted');
						if(d == sortData[0]){
							addClass(cell, 'gridxCellSortedMain');
						}
						var len = sortData.length;
						if(d.descending){
							addClass(cell, 'gridxCellSortedDesc');
							if(len == 1){
								singleBtn.title = nls.singleSort + ' - ' + nls.unsorted;
								singleBtn.innerHTML = a11yText.dojoxGridDescending + '&nbsp;';
							}else{
								nestedBtn.title = nls.nestedSort + ' - ' + nls.unsorted;
								nestedBtn.innerHTML += a11yText.dojoxGridDescending;
							}
						}else{
							addClass(cell, 'gridxCellSortedAsc');
							if(len == 1){
								singleBtn.title = nls.singleSort + ' - ' + nls.descending;
								singleBtn.innerHTML = a11yText.dojoxGridAscending + '&nbsp;';
							}else{
								nestedBtn.title = nls.nestedSort + ' - ' + nls.descending;
								nestedBtn.innerHTML += a11yText.dojoxGridAscending;
							}
						}
					}
				}
			});
		},

		_setWaiState: function(cell, colid, data){
			var col = this.grid.column(colid),
				columnInfo = 'Column ' + col.name(),
				orderState = 'none', orderAction = 'ascending';
			if(data){
				orderState = data.descending ? 'descending' : 'ascending';
				orderAction = data.descending ? 'none' : 'descending';
			}
			var a11ySingleLabel = string.substitute(this.grid.nls.waiSingleSortLabel, [columnInfo, orderState, orderAction]),
				a11yNestedLabel = string.substitute(this.grid.nls.waiNestedSortLabel, [columnInfo, orderState, orderAction]);
			query('.gridxSortBtnSingle', cell)[0].setAttribute("aria-label", a11ySingleLabel);
			query('.gridxSortBtnNested', cell)[0].setAttribute("aria-label", a11yNestedLabel);
		}
	});
});
