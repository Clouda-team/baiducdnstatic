define([
	'dojo/_base/declare',
	'dojo/data/ItemFileWriteStore'
], function(declare, ItemFileWriteStore){

return declare(ItemFileWriteStore, {
	constructor: function(){
		var oldFetch = this.fetch;
		this.fetch = function(request){
			var t = request.start * 10, _this = this;
			setTimeout(function(){
				oldFetch.call(_this, request);
			}, _this.asyncTimeout || 700);
			return request;
		};
	}
});
});
