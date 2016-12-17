define([
	'dojo',
	'dojox/data/JsonRestStore'
], function(dojo, JsonRestStore){

return function(args){
	//Clear put/delete records file, so we can always start with a brand new store.
	dojo.xhrPost({url: args.path + '/test_jsonRestStore.php?totalsize=' + args.size, sync: true});

	return new JsonRestStore({
		idAttribute: 'id',
		target: args.path + '/test_jsonRestStore.php'
	});
};
});
