define([
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"dijit/registry",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/_base/event",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/string",
	"dojo/parser",
	"dojo/query",
	"dojo/keys",
	'dojo/on',
	'dojox/html/entities',
	"dijit/_BidiSupport",
	"../../core/_Module",
	"dojo/text!../../templates/FilterBar.html",
	"../Filter",
	"./FilterDialog",
	"./FilterConfirmDialog",
	"./FilterTooltip",
	"dijit/TooltipDialog",
	"dijit/popup",
	"dijit/form/Button"
], function(kernel, declare, registry, lang, array, event, dom, domAttr, css, string,
			parser, query, keys, on, entities, _BidiSupport, _Module, template, Filter, FilterDialog, FilterConfirmDialog, FilterTooltip){

/*=====
	var FilterBar = declare(_Module, {
		// summary:
		//		module name: filterBar.
		//		Filter bar module.
		// description:
		//		Show a filter bar on top of grid header. Clicking the filter bar will show a filter dialog to config conditions.
		//		This module depends on "filter" module.

		// filterData: Object
		//		Set the initial filter rules. Format is:
		//	|	{
		//	|		type: "all",
		//	|		conditions: [
		//	|			{}
		//	|		]
		//	|	}
		filterData: null,

		// closeButton: Boolean
		//		TRUE to show a small button on the filter bar for the user to close/hide the filter bar.
		closeButton: true,

		// defineFilterButton: Boolean
		//		FALSE to hide the define filter button on the left side (right side for RTL) of the filter bar.
		defineFilterButton: true,

		// tooltipDelay: Number
		//		Time in mili-seconds of the delay to show the Filter Status Tooltip when mouse is hovering on the filter bar.
		tooltipDelay: 300,

		// maxRuleCount: Integer
		//		Maximum rule count that can be applied in the Filter Definition Dialog.
		//		If <= 0 or not number, then infinite rules are supported.
		maxRuleCount: 0,

		// ruleCountToConfirmClearFilter: Integer | Infinity | null
		//		If the filter rule count is larger than or equal to this value, then a confirm dialog will show when clearing filter.
		//		If set to less than 1 or null, then always show the confirm dialog.
		//		If set to Infinity, then never show the confirm dialog.
		//		Default value is 2.
		ruleCountToConfirmClearFilter: 2,

		// itemsName: String
		//		The general name of the items listed in the grid.
		//		If not provided, then search the language bundle.
		itemsName: '',

		// condition:
		//		Name of all supported conditions.
		//		Hard coded here or dynamicly generated is up to the implementer. Anyway, users should be able to get this info.
		conditions: {},

		applyFilter: function(filterData){
			// summary:
			//		Apply the filter data.
		},

		refresh: function(){
			// summary:
			//		Re-draw the filter bar if necessary with the current attributes.
			// example:
			//	|	grid.filterBar.closeButton = true;
			//	|	grid.filterBar.refresh();
		},

		isVisible: function(){
			// summary:
			//		Whether the filter bar is visible.
		},

		show: function(){
			// summary:
			//		Show the filter bar. (May add animation later)
		},

		hide: function(){
			// summary:
			//		Hide the filter bar. (May add animation later)
		},

		onShow: function(){
		},

		onHide: function(){
		},

		showFilterDialog: function(){
			// summary:
			//		Show the filter define dialog.
		}
	});

	FilterBar.__DataTypeArgs = declare([], {
		useRawData: true,
		converter: function(v){
		}
	});

	FilterBar.__FilterArgs = declare([], {
		trueLabel: '',
		falseLabel: '',
		valueDijitArgs: {}
	});

	FilterBar.__ColumnDefinition = declare([], {
		// filterable: Boolean
		//		If FALSE, then this column should not occur in the Filter Definition Dialog for future rules.
		//		But this does not influence existing filter rules. Default to be TRUE.
		filterable: true,

		// disabledConditions: String[]
		//		If provided, all the listed conditions will not occur in the Filter Definition Dialog for future rules.
		//		But this does not influence existing filter rules. Default to be an empty array.
		disabledConditions: [],

		// dataType: String
		//		Specify the data type of this column. Should be one of "string", "number", "date", "time", "boolean" and "enum".
		//		Case insensitive. Data type decides which conditions to use in the Filter Definition Dialog.
		dataType: 'date',

		//TODOC?
		//storeDatePattern: '',

		//TODOC?
		//dateParsePattern: 'yyyy/MM/dd HH:mm:ss',

		// filterArgs: __FilterArgs
		//		
		filterArgs: null,

		// dataTypeArgs: __DataTypeArgs
		//		Passing any other special config options for this column. For example, if the column is of type 'date', but the data
		//		in store is of string type, then a 'converter' function is needed here:
		//		dataTypeArgs: {
		//			useRawData: true,
		//			converter: function(v){
		//				return dojo.date.locale.parse(v, {...});
		//			}
		//		}
		dataTypeArgs: {}
	});

	return FilterBar;
=====*/

	return declare(_Module, {
		name: 'filterBar',
		forced: ['filter'],
		preload: function() {
			var t = this,
				g = t.grid, rules;

			var F = Filter;
			F.before = F.lessEqual;
			F.after = F.greaterEqual;

			if (this.arg('experimental')) {
				this.conditions = lang.mixin({}, this.conditions);
				this.conditions.number = ['equal','greater','less','greaterEqual','lessEqual','notEqual', 'range', 'isEmpty'];
			}
			if (g.persist) {
				rules = g.persist.registerAndLoad('filterBar', function(){
					return t.filterData;
				});
			}
			if (rules) {
				t.filterData = rules;
			} else {
				rules = t.arg('filterData');
				t._preFilterData = rules;
			}
			if (rules) {
				g.filter.setFilter(t._createFilterExpr(rules), 1);
			}
		},
		//Public-----------------------------------------------------------
		closeButton: true,
	
		defineFilterButton: true,
		
		tooltipDelay: 300,
	
		maxRuleCount: 0,
		
		ruleCountToConfirmClearFilter: 2,

		//some newly added conditions(like numberRange) may not have complete nls,
		//which means they should not be used in a production environment,
		//mark experimental=true to open them.
		experimental: false,
		//useShortMessage: false,
		
		conditions: {
			'string': ['contain', 'equal', 'startWith', 'endWith', 'notEqual','notContain', 'notStartWith', 'notEndWith',	'isEmpty'],
			'number': ['equal', 'greater', 'less', 'greaterEqual', 'lessEqual', 'notEqual', 'isEmpty'],
			'date': ['equal','before','after','range','isEmpty', 'past'],
			'datetime': ['equal','before','after','range','isEmpty', 'past'],
			'time': ['equal','before','after','range','isEmpty', 'past'],
			'enum': ['equal', 'notEqual', 'isEmpty'],
			'boolean': ['equal','isEmpty']
		},
		
		load: function(args, startup){
			//Add before and after expression for filter.
			this._nls = this.grid.nls;
			this.domNode = dom.create('div', {
				innerHTML: string.substitute(template, this._nls),
				'class': 'gridxFilterBar'
			});
			parser.parse(this.domNode);
			css.toggle(this.domNode, 'gridxFilterBarHideCloseBtn', !this.arg('closeButton'));
			this.grid.vLayout.register(this, 'domNode', 'headerNode', -0.5);
			this._initWidgets();
			this._initFocus();
			this.refresh();
			this.connect(this.domNode, 'onclick', 'onDomClick');
			this.connect(this.domNode, 'onmouseover', 'onDomMouseOver');
			this.connect(this.domNode, 'onmousemove', 'onDomMouseMove');
			this.connect(this.domNode, 'onmouseout', 'onDomMouseOut');
			this.aspect(this.grid.model, 'setStore', function(){
				this.filterData = null;
				this._buildFilterState();
			});
			this.loaded.callback();
		},
		onDomClick: function(e){
			if(!e.target || !e.target.tagName){return;}
			if(domAttr.get(e.target, 'action') === 'clear'){
				this.clearFilter();
			}else if(css.contains(e.target, 'gridxFilterBarCloseBtn') || css.contains(e.target,'gridxFilterBarCloseBtnText')){
				this.hide();
			}else{
				this.showFilterDialog();
			}
		},
		onDomMouseMove: function(e){
			if(e && e.target && (domAttr.get(e.target, 'action') === 'clear'
				|| this.btnFilter === dijit.getEnclosingWidget(e.target))){return;}
			this._showTooltip(e);
		},
		onDomMouseOver: function(e){},
		onDomMouseOut: function(e){
			//Make sure to not hide tooltip when mouse moves to tooltip itself.
			window.setTimeout(lang.hitch(this, '_hideTooltip'), 10);
		},
		
		_createFilterExpr: function(filterData){
			var F = Filter, exps = [];
			array.forEach(filterData.conditions, function(data){
				var type = 'string';
				if(data.colId){
					type = this.grid.column(data.colId).dataType();
					exps.push(this._getFilterExpression(data.condition, data, type, data.colId));
				}else{
					//any column
					var arr = [];
					array.forEach(this.grid.columns(), function(col){
						if(!col.isFilterable()){return;}
						arr.push(this._getFilterExpression(data.condition, data, type, col.id));
					}, this);
					exps.push(F.or.apply(F, arr));
				}
			}, this);
			return (filterData.type === 'all' ? F.and : F.or).apply(F, exps);
		},

		applyFilter: function(filterData){
			var _this = this,
				g = this.grid,
				filter = this._createFilterExpr(filterData);

			this.filterData = filterData;
			this.grid.filter.setFilter(filter);
			this.model.when({}).then(function(){
				// _this._currentSize = _this.model.size();
				// _this._totalSize = _this.model._cache.totalSize >= 0 ? _this.model._cache.totalSize : _this.model._cache.size();
				_this._currentSize = g.tree? _this.model._sizeAll() : _this.model.size();
				_this._totalSize = g.tree? _this.model._sizeAll('', true) :
										(_this.model._cache.totalSize >= 0 ? _this.model._cache.totalSize : _this.model._cache.size());
				_this._buildFilterState();
			});
		},
		
		confirmToExecute: function(callback, scope){
			var max = this.arg('ruleCountToConfirmClearFilter');
			if(this.filterData && (this.filterData.conditions.length >= max || max <= 0)){
				if(!this._cfmDlg){
					this._cfmDlg = new FilterConfirmDialog({
						grid: this.grid
					});
				}
				this._cfmDlg.execute = lang.hitch(scope, callback);
				this._cfmDlg.show();
			}else{
				callback.apply(scope);
			}
		},
		
		clearFilter: function(noConfirm){
			if(!noConfirm){
				this.confirmToExecute(lang.hitch(this, 'clearFilter', true), this);
			}else{
				this.filterData = null;
				this.grid.filter.clearFilter();
				this._buildFilterState();
			}
		},
	
		columnMixin: {
			isFilterable: function(){
				// summary:
				//		Check if this column is filterable.
				// return: Boolean
				return this.grid._columnsById[this.id].filterable !== false;
			},
	
			setFilterable: function(filterable){
				// summary:
				//		Set filterable for this column.
				// filterable: Boolean
				//		TRUE for filterable, FALSE for not.
				// return:
				//		column object itself
				this.grid.filterBar._setFilterable(this.id, filterable);
				return this;
			},
	
			dataType: function(){
				// summary:
				//		Get the data type of this column. Always lowercase.
				// return: String
				return (this.grid._columnsById[this.id].dataType || 'string').toLowerCase();
			},
	
			filterConditions: function(){
				// summary:
				//		Get the available conditions for this column.	
				return this.grid.filterBar._getColumnConditions(this.id);
			}
		},
	
		refresh: function(){
			this.btnClose.style.display = this.closeButton ? '': 'none';
			this.btnFilter.domNode.style.display = this.arg('defineFilterButton') ? '': 'none';
			this._currentSize = this.model.size();
			this._totalSize = this.model._cache.totalSize >= 0 ? this.model._cache.totalSize : this.model._cache.size();
			this._buildFilterState();
		},
		isVisible: function(){
			return this.domNode.style.display != 'none';
		},
		show: function(){
			this.domNode.style.display = 'block';
			this.grid.vLayout.reLayout();
			this.onShow();
		},
	
		hide: function(){
			this.domNode.style.display = 'none';
			this.grid.vLayout.reLayout();
			this._hideTooltip();
			this.onHide();
		},
		onShow: function(){},
		onHide: function(){},
		showFilterDialog: function(){
			var dlg = this._filterDialog;
			if(!dlg){
				this._filterDialog = dlg = new FilterDialog({
					grid: this.grid
				});
			}
			if(dlg.open){return;}
			//Fix #7345: If there exists filterData, it should be set after dlg is shown;
			//If there is no filterData, dlg.setData have to be called before dlg.show(),
			//otherwise, the dlg will not show any condition boxes.
			//TODO: Need more investigation on this to make the logic more reasonable!
			if(!this.filterData){
				dlg.setData(this.filterData);
			}
			dlg._matchCase.set('checked', this.grid.filter.caseSensitive);
			dlg.show();
			if(this.filterData){
				dlg.setData(this.filterData);
			}
		},
		
		uninitialize: function(){
			this._filterDialog && this._filterDialog.destroyRecursive();
			this.inherited(arguments);
			dom.destroy(this.domNode);
		},
	
		//Private---------------------------------------------------------------
		_getColumnConditions: function(colId){
			// summary:
			//		Get the available conditions for a specific column. 
			//		Excluded condtions is defined by col.disabledConditions
			// tag:
			//		private
			// colId: String|Number
			//		The ID of a column.
			// return: String[]
			//		An array of condition names.
			
			var disabled, type;
			if(!colId){
				//any column
				disabled = [];
				type = 'string';
			}else{
				disabled = this.grid._columnsById[colId].disabledConditions || [];
				type = (this.grid._columnsById[colId].dataType || 'string').toLowerCase();
			}
			
			var ret = this.conditions[type], hash = {};
			if(!ret){
				ret = this.conditions.string;
			}
			array.forEach(disabled, function(name){hash[name] = true;});
			ret = array.filter(ret, function(name){return !hash[name];});
			return ret; 
		},
		
		_setFilterable: function(colId, filterable){
			var col = this.grid._columnsById[colId];
			if(!col){return;}
			if(col.filterable == !!filterable){return;}
			col.filterable = !!filterable;
			if(this.filterData){
				var d = this.filterData, len = d.conditions.length;
				d.conditions = array.filter(d.conditions, function(c){
					return c.colId != colId;
				});
				if(len != d.conditions.length){
					this.applyFilter(d);
				}
				if(this._filterDialog.open){
					this._filterDialog.setData(d);
				}
			}
		},
		_initWidgets: function(){
			this.btnFilter = registry.byNode(query('.dijitButton', this.domNode)[0]);
			this.btnClose = query('.gridxFilterBarCloseBtn', this.domNode)[0];
			this.connect(this.btnClose, 'onkeydown', '_onCloseKey');
			this.statusNode = query('.gridxFilterBarStatus', this.domNode)[0].firstChild;
			domAttr.remove(this.btnFilter.focusNode, 'aria-labelledby');
		},
		
		_buildFilterState: function(){
			// summary:
			//		Build the tooltip dialog to show all applied filters.
			var clearButton, t = this;

			if(!this.filterData || !this.filterData.conditions.length){
				this.statusNode.innerHTML = this.arg('noFilterMessage', this.grid.nls.filterBarMsgNoFilterTemplate);
				clearButton = dojo.query('[role]', this.statusNode)[0];
				if(clearButton){
					clearButton.signal.remove();
				}
				return;
			}
			this.statusNode.innerHTML = string.substitute(
				this.arg('hasFilterMessage', this.arg('useShortMessage') ? this.grid.nls.summary : this.grid.nls.filterBarMsgHasFilterTemplate),
				[this._currentSize, this._totalSize, this.arg('itemsName')? this.arg('itemsName') : this.grid.nls.defaultItemsName]) + 
				'&nbsp; &nbsp; <a action="clear" tabindex="-1" role="button" title="' + this.grid.nls.filterBarClearButton + '">'
					+ this.grid.nls.filterBarClearButton + '</a>';

			clearButton = dojo.query('[role]', this.statusNode)[0];
			clearButton.signal = on(clearButton, 'keypress', function(e){
				if(e.keyCode === keys.ENTER){
					t.clearFilter();
				}
			});
			this._buildTooltip();
		},

		_buildTooltip: function(){
			if(!this._tooltip){
				this._tooltip = new FilterTooltip({grid: this.grid});
			}
			this._tooltip.buildContent();
		},
		_showTooltip: function(evt, delayed){
			this._hideTooltip();
			if(!this.filterData || 
				!this.filterData.conditions || 
				!this.filterData.conditions.length){return;}
			if(!delayed){
				this._pointTooltipDelay = window.setTimeout(lang.hitch(this, '_showTooltip', 
					evt, true),this.arg('tooltipDelay'));
				return;
			}
			this._tooltip.show(evt);
		},
		_hideTooltip: function(){
			var dlg = this._tooltip;
			if(!dlg){return;}
			if(dlg.isMouseOn){return;}
			if(this._pointTooltipDelay){
				window.clearTimeout(this._pointTooltipDelay);
				this._pointTooltipDelay = null;
			}
			dlg.hide();
		},
		_getRuleString: function(condition, value, type){
			var valueString, f, tpl, resolvedTextDir;

			// condition = condition && condition.toLowerCase();

			if(condition == 'isEmpty'){
				valueString = '';
			}else if(/^date|^time/i.test(type) && condition !== 'past'){
				f = this._formatDate;
				if (/^time/i.test(type)) {
					f = this._formatTime;
				}
				if (/^datetime/i.test(type)) {
					f = this._formatDatetime;
				}
				
				if(condition === 'range'){
					tpl = this.arg('rangeTemplate', this.grid.nls.rangeTemplate);
					valueString = string.substitute(tpl, [f(value.start), f(value.end)]);
				}else{
					valueString = f(value);
				}
			}else if(condition === 'range'){
				tpl = this.arg('rangeTemplate', this.grid.nls.rangeTemplate);
				valueString = string.substitute(tpl, [value.start, value.end]);
			}else if(condition === 'past' && value.interval && value.amount !== undefined){
				var interval = value.interval;
				tpl = this.grid.nls['past' + interval[0].toUpperCase() + interval.substring(1) + 'sConditionTemplate'];
				if(tpl){
					valueString = string.substitute(tpl, [value.amount]);
				}
			}
			else{
				valueString = value;
			}
			if(this.grid.textDir){
				resolvedTextDir = this.grid.textDir;
				if(resolvedTextDir == "auto"){
					resolvedTextDir = _BidiSupport.prototype._checkContextual(valueString);
				}
				valueString = '<span dir="' + resolvedTextDir + '">' + valueString + '</span>';
			}
			return '<span style="font-style:italic">' + this._getConditionDisplayName(condition) + '</span> ' + valueString;
		},
		_getConditionDisplayName: function(c){
			var k = c.charAt(0).toUpperCase() + c.substring(1);
			return this.arg('condition' + k, this.grid.nls['condition' + k]);
		},
		_getConditionOptions: function(colId){
			var cache = this._conditionOptions = this._conditionOptions || {};
			if(!cache[colId]){
				var arr = [];
				array.forEach(this._getColumnConditions(colId), function(s){
					var k = s.charAt(0).toUpperCase() + s.substring(1);
					arr.push({
						label: this.arg('condition' + k, this.grid.nls['condition' + k]),
						value: s
					});
				}, this);
				cache[colId] = arr;
			}
			return cache[colId];
		},
		
		_getFilterExpression: function(condition, data, type, colId){
			//get filter expression by condition, data, column and type
			var F = Filter,
				f = this.grid.filter,
				dv = data.value,
				col = this.grid._columnsById[colId],
				cs = f.arg('caseSensitive');

			var dc = col.dateParser || this._stringToDate;
			var tc = col.timeParser || this._stringToTime;
			var dtc = col.datetimeParser || this._stringToDatetime;
			var converters = {
				custom: col.dataTypeArgs && col.dataTypeArgs.converter && lang.isFunction(col.dataTypeArgs.converter)?
						col.dataTypeArgs.converter : null,
				date: dc,
				datetime: dtc,
				time: tc
			};
			var c = data.condition,
				exp,
				isNot = false;

			type = c == 'isEmpty' ? 'string' : type; //isEmpty always treat type as string
			var converter = converters.custom? converters.custom : converters[type];

			if(col.encode === true && typeof data.value === 'string'){
				dv = entities.encode(data.value);
			}
			// if(type == 'datetime'){
			// 	var date = data.value.date,
			// 		time = data.value.time.
			// 		dv = new Date(date);

			// 	if(date && time){
			// 		dv.setMinutes(time.getMinutes());
			// 		dv.setHours(time.getHours());
			// 	}
			// }
			var startValue, endValue, columnValue;
			if(c === 'range' || c === 'past'){
				if(c === 'past' && (!data.value.start || !data.value.end)){
					this._buildPastCondition(data);
				}
				startValue = F.value(data.value.start, type);
				endValue = F.value(data.value.end, type);
				columnValue = F.column(colId, type, converter);
				exp = F.and(F.greaterEqual(columnValue, startValue), F.lessEqual(columnValue, endValue));
			}else{
				if(/^not/.test(c)){
					isNot = true;
					c = c.replace(/^not/g, '');
					c = c.charAt(0).toLowerCase() + c.substring(1);
				}
				exp = F[c](F.column(colId, type, converter, false, cs), c == 'isEmpty' ? null : F.value(dv, type, null, cs), cs);
				if(isNot){exp = F.not(exp);}
			}
			return exp;
		},
		_stringToDate: function(s){
			if(s instanceof Date){return s;}

			if(typeof s === 'string'){
				var d = new Date(s);

				if(typeof d.getTime() === 'number'){
					return d;
				}
			}

			var pattern = /(\d{4})\/(\d\d?)\/(\d\d?)/;
			pattern.test(s);
			var d = new Date();
			d.setFullYear(parseInt(RegExp.$1));
			d.setMonth(parseInt(RegExp.$2) - 1);
			d.setDate(parseInt(RegExp.$3));
			return d;
		},
		_stringToTime: function(s){
			if(s instanceof Date){return s;}

			var pattern = /(\d\d?):(\d\d?):(\d\d?)/;
			if(pattern.test(s)){
				var d = new Date();
				d.setHours(parseInt(RegExp.$1));
				d.setMinutes(parseInt(RegExp.$2));
				d.setSeconds(parseInt(RegExp.$3));
				return d;
			}
			return 'invalid time';
		},
		_stringToDatetime: function(s){
			if(s instanceof Date){return s;}

			return new Date(s);
		},
		_formatDate: function(date){
			//this may be customized by grid layout definition
			date = typeof date === 'object' ? date : new Date(date);
			var m = date.getMonth() + 1, d = date.getDate();
			return m + '/' + d + '/' + date.getFullYear();
		},
		_formatTime: function(time){
			//this may be customized by grid layout definition
			time = typeof time === 'object' ? time : new Date(time);
			var h = time.getHours(), m = time.getMinutes();
			if(h < 10){h = '0' + h;}
			if(m < 10){m = '0' + m;}
			return h + ':' + m + ':00';
		},
		_formatDatetime: function(datetime){
			datetime = typeof datetime === 'object' ? datetime : new Date(datetime);
			var m = datetime.getMonth() + 1, d = datetime.getDate();
			//this may be customized by grid layout definition
			var h = datetime.getHours(), min = datetime.getMinutes();
			if(h < 10){h = '0' + h;}
			if(min < 10){min = '0' + min;}
			return m + '/' + d + '/' + datetime.getFullYear() + ' ' + h + ':' + min + ':00';
		},

		_buildPastCondition: function(data) {
			var cur = new Date(),
				past = new Date(),
				interval = data.value.interval,
				val = data.value.amount;

			switch(interval){
				case 'hour':
					if (cur.getHours() < val) {
						past.setHours(0);
						past.setMinutes(0);
					} else {
						past.setHours(cur.getHours() - val);
					}
					break;
				case 'day':
					past.setDate(cur.getDate() - val);
					break;
				case 'month':
					past.setMonth(cur.getMonth() - val);
					break;
				case 'year':
					past.setFullYear(cur.getFullYear() - val);
					break;
			}

			data.value.start = past;
			data.value.end = cur;
			// return {start: past, end: cur, amount: val, interval: interval};
		},
		
		_initFocus: function(){
			var focus = this.grid.focus;
			if(focus){
				focus.registerArea({
					name: 'filterbar_btn',
					priority: -1,
					focusNode: this.btnFilter.domNode,
					doFocus: this._doFocusBtnFilter,
					scope: this
				});
				
				focus.registerArea({
					name: 'filterbar_clear',
					priority: -0.9,
					focusNode: this.domNode,
					doFocus: this._doFocusClearLink,
					scope: this
				});
				
				focus.registerArea({
					name: 'filterbar_close',
					priority: -0.8,
					focusNode: this.btnClose,
					doFocus: this._doFocusBtnClose,
					scope: this
				});
			}
		},
		_doFocusBtnFilter: function(evt){
			this.btnFilter.focus();
			if(evt){event.stop(evt);}
			return true;
		},
		
		_doFocusClearLink: function(evt){
			this.btnFilter.focus();
			var link = query('a[action="clear"]')[0];
			if(link){
				link.focus();
				if(evt){event.stop(evt);}
				return true;
			}
			return false;
		},
		_doFocusBtnClose: function(evt){
			this.btnClose.focus();
			if(evt){event.stop(evt);}
			return true;
		},
		
		_doBlur: function(){
			return true;
		},

		_onCloseKey: function(evt){
			if(evt.keyCode === keys.ENTER){
				this.hide();
			}
		},

		destroy: function(){
			this._filterDialog && this._filterDialog.destroy();
			this._cfmDlg && this._cfmDlg.destroy();
			this.btnFilter.destroy();
			if(this._tooltip){
				this._tooltip.destroy();
			}
			dom.destroy(this.domNode);
			this.inherited(arguments);
		}
		
	});
});
