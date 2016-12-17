
dojo.setObject('DebugUtil',{
	timer:{
		_cache:{}
		,_data: []
		,start:function(id){
			if(!id)this.defaultTimer = (new Date()).getTime();
			else this._cache[id] = (new Date()).getTime();
		}
		,end:function(id, msg, noConsole, callback){
			if(id && !this._cache[id]){
				msg = id;
				id = null;
			}
			var t = this.getTime(id);
			var startTime = id ? this._cache[id] : this.defaultTimer;
			if(!noConsole)console.debug((msg||'') + ': ' + t + 'ms');
			if(callback)callback(t);
			return t;
		}
		,getTime:function(id){
			return (new Date()).getTime() - (id ? this._cache[id] : this.defaultTimer);
		}
		,trackFunction: function(obj, funcName, msg){
			console.debug(obj, funcName);
		    obj = obj || window;
		    
		    var data = dojo.filter(this._data, function(d){
		    	return d.obj == obj && d.funcName == funcName;
		    })[0];
		    if(!data){
		    	data = {obj: obj, funcName: funcName, count: 0, time: 0};
		    	this._data.push(data);
		    }
		    var func = obj[funcName];
		    var self = this;
		    obj[funcName] = function(){
		    	var _id = (new Date()).getTime()+'';
		        self.start(_id);
		        var re = func.apply(obj, arguments);
		        var arr = [];
		        for(var i=0; i<arguments.length;i++)arr.push(arguments[i]+'');
		        data.count++;
		        data.time += self.getTime(_id);
		        self.end(_id, msg || ('Function "' + funcName + '('+arr.join(',')+')' + '" execution time'));
		        return re;
		    }
		}
		,clear: function(){
			this._data.length = 0;
		}
		,report: function(){
			dojo.forEach(this._data, function(d){
				console.debug(d.obj, d.funcName, 'count: '+d.count
					,'total: ' + d.time + 'ms', 'avg: ' + Math.floor(d.time/d.count) + 'ms');
			});
		}
	}

	
});