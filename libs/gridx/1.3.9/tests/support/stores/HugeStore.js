define([
	'dojox/data/QueryReadStore'
], function(Store){

return function(args){
	return new Store({
		url: args.path + '/test_hugeStore.php?totalsize=' + args.size
	});
};
});
