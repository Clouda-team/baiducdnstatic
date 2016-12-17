define([
	'intern!object',
	'intern/chai!assert',
	'dojo/_base/declare',
	'dstore/Csv',
	'dstore/Memory',
	'dojo/text!./data/noquote.csv',
	'dojo/text!./data/quote.csv',
	'dojo/text!./data/contributors.csv'
], function (registerSuite, assert, declare, Csv, Memory, noquote, quote, contributors) {
	// First, normalize newlines in all retrieved CSVs, to avoid test failures due to autocrlf
	noquote = noquote.replace(/\r\n/g, '\n');
	quote = quote.replace(/\r\n/g, '\n');
	contributors = contributors.replace(/\r\n/g, '\n');

	var CsvMemory = declare([Memory, Csv]);
	var xhrBase = require.toUrl('dstore/tests/data');
	var csvs = {}; // holds retrieved raw CSV data
	var stores = {}; // holds stores created after CSV data is retrieved
	csvs.noQuote = noquote;
	stores.noQuoteNoHeader = new CsvMemory({
		data: noquote,
		newline: '\n',
		fieldNames: ['id', 'last', 'first', 'born', 'died']
	});
	stores.noQuoteWithHeader = new CsvMemory({
		data: noquote,
		newline: '\n'
		// No fieldNames; first row will be treated as header row.
	});
	stores.noQuoteTrim = new CsvMemory({
		data: noquote,
		newline: '\n',
		trim: true
	});
	csvs.quote = quote;
	stores.quoteNoHeader = new CsvMemory({
		data: quote,
		newline: '\n',
		fieldNames: ['id', 'name', 'quote']
	});
	stores.quoteWithHeader = new CsvMemory({
		data: quote,
		newline: '\n'
		// No fieldNames; first row will be treated as header row.
	});
	csvs.contributors = contributors;
	stores.contributors = new CsvMemory({
		data: contributors,
		newline: '\n'
	});
	registerSuite({
		name: 'dstore CSV',

		'no quote': function () {
			var noHeader = stores.noQuoteNoHeader,
				withHeader = stores.noQuoteWithHeader,
				trim = stores.noQuoteTrim,
				item, trimmedItem;

			// Test header vs. no header...
			assert.strictEqual(4, noHeader.data.length,
				'Store with fieldNames should have 4 items.');
			assert.strictEqual(3, withHeader.data.length,
				'Store using header row should have 3 items.');
			assert.strictEqual(5, noHeader.fieldNames.length,
				'Store with fieldNames should have 5 fields.');
			assert.strictEqual(6, withHeader.fieldNames.length,
				'Store using header row should have 6 fields.');
			assert.strictEqual('id', noHeader.getSync('id').id,
				'First line should be considered an item when fieldNames are set');
			assert.strictEqual('Albert', withHeader.getSync('1').first,
				'Field names picked up from header row should be trimmed.');
			assert.strictEqual(noHeader.getSync('1').last, withHeader.getSync('1').last,
				'Item with id of 1 should have the same data in both stores.');

			// Test trim vs. no trim...
			item = withHeader.getSync('2');
			trimmedItem = trim.getSync('2');
			assert.strictEqual(' Nikola ', item.first,
				'Leading/trailing spaces should be preserved if trim is false.');
			assert.strictEqual('Nikola', trimmedItem.first,
				'Leading/trailing spaces should be trimmed if trim is true.');
			assert.strictEqual(' ', item.middle,
				'Strings containing only whitespace should remain intact if trim is false.');
			assert.strictEqual('', trimmedItem.middle,
				'Strings containing only whitespace should be empty if trim is true.');

			// Test data integrity...
			item = withHeader.getSync('1');
			assert.isTrue(item.middle === '', 'Test blank value.');
			assert.strictEqual('1879-03-14', item.born, 'Test value after blank value.');
			assert.isTrue(withHeader.getSync('3').died === '', 'Test blank value at end of line.');
		},

		'quote': function () {
			var noHeader = stores.quoteNoHeader,
				withHeader = stores.quoteWithHeader;

			// Test header vs. no header...
			assert.strictEqual(5, noHeader.data.length,
				'Store with fieldNames should have 5 items.');
			assert.strictEqual(4, withHeader.data.length,
				'Store using header row should have 4 items.');
			assert.strictEqual('id', noHeader.getSync('id').id,
				'First line should be considered an item when fieldNames are set');
			assert.strictEqual(noHeader.getSync('1').name, withHeader.getSync('1').name,
				'Item with id of 1 should have the same data in both stores.');

			// Test data integrity...
			assert.strictEqual('""', withHeader.getSync('3').quote,
				'Value consisting of two double-quotes should pick up properly.');
			assert.strictEqual(' S, P, ...ace! ', withHeader.getSync('4').quote,
				'Leading/trailing spaces within quotes should be preserved.');
			assert.isTrue(/^Then[\s\S]*"Nevermore\."$/.test(withHeader.getSync('2').quote),
				'Multiline value should remain intact.');
			assert.isTrue(/smiling,\n/.test(withHeader.getSync('2').quote),
				'Multiline value should use same newline format as input.');
		},

		'import export': function () {
			assert.strictEqual(csvs.contributors, stores.contributors.toCsv(),
				'toCsv() should generate data matching original if it is well-formed');
		}
	});
});