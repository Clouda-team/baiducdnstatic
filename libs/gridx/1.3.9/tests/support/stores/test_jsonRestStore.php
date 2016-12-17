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
			$fh = fopen('test_jsonRestStore.txt', 'w');
			if(array_key_exists('totalsize', $_REQUEST)){
				fwrite($fh, (int)$_REQUEST['totalsize']."\r\n");
			}
			fclose($fh);
			break;
	}

	function compare($a, $b){
		if($a[0] == $b[0]){
			return 0;
		}else{
			return $a[0] < $b[0] ? -1 : 1;
		}
	}

class JsonRestStore{
	public $totalCount = 100;

	public $jsonArray = array(
		"identifier"=>"id",
	);

	function __construct(){
		$fh = fopen('test_jsonRestStore.txt', 'r');
		$str = fgets($fh);
		if($str){
			$this->totalCount = (int)$str;
		}
		$this->chars = explode(',', $this->chars);
		fclose($fh);
	}

	//PipeLine----------------------------------------------------------------------------
	private $chars = "0,1,2,3, ,4,5,6,7, ,8,9,a,b, ,c,d,e,f, ,g,h,i,j, ,k,l,m,n, ,k,o,p,q, ,r,s,t,u, ,v,w,x,y, ,z";
	private $seed = 9973;

	private function getNumber($r){
		$a = 8887;
		$c = 9643;
		$m = 8677;
		$this->seed = ($a * $this->seed + $c) % $m;
		$res = floor($this->seed / $m * $r);
		return $res;
	}

	private function getString(){
		$len = $this->getNumber(50);
		$sb = array();
		$cnt = count($this->chars);
		for($i = 0; $i < $len; ++$i){
			$sb[] = $this->chars[$this->getNumber($cnt)];
		}
		return implode($sb);
	}

	private function getRow($index){
		return array(
			"id" => $index + 1,
//            "number" => $this->totalCount - $index
			"number" => $this->getNumber($this->totalCount + 1),
			"string" => $this->getString(),
			"order" => $index + 1
		);
	}

	private function getItems(){
		$items = array();
		for($i = 0; $i < $this->totalCount; ++$i){
			$items[] = $this->getRow($i);
		}
//        fb($items, 'getItems');
//        fb(count($items), 'getItems');
		return $items;
	}

	private function query($items){
		if(count($items) > 0){
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
		}
		return $items;
	}

	private function patch($items){
		$fh = fopen('test_jsonRestStore.txt', 'r');
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

	private function sort($items){
		$query = $_SERVER['QUERY_STRING'];
		$idx = strpos($query, 'sort(');
		if($idx !== false){
			$query = substr($query, $idx + 5);
			$idx = strpos($query, ')');
			if($idx !== false){
				$toSort = array();
				$dict = array();
				$query = substr($query, 0, $idx);
				$attrs = explode(',', $query);
				$cols = array();
				$args = array();
				foreach($items as $item){
					$dict[$item['id']] = $item;
				}
				foreach($attrs as $attr){
					$desc = substr($attr, 0, 1) == '-';
					if($desc || substr($attr, 0, 1) == '+'){
						$attr = substr($attr, 1);
					}
					$cols[] = $attr;
					$a = 'attrname'.$attr;
					$$a = array();
					foreach($items as $item){
						array_push($$a, $item[$attr]);
					}
					$toSort[] = &$$a;
					$args[] = &$$a;
					$args[] = $desc ? SORT_DESC : SORT_ASC;
					$args[] = $attr == 'string' ? SORT_STRING : SORT_NUMERIC;
				}
				if(!in_array('id', $cols)){
					$cols[] = 'id';
					$arr = array();
					foreach($items as $item){
						$arr[] = $item['id'];
					}
					$toSort[] = &$arr;
					$args[] = &$arr;
					$args[] = SORT_ASC;
					$args[] = SORT_NUMERIC;
				}
				call_user_func_array('array_multisort', $args);
				$result = array();
				foreach($toSort[array_search('id', $cols)] as $i){
					$result[] = $dict[$i];
				}
				$items = $result;
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
			$items = array_slice($items, $start);
			if($end > 0){
				$items = array_slice($items, 0, $end + 1 - $start);
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
		return json_encode($this->slice($this->addTotalCount($this->sort($this->query($this->patch($this->getItems()))))));
	}

	public function put(){
		$id = $_SERVER['PATH_INFO'];
		$id = substr($id, 1);
		$contents = file_get_contents('php://input');
		$fh = fopen('test_jsonRestStore.txt', 'a');
		fwrite($fh, '+ '.$id.' '.$contents."\r\n");
		fclose($fh);
//        fb($contents, 'put item');
	}

	public function delete(){
		$id = $_SERVER['PATH_INFO'];
//        fb($_SERVER, 'delete item');
		$id = substr($id, 1);
		$fh = fopen('test_jsonRestStore.txt', 'a');
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
}
?>
