profile = {
	defaultConfig: {async: true},
	stripConsole: 'normal',
	layerOptimize: 'closure',
	optimize: 'closure',
	releaseDir: '../../../gridx_release',
	action: 'release',
	packages: [
		{
			name: 'dojo',
			location: '../../../dojo'
		},
		{
			name: 'dijit',
			location: '../../../dijit' 	//always relative to profile path
		},
		{
			name: 'dojox',
			location: '../../../dojox' 	//always relative to profile path
		},
		{
			name: 'gridx',
			location: '../../../gridx'
		}
	],
	layers: {
		'gridx/gridx-mobile': {
			include: [
				'gridx/Grid',
				'gridx/core/model/cache/Sync',
				'gridx/modules/SingleSort',
				"gridx/modules/TouchVScroller",
				"gridx/modules/Rotater"
			],
			exclude:[
				"dojo/text",
				"dojox/mobile/TransitionEvent",
				"dojox/mobile/ViewController",
				"dijit/_Contained",
				"dojox/mobile/parser",
				"dojox/mobile/scrollable",
				"dijit/_Container",
				"dojox/mobile/sniff",
				"dojo/i18n",
				"dojox/mobile/ProgressIndicator",
				"dojo/_base/query",
				"dojo/Stateful",
				"dojox/mobile/deviceTheme",
				"dojo/touch",
				"dojo/string",
				"dijit/registry",
				"dojox/mobile/View",
				"dojox/html/metrics",
				"dojo/DeferredList",
				"dojo/cache",
				"dojox/mobile/_ScrollableMixin",
				"dijit/main",
				"dijit/_TemplatedMixin",
				"dojox/mobile/transition",
				"dijit/_WidgetBase"
			]
		},
		'gridx/dojo-deps-mobile': {
			include:[
				'dojo/store/Memory',
				'dojo/store/util/QueryResults',
				'dojo/store/util/SimpleQueryEngine',			
				"dojo/text",
				"dojox/mobile/TransitionEvent",
				"dojox/mobile/ViewController",
				"dijit/_Contained",
				"dojox/mobile/parser",
				"dojox/mobile/scrollable",
				"dijit/_Container",
				"dojox/mobile/sniff",
				"dojo/i18n",
				"dojox/mobile/ProgressIndicator",
				"dojo/_base/query",
				"dojo/Stateful",
				"dojox/mobile/deviceTheme",
				"dojo/touch",
				"dojo/string",
				"dijit/registry",
				"dojox/mobile/View",
				"dojox/html/metrics",
				"dojo/DeferredList",
				"dojo/cache",
				"dojox/mobile/_ScrollableMixin",
				"dijit/main",
				"dijit/_TemplatedMixin",
				"dojox/mobile/transition",
				"dijit/_WidgetBase"
			]
		},
		
		'gridx/gridx-mini': {
			include: [
				'gridx/Grid',
				'gridx/core/model/cache/Sync',
				'gridx/modules/select/Row',
				'gridx/modules/SingleSort',
				'gridx/modules/ColumnResizer'
			],
			exclude:[
		      	'dojo/text',
		    	'dojo/i18n',
		    	'dojo/_base/query',
		    	'dojo/Stateful',
		    	'dojo/touch',
		    	'dojo/string',
		    	'dijit/registry',
		    	'dojox/html/metrics',
		    	'dojo/DeferredList',
		    	'dojo/cache',
		    	'dijit/main',
		    	'dijit/_TemplatedMixin',
		    	'dijit/_WidgetBase'
			]
		},
		'gridx/dojo-deps-mini': {
			include:[
				'dojo/store/Memory',
				'dojo/store/util/QueryResults',
				'dojo/store/util/SimpleQueryEngine',
		      	'dojo/text',
		    	'dojo/i18n',
		    	'dojo/_base/query',
		    	'dojo/Stateful',
		    	'dojo/touch',
		    	'dojo/string',
		    	'dijit/registry',
		    	'dojox/html/metrics',
		    	'dojo/DeferredList',
		    	'dojo/cache',
		    	'dijit/main',
		    	'dijit/_TemplatedMixin',
		    	'dijit/_WidgetBase'
			]
		},
		'gridx/gridx-all': {
			include: [
				'gridx/Grid',
				'gridx/tests/support/modules',
				'gridx/core/model/cache/Sync',
				'gridx/core/model/cache/Async'
			],
			exclude:[
		     	'dijit/form/nls/validate',
		    	'dijit/form/TextBox',
		    	'dijit/_CssStateMixin',
		    	'dijit/DialogUnderlay',
		    	'dijit/place',
		    	'dijit/_HasDropDown',
		    	'dojo/dnd/Selector',
		    	'dijit/_MenuBase',
		    	'dijit/focus',
		    	'dijit/hccss',
		    	'dojox/html/ellipsis',
		    	//'dijit/layout/templates/AccordionButton.html',
		    	'dijit/form/_ComboBoxMenuMixin',
		    	'dojo/parser',
		    	//'dijit/form/templates/DropDownButton.html',
		    	'dojo/dnd/Manager',
		    	'dijit/form/ToggleButton',
		    	'dojo/date/stamp',
		    	'dijit/form/DateTextBox',
		    	'dijit/layout/AccordionContainer',
		    	//'dijit/templates/Calendar.html',
		    	'dijit/form/_AutoCompleterMixin',
		    	'dijit/form/MappedTextBox',
		    	'dijit/form/ComboBoxMixin',
		    	'dijit/form/_TextBoxMixin',
		    	'dijit/_TimePicker',
		    	'dijit/form/RadioButton',
		    	//'dijit/templates/TimePicker.html',
		    	'dijit/_OnDijitClickMixin',
		    	'dojo/dnd/autoscroll',
		    	'dijit/form/_RadioButtonMixin',
		    	'dojo/dnd/TimedMoveable',
		    	'dijit/form/_ListMouseMixin',
		    	'dojo/cookie',
		    	//'dijit/form/templates/DropDownBox.html',
		    	'dijit/form/NumberTextBox',
		    	'dijit/form/TimeTextBox',
		    	//'dijit/form/templates/Button.html',
		    	'dojo/_base/url',
		    	//'dijit/templates/MenuItem.html',
		    	//'dijit/form/templates/CheckBox.html',
		    	'dojo/cldr/nls/gregorian',
		    	'dojo/uacss',
		    	'dijit/Tooltip',
		    	//'dijit/templates/MenuSeparator.html',
		    	'dijit/form/_FormValueMixin',
		    	'dijit/form/DropDownButton',
		    	'dijit/form/_FormWidgetMixin',
		    	'dojo/date',
		    	'dijit/layout/_ContentPaneResizeMixin',
		    	'dijit/form/RangeBoundTextBox',
		    	'dijit/nls/loading',
		    	'dojo/dnd/Moveable',
		    	'dijit/TooltipDialog',
		    	'dojo/store/util/SimpleQueryEngine',
		    	'dojo/cldr/nls/number',
		    	'dijit/typematic',
		    	'dijit/MenuItem',
		    	'dojo/cldr/supplemental',
		    	'dijit/layout/_LayoutWidget',
		    	'dijit/_base/manager',
		    	'dijit/popup',
		    	//'dijit/templates/TooltipDialog.html',
		    	'dojo/dnd/Mover',
		    	'dijit/BackgroundIframe',
		    	'dojo/dnd/Avatar',
		    	//'dijit/templates/Menu.html',
		    	'dijit/form/Button',
		    	'dojo/store/Memory',
		    	//'dijit/templates/Tooltip.html',
		    	'dijit/layout/StackContainer',
		    	'dojo/regexp',
		    	'dijit/form/ComboBox',
		    	'dijit/form/_FormMixin',
		    	'dijit/DropDownMenu',
		    	'dojo/data/util/simpleFetch',
		    	'dijit/Menu',
		    	'dijit/form/_CheckBoxMixin',
		    	'dijit/layout/ContentPane',
		    	//'dijit/form/templates/ValidationTextBox.html',
		    	'dijit/layout/utils',
		    	'dijit/_Contained',
		    	//'dijit/form/templates/TextBox.html',
		    	'dijit/_KeyNavContainer',
		    	'dijit/form/DataList',
		    	//'dijit/templates/Dialog.html',
		    	'dijit/form/CheckBox',
		    	'dijit/_Container',
		    	'dojo/dnd/Source',
		    	'dojo/data/ItemFileReadStore',
		    	'dojo/html',
		    	'dijit/form/ValidationTextBox',
		    	'dojo/window',
		    	'dojo/number',
		    	'dijit/_FocusMixin',
		    	'dijit/_WidgetsInTemplateMixin',
		    	'dojo/data/util/filter',
		    	'dijit/form/FilteringSelect',
		    	'dojo/data/util/sorter',
		    	'dijit/form/_ButtonMixin',
		    	'dojo/colors',
		    	'dojo/date/locale',
		    	'dijit/form/_FormSelectWidget',
		    	'dijit/form/Select',
		    	'dojo/store/util/QueryResults',
		    	'dijit/form/_ListBase',
		    	'dijit/form/_FormWidget',
		    	'dojo/dnd/common',
		    	'dijit/CalendarLite',
		    	'dijit/MenuSeparator',
		    	'dijit/form/_ComboBoxMenu',
		    	'dijit/Dialog',
		    	'dijit/form/_DateTimeTextBox',
		    	'dijit/a11y',
		    	'dijit/Calendar',
		    	'dijit/form/_ToggleButtonMixin',
		    	'dojo/dnd/Container',
		    	'dijit/_Widget',
		    	//'dijit/form/templates/Select.html',
		    	'dijit/form/nls/ComboBox',
		    	'dojo/fx',
		    	'dijit/_DialogMixin',
		    	'dijit/nls/common',
		    	'dijit/form/_FormValueWidget',
				'gridx/tests/support/data/MusicData',
				'gridx/tests/support/stores/ItemFileWriteStore',
				//'gridx/tests/support/modules',
				'gridx/tests/support/TestPane'		    	
		    ]
		}
	},
	transformJobs:[
			[
				// the synthetic report module
				function(resource) {
					return resource.tag.report;
				},
				["dojoReport", "insertSymbols", "report"]
			],[
				// synthetic AMD modules (used to create layers on-the-fly
				function(resource, bc) {
					if (resource.tag.synthetic && resource.tag.amd){
						//console.log('write amd: '+ resource.name);
						bc.amdResources[resource.mid]= resource;
						return true;
					}
					return false;
				},
				// just like regular AMD modules, but without a bunch of unneeded transforms
				["depsScan", "writeAmd", "writeOptimized"]
			],[
				// AMD module:
				// already marked as an amd resource
				// ...or...
				// not dojo/dojo.js (filtered above), not package has module (filtered above), not nls bundle (filtered above), not test or building test, not build control script or profile script but still a Javascript resource...
				function(resource, bc) {
					if (resource.tag.amd || (/\.js$/.test(resource.src) && (!resource.tag.test || bc.copyTests=="build") && !/\.(bcs|profile)\.js$/.test(resource.src))) {
						bc.amdResources[resource.mid]= resource;
						return true;
					}
					return false;
				},
				["read", "dojoPragmas", "hasFindAll", "insertSymbols", "hasFixup", "depsScan"]
			],[
				// html file; may need access contents for template interning and/or dojoPragmas; therefore, can't use copy transform
				function(resource, bc) {
					return /\.(html|htm)$/.test(resource.src);
				},
				["read", "dojoPragmas"]
			],[
				// just copy everything else except tests which were copied above iff desired...
				function(resource) {
					return true;
				},
				[]
			]
		]
};
