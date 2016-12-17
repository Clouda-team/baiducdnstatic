define([
	'dojo/_base/declare',
	'dijit/layout/ContentPane',
	'dijit/layout/AccordionContainer',
	'dijit/form/Button'
], function(declare, ContentPane, AccordionContainer){

return declare('gridx.tests.support.TestPane', AccordionContainer, {
	addTestSet: function(name, testContent){
		this.addChild(new ContentPane({
			title: name,
			content: testContent
		}));
	}
});
});
