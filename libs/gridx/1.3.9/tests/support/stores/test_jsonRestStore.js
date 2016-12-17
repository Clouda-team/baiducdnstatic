dojo.require("dojox.data.JsonRestStore");

//Clear put/delete records file, so we can always start with a brand new store.
dojo.xhrPost({url: 'test_jsonRestStore.php?totalsize=' + 200, sync: true});

var jsonStore = new dojox.data.JsonRestStore({
	idAttribute: 'id',
	target: 'test_jsonRestStore.php'
});

jsonStore.fetch({
	start: 10,
	count: 10,
	query: {id: '*'},
	sort: [{attribute: 'number', descending: true}],
	onComplete: function(items){
		console.log('items:', items);
		jsonStore.deleteItem(items[0]);
		console.log('delete ok');
		jsonStore.save({
			onComplete: function(){
				jsonStore.newItem({id: 1000, number: 123456, square: 11111});
				console.log('add ok');
				jsonStore.save({
					onComplete: function(){
						jsonStore.setValue(items[1], 'number', 22222);
						console.log('set ok');
						jsonStore.save({
							onComplete: function(){
								jsonStore.newItem({id: 2000, number: 123456, square: 11111});
								jsonStore.newItem({id: 3000, number: 123456, square: 11111});
								jsonStore.newItem({id: 4000, number: 123456, square: 11111});
								jsonStore.save({
									onComplete: function(){
										jsonStore.fetch({
											onComplete: function(items){
											}
										});
									}
								});
							}
						});
					}
				});
			}
		});
	}
});


