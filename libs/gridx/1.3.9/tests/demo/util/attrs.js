define([
], function(){
	return [
		//Grid
		{mod: '', name: 'autoHeight',
			type: 'bool',
			unitPost: 'Grid body height equals the sum of row height, and there\'s no vertical scroll bar.',
			value: false,
			description: 'If this is set to true, the grid will show all the rows without virtical scroller bar. In this mode, the height of grid is defined by the total height of rows.'
		},
		{mod: '', name: 'autoWidth',
			type: 'bool',
			unitPost: 'Grid body width equals the sum of column width, and there\'s no horizontal scroll bar.',
			value: false,
			description: 'If this is set to true, the grid will show all the columns without horizontal scroller bar. In this mode, the width of grid is defined by the total width of columns.'
		},
		//Header
		{mod: 'header', name: 'hidden',
			type: 'bool',
			unitPost: 'Hide the grid header',
			value: false,
			description: ''
		},
		//Body
		{mod: 'body', name: 'rowHoverEffect',
			type: 'bool',
			unitPost: 'When mouse hovering a row, highlight it.',
			value: true,
			description: ''
		},
		{mod: 'body', name: 'stuffEmptyCell',
			type: 'bool',
			unitPost: 'Stuff a space charactor into empty cells to make the row look higher.',
			value: true,
			description: ''
		},
		//ColumnWidth
		{mod: 'columnWidth', name: 'default',
			type: 'number',
			editor: 'numberTextBox',
			unitPre: 'Default column width set to',
			unitPost: 'px',
			value: 60,
			description: ''
		},
		{mod: 'columnWidth', name: 'autoResize',
			type: 'bool',
			unitPost: 'Only percentage column width and auto column width are allowed, no horizontal scroll bar, no column resizer.',
			value: false,
			description: ''
		},
		//HScroller
		//VScroller
		{mod: 'vScroller', name: 'buffSize',
			type: 'number',
			editor: 'spinner',
			unitPre: 'Render',
			unitPost: 'more rows above/below the view port.',
			value: 5,
			description: ''
		},
		{mod: 'vScroller', name: 'lazy',
			type: 'bool',
			unitPost: 'Fetch data only when user stops scrolling the grid vertically.',
			value: false,
			description: ''
		},
		{mod: 'vScroller', name: 'lazyTimeout',
			type: 'number',
			editor: 'spinner',
			unitPre: 'Wait for',
			unitPost: 'milli-seconds before fetching data for every scroll (only effective when "lazy" is true)',
			value: 50,
			description: ''
		},
		//HLayout
		//VLayout
		//Focus
		//Edit
		{mod: 'edit', name: 'lazySave',
			type: 'bool',
			value: true,
			unitPost: 'save the edited data at client side without write to store immediately.',
			description: ''
		},
		//Sort
		{mod: 'sort', name: 'initialOrder',
			type: 'array',
			value: undefined,
			description: ''
		},
		//ColumnResizer
		{mod: 'columnResizer', name: 'miniWidth',
			type: 'number',
			editor: 'numberTextBox',
			unitPre: 'The minimal width a column can be resized to is',
			unitPost: 'px',
			value: 20,
			description: ''
		},
		{mod: 'columnResizer', name: 'detectWidth',
			type: 'number',
			editor: 'numberTextBox',
			unitPre: 'Change mouse cursor to resizer shape when it is less than',
			unitPost: 'px from the right border of a column',
			value: 5,
			description: ''
		},
		//ColumnLock
		{mod: 'columnLock', name: 'count',
			type: 'number',
			editor: 'spinner',
			unitPre: 'lock the first',
			unitPost: 'columns',
			value: 0,
			description: ''
		},
		//RowLock
		{mod: 'rowLock', name: 'count',
			type: 'number',
			editor: 'spinner',
			unitPre: 'lock the first',
			unitPost: 'rows',
			value: 0,
			description: ''
		},
		//Tree
		{mod: 'tree', name: 'nested',
			type: 'bool',
			unitPost: 'Show tree expandos in different columns for each level of data.',
			value: false,
			description: ''
		},
		{mod: 'tree', name: 'expandoPadding',
			type: 'number',
			editor: 'numberTextBox',
			unitPre: 'For every level in Tree grid, intend the expando by',
			unitPost: 'px',
			value: 18,
			description: ''
		},
		{mod: 'tree', name: 'expandLevel',
			type: 'number',
			editor: 'numberTextBox',
			unitPre: 'Expand at most',
			unitPost: 'levels of child rows',
			value: 18,
			description: ''
		},
		//SelectRow
		{mod: 'selectRow', name: 'treeMode',
			type: 'bool',
			unitPost: 'Select all the children when selecting a row; mark a row as mixed status when some of its children are selected while others are not',
			value: true,
			description: ''
		},
		{mod: 'selectRow', name: 'triggerOnCell',
			type: 'bool',
			unitPost: 'Select a row when any cell in that row is clicked.',
			value: false,
			description: ''
		},
		{mod: 'selectRow', name: 'unselectable',
			type: 'other',
			unitPost: 'Allow selecting multiple rows (holding CTRL).',
			value: [],
			simpleValue: (function(){
				var o = {};
				for(var i = 0; i < 100; i++){
					if(i % 5 === 0){
						o['item-' + i] = true;
					}
				}
				return o;
			})(),
			complexValue: (function(){
				var o = {};
				for(var i = 0; i < 50; i++){
					if(i % 3 === 0){
						o['item-' + i] = true;
					}
				}
				return o;
			})(),
			description: ''
		},
		{mod: 'selectRow', name: 'multiple',
			type: 'bool',
			unitPost: 'Allow selecting multiple rows (holding CTRL).',
			value: false,
			description: ''
		},		
		//SelectColumn
		{mod: 'selectColumn', name: 'multiple',
			type: 'bool',
			unitPost: 'Allow selecting multiple columns (holding CTRL).',
			value: false,
			description: ''
		},
		//SelectCell
		{mod: 'selectCell', name: 'multiple',
			type: 'bool',
			unitPost: 'Allow selecting multiple cells (holding CTRL).',
			value: false,
			description: ''
		},
		//IndirectSelect
		{mod: 'indirectSelect', name: 'all',
			type: 'bool',
			unitPost: 'Show the "select all" check box in the header of the indirect selection column.',
			value: true,
			description: ''
		},
		//Pagination
		{mod: 'pagination', name: 'initialPage',
			type: 'number',
			editor: 'spinner',
			unitPre: 'Show the page of index',
			unitPost: 'when grid is created.',
			value: 0,
			description: ''
		},
		{mod: 'pagination', name: 'initialPageSize',
			type: 'number',
			editor: 'spinner',
			unitPre: 'Show',
			unitPost: 'rows for every page',
			value: 10,
			description: ''
		},
		//PaginationBar
		{mod: 'paginationBar', name: 'gotoButton',
			type: 'bool',
			unitPost: 'Show goto-page button in the linked pagination bar.',
			value: true,
			description: ''
		},
		{mod: 'paginationBar', name: 'visibleSteppers',
			type: 'number',
			editor: 'spinner',
			unitPre: 'Show (at least)',
			unitPost: 'page links in the page stepper region of the linked pagination bar.',
			value: 10,
			description: ''
		},
		//Filter
		{mod: 'filter', name: 'serverMode',
			type: 'bool',
			unitPost: 'Pass the filter condition as a query to store so that filter logic can be handled in server.',
			value: false,
			description: ''
		},
		//FilterBar
		{mod: 'filterBar', name: 'closeButton',
			type: 'bool',
			unitPost: 'Show a small button on the filter bar for the user to close/hide the filter bar',
			value: true,
			description: ''
		},
		{mod: 'filterBar', name: 'defineFilterButton',
			type: 'bool',
			unitPost: 'Show the define filter button on the left side (right side for RTL) of the filter bar.',
			value: true,
			description: ''
		},
		{mod: 'filterBar', name: 'tooltipDelay',
			type: 'number',
			editor: 'numberTextBox',
			unitPre: 'Delay',
			unitPost: 'mili-seconds to show the Filter Status Tooltip when mouse is hovering on the filter bar.',
			value: 300,
			description: ''
		},
		{mod: 'filterBar', name: 'maxRuleCount',
			type: 'number',
			editor: 'spinner',
			unitPre: 'At most',
			unitPost: 'rules that can be applied in the Filter Definition Dialog.',
			value: 3,
			description: ''
		},
		{mod: 'filterBar', name: 'ruleCountToConfirmClearFilter',
			type: 'number',
			editor: 'spinner',
			unitPre: 'If there are more than or equal to',
			unitPost: 'rules defined, a confirm dialog will be promped when clearing filter.',
			value: 2,
			description: ''
		},
		//MoveRow
		{mod: 'moveRow', name: 'moveSelected',
			type: 'bool',
			unitPost: 'When moving rows using keyboard (CTRL+ARROW_UP/ARROW_DOWN), move all the selected rows together.',
			value: true,
			description: ''
		},
		//MoveColumn
		{mod: 'moveColumn', name: 'moveSelected',
			type: 'bool',
			unitPost: 'When moving columns using keyboard (CTRL+ARROW_UP/ARROW_DOWN), move all the selected rows together.',
			value: true,
			description: ''
		},
		//DndRow
		{mod: 'dndRow', name: 'canRearrange',
			type: 'bool',
			unitPost: 'Allow rearrange rows within the grid by drag and drop.',
			value: true,
			description: ''
		},
		{mod: 'dndRow', name: 'copyWhenDragOut',
			type: 'bool',
			unitPost: 'When dragged out to another grid or a non-grid target, do not delete the dragged rows in this grid.',
			value: true,
			description: ''
		},
		{mod: 'dndRow', name: 'delay',
			type: 'number',
			editor: 'numberTextBox',
			unitPre: 'Delay',
			unitPost: 'px when dragging mouse to trigger row dnd.',
			value: 2,
			description: ''
		},
		//DndColumn
		{mod: 'dndColumn', name: 'canRearrange',
			type: 'bool',
			unitPost: 'Allow rearrange columns within the grid by drag and drop.',
			value: true,
			description: ''
		},
		{mod: 'dndColumn', name: 'delay',
			type: 'number',
			editor: 'numberTextBox',
			unitPre: 'Delay',
			unitPost: 'px when dragging mouse to trigger column dnd.',
			value: 2,
			description: ''
		},
		//ExporterCSV
		//Printer
		//TitleBar
		
		//groupHeader
		{mod: 'header', name: 'groups', overrideCore: true,
			// binding: 'gridx/modules/GroupHeader',
			type: 'other',		//not show in attribute editor
			editor: '',
			value: [],
			simpleValue: [
				{name: 'Group 1', children: 2},
				{name: 'Group 2', children: 2}
			],
			complexValue: [
				{name: 'Group 1', children: 
					[
						{name: 'Group 1-1', children: 2},
						{name: 'Group 1-2', children: 2}
					]
				}
				// {name: 'Group 2', children: 2}			
			],
			unitPost: 'set the structure of the header group when groupHeader module is included.',
			description: ''
		},
		//hiddenColumns
		{mod: 'hiddenColumns', name: 'init',
			type: 'other',
			editor: 'numberTextBox',
			unitPre: 'Delay',
			unitPost: 'IDs of columns to be hidden when grid is initially created.',
			value: [],
			simpleValue:['column_1'],
			complexValue: ['column_1', 'column_2'],
			description: ''
		}
	];
});
