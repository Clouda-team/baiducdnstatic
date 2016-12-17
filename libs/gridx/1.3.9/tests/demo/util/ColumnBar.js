define([
	'dojo/_base/declare',
	'dojo/_base/query',
	'dojo/_base/array',
	'dojo/dom-class',
	'dijit/registry',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dojo/text!./ColumnBar.html',
	'dijit/DialogUnderlay',
	'dijit/form/CheckBox',
	'dijit/form/TextBox'
], function(declare, query, array, domClass, registry, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, DialogUnderlay, CheckBox){
	if(!DialogUnderlay._singleton){
		DialogUnderlay._singleton = new DialogUnderlay({});
	}

	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin],{
		columnId: '',

		columnField: '',

		columnName: '',

		columnWidth: '',

		columnIndex: 0,

		templateString: template,

		idField: 'id',

		fieldOptions: '[]',

		postMixInProperties: function(){
			var options = array.map(this.fields, function(field, i){
				return ['{lable: "', field, '", value: "', field, '"', i ? '' : ', selected: true', '}'].join('');
			});
			options.unshift('{label: "", value: ""}');
			options = options.join(',');
			this.fieldOptions = '[' + options + ']';
		},

		postCreate: function(){
			var options = array.map(this.fields, function(field, i){
				return {label: field, value: field, selected: i === 0};
			});
			this.fieldNode.addOption(options);
			this.fieldNode.set('value', this.columnField || options[0].value);
			if(this.columnWidth){
				this.widthUnitNode.set('value', this.columnWidth[1]);
				var t = this;
				setTimeout(function(){
					t.widthValueNode.set('value', t.columnWidth[0]);
				}, 0);
			}
			document.body.appendChild(this.editPane);
			query('.columnBarEditInput', this.editPane).forEach(function(node){
				var editor = registry.byNode(node);
				editor.editorDefaultValue = editor.get('value');
			});
		},

		onFieldChange: function(){
			var readOnly = this.fieldNode.get('value') == this.idField || this.fieldNode.get('value') == 'empty';
			if(readOnly){
				this.editableBox.set('checked', false);
			}
			this.editableBox.set('disabled', readOnly);
			if(readOnly){
				this.alwaysEditingBox.set('checked', false);
			}
			this.alwaysEditingBox.set('disabled', readOnly);
			if(readOnly){
				this.editorBox.set('value', 'empty');
			}
			this.editorBox.set('disabled', readOnly);
		},

		setIndex: function(index){
			this.columnIndex = index;
			this.indexNode.innerHTML = index;
		},

		getColumn: function(){
			var field = this.fieldNode.get('value');
			var ret = {
				index: this.columnIndex,
				id: this.idNode.get('value'),
				name: this.nameNode.get('value'),
				field: field == 'empty' ? '' : field,
				width: this.widthValueNode.get('value') + this.widthUnitNode.get('displayedValue')
			};
			query('.columnBarEditUsedAttr .columnBarEditInput', this.editPane).forEach(function(node){
				var editor = registry.byNode(node);
				var attr = node.parentNode.getAttribute('columnAttr');
				if(editor instanceof CheckBox){
					ret[attr] = editor.get('checked');
				}else{
					ret[attr] = editor.get('value');
				}
			});
			console.log('column is: ', ret);
			return ret;
		},

		_onWidthUnitChange: function(data){
			var wv = this.widthValueNode;
			wv.domNode.style.width = data == 'auto' ? '0' : '50px';
			if(data == 'px'){
				wv.set('value', 50);
			}else if(data == 'em'){
				wv.set('value', 5);
			}else if(data == 'percent'){
				wv.set('value', 15);
			}else if(data == 'auto'){
				wv.set('value', '');
			}
		},
		hideEditPane: function(){
			DialogUnderlay._singleton.hide();
			this.editPane.style.display = 'none';
		},

		onEdit: function(){
			DialogUnderlay._singleton.set({
				dialogId: this.id + '-editor'
			});
			DialogUnderlay._singleton.show();
			this.editPane.style.display = 'block';
		},
		onAdd: function(){
		},
		onDelete: function(){
		},

		onSortableChange: function(){
			this.onAttrChange(this.sortableBox, 'Sortable');
		},
		onFilterableChange: function(){
			this.onAttrChange(this.filterableBox, 'Filterable');
		},
		onEditableChange: function(){
			this.onAttrChange(this.editableBox, 'Editable');
		},
		onAlwaysEditChange: function(){
			this.onAttrChange(this.alwaysEditingBox, 'AlwaysEdting');
		},
		onEditorChange: function(){
			this.onAttrChange(this.editorBox, 'Editor');
		},
		onMenuChange: function(){
			this.onAttrChange(this.menuBox, 'Menu');
		},
		onAttrChange: function(widget, featureName){
			var toUse = widget.editorDefaultValue != widget.get('value');
			domClass.toggle(widget.domNode.parentNode.parentNode, 'columnBarEditUsedAttr', toUse);
			query('.columnBarFeature' + featureName, this.columnBarFeatures).toggleClass('columnBarFeatureUsed', toUse);
		}
	});
});
