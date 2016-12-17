<?php
$lag = 4;
$items = <<<EOF
[
		{"Heard": true, "Progress": 0.5, "Genre":"Easy Listening",	"Artist":"Bette Midler",	"Year":2003,	"Album":"Bette Midler Sings the Rosemary Clooney Songbook",	"Name":"Hey There",	"Length":"03:31",	"Track":4,	"Composer":"Ross, Jerry 1926-1956 -w Adler, Richard 1921-",	"Download Date":"1923/4/9",	"Last Played":"04:32:49",
		
		"children":[{"id":"item-1-1","Heard": false, "Progress": 0.6, "Genre":"Classic Rock",	"Artist":"Jimi Hendrix",	"Year":1993,	"Album":"Are You Experienced",	"Name":"Love Or Confusion",	"Length":"03:15",	"Track":4,	"Composer":"Jimi Hendrix",	"Download Date":"1947/12/6",	"Last Played":"03:47:49"},
		{"id":"item-1-2","Heard": true, "Progress": 0.5, "Genre":"Classical",	"Artist":"Julian Bream",	"Year":1965,	"Album":"Julian Bream Edition, Vol. 20",	"Name":"Bach: Lute Suite In A Minor, BWV 997 - Praeludium",	"Length":"03:06",	"Track":7,	"Composer":"Johann Sebastian Bach",	"Download Date":"2032/12/26",	"Last Played":"07:49:41"},
		{"id":"item-1-3","Heard": true, "Progress": 0.5, "Genre":"Jazz",	"Artist":"Bill Evans",	"Year":1962,	"Album":"Interplay",	"Name":"You And The Night And The Music",	"Length":"07:05",	"Track":1,	"Composer":"Arthur Schwartz/Howard Dietz",	"Download Date":"2032/12/25",	"Last Played":"07:30:00"},
		{"id":"item-1-4","Heard": false, "Progress": 0.9, "Genre":"Classical",	"Artist":"Julian Bream",	"Year":1965,	"Album":"Julian Bream Edition, Vol. 20",	"Name":"Bach: Lute Suite In E Minor, BWV 996 - Sarabande",	"Length":"04:45",	"Track":4,	"Composer":"Johann Sebastian Bach",	"Download Date":"2017/1/6",	"Last Played":"05:54:23"},
		{"id":"item-1-5","Heard": true, "Progress": 0.5, "Genre":"Jazz",	"Artist":"Charlie Hunter",	"Year":2004,	"Album":"Friends Seen and Unseen",	"Name":"One for the Kelpers",	"Length":"06:31",	"Track":1,	"Composer":"John Ellis",	"Download Date":"1988/6/13",	"Last Played":"09:22:30"},
		{"id":"item-1-6","Heard": true, "Progress": 0.5, "Genre":"Easy Listening",	"Artist":"Bette Midler",	"Year":2003,	"Album":"Bette Midler Sings the Rosemary Clooney Songbook",	"Name":"You'll Never Know",	"Length":"01:44",	"Track":1,	"Composer":"Warren, Harry 1893-1981 -w Gordon, Mac 1904-1959",	"Download Date":"1923/10/17",	"Last Played":"14:09:23"}


		]
		},
		{"Heard": true, "Progress": 0.7, "Genre":"Jazz",	"Artist":"Andy Narell",	"Year":1992,	"Album":"Down the Road",	"Name":"Sugar Street",	"Length":"07:00",	"Track":8,	"Composer":"Andy Narell",	"Download Date":"1906/3/22",	"Last Played":"21:56:15"},
		{"Heard": false, "Progress": 0.5, "Genre":"Easy Listening",	"Artist":"Frank Sinatra",	"Year":1991,	"Album":"Sinatra Reprise: The Very Good Years",	"Name":"It Was A Very Good Year",	"Length":"04:29",	"Track":9,	"Composer":"E. Drake",	"Download Date":"1943/9/1",	"Last Played":"15:59:04",


		"children":[{"id":"item-1-1","Heard": false, "Progress": 0.6, "Genre":"Classic Rock",	"Artist":"Jimi Hendrix",	"Year":1993,	"Album":"Are You Experienced",	"Name":"Love Or Confusion",	"Length":"03:15",	"Track":4,	"Composer":"Jimi Hendrix",	"Download Date":"1947/12/6",	"Last Played":"03:47:49"},
		{"id":"item-2-2","Heard": true, "Progress": 0.5, "Genre":"Classical",	"Artist":"Julian Bream",	"Year":1965,	"Album":"Julian Bream Edition, Vol. 20",	"Name":"Bach: Lute Suite In A Minor, BWV 997 - Praeludium",	"Length":"03:06",	"Track":7,	"Composer":"Johann Sebastian Bach",	"Download Date":"2032/12/26",	"Last Played":"07:49:41"},
		{"id":"item-2-3","Heard": true, "Progress": 0.5, "Genre":"Jazz",	"Artist":"Bill Evans",	"Year":1962,	"Album":"Interplay",	"Name":"You And The Night And The Music",	"Length":"07:05",	"Track":1,	"Composer":"Arthur Schwartz/Howard Dietz",	"Download Date":"2032/12/25",	"Last Played":"07:30:00"},
		{"id":"item-2-4","Heard": false, "Progress": 0.9, "Genre":"Classical",	"Artist":"Julian Bream",	"Year":1965,	"Album":"Julian Bream Edition, Vol. 20",	"Name":"Bach: Lute Suite In E Minor, BWV 996 - Sarabande",	"Length":"04:45",	"Track":4,	"Composer":"Johann Sebastian Bach",	"Download Date":"2017/1/6",	"Last Played":"05:54:23"},
		{"id":"item-2-5","Heard": true, "Progress": 0.5, "Genre":"Jazz",	"Artist":"Charlie Hunter",	"Year":2004,	"Album":"Friends Seen and Unseen",	"Name":"One for the Kelpers",	"Length":"06:31",	"Track":1,	"Composer":"John Ellis",	"Download Date":"1988/6/13",	"Last Played":"09:22:30"},
		{"id":"item-2-6","Heard": true, "Progress": 0.5, "Genre":"Easy Listening",	"Artist":"Bette Midler",	"Year":2003,	"Album":"Bette Midler Sings the Rosemary Clooney Songbook",	"Name":"You'll Never Know",	"Length":"01:44",	"Track":1,	"Composer":"Warren, Harry 1893-1981 -w Gordon, Mac 1904-1959",	"Download Date":"1923/10/17",	"Last Played":"14:09:23"}
		]

		},
		{"Heard": true, "Progress": 0.5, "Genre":"Pop and R&B",	"Artist":"Joni Mitchell",	"Year":1974,	"Album":"Court And Spark",	"Name":"Help Me",	"Length":"03:22",	"Track":2,	"Composer":"Joni Mitchell",	"Download Date":"2013/12/5",	"Last Played":"09:59:04"},
		
		{"Heard": true, "Progress": 0.5, "Genre":"Progressive Rock",	"Artist":"Emerson, Lake & Palmer",	"Year":1992,	"Album":"The Atlantic Years",	"Name":"Tank",	"Length":"06:47",	"Track":4,	"Composer":"Carl Palmer/Keith Emerson",	"Download Date":"1996/11/14",	"Last Played":"00:36:34"},
		{"Heard": true, "Progress": 0.5, "Genre":"Classic Rock",	"Artist":"Jimi Hendrix",	"Year":1968,	"Album":"Electric Ladyland",	"Name":"Come On, Pt. 1",	"Length":"04:10",	"Track":7,	"Composer":"Earl King",	"Download Date":"2008/3/1",	"Last Played":"14:48:45"},
		{"Heard": true, "Progress": 0.5, "Genre":"World",	"Artist":"Andy Statman & David Grisman",	"Year":1995,	"Album":"Songs Of Our Fathers",	"Name":"Der Rebbe",	"Length":"03:59",	"Track":9,	"Composer":"Trad.",	"Download Date":"2021/5/21",	"Last Played":"11:45:56"},
		{"Heard": false, "Progress": 0.5, "Genre":"Blues",	"Artist":"B.B. King",	"Year":2005,	"Album":"80",	"Name":"Early in the Morning",	"Length":"04:50",	"Track":1,	"Composer":"",	"Download Date":"2020/1/13",	"Last Played":"08:23:26"},
		{"Heard": true, "Progress": 0.5, "Genre":"Classical",	"Artist":"Julian Bream",	"Year":1992,	"Album":"Nocturnal",	"Name":"Martin: Quatre Pièces Breves - 3. Plainte: Sans Lenteur",	"Length":"02:59",	"Track":3,	"Composer":"Frank Martin",	"Download Date":"1986/5/4",	"Last Played":"20:54:23"},
		{"Heard": true, "Progress": 0.5, "Genre":"Jazz",	"Artist":"Bill Evans",	"Year":1958,	"Album":"Everybody Digs Bill Evans",	"Name":"What Is There to Say?",	"Length":"04:54",	"Track":8,	"Composer":"Duke",	"Download Date":"1900/8/15",	"Last Played":"04:01:53"},
		{"Heard": true, "Progress": 0.5, "Genre":"Jazz",	"Artist":"Andy Narell",	"Year":1989,	"Album":"Little Secrets",	"Name":"Don't Look Back",	"Length":"09:39",	"Track":6,	"Composer":"Andy Narell",	"Download Date":"1907/3/5",	"Last Played":"23:29:04"},
		{"Heard": true, "Progress": 0.5, "Genre":"Progressive Rock",	"Artist":"Dixie dregs",	"Year":1978,	"Album":"What if",	"Name":"What if",	"Length":"05:02",	"Track":3,	"Composer":"Steve Morse",	"Download Date":"1992/3/28",	"Last Played":"00:22:30"},
		{"Heard": true, "Progress": 0.5, "Genre":"Progressive Rock",	"Artist":"Dixie dregs",	"Year":1977,	"Album":"Free Fall",	"Name":"Dig the Ditch",	"Length":"03:51",	"Track":9,	"Composer":"Steven J. Morse",	"Download Date":"1994/10/6",	"Last Played":"18:00:00"},
		{"Heard": true, "Progress": 0.5, "Genre":"Rock",	"Artist":"Dave Matthews",	"Year":1996,	"Album":"Crash",	"Name":"Too Much",	"Length":"04:24",	"Track":4,	"Composer":"Dave Matthews",	"Download Date":"1926/1/4",	"Last Played":"00:02:49"},
		{"Heard": true, "Progress": 0.5, "Genre":"Classic Rock",	"Artist":"Black Sabbath",	"Year":2004,	"Album":"Master of Reality",	"Name":"Into the Void",	"Length":"06:12",	"Track":8,	"Composer":"Bill Ward/Geezer Butler/Ozzy Osbourne/Tony Iommi",	"Download Date":"1938/7/16",	"Last Played":"00:56:15"},
		{"Heard": true, "Progress": 0.5, "Genre":"Easy Listening",	"Artist":"Bette Midler",	"Year":1993,	"Album":"Experience the Divine",	"Name":"From A Distance",	"Length":"04:39",	"Track":3,	"Composer":"Julie Gold",	"Download Date":"2029/2/25",	"Last Played":"21:14:04"},
		{"Heard": true, "Progress": 0.5, "Genre":"Classical",	"Artist":"Julian Bream",	"Year":1957,	"Album":"Fret Works: Dowland & Villa-Lobos",	"Name":"Lachrimae Antiquae Galliard",	"Length":"02:59",	"Track":2,	"Composer":"John Dowland",	"Download Date":"1978/10/15",	"Last Played":"11:54:23"},
		{"Heard": true, "Progress": 0.5, "Genre":"Rock",	"Artist":"Dave Matthews",	"Year":1996,	"Album":"Crash",	"Name":"Let You Down",	"Length":"04:09",	"Track":8,	"Composer":"Dave Matthews",	"Download Date":"1906/1/5",	"Last Played":"20:20:38"},
		{"Heard": true, "Progress": 0.5, "Genre":"Jazz",	"Artist":"Bill Evans",	"Year":1958,	"Album":"Everybody Digs Bill Evans",	"Name":"Night and Day",	"Length":"07:35",	"Track":4,	"Composer":"Cole Porter",	"Download Date":"1953/5/20",	"Last Played":"10:24:23"},
		{"Heard": true, "Progress": 0.5, "Genre":"Classic Rock",	"Artist":"Black Sabbath",	"Year":2004,	"Album":"Black Sabbath",	"Name":"Black Sabbath",	"Length":"06:18",	"Track":1,	"Composer":"Bill Ward/Geezer Butler/Ozzy Osbourne/Tony Iommi",	"Download Date":"1908/7/24",	"Last Played":"16:38:26"},
		{"Heard": true, "Progress": 0.5, "Genre":"Blues",	"Artist":"Buddy Guy",	"Year":1993,	"Album":"Feels Like Rain",	"Name":"She's Nineteen Years Old",	"Length":"05:43",	"Track":4,	"Composer":"Muddy Waters",	"Download Date":"1971/2/24",	"Last Played":"01:01:53"},
		{"Heard": true, "Progress": 0.5, "Genre":"Jazz",	"Artist":"Bill Evans",	"Year":1978,	"Album":"Affinity",	"Name":"The Days of Wine and Roses",	"Length":"06:43",	"Track":4,	"Composer":"Henry Mancini, Johnny Mercer",	"Download Date":"1955/2/12",	"Last Played":"01:49:41"},
		{"Heard": true, "Progress": 0.5, "Genre":"Progressive Rock",	"Artist":"Emerson, Lake & Palmer",	"Year":"",	"Album":"The Atlantic Years",	"Name":"The Endless Enigma (Part 1)",	"Length":"06:41",	"Track":7,	"Composer":"",	"Download Date":"1961/12/22",	"Last Played":"23:40:19"},
		{"Heard": false, "Progress": 0.5, "Genre":"Easy Listening",	"Artist":"Frank Sinatra",	"Year":1991,	"Album":"Sinatra Reprise: The Very Good Years",	"Name":"It Was A Very Good Year",	"Length":"04:29",	"Track":9,	"Composer":"E. Drake",	"Download Date":"1943/9/1",	"Last Played":"15:59:04"},
		{"Heard": true, "Progress": 0.5, "Genre":"Pop and R&B",	"Artist":"Joni Mitchell",	"Year":1974,	"Album":"Court And Spark",	"Name":"Help Me",	"Length":"03:22",	"Track":2,	"Composer":"Joni Mitchell",	"Download Date":"2013/12/5",	"Last Played":"09:59:04"},
		{"Heard": true, "Progress": 0.5, "Genre":"Classical",	"Artist":"Julian Bream",	"Year":1965,	"Album":"Julian Bream Edition, Vol. 20",	"Name":"Bach: Lute Suite In A Minor, BWV 997 - Praeludium",	"Length":"03:06",	"Track":7,	"Composer":"Johann Sebastian Bach",	"Download Date":"2032/12/26",	"Last Played":"07:49:41"},
		{"Heard": true, "Progress": 0.5, "Genre":"Jazz",	"Artist":"Bill Evans",	"Year":1962,	"Album":"Interplay",	"Name":"You And The Night And The Music",	"Length":"07:05",	"Track":1,	"Composer":"Arthur Schwartz/Howard Dietz",	"Download Date":"2032/12/25",	"Last Played":"07:30:00"},
		{"Heard": false, "Progress": 0.9, "Genre":"Classical",	"Artist":"Julian Bream",	"Year":1965,	"Album":"Julian Bream Edition, Vol. 20",	"Name":"Bach: Lute Suite In E Minor, BWV 996 - Sarabande",	"Length":"04:45",	"Track":4,	"Composer":"Johann Sebastian Bach",	"Download Date":"2017/1/6",	"Last Played":"05:54:23"},
		{"Heard": true, "Progress": 0.5, "Genre":"Jazz",	"Artist":"Charlie Hunter",	"Year":2004,	"Album":"Friends Seen and Unseen",	"Name":"One for the Kelpers",	"Length":"06:31",	"Track":1,	"Composer":"John Ellis",	"Download Date":"1988/6/13",	"Last Played":"09:22:30"},
		{"Heard": true, "Progress": 0.5, "Genre":"Easy Listening",	"Artist":"Bette Midler",	"Year":2003,	"Album":"Bette Midler Sings the Rosemary Clooney Songbook",	"Name":"You'll Never Know",	"Length":"01:44",	"Track":1,	"Composer":"Warren, Harry 1893-1981 -w Gordon, Mac 1904-1959",	"Download Date":"1923/10/17",	"Last Played":"14:09:23"},
		{"Heard": true, "Progress": 0.5, "Genre":"Progressive Rock",	"Artist":"Emerson, Lake & Palmer",	"Year":1992,	"Album":"The Atlantic Years",	"Name":"Tank",	"Length":"06:47",	"Track":4,	"Composer":"Carl Palmer/Keith Emerson",	"Download Date":"1996/11/14",	"Last Played":"00:36:34"},
		{"Heard": true, "Progress": 0.5, "Genre":"Classic Rock",	"Artist":"Jimi Hendrix",	"Year":1968,	"Album":"Electric Ladyland",	"Name":"Come On, Pt. 1",	"Length":"04:10",	"Track":7,	"Composer":"Earl King",	"Download Date":"2008/3/1",	"Last Played":"14:48:45"},
		{"Heard": true, "Progress": 0.5, "Genre":"World",	"Artist":"Andy Statman & David Grisman",	"Year":1995,	"Album":"Songs Of Our Fathers",	"Name":"Der Rebbe",	"Length":"03:59",	"Track":9,	"Composer":"Trad.",	"Download Date":"2021/5/21",	"Last Played":"11:45:56"},
		{"Heard": false, "Progress": 0.5, "Genre":"Blues",	"Artist":"B.B. King",	"Year":2005,	"Album":"80",	"Name":"Early in the Morning",	"Length":"04:50",	"Track":1,	"Composer":"",	"Download Date":"2020/1/13",	"Last Played":"08:23:26"},
		{"Heard": true, "Progress": 0.5, "Genre":"Classical",	"Artist":"Julian Bream",	"Year":1992,	"Album":"Nocturnal",	"Name":"Martin: Quatre Pièces Breves - 3. Plainte: Sans Lenteur",	"Length":"02:59",	"Track":3,	"Composer":"Frank Martin",	"Download Date":"1986/5/4",	"Last Played":"20:54:23"},
		{"Heard": true, "Progress": 0.5, "Genre":"Jazz",	"Artist":"Bill Evans",	"Year":1958,	"Album":"Everybody Digs Bill Evans",	"Name":"What Is There to Say?",	"Length":"04:54",	"Track":8,	"Composer":"Duke",	"Download Date":"1900/8/15",	"Last Played":"04:01:53"},
		{"Heard": true, "Progress": 0.5, "Genre":"Jazz",	"Artist":"Andy Narell",	"Year":1989,	"Album":"Little Secrets",	"Name":"Don't Look Back",	"Length":"09:39",	"Track":6,	"Composer":"Andy Narell",	"Download Date":"1907/3/5",	"Last Played":"23:29:04"},
		{"Heard": true, "Progress": 0.5, "Genre":"Progressive Rock",	"Artist":"Dixie dregs",	"Year":1978,	"Album":"What if",	"Name":"What if",	"Length":"05:02",	"Track":3,	"Composer":"Steve Morse",	"Download Date":"1992/3/28",	"Last Played":"00:22:30"}
		
		
	]
