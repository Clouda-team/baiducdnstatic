// from dijit/dijit.profile.js
var profile = (function(){
	var testResourceRe = /^gridx\/tests\/|^gridx\/mobile\/tests\//;
	var galleryResourceRe = /^gridx\/gallery\//;
	var buildResourceRe = /^gridx\/build\//;
	var utilResourceRe = /^gridx\/util\/|^gridx\/mobile\/util\//;

	var	copyOnly = function(filename, mid){
			var list = {
				"gridx/gridx.profile":1,
				"dijit/package.json":1
			};
			return (mid in list) 
						|| (/^gridx\/resources\//.test(mid) && !/\.css$/.test(filename)) 
						|| /(png|jpg|jpeg|gif|tiff)$/.test(filename);
		};

	return {
		resourceTags:{
			test: function(filename, mid){
				return testResourceRe.test(mid) 
					|| galleryResourceRe.test(mid) 
					|| buildResourceRe.test(mid) 
					|| utilResourceRe.test(mid);
			},

			copyOnly: function(filename, mid){
				return copyOnly(filename, mid);
			},

			amd: function(filename, mid){
				return !testResourceRe.test(mid) 
					&& !galleryResourceRe.test(mid) 
					&& !buildResourceRe.test(mid) 
					&& !utilResourceRe.test(mid) 
					&& !copyOnly(filename, mid) 
					&& /\.js$/.test(filename);
			},

			miniExclude: function(filename, mid){
				return /^gridx\/bench\//.test(mid)
					|| /^gridx\/themes\/themeTest/.test(mid)
					|| /^gridx\/mobile\/demos\//.test(mid);
			}
		},

		trees:[
			[".", ".", /(\/\.)|(~$)/]
		]
	};
})();
