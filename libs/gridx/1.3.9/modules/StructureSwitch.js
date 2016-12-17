define([
	'dojo/_base/kernel',
	'dojo/_base/declare',
	'dojo/_base/array',
	'../core/_Module'
], function(kernel, declare, array, _Module){
	kernel.experimental('gridx/modules/StructureSwitch');

/*=====
	return declare(_Module, {
		// summary:
		//		module name: structureSwitch.
		//		Switch column structure by means of hidden columns.
		// description:
		//		All possible columns are declared on creation of gridx, but only a few of them are shown at a time.
		//		Column structure profiles are defined, each profile defines which columns to show.
		//		Switch profiles through API of this module, which is done by means of the HiddenColumns module.
		//		Especially suitable for orientation change on mobile device.

		// default: String
		//		The name of the default structure profile. Should exist in the config parameter.
		//		If not, every column will be shown.
		default: '',

		// orientation: Boolean
		//		If true, gridx automatically checks which profile to use on every "orientationchange" event.
		orientation: true,

		// config: Object
		//		An association array to define column structure profiles.
		//		Key is profile name. Value is an array of column IDs.
		config: {},

		// condition: Object
		//		An association array to define trigger-conditions for every profile.
		//		Key is profile name (should exists in the config parameter).
		//		Value is a predicate function accepting grid as its parameter:
		//		For example:
		//		function(grid){
		//			return Math.abs(window.orientation) == 90;
		//		}
		condition: {},

		to: function(profileName){
			// summary:
			//		Switch to a column structure indicated by the profileName.
			//		Returns true if switched to the target profile, false if not.
			// profileName: String
			//		The name of the target profile.
			//		If set to empty string "", switch to show all columns.
			//		If invalid, no-op.
		},

		check: function(){
			// summary:
			//		Checks every pre-defined condition predicate, if any of them returns true,
			//		and the corresponding profile exists, switch to that profile.
			//		Returns the name of the profile if found a match, null if not.
		}
	});
=====*/

	return declare(_Module, {
		name: "structureSwitch",
		required: ['hiddenColumns'],
		'default': '',
		orientation: true,

		constructor: function(){
			var t = this,
				config = t.arg('config') || {},
				condition = t.arg('condition') || {};
			if(t.arg('orientation')){
				if(config.portrait){
					condition.portrait = function(){
						return 'orientation' in window && window.orientation === 0;
					};
				}
				if(config.landscape){
					condition.portrait = function(){
						return Math.abs(window.orientation) == 90;
					};
				}
				t.connect(window, 'orientationchange', 'check');
			}
		},

		preload: function(){
			var t = this,
				dft = t.config[t.arg('default')];
			if(dft){
				var toHide = array.filter(array.map(t.grid._columns, function(col){
					return col.id;
				}), function(id){
					return array.indexOf(dft, id) < 0;
				});
				[].push.apply(t.grid.hiddenColumns.arg('init', []), toHide);
			}
		},

		load: function(args, startup){
			var t = this;
			startup.then(function(){
				t.check();
				t.loaded.callback();
			});
		},

		//Public----------------------------------------------------------------------------
		to: function(name){
			var g = this.grid,
				structure = this.config[name];
			if(!structure && name === ''){
				structure = array.map(g.structure, function(col){
					return col.id;
				});
			}
			if(structure){
				var hiddenColumns = g.hiddenColumns;
				var toHide = array.filter(g._columns, function(col){
					return array.indexOf(structure, col.id) < 0;
				});
				var toShow = array.filter(structure, function(col){
					return !g._columnsById[col.id];
				});
				hiddenColumns.add.apply(hiddenColumns, toHide);
				hiddenColumns.remove.apply(hiddenColumns, toShow);
			}
			return !!structure;
		},

		check: function(){
			var t = this;
			for(var name in t.condition){
				if(t.condition[name](t.grid) && t.to(name)){
					t.grid.resize();
					return name;
				}
			}
			return null;
		}
	});
});
