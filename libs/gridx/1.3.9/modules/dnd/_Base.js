define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"../../core/_Module",
	"./Avatar",
	"./_Dnd"
], function(declare, array, lang, _Module, Avatar){

/*=====
	return declare(_Module, {
		// summary:
		//		Base class for dnd modules.

		// delay: Number
		//		The time delay before starting dnd after mouse down.
		delay: 2,
	
		// enabled: Boolean
		//		Whether this module is enabled.
		enabled: true,

		// canRearrange: Boolean
		//		Whether rearrange within grid using dnd is allowed.
		canRearrange: true,

		// copyWhenDragOut: Boolean|Object
		//		When dragging out, whehter to delete in this grid.
		//		If it is a boolean value, it is effective for all targets.
		//		If it is an associative array, it can be set on different drag targets.
		//		(key is an "accept" string of the dnd target).
		copyWhenDragOut: false,

		// avatar: function
		//		The avatar constructor used during dnd.
		avatar: null
	});
=====*/

	return declare(_Module, {
		delay: 2,
		enabled: true,
		canRearrange: true,
		copyWhenDragOut: false,
		avatar: Avatar,

		preload: function(args){
			var dnd = this.grid.dnd._dnd;
			dnd.register(this.name, this);
			dnd.avatar = this.arg('avatar');
		},

		checkArg: function(name, arr){
			var arg = this.arg(name);
			return (arg && lang.isObject(arg)) ? array.some(arr, function(v){
				return arg[v];
			}) : arg;
		}
	});
});
