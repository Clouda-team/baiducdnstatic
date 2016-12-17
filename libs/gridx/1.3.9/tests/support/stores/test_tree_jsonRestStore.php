<?php
//    require_once('FirePHPCore/fb.php');  
//    ob_start(); 

	header("Content-Type: " . ($_SERVER["CONTENT_TYPE"] == 'application/json' ? 'application/json' : 'text/plain'));

	$store = new JsonRestStore();
	switch ($_SERVER["REQUEST_METHOD"]) {
		case "GET":
//            fb($_REQUEST, 'GET');
			echo $store->get();
			break;
		case "PUT":
//            fb($_REQUEST, 'PUT');
			$store->put();
			break;
		case "DELETE":
//            fb($_REQUEST, 'DELETE');
			$store->delete();
			break;
		case "POST":
//            fb($_REQUEST, 'POST');
			$fh = fopen($store->recordFile, 'w');
			if(array_key_exists('totalsize', $_REQUEST)){
				fwrite($fh, (int)$_REQUEST['totalsize']."\r\n");
			}
			fclose($fh);
			break;
	}


class JsonRestStore{
	public $totalCount = 2;
	public $maxLevel = 0;
	public $childCount = 0;
	public $recordFile = 'test_tree_jsonRestStore.txt';

	public $jsonArray = array(
		"identifier"=>"id",
	);

	function __construct(){
		$fh = fopen($this->recordFile, 'r');
		$count = (int)fgets($fh);
		if($count){
			$this->totalCount = $count;
		}
		fclose($fh);
	}

	//PipeLine----------------------------------------------------------------------------
	private function getRow($parentId, $index){
		return array(
			"id" => $parentId.'-'.($index + 1),
			"number" => $index + 1
		);
	}

	private function getItems($level, $parentId){
		$items = array();
		$count = $level ? $this->childCount : $this->totalCount;
		for($i = 0; $i < $count; ++$i){
			$row = $this->getRow($parentId, $i);
			if($level < $this->maxLevel){
				$row['children'] = $this->getItems($level + 1, $row['id']);
			}
			$items[] = $row;
		}
		return $items;
	}

	private function patch($items){
//        fb($items, 'before patch');
//        fb(count($items), 'before patch');
		$fh = fopen($this->recordFile, 'r');
		while(!feof($fh)){
			$str = fgets($fh);
			$record = explode(' ', $str, 3);
			
			if($record[0] == '+'){
				$obj = json_decode($record[2]);
				for($i = 0; $i < count($items); ++$i){
					if($items[$i]['id'] == $record[1]){
						foreach($obj as $key => $value){
							$items[$i][$key] = $value;
						}
						break;
					}
				}
				if($i == count($items)){
					$newItem = array();
					foreach($obj as $key => $value){
						$newItem[$key] = $value;
					}
					$items[] = $newItem;
				}
			}else if($record[0] == '-'){
				for($i = 0; $i < count($items); ++$i){
					if($items[$i]['id'] == $record[1]){
						fb('delete '.$record[1], 'patch');
						array_splice($items, $i, 1);
						break;
					}
				}
			}
		}
		fclose($fh);
//        fb($items, 'patch');
//        fb(count($items), 'patch');
		return $items;
	}

	private function query($items){
		$keys = array_keys($items[0]);
		$querys = array();
		foreach($keys as $key){
			if(array_key_exists($key, $_REQUEST)){
				$q = $_REQUEST[$key];
				if (strlen($q) && $q[strlen($q)-1]=="*") {
					$q = substr($q, 0, strlen($q)-1);
				}
				$querys[$key] = $q;
			}
		}
		if(count($querys)){
			$ret = array();
			foreach ($items as $item) {
				if($this->match($item, $querys)){
					$ret[] = $item;
				}
			}
			$items = $ret;
		}
//        fb($items, 'query');
//        fb(count($items), 'query');
		return $items;
	}

	private function sort($items){
		$query = $_SERVER['QUERY_STRING'];
		$idx = strpos($query, 'sort(');
		if($idx !== false){
			$query = substr($query, $idx + 5);
			$idx = strpos($query, ')');
			if($idx !== false){
				$query = substr($query, 0, $idx);
				$attrs = explode(',', $query);
				foreach($attrs as $attr){
					$toSort = array();
					$desc = substr($attr, 0, 1) == '-';
					if(substr($attr, 0, 1) == '-' || substr($attr, 0, 1) == '+'){
						$attr = substr($attr, 1);
					}
					foreach ($items as $i) $toSort[$i[$attr]] = $i;
					if($desc){
						krsort($toSort);
					}else{
						ksort($toSort);
					}
					$newRet = array();
					foreach ($toSort as $i) $newRet[] = $i;
					$items = $newRet;
				}
			}
		}
//        fb($items, 'sort');
//        fb(count($items), 'sort');
		return $items;
	}

	private function slice($items){
		if(array_key_exists("HTTP_RANGE", $_SERVER)){
			$range = $_SERVER["HTTP_RANGE"];
			$range = substr($range, 6);
			$range = explode('-', $range);
			$start = (int)$range[0];
			$end = (int)$range[1];
			$parentId = $_REQUEST['parentId'];
			if($parentId){
				$parent = $this->findItem($items, $parentId, 1);
				if($parent){
					$items = $parent['children'];
				}
			}
			$items = array_slice($items, $start);
			if($end > 0){
				$items = array_slice($items, 0, $end + 1);
			}
		}
//        fb($items, 'slice');
//        fb(count($items), 'slice');
		return $items;
	}

	public function addTotalCount($items){
		header("Content-Range: /".count($items));
		return $items;
	}

	//Public-------------------------------------------------------------------------------
	public function get(){
		$items = $this->getItems(0, 'item');
//        fb($items, 'getting');
		return json_encode(
			$this->slice(
				$this->addTotalCount(
					$this->sort(
						$this->query(
							$this->patch($items
							))))));
	}

	public function put(){
		$id = $_SERVER['PATH_INFO'];
		$id = substr($id, 1);
		$contents = file_get_contents('php://input');
		$fh = fopen($this->recordFile, 'a');
		fwrite($fh, '+ '.$id.' '.$contents."\r\n");
		fclose($fh);
//        fb($contents, 'put item');
	}

	public function delete(){
		$id = $_SERVER['PATH_INFO'];
//        fb($_SERVER, 'delete item');
		$id = substr($id, 1);
		$fh = fopen($this->recordFile, 'a');
		fwrite($fh, '- '.$id."\r\n");
		fclose($fh);
	}

	//Util------------------------------------------------------------------------
	public function match($item, $querys){
		foreach(array_keys($querys) as $key){
			if($querys[$key] && strpos(strtolower($item[$key]), strtolower($querys[$key])) === false){
				return false;
			}
		}
		return true;
	}

	public function findItem($items, $id){
		foreach($items as $item){
			if($item['id'] == $id){
				return $item;
			}else{
				$this->findItem($item['children'], $id);
			}
		}
		return false;
	}
}

?>
