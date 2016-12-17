define([
/*====="./exporter/exporter",=====*/
	"./exporter/toTable",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"dojo/_base/xhr",
	"dojo/_base/sniff",
	"dojo/_base/window"
], function(/*=====exporter, =====*/exportToTable, declare, lang, Deferred, xhr, has, win){

/*=====
	function printer(grid, args){
		// summary:
		//		Print grid contents.
		// args: __PrinterArgs
		//		Print args
		// returns:
		//		A deferred object indicating when the export process is completed.
	}

	printer.toHTML = function(grid, args){
		// summary
		//		Export to printable html, used for preview
		// args: __PrinterArgs
		//		Print args
		// returns:
		//		A deferred object indicating when the export process is completed.
	};

	printer.__PrinterArgs = declare(exporter.__ExporterArgs, {
		// style: String
		//		The CSS string for the printed document
		style: '',

		// styleSrc: URL String
		//		The CSS file url used for the printed document
		styleSrc: '',

		// title: String
		//		The content of the <title> element in the <head> of the printed document
		title: '',

		// description: String
		//		Any HTML content that will be put before the grid in the printed document.
		description: '',

		// customHead: String
		//		Any HTML <head> content that will be put in the <head> of the printed document.
		customHead: ''
	});

	return printer;
=====*/

	var printFrame,
		hitch = lang.hitch;

	function loadStyleFiles(src){
		var d = new Deferred(),
			loaded = hitch(d, d.callback);
		if(src){
			xhr.get({
				url: src
			}).then(loaded, function(){
				console.warn('Failed to load resource: ', src);
				loaded('');
			});
		}else{
			loaded('');
		}
		return d;
	}

	function _print(str){
		var w, fillDoc = function(w){
			var doc = w.document;
			doc.open();
			doc.write(str);
			doc.close();
		};
		if(!window.print){
			console.warn('Print function is not available');
			return;
		}else if(has('chrome') || has('opera')){
			//referred from dijit._editor.plugins.Print._print()
			//In opera and chrome the iframe.contentWindow.print
			//will also print the outside window. So we must create a
			//stand-alone new window.
			w = window.open("javascript:''", "",
				"status=0,menubar=0,location=0,toolbar=0,width=1,height=1,resizable=0,scrollbars=0");
			fillDoc(w);
			w.print();
			//Opera will stop at this point, showing the popping-out window.
			//If the user closes the window, the following codes will not execute.
			//If the user returns focus to the main window, the print function
			// is executed, but still a no-op.
			w.close();
		}else{
			if(!printFrame){
				//create an iframe to store the grid data.
				printFrame = win.doc.createElement('iframe');
				printFrame.frameBorder = 0;
				var s = printFrame.style;
				s.position = 'absolute';
				s.width = s.height = '1px';
				s.right = s.bottom = 0;
				s.border = 'none';
				s.overflow = 'hidden';
				if(!has('ie') && !has('trident')){
					s.visibility = 'hidden';
				}
				win.body().appendChild(printFrame);
			}
			w = printFrame.contentWindow;
			fillDoc(w);
			//IE requires the frame to be focused for print to work, and it's harmless for FF.
			w.focus();
			w.print();
		}
	}

	function wrap(grid, args, styleSrc, bodyContent){
		return [
			'<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"><html ',
				grid.isLeftToRight() ? '' : 'dir="rtl"',
			'><head><title>',
				args.title || '',
			'</title><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></meta><style type="text/css">',
				styleSrc,
			'</style><style type="text/css">',
				args.style || '',
			'</style>',
				args.customHead || '',
			'</head><body>', 
				args.description || '', 
				bodyContent,
			'</body></html>'
		].join('');
	}

	function printer(grid, args){
		return printer.toHTML(grid, args).then(_print);
	}

	printer.toHTML = function(grid, args){
		var d = new Deferred();
		loadStyleFiles(args.styleSrc).then(function(styleSrc){
			exportToTable(grid, args).then(function(str){
				d.callback(wrap(grid, args, styleSrc, str));
			}, hitch(d, d.errback), hitch(d, d.progress));
		});
		return d;
	};

	return printer;
});