EOF;

function boolToStr($a){
	if($a === TRUE){
		$a = 'true';	
	}
	if($a === FALSE){
		$a = 'fasle';
	}
	return $a;
}

function column($field){
	$obj = $GLOBALS['currentItem'];
	return $obj->$field;
}

function contain($a, $b){
	$a = boolToStr($a);
	return stripos($a, $b) !== FALSE;
}

function logicand(){
	$args = func_get_args();
	$bool = true;
	foreach($args as $arg){
		$bool &= $arg;
	}
	return $bool;
}

function logicor(){
	$args = func_get_args();
	$bool = false;
	foreach($args as $arg){
		$bool |= $arg;
	}
	return $bool;
}

function isEmpty($a){
	return $a === '' || $a === null;
}

function not($a){
	return !$a;
}

function equal($a, $b){
	// echo $a . '  ' . $b . '<br>';
	// return strtolower($a) === strtolower($b);
	// $a = 
	$a = boolToStr($a);
	return strtolower($a) === strtolower($b);
}

function greater($a, $b){
	return $a > $b;
}

function less($a, $b){
	return $a < $b;
}

function greaterEqual($a, $b){
	return $a >= $b;
}

function lessEqual($a, $b){
	return $a <= $b;
}

function startWith($a, $b){
	$a = boolToStr($a);
	return stripos($a, $b) === 0;
}

