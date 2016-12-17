<?php
// This script implements a simple mock service for QueryRead tests.
header('Content-Type: application/json');

$total = $_GET['id'] ? 1 : 100;

// Allow override of checked parameters to allow testing non-default values
// on QueryRead properties.
$startParam = $_GET['startParam'] ? $_GET['startParam'] : 'start';
$countParam = $_GET['countParam'] ? $_GET['countParam'] : 'count';
$sortParam = $_GET['sortParam'] ? $_GET['sortParam'] : 'sort';
$itemsProperty = $_GET['itemsProperty'] ? $_GET['itemsProperty'] : 'items';
$totalProperty = $_GET['totalProperty'] ? $_GET['totalProperty'] : 'total';

// Set boundaries and sorting based on parameters to be set by store logic.
$start = $_GET[$startParam] ? $_GET[$startParam] : 0;
$end = $_GET[$countParam] ? min($start + $_GET[$countParam] - 1, $total - 1) : $total;
$desc = $_GET[$sortParam] ? substr($_GET[$sortParam], 0, 1) == '-' : false;

if ($_GET[$sortParam]) {
	$desc = substr($_GET[$sortParam], 0, 1) == '-';
}

// Allow switching between response of outer object with items/total, and
// direct array w/ Content-Range header representing total.
if ($_GET['useContentRange']) {
	header('Content-Range: items ' . $start . '-' . $end . '/' . $total);
} else {
	echo '{"' . $totalProperty . '":' . $total . ',"' . $itemsProperty . '":';
}
echo '[';
if ($_GET['id']) {
	echo '{"id":' . $_GET['id'] . ',"name":"Item ' . $_GET['id'] . '"}';
} else {
	// Iterate forwards or backwards depending on whether sorted descending.
	for ($i = ($desc ? $end : $start); $desc ? $i >= $start : $i <= $end; $desc ? $i-- : $i++) {
		if($i != ($desc ? $end : $start)){
			echo ',';
		}
		echo '{"id":' . ($i + 1) . ',"name":"Item ' . ($i + 1) . '"}';
	}
}
echo ']';
if (!$_GET['useContentRange']) {
	echo '}'; // End the outer object.
}
?>