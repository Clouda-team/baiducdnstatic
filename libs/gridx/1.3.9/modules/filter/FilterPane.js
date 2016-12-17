define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/string",
	"dojo/query",
	"dijit/registry",
	"dijit/_BidiSupport",
	"dojox/html/ellipsis",
	"dojox/html/metrics",
	"./DistinctComboBoxMenu",
	"../Filter",
	"dojo/text!../../templates/FilterPane.html",
	"dijit/layout/ContentPane",
	"dijit/form/Select",
	"dijit/form/TextBox",
	"dijit/form/DateTextBox",
	"dijit/form/TimeTextBox",
	"dijit/form/RadioButton",
	"dijit/form/NumberTextBox",
	"dijit/form/ComboBox"
], function(declare, lang, array, dom, css, string, query, registry, _BidiSupport, ellipsis, metrics, DistinctComboBoxMenu, Filter, template, ContentPane){

/*=====
	return declare([], {
	});
=====*/

	var ANY_COLUMN_VALUE = '_gridx_any_column_value_';
	
	function isAnyColumn(colid){
		return colid == ANY_COLUMN_VALUE;
	}
	return declare([ContentPane], {
		//content: template,
		sltColumn: null,
		sltCondition: null,
		grid: null,
		postCreate: function(){
			this.inherited(arguments);
			this.i18n = this.grid.nls;
			this._columnAriaLabel = this.i18n.columnSelectAriaLabel.replace('${0}', 1).replace('${1}', 3);
			this._conditionAriaLabel = this.i18n.conditionSelectAriaLabel.replace('${0}', 2).replace('${1}', 3);
			this._valueAriaLabel = this.i18n.valueBoxAriaLabel.replace('${0}', 3).replace('${1}', 3);
			this.set('title', this.grid.nls.defaultRuleTitle);
			this.set('content', string.substitute(template, this));
			// console.log('value aria label is', this._valueAriaLabel);
			this._initFields();
			this._initSltCol();
			this.connect(this.sltColumn, 'onChange', '_onColumnChange');
			this.connect(this.sltCondition, 'onChange', '_onConditionChange');
			this.comboText.dropDownClass = DistinctComboBoxMenu;
			this._onConditionChange();//In the latest dijit, onChange event is no longer fired after creation
		},
	
		getData: function(){
			// summary:
			//		Get the filter defined by this filter pane.
			var value = this._getValue(), 
				colId = this.sltColumn.get('value'),
				condition = this.sltCondition.get('value'),
				dataType = this._getDataType();
			if(condition === 'isEmpty' ||
				(value !== null && 
					(condition !== 'range' || (value.start && value.end)) //s&&
					// (dataType !== 'datetime' || (value.date && value.time))
				)
			){
				return {
					colId: isAnyColumn(colId) ? '' : colId,
					condition: condition,
					//fix defect #
					//set('value', '') on DateTimeBox will set date to 1/1/197010741
					//so, set('value', null) when condition is empty on a DateTimeBoxs
					value: condition === 'isEmpty'? ( this._getType() === 'Date'? null : '') : value,
					type: this._getType()
				};
			}else{
				return null;
			}
		},
		setData: function(data){
			// summary:
			//		Set the data of the pane to restore UI.
			if(data === null){return;}
			this.sltColumn.set('value', data.colId, null);
			this._onColumnChange();
			var _this = this;
			
			window.setTimeout(function(){
				_this.sltCondition.set('value', data.condition, null);
				_this._onConditionChange();
				window.setTimeout(function(){
					//FIXME: Need another set timeout since something has became async for the new dijit.
					_this._setValue(data.value);
				},50);
				// _this._setValue(data.value);
			}, 10);
		},
		close: function(){
			var ac = this._getContainer();
			if(ac.getChildren().length === 4){
				//while there's less than 4 rules, no scroll bar
				ac._contentBox.w += metrics.getScrollbar().w;
			}
			
			if(this === ac.selectedChildWidget){
				//select previous pane if this is current, consistent with EDG filter.
				var i = array.indexOf(ac.getChildren(), this);
				if(i > 0){ac.selectChild(ac.getChildren()[i-1]);}
			}
			
			ac.removeChild(this);
			css.toggle(ac.domNode, 'gridxFilterSingleRule', ac.getChildren().length === 1);
			this.grid.filterBar._filterDialog._updateAccordionContainerHeight();
		},
		onChange: function(){
			// summary:
			//		event: fired when column, condition or value is changed
		},
		_getContainer: function(){
			return registry.byNode(this.domNode.parentNode.parentNode.parentNode);
		},
		_initFields: function(){
			this.sltColumn = registry.byNode(query('li>table', this.domNode)[0]);
			this.sltCondition = registry.byNode(query('li>table', this.domNode)[1]);
			var fields = this._fields = [
				this.tbSingle = registry.byNode(query('.gridxFilterPaneTextWrapper > .dijitTextBox', this.domNode)[0]),
				
				this.tbNumber = registry.byNode(query('.gridxFilterPaneNumberWrapper > .dijitTextBox', this.domNode)[0]),
				this.tbNumberStart = registry.byNode(query('.gridxFilterPaneNumberRangeWrapper > .dijitTextBox', this.domNode)[0]),
				this.tbNumberEnd = registry.byNode(query('.gridxFilterPaneNumberRangeWrapper > .dijitTextBox', this.domNode)[1]),
				this.tbTimePast = registry.byNode(query('.gridxFilterPaneTimePastWrapper > .dijitTextBox', this.domNode)[0]),
				this.sltTimeInterval = registry.byNode(query('.gridxFilterPaneTimePastWrapper > .dijitSelect', this.domNode)[0]),
				
				this.comboText = registry.byNode(query('.gridxFilterPaneComboWrapper > .dijitComboBox', this.domNode)[0]),
				this.sltSingle = registry.byNode(query('.gridxFilterPaneSelectWrapper > .dijitSelect', this.domNode)[0]),
				
				this.dtbSingle = registry.byNode(query('.gridxFilterPaneDateWrapper > .dijitDateTextBox', this.domNode)[0]),
				this.dtbStart = registry.byNode(query('.gridxFilterPaneDateRangeWrapper > .dijitDateTextBox', this.domNode)[0]),
				this.dtbEnd = registry.byNode(query('.gridxFilterPaneDateRangeWrapper > .dijitDateTextBox', this.domNode)[1]),
				this.tbDatePast = registry.byNode(query('.gridxFilterPaneDatePastWrapper > .dijitTextBox', this.domNode)[0]),
				this.sltDateInterval = registry.byNode(query('.gridxFilterPaneDatePastWrapper > .dijitSelect', this.domNode)[0]),

				this.dtbDatetimeSingle = registry.byNode(query('.gridxFilterPaneDatetimeWrapper > .dijitDateTextBox', this.domNode)[0]),
				this.dtbDatetimeStart = registry.byNode(query('.gridxFilterPaneDatetimeRangeWrapper > .dijitDateTextBox', this.domNode)[0]),
				this.dtbDatetimeEnd = registry.byNode(query('.gridxFilterPaneDatetimeRangeWrapper > .dijitDateTextBox', this.domNode)[1]),
				this.ttbDatetimeSingle = registry.byNode(query('.gridxFilterPaneDatetimeWrapper > .dijitTimeTextBox', this.domNode)[0]),
				this.ttbDatetimeStart = registry.byNode(query('.gridxFilterPaneDatetimeRangeWrapper > .dijitTimeTextBox', this.domNode)[0]),
				this.ttbDatetimeEnd = registry.byNode(query('.gridxFilterPaneDatetimeRangeWrapper > .dijitTimeTextBox', this.domNode)[1]),
				this.tbDatetimePast = registry.byNode(query('.gridxFilterPaneDatetimePastWrapper > .dijitTextBox', this.domNode)[0]),
				this.sltDatetimeInterval = registry.byNode(query('.gridxFilterPaneDatetimePastWrapper > .dijitSelect', this.domNode)[0]),

				this.ttbSingle = registry.byNode(query('.gridxFilterPaneTimeWrapper > .dijitTimeTextBox', this.domNode)[0]),
				this.ttbStart = registry.byNode(query('.gridxFilterPaneTimeRangeWrapper > .dijitTimeTextBox', this.domNode)[0]),
				this.ttbEnd = registry.byNode(query('.gridxFilterPaneTimeRangeWrapper > .dijitTimeTextBox', this.domNode)[1]),
				
				this.rbTrue = registry.byNode(query('.gridxFilterPaneRadioWrapper .dijitRadio', this.domNode)[0]),
				this.rbFalse = registry.byNode(query('.gridxFilterPaneRadioWrapper .dijitRadio', this.domNode)[1])
			];
			
			this.rbTrue.domNode.nextSibling.htmlFor = this.rbTrue.id;
			this.rbFalse.domNode.nextSibling.htmlFor = this.rbFalse.id;
			var name = 'rb_name_' + Math.random();
			this.rbTrue.set('name', name);
			this.rbFalse.set('name', name);
			
			array.forEach(fields, function(field){
				this.connect(field, 'onChange', '_onValueChange');
			}, this);
		},
		_initSltCol: function(){
			var colOpts = [{label: this.i18n.anyColumnOption, value: ANY_COLUMN_VALUE}],
				fb = this.grid.filterBar, 
				sltCol = this.sltColumn;
			array.forEach(this.grid.columns(), function(col){
				if(!col.isFilterable())return;
				var colName = col.name();
				colName = this.grid.enforceTextDirWithUcc(col.id, colName);
				colOpts.push({value: col.id, label: colName});
			}, this);
			sltCol.addOption(colOpts);
		},
		_initCloseButton: function(){
			// summary:
			//		Add a close button to the accordion pane.
			//		Must be called after adding to an accordion container.
			var btnWidget = this._buttonWidget;
			var closeButton = dom.create('span', {
				className: 'gridxFilterPaneCloseButton',
				innerHTML: '<img src="' + this._blankGif + '"/>',
				tabIndex: 0,
				title: this.i18n.removeRuleButton || ''
			}, btnWidget.domNode, 'last');
			this.connect(closeButton, 'onclick', 'close');
			css.add(btnWidget.titleTextNode, 'dojoxEllipsis');
		},
		
		_onColumnChange: function(){
			var colId = this.sltColumn.get('value');
			var opt = this.grid.filterBar._getConditionOptions(isAnyColumn(colId) ? '' : colId);
			var slt = this.sltCondition;
			//if(slt.options && slt.options.length){slt.removeOption(slt.options);}
			slt.set('options', []);
			slt.addOption(lang.clone(opt));
			this._updateTitle();
			this._updateValueField();
			this.onChange();
		},
		_onConditionChange: function(){
			this._updateValueField();
			this._updateTitle();
			this.onChange();
		},
		_onValueChange: function(){
			if(this.grid.textDir && this.grid.textDir == 'auto'){
				this.tbSingle.focusNode.dir = _BidiSupport.prototype._checkContextual(this._getValue());
			}
			this._updateTitle();
			this.onChange();
		},
		_getDataType: function(){
			// summary:
			//		Get current column data type
			var colid = this.sltColumn.get('value');
			var dataType = 'string';
			if(!isAnyColumn(colid)){
				dataType = this.grid.column(colid).dataType();
			}
			return dataType;
		},
		_getType: function(){
			// summary:
			//		Get current filter type, determined by data type and condition.
			var mapping = {'string': 'Text', number: 'Number', date: 'Date', time: 'Time', datetime: 'Datetime', 'enum': 'Select', 'boolean': 'Radio'};
			var type = mapping[this._getDataType()];
			if ('range' === this.sltCondition.get('value')) type += 'Range';
			if ('past' === this.sltCondition.get('value')) type += 'Past';
			return type;
		},
		_updateTitle: function(){
			if(!this._buttonWidget){return;}
			var title, value = this._getValue(), 
				type = this._getType(), condition = this.sltCondition.get('value'),
				txtNode = this._buttonWidget.titleTextNode;
			
			if(this._isValidValue(value) && (condition !== 'range' || (value.start && value.end))){
				title = this.sltColumn.get('displayedValue') + ' ' + this.grid.filterBar._getRuleString(condition, value, type);
			}else{
				var ruleNumber = array.indexOf(this._getContainer().getChildren(), this) + 1;
				title = string.substitute(this.i18n.ruleTitleTemplate, {ruleNumber: ruleNumber});
			}
			txtNode.innerHTML = title.replace(/&/g, '&amp;');
			txtNode.title = title.replace(/<\/?span[^>]*>/g, '').replace('&nbsp;', ' ');
		},
		_needComboBox: function(){
			// summary:
			//		Whether current state needs a combo box for string input, may rewrite to support virtual column
			var colId = this.sltColumn.get('value');
			return this._getType() === 'Text' && !isAnyColumn(colId) && this.grid._columnsById[colId].field;
		},
		_updateValueField: function(){
			// summary:
			//		Update the UI for field to show/hide fields.
			var type = this._getType(), colId = this.sltColumn.get('value');
			var combo = this._needComboBox();
			
			array.forEach([
				'Text','Combo',
				'Number', 'NumberRange',
				'Date', 'DateRange', 'DatePast',
				'Datetime', 'DatetimeRange', 'DatetimePast',
				'Time', 'TimeRange', 'TimePast',
				'Select', 'Radio'
			], function(k){
				css.remove(this.domNode, 'gridxFilterPane' + k);
			}, this);
			
			css.add(this.domNode, 'gridxFilterPane' + (combo ? 'Combo' : type));
			var disabled = this.sltCondition.get('value') === 'isEmpty';
			array.forEach(this._fields, function(f){f.set('disabled', disabled);});
			
			var col = this.grid._columnsById[colId];
			if(combo){
				if(!this._dummyCombo){
					//HACK: mixin query, get, etc methods to store, remove from 2.0.
					this._dummyCombo = new dijit.form.ComboBox({store: this.grid.store});
				}
				//init combobox
				if(col.autoComplete !== false){
					lang.mixin(this.comboText, {
						store: this.grid.store,
						searchAttr: col.field,
						fetchProperties: {sort:[{attribute: col.field, descending: false}]}
					});
				}
			}
			if(type == 'Select'){
				var sltSingle = this.sltSingle;
				sltSingle.removeOption(sltSingle.getOptions());
				sltSingle.addOption(array.map(col.enumOptions || [], function(option){
					return lang.isObject(option) ? option : {
						label: option,
						value: option
					};
				}));
				this._updateTitle();
			}
		},
		_getValue: function(){
			// summary:
			//		Get current filter value
			var type = this._getType(), combo = this._needComboBox(), val,
				_getDatetime = function(date, time){
					var datetime = new Date(date);

					if(date && time){
						datetime.setMinutes(time.getMinutes());
						datetime.setHours(time.getHours());
						return datetime;
					}
					return null;
				};

			switch(type){
				case 'Text':
					return (combo ? this.comboText : this.tbSingle).get('value') || null;
				case 'Number':
					return (isNaN(this.tbNumber.get('value')) || !this.tbNumber.isValid())? null : this.tbNumber.get('value');
				case 'NumberRange':
					return {
						start: (isNaN(this.tbNumberStart.get('value')) || !this.tbNumberStart.isValid())? null : this.tbNumberStart.get('value'), 
						end: (isNaN(this.tbNumberEnd.get('value')) || !this.tbNumberEnd.isValid())? null : this.tbNumberEnd.get('value')
					};
					// return (isNaN(this.tbNumber.get('value')) || !this.tbNumber.isValid())? null : this.tbNumber.get('value');
				case 'Select':
					return this.sltSingle.get('value') || null;
				case 'Date':
					// console.log(this.dtbSingle.get('value'));
					// console.log(typeof this.dtbSingle.get('value'));
					return this.dtbSingle.get('value') || null;
				case 'DateRange':
					return {start: this.dtbStart.get('value'), end: this.dtbEnd.get('value')};
				case 'DatePast':
					val = this.tbDatePast.get('value');
					if(isNaN(val) || !this.tbDatePast.isValid()){
						return null;
					}
					var cur = new Date(),
						past = new Date(),
						interval = this.sltDateInterval.get('value');

					switch(interval){
						case 'hour':
							past.setHours(cur.getHours() - val);
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

					// console.log(past, cur);
					return {start: past, end: cur, amount: val, interval: interval};
				case 'Datetime':
					// console.log(this.dtbSingle.get('value'));
					// console.log(typeof this.dtbSingle.get('value'));
					var date = this.dtbDatetimeSingle.get('value'),
						time = this.ttbDatetimeSingle.get('value');

					return _getDatetime(date, time);
					// return {date: date, time: time};
				case 'DatetimeRange':
					var dateStart = this.dtbDatetimeStart.get('value'),
						timeStart = this.ttbDatetimeStart.get('value'),
						dateEnd = this.dtbDatetimeEnd.get('value'),
						timeEnd = this.ttbDatetimeEnd.get('value');

					return {start: _getDatetime(dateStart, timeStart), end: _getDatetime(dateEnd, timeEnd)};
				case 'DatetimePast':
					val = this.tbDatetimePast.get('value');
					if(isNaN(val) || !this.tbDatetimePast.isValid()){
						return null;
					}
					var cur = new Date(),
						past = new Date(),
						interval = this.sltDatetimeInterval.get('value');

					switch(interval){
						case 'hour':
							past.setHours(cur.getHours() - val);
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

					// console.log(past, cur);
					return {start: past, end: cur, amount: val, interval: interval};
					// temp = this.tbDatePast.get('value');
					// return isNaN(temp) || !this.tbDatePast.isValid()? null : temp;
				case 'Time':
					return this.ttbSingle.get('value') || null;
				case 'TimeRange':
					return {start: this.ttbStart.get('value'), end: this.ttbEnd.get('value')};
				case 'TimePast':
					val = this.tbTimePast.get('value');
					if(isNaN(val) || !this.tbTimePast.isValid()){
						return null;
					}
					var cur = new Date(),
						past = new Date(),
						interval = this.sltTimeInterval.get('value');

					switch(interval){
						case 'hour':
							if (cur.getHours() < val) {
								past.setHours(0);
								past.setMinutes(0);
							} else {
								past.setHours(cur.getHours() - val);
							}
							break;
					}

					return {start: past, end: cur, amount: val, interval: interval};
				case 'Radio':
					return !!this.rbTrue.get('checked');
				default:
					return null;
			}
		},

		_setValue: function(value){
			if(!this._isValidValue(value)){return;}
			var type = this._getType(),
				combo = this._needComboBox(),
				tempDate;

			switch (type) {
				case 'Text':
					(combo ? this.comboText : this.tbSingle).set('value', value);
					break;
				case 'Number':
					this.tbNumber.set('value', value);
					break;
				case 'NumberRange':
					this.tbNumberStart.set('value', value.start);
					this.tbNumberEnd.set('value', value.end);
					break;
				case 'Select':
					this.sltSingle.set('value', value);
					break;
				case 'Date':
					tempDate = new Date(value);
					this.dtbSingle.set('value', tempDate);
					break;
				case 'DateRange':
					this.dtbStart.set('value', new Date(value.start));
					this.dtbEnd.set('value', new Date(value.end));
					break;
				case 'DatePast':
					this.tbDatePast.set('value', value.amount);
					this.sltDateInterval.set('value', value.interval);
					break;
				case 'Datetime':
					tempDate = new Date(value);
					this.dtbDatetimeSingle.set('value', tempDate);
					tempDate.setFullYear(1970);
					tempDate.setMonth(0);
					tempDate.setDate(1);
					this.ttbDatetimeSingle.set('value', tempDate);
					break;
				case 'DatetimeRange':
					tempDate = new Date(value.start);
					this.dtbDatetimeStart.set('value', tempDate);
					tempDate.setFullYear(1970);
					tempDate.setMonth(0);
					tempDate.setDate(1);
					this.ttbDatetimeStart.set('value', tempDate);

					var endTempDate = new Date(value.end);
					this.dtbDatetimeEnd.set('value', endTempDate);
					endTempDate.setFullYear(1970);
					endTempDate.setMonth(0);
					endTempDate.setDate(1);
					this.ttbDatetimeEnd.set('value', endTempDate);
					break;
				case 'DatetimePast':
					this.tbDatetimePast.set('value', value.amount);
					this.sltDatetimeInterval.set('value', value.interval);
					break;
				case 'Time':
					this.ttbSingle.set('value', value);
					break;
				case 'TimeRange':
					this.ttbStart.set('value', value.start);
					this.ttbEnd.set('value', value.end);
					break;
				case 'TimePast':
					this.tbTimePast.set('value', value.amount);
					this.sltTimeInterval.set('value', value.interval);
					break;
				case 'Radio':
					if(value){this.rbTrue.set('checked', true);}
					else{this.rbFalse.set('checked', true);}
					break;
			}
		},
		
		_isValidValue: function(value){
			return value !== null && value != undefined;
		},
		
		uninitialize: function(){
			this.inherited(arguments);
			if(this._dummyCombo){this._dummyCombo.destroyRecursive();}
		}
	});
});