function endWith($a, $b){
	// if(preg_match($a, $b)){
		//echo 'match is:' . $a . '<br>';
	// }
	$a = boolToStr($a);
	return preg_match("/{$b}$/", $a);
}

function output($data, $isFilter = false){
	// header("Content-Range: /" . count($GLOBALS['data']));
	// header("Content-Range:" . 'items 0-' . count($data) . '/' . count($GLOBALS['data']));
	// sleep($GLOBALS['lag']);
	if($isFilter){
		header("Content-Range: " . $GLOBALS['totalCount'] . "/" . count($data));
	}else{
		header("Content-Range: /" . count($data));
	}
	header("Content-Type:" . "application/json"); 
	
	$data = slice($data);
	echo json_encode($data);
}


function slice($data){
	$range = $_SERVER['HTTP_RANGE'];
	// var_dump($range);
	$range = substr($range, 6);
	$pairs = explode('-', $range);
	$start = intval($pairs[0]);
	$end = intval($pairs[1]);
	
	$a = array();
	for($i = $start; $i <= $end; $i++){
		if(array_key_exists($i, $data)){
			$a[] = $data[$i];
		}
	}
	return $a;
}

sleep($lag);
$data = json_decode($items);
$totalCount = count($data);

$currentItem = null;
$field;
// header("Content-Type: " . ($_SERVER["CONTENT_TYPE"] == 'application/json' ? 'application/json' : 'text/plain'));
// header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);

