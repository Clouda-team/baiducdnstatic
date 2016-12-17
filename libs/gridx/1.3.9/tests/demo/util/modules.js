define([
	'../../../allModules'
], function(mods){
	return [
		{label: 'Virtual Vertical Scroller',
			module: mods.VirtualVScroller,
			mid: 'gridx/modules/VirtualVScroller',
			name: 'VirtualVScroller',
			description: [
				'Virtual scrolling means rendering row DOM nodes only when they are about to be shown.',
				'Rows out of view will not be rendered until they are scrolled into view.',
				'This makes the rendering of grid much faster when there are a lot of rows.'
			].join(''),
			icon: 'images/modIcon-VirtualVScroller.png',
			iconClass: '',
			pic: '../../gallery/image/virtualscroller.png'
		},
		{label: 'Filter API', 
			module: mods.Filter,
			mid: 'gridx/modules/Filter',
			name: 'Filter',
			description: [
				'Provides filter API for grid, no UI. Also provides a set of useful utility functions to help create ',
				'complicated filter condition.'
			].join(''),
			icon: 'images/modIcon-Filter.png',
			iconClass: ''
		},
		{label: 'Pagination API', 
			module: mods.Pagination,
			mid: 'gridx/modules/Pagination',
			name: 'Pagination',
			description: [
				'Provides APIs to show only a part of rows of the store. ',
				'This pagination modules does not have any UI. ',
				'Different UI implmentations can be built on top of this module.'
			].join(''),
			icon: 'images/modIcon-Pagination.png',
			iconClass: ''
		},
		{label: 'Keyboard Support', 
			module: mods.Focus,
			mid: 'gridx/modules/Focus',
			name: 'Focus',
			description: '', 
			icon: 'images/modIcon-Focus.png',
			iconClass: ''
		},
		{label: 'Column Lock', 
			module: mods.ColumnLock,
			mid: 'gridx/modules/ColumnLock',
			name: 'ColumnLock',
			description: [
				'Leading columns can be locked up, so that the horizontal scroll bar will not scroll them out of view.',
				'This module only provides API to lock and unlock columns. But an attribute called "count" can be used ',
				'to lock columns when grid is created.'
			].join(''),
			icon: 'images/modIcon-ColumnLock.png',
			iconClass: '',
			pic: '../../gallery/image/columnlock.png'
		},
		{label: 'Row Lock', 
			module: mods.RowLock,
			mid: 'gridx/modules/RowLock',
			name: 'RowLock',
			description: 'Lock several rows at the top of the current view, so that the vertical scroll bar will not scroll them out of view. This module only provides API to lock and unlock rows, but and attribute called "count" can be used to lock rows when grid is created.',
			icon: 'images/modIcon-RowLock.png',
			iconClass: ''
		},

		{label: 'Column Resizer',
			module: mods.ColumnResizer,
			mid: 'gridx/modules/ColumnResizer',
			name: 'ColumnResizer',
			description: [
				'Column Resizer provides both UI and API to resize grid columns.',
				'When mouse hovering between two columns, the cursor will change to a horizontal resize shape.',
				'Then mouse down and drag, a vertical bar will be shown to indicate the new column width.',
				'Release the mouse will set the new width to the column.'
			].join(''),
			icon: 'images/modIcon-ColumnResizer.png',
			iconClass: '',
			pic: '../../gallery/image/simplegrid.png'
		},
		{label: 'Single Column Sort', 
			module: mods.SingleSort,
			mid: 'gridx/modules/SingleSort',
			name: 'SingleSort',
			description: [
				'Sort one and only one column. Clicking the column header will sort the column.',
				'This module also provides a rich set of APIs.'
			].join(''),
			icon: 'images/modIcon-SingleSort.png',
			iconClass: '',
			pic: '../../gallery/image/singlesort.png'
		},
		{label: 'Nested Column Sort', 
			module: mods.NestedSort,
			mid: 'gridx/modules/NestedSort',
			name: 'NestedSort',
			description: [
				'Sort multiple columns. The first sorted column is the main order. If some rows have same value ',
				'in the first column, they are sorted on the second sorted column, and so on. Both API and UI are ',
				'provided.'
			].join(''),
			icon: 'images/modIcon-NestedSort.png',
			iconClass: '',
			pic: '../../gallery/image/nestedsort.png'
		},
		{label: 'Simple Row Selection', 
			module: mods.SelectRow,
			mid: 'gridx/modules/select/Row',
			name: 'SelectRow',
			description: [
				'Select rows by ID. This module is simple and quick. ',
				'Only loaded rows can be selected by this module. Range selection is not ',
				'provided here, because some rows in the range could be not loaded yet. But multiple selection ',
				'is supported as well as single selection, which can be performed by holding CTRL key. ',
				'Also privodes a rich set of APIs.'
			].join(''),
			icon: 'images/modIcon-SelectRow.png',
			iconClass: '',
			pic: '../../gallery/image/select.png'
		},
		{label: 'Simple Column Selection', 
			module: mods.SelectColumn,
			mid: 'gridx/modules/select/Column',
			name: 'SelectColumn',
			description: [
				'A simple implementation for column selection. Only support selecting column by ID.',
				'Suitable for single column selection senarios. But multiple selection is also supported ',
				'while holding CTRL.'
			].join(''),
			icon: 'images/modIcon-SelectColumn.png',
			iconClass: ''
		},
		{label: 'Simple Cell Selection', 
			module: mods.SelectCell,
			mid: 'gridx/modules/select/Cell',
			name: 'SelectCell',
			description: [
				'Select cells by row ID and column ID. This is a simple and quick implemenation, ',
				'suitable for single cell selection. But also support multiple cell selection when holding CTRL.',
				'Only cells in loaded rows can be selected.'
			].join(''),
			icon: 'images/modIcon-SelectCell.png',
			iconClass: ''
		},

		{label: 'Extended Row Selection', 
			module: mods.ExtendedSelectRow,
			mid: 'gridx/modules/extendedSelect/Row',
			name: 'SelectRow',
			description: [
				'Select rows by index. Even rows that are not loaded yet can be selected using this module.',
				'So range selection is supported here, including mouse sweep selection and SHIFT range selection.',
				'But in order to select the correct row even after sorting or filtering, the row must finally ',
				'be loaded and select by ID. So this module will be slow when seleting a large range of a huge ',
				'server side store.'
			].join(''),
			icon: 'images/modIcon-ExtendedSelectRow.png',
			iconClass: ''
		},
		{label: 'Extended Column Selection', 
			module: mods.ExtendedSelectColumn,
			mid: 'gridx/modules/extendedSelect/Column',
			name: 'SelectColumn',
			description: [
				'Select columns by index. Support range column selection including mouse sweep selection and ',
				'SHIFT range selection. This module is only necessory when range column selection is needed.'
			].join(''),
			icon: 'images/modIcon-ExtendedSelectColumn.png',
			iconClass: ''
		},
		{label: 'Extended Cell Selection', 
			module: mods.ExtendedSelectCell,
			mid: 'gridx/modules/extendedSelect/Cell',
			name: 'SelectCell',
			description: [
				'Select cells by row index and column index. Cell range selection is supported, including mouse ',
				'sweep selection and SHIFT range selection. Similar to extended row selection, cells in unloaded rows',
				' can also be selected, but finally they all need to be loaded to get selected by ID.'
			].join(''),
			icon: 'images/modIcon-ExtendedSelectCell.png',
			iconClass: '',
			pic: '../../gallery/image/extendedselect.png'
		},
		{label: 'Filter Bar', 
			module: mods.FilterBar,
			mid: 'gridx/modules/filter/FilterBar',
			name: 'FilterBar',
			description: [
				'Provides a kind of UI to filter grid rows. ',
				'Filter bar is a horizontal bar on the top of grid header.',
				'Clicking on the filter bar will show a filter dialog to help create filter conditions.'
			].join(''),
			icon: 'images/modIcon-FilterBar.png',
			iconClass: ''
		},
		{label: 'Linked Button Pagination Bar', 
			module: mods.PaginationBar,
			mid: 'gridx/modules/pagination/PaginationBar',
			name: 'PaginationBar',
			description: [
				'This is a kind of UI of pagination grid. ',
				'Linked buttons are provided to navigate from page to page,',
				' or change page sizes.',
				'This UI usually needs quite a lot horizontal space.'
			].join(''),
			icon: 'images/modIcon-PaginationBar.png',
			iconClass: '',
			pic: '../../gallery/image/pagination.png'
		},
		{label: 'Drop Down Pagination Bar', 
			module: mods.PaginationBarDD,
			mid: 'gridx/modules/pagination/PaginationBarDD',
			name: 'PaginationBarDD',
			description: [
				'This is a kind of UI of pagination grid. ',
				'Drop down lists are used to choose page or page size.',
				'This UI is more suitable for narrow grids compared to the Linked Button version'
			].join(''),
			icon: 'images/modIcon-PaginationBarDD.png',
			iconClass: ''
		},
		{label: 'Row Move API', 
			module: mods.MoveRow,
			mid: 'gridx/modules/move/Row',
			name: 'MoveRow',
			description: [
				'Provides row reordering API. Also support moving rows by keyboard (CTRL+UP_ARROW/DOWN_ARROW) if Focus module is used.',
				'Row reordering is implemented by sorting a special field in store. By default this field is called "order", and only contains unique number values in every row. Specify "moveField" attribute for grid to use other fields instead of "order".'
			].join(''),
			icon: 'images/modIcon-MoveRow.png',
			iconClass: ''
		},
		{label: 'Column Move API', 
			module: mods.MoveColumn,
			mid: 'gridx/modules/move/Column',
			name: 'MoveColumn',
			description: [
				'Provides column reordering API. Also support moving columns by keyboard (CTRL+LEFT_ARROW/RIGHT_ARROW) if Focus module is used.'
			].join(''),
			icon: 'images/modIcon-MoveColumn.png',
			iconClass: ''
		},
		{label: 'Widgets in Cell', 
			module: mods.CellWidget,
			mid: 'gridx/modules/CellWidget',
			name: 'CellWidget',
			description: [
				'Provide support to efficiently show dijits/widgets in cell. ',
				'This module is only effective for columns with "widgetsInCell" set to true. ',
				'In these columns, the "decorator" function returns the templateString of the CellWidget, ',
				'which is the container widget in every cell in these columns. ',
				'Widgets in cell are reused among different rows by setting different cell values, ',
				'so the "data" argument in the "decorator" function is no longer valid. ',
				'Set css class "gridxHasGridCellValue" for your widget or provide "setCellValue" function to fill data into your widget.'
			].join(''),
			icon: 'images/modIcon-CellWidget.png',
			iconClass: '',
			pic: '../../gallery/image/cellWidget.png'
		},
		{label: 'Editable Cell', 
			module: mods.Edit,
			mid: 'gridx/modules/Edit',
			name: 'Edit',
			description: [
				'Make cells editable.'
			].join(''),
			icon: 'images/modIcon-Edit.png',
			iconClass: '',
			pic: '../../gallery/image/editable.png'
		},
		{label: 'Row Header', 
			module: mods.RowHeader,
			mid: 'gridx/modules/RowHeader',
			name: 'RowHeader',
			description: '', 
			icon: 'images/modIcon-RowHeader.png',
			iconClass: ''
		},
		{label: 'Group Header', 
			module: mods.GroupHeader,
			mid: 'gridx/modules/GroupHeader',
			name: 'GroupHeader',
			description: '', 
			icon: 'images/modIcon-GroupHeader.png',
			iconClass: ''
		},		
		{label: 'Hidden Column', 
			module: mods.HiddenColumns,
			mid: 'gridx/modules/HiddenColumns',
			name: 'HiddenColumns',
			description: '', 
			icon: 'images/modIcon-RowHeader.png',
			iconClass: ''
		},			
		{label: 'Indirect Selection', 
			module: mods.IndirectSelect,
			mid: 'gridx/modules/IndirectSelect',
			name: 'IndirectSelect',
			description: '', 
			icon: 'images/modIcon-IndirectSelect.png',
			iconClass: ''
		},
//        {label: 'Menu', 
//            module: mods.Menu,
//            mid: 'gridx/modules/Menu',
//            name: 'Menu',
//            description: '', 
//            iconClass: ''
//        },
		{label: 'Tree', 
			module: mods.Tree,
			mid: 'gridx/modules/Tree',
			name: 'Tree',
			description: '', 
			icon: 'images/modIcon-Tree.png',

			pic: '../../gallery/image/tree.png'
		},
		{label: 'Row Drag and Drop', 
			module: mods.DndRow,
			mid: 'gridx/modules/dnd/Row',
			name: 'Tree',
			description: '', 
			icon: 'images/modIcon-DndRow.png',
			iconClass: ''
		},
		{label: 'Column Drag and Drop', 
			module: mods.DndColumn,
			mid: 'gridx/modules/dnd/Column',
			name: 'DndRow',
			description: '', 
			icon: 'images/modIcon-DndColumn.png',
			iconClass: ''
		},
		{label: 'Bar', 
			module: mods.Bar,
			mid: 'gridx/modules/Bar',
			name: 'Bar',
			description: '', 
			icon: 'images/modIcon-DndColumn.png',
			iconClass: ''
		},
		{label: 'HeaderMenu', 
			module: mods.HeaderMenu,
			mid: 'gridx/modules/HeaderMenu',
			name: 'Bar',
			description: '', 
			icon: 'images/modIcon-HeaderRegion.png',
			iconClass: ''
		}
	];
});
