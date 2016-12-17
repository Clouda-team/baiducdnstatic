<?php
//    require_once('FirePHPCore/fb.php');  
//    ob_start(); 

	header("Content-Type: " . ($_SERVER["CONTENT_TYPE"] == 'application/json' ? 'application/json' : 'text/plain'));

	$store = new Store();
	switch ($_SERVER["REQUEST_METHOD"]) {
		case "GET":
			echo $store->get();
	}

class Store{
	private $jsonArray = array(
		"identifier"=>"id",
		"label"=>"id"
	);

	private $totalCount = 1000;

	private $str = "abcd efgh ijkl mnop qrst uvwx yz12 3456 7890";

	function __construct(){
		if(array_key_exists('totalsize', $_REQUEST)){
			$this->totalCount = $_REQUEST['totalsize'];
		}
		$this->jsonArray['numRows'] = $this->totalCount;
	}

	public function get(){
		return json_encode($this->packup($this->getItems()));
	}

	//Private ------------------------------------------------------------------
	private function randomText($index){
		$len = rand(1, 200);
		$sb = array();
		for($i = 0; $i < $len; ++$i){
			$sb[] = $this->str[rand(0, strlen($this->str) - 1)];
		}
		return implode($sb);
	}

	private function getRow($index){
		return array(
			"id" => $index + 1,
			"number" => $index * $index,
			"string" => $this->randomText($index)
		);
	}

	private function getItems(){
		$start = 0;
		if (array_key_exists("start", $_REQUEST)) {
			$start = $_REQUEST['start'];
		}
		$count = $this->totalCount;
		if (array_key_exists("count", $_REQUEST)) {
			$count = $_REQUEST['count'];
		}
		$items = array();
		for($i = $start; $i < $start + $count; ++$i){
			$items[] = $this->getRow($i);
		}
		return $items;
	}
	
	private function packup($items){
		$this->jsonArray['items'] = $items;
		return $this->jsonArray;
	}
}
?>