$i = 0;
foreach($data as $item){
	$item->id = $i++;
}
// echo json_encode($data);

if($_SERVER['REQUEST_METHOD'] == 'GET'){
	$query = $_SERVER['QUERY_STRING'];
	if(isset($query) && !empty($query)){
		
		//main filter function entry
		if(isset($_GET['query'])){
				$query = $_GET['query'];
			
				if(empty($query)){
					$array = $data;
				}else{
					$array = array();
					$interval = 25200000;
					foreach ($data as $item) {
						$currentItem = $item;

						$currentItem -> {"Last Played"} = strtotime($currentItem->{"Last Played"}." 1 January 2000")*1000 - $interval;
						$currentItem -> {"Download Date"} = strtotime($currentItem->{"Download Date"})*1000;

						$query = "\$bool = " . $query;
						eval($query);

						$currentItem -> {"Last Played"} = strftime("%X", ($currentItem->{"Last Played"} + $interval)/1000);
						$currentItem->{"Download Date"} = strftime("%Y/%m/%d", $currentItem->{"Download Date"}/1000);

						if($bool){
							$array[] = $item;
						}
					}
				}
				// echo json_encode($array);
				output($array, 1);
			
		}else{		//search
			preg_match('/^(\w*)=\*?(\w*)\*&sort\((\+|-)(\w*)\)$/', $query, $matches);
			if(!empty($matches)){
				
				$field = $matches[1];
				$key = $matches[2];
				$sort = $matches[3];
				$sortField = $matches[4];
				$array = array();
				
				if(!empty($key)){
					foreach($data as $item){
						$v = $item->$field;
						// echo '<br> value is: ' . $v;
						if(strpos($v, $key) !== FALSE){
							$array[] = $item;
						}
					}
				}else{
					$array = $data;
				}
				
				if(!empty($sortField)){
				}
				
				function cmpAsc($a, $b){
					if ($a->$GLOBALS['field'] == $b->$GLOBALS['field']) {
						return 0;
					}
					return ($a->$GLOBALS['field'] < $b->$GLOBALS['field']) ? -1 : 1;
				}
				
				function cmpDesc($a, $b){
					if ($a->$GLOBALS['field'] == $b->$GLOBALS['field']) {
						return 0;
					}
					return ($a->$GLOBALS['field'] > $b->$GLOBALS['field']) ? -1 : 1;
				}
				if($sort == '+'){
					usort($array, 'cmpAsc');
				}else{
					usort($array, 'cmpDesc');
				}
				// echo json_encode($array);
				output($array);
				
			}
		}
	}else{
		// echo json_encode($data);
		output($data);
		
	}
}
// 

?>