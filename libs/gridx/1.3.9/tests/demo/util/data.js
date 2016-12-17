define([], function(){
	var genres = ["Easy Listening", "Classic Rock", "Jazz", "Progressive Rock", "Rock", "Blues", "World", "Classical", "Pop and R&B"];
	var artists = [ "Bette Midler" , "Jimi Hendrix" , "Andy Narell" , "Emerson, Lake & Palmer" , "Blood, Sweat & Tears" , "Frank Sinatra" , "Dixie dregs" , "Black Sabbath" , "Buddy Guy" , "Andy Statman & David Grisman" , "Andres Segovia" , "Joni Mitchell" , "Julian Bream" , "Dave Matthews" , "Charlie Hunter" , "Bill Evans" , "Andy Statman Quartet" , "B.B. King" ];
	var albums = [ "Bette Midler Sings the Rosemary Clooney Songbook" , "Are You Experienced" , "Down the Road" , "The Atlantic Years" , "Child Is Father To The Man" , "Little Secrets" , "Sinatra Reprise: The Very Good Years" , "Free Fall" , "Master of Reality" , "Damn Right, I've Got The Blues" , "Songs Of Our Fathers" , "Electric Ladyland" , "The Best Of Andres Segovia" , "Both Sides Now" , "Court And Spark" , "Sinatra and Swinging Brass" , "Fret Works: Dowland & Villa-Lobos" , "Before These Crowded Streets" , "Friends Seen and Unseen" , "Everybody Digs Bill Evans" , "Nocturnal" , "The Art Of Segovia [Disc 1]" , "Between Heaven & Earth" , "80" , "Crash" , "What if" , "Deuces Wild" , "Interplay" , "Feels Like Rain" , "Affinity" , "Experience the Divine" , "Blood, Sweat & Tears" , "Brain Salad Surgery [Rhino]" , "The Capitol Years [Disc 1]" , "Black Sabbath" , "Julian Bream Edition, Vol. 20" ];
	var names = [ "Hey There" , "Love Or Confusion" , "Sugar Street" , "Tarkus" , "Somethin' Goin' On" , "Armchair Psychology" , "Luck Be A Lady" , "Sleep" , "Sweet Leaf" , "Five Long Years" , "The Way You Look Tonight" , "Chassidic Medley: Adir Hu / Moshe Emes" , "Long Hot Summer Night" , "Asturias (Suite Espanola, Op. 47)" , "We Kinda Music" , "Comes Love" , "Court And Spark" , "Serenade in Blue" , "Queen Elizabeth's Galliard" , "Free Fall" , "After Forever" , "The Wind Cries Mary" , "Don't Drink the Water" , "Eleven Bars for Gandhi" , "L'Ma'an Achai V'Re'ei" , "Minority" , "Britten: Nocturnal - 1. Musingly (Meditativo)" , "Tarrega: Recuerdos de la Alhambra" , "Overture" , "Tzamah Nafshi" , "The Thrill Is Gone" , "Stay (Wasting Time)" , "Answer Me My Love" , "Two Step" , "Little Kids" , "Come On-A My House" , "King of Denmark's Galliard" , "Recuerdos De La Alhambra" , "Voodoo Chile" , "Fantasia" , "There Must Be A Better World Somewhere" , "Green Ballet: 2nd Position for Steel Orchestra" , "I'll Never Smile Again (Take 7)" , "I Go Crazy" , "The Other Side of Midnight (Noelle's Theme)" , "...And the Gods Made Love" , "At Last" , "Miss Ottis Regrets" , "Change in the Weather" , "This Ole House" , "Holiday" , "Smiling Phases" , "Disorderly Conduct" , "Purple Haze" , "Green Ballet: 1st Position for Steel Orchestra" , "Just One Smile" , "More And More" , "Have You Ever Been (To Electric Ladyland)" , "I Love You More Than You'll Ever Know" , "Rock Me Baby" , "Sufferin' Mind" , "You're My Thrill" , "Chapel Of Love" , "Hummingbird" , "Jerusalem" , "Fanfare For The Common Man" , "Wrap Your Troubles In D...eam Your Troubles Away)" , "Bouree (Suite In E Minor, BWV 996 - Bach)" , "Crash Into Me" , "Someone To Watch Over Me" , "The Last Stop" , "Crosstown Traffic" , "I Do It For Your Love" , "Dovid Melech Yisrael" , "Dig the Ditch" , "Too Much" , "Into the Void" , "From A Distance" , "Lachrimae Antiquae Galliard" , "Let You Down" , "Night and Day" , "Black Sabbath" , "She's Nineteen Years Old" , "The Days of Wine and Roses" , "The Endless Enigma (Part 1)" , "It Was A Very Good Year" , "Help Me" , "Bach: Lute Suite In A Minor, BWV 997 - Praeludium" , "You And The Night And The Music" , "Bach: Lute Suite In E Minor, BWV 996 - Sarabande" , "One for the Kelpers" , "You'll Never Know" , "Tank" , "Come On, Pt. 1" , "Der Rebbe" , "Early in the Morning" , "Martin: Quatre Pièces B.... Plainte: Sans Lenteur" , "What Is There to Say?" , "Don't Look Back" , "What if" ];
	var composers = [ "Ross, Jerry 1926-1956 -w Adler, Richard 1921-" , "Jimi Hendrix" , "Andy Narell" , "Greg Lake/Keith Emerson" , "" , "F. Loesser" , "Steve Morse" , "Bill Ward/Geezer Butler/Ozzy Osbourne/Tony Iommi" , "Eddie Boyd/John Lee Hooker" , "D. Fields/J. Kern" , "Shlomo Carlebach; Trad." , "Isaac Albeniz" , "Charles Tobias/Sammy Stept/Lew Brown" , "Joni Mitchell" , "Harry Warren, Mack Gordon" , "John Dowland" , "Tony Iommi" , "Beauford, Carter/Matthews, David J." , "Charlie Hunter" , "Shlomo Carlebach" , "Gigi Gryce" , "Benjamin Britten" , "Francisco Tarrega" , "Karlin-Stolin" , "Lessard, Stefan/Beauford, Carter/Moore, Leroi" , "Carl Sigman/Gerhard Winkler/Fred Rauch" , "Dave Matthews" , "Saroyan, William 1908-1...asarian, Ross 1919-1972" , "Rebennack/Pomus" , "Vince Mendoza" , "Ruth Lowe" , "James Brown" , "Michel Legrand" , "Mack Gordon/Harry Warren" , "Cole Porter" , "John Fogerty" , "Hamblen, Stuart 1908-1989" , "Steven J. Morse" , "Jim Capaldi, Steve Winwood, Chris Wood" , "Don Juan, Pea Vee" , "B.B. King/Joe Josea" , "E. Jones" , "Jay Gorney/Sindney Clare" , "Ellie Greenwich/Jeff Barry/Phil Spector" , "Charles Hubert Hastings Parry/William Blake" , "Billy Moll/Harry Barris/Ted Koehler" , "Johann Sebastian Bach (1685-1750)" , "George & Ira Gershwin/George Gershwin" , "Lessard, Stefan/Beauford, Carter" , "Paul Simon" , "Julie Gold" , "Muddy Waters" , "Henry Mancini, Johnny Mercer" , "E. Drake" , "Johann Sebastian Bach" , "Arthur Schwartz/Howard Dietz" , "John Ellis" , "Warren, Harry 1893-1981 -w Gordon, Mac 1904-1959" , "Carl Palmer/Keith Emerson" , "Earl King" , "Trad." , "Frank Martin" , "Duke" ];
	var lengths = [ "03:31" , "03:15" , "07:00" , "20:40" , "08:00" , "08:20" , "05:16" , "01:58" , "05:04" , "08:27" , "03:23" , "04:14" , "03:27" , "06:25" , "08:22" , "04:29" , "02:46" , "03:00" , "01:33" , "04:41" , "05:26" , "07:01" , "06:57" , "05:56" , "05:22" , "02:14" , "01:32" , "05:03" , "05:35" , "03:24" , "06:29" , "02:07" , "01:50" , "01:15" , "05:12" , "14:59" , "05:02" , "04:51" , "03:41" , "06:33" , "02:26" , "01:23" , "04:28" , "02:40" , "04:38" , "03:03" , "05:11" , "06:40" , "02:53" , "02:16" , "03:04" , "02:10" , "05:57" , "06:38" , "03:33" , "03:52" , "02:54" , "04:42" , "02:44" , "05:41" , "06:21" , "05:18" , "02:57" , "06:58" , "07:23" , "03:51" , "04:24" , "06:12" , "04:39" , "02:59" , "04:09" , "07:35" , "06:18" , "05:43" , "06:43" , "06:41" , "03:22" , "03:06" , "07:05" , "04:45" , "06:31" , "01:44" , "06:47" , "04:10" , "03:59" , "04:50" , "04:54" , "09:39" ];

	var seed = 9973;
	var randomNumber = function(range){
		var a = 8887;
		var c = 9643;
		var m = 8677;
		seed = (a * seed + c) % m;
		var res = Math.floor(seed / m * range);
		return res;
	};

	function pick(arr){
		return arr[randomNumber(arr.length)];
	}

	var generateItem = function(parentId, index){
		return {
			id: parentId + "-" + (index + 1),
			order: index + 1,
			genre: pick(genres),
			artist: pick(artists),
			album: pick(albums),
			name: pick(names),
			composer: pick(composers),
			length: pick(lengths),
			year: randomNumber(60) + 1950,
			progress: randomNumber(100) / 100,
			heard: pick([true, false])
		};
	};

	var generateLevel = function(parentId, level, size, maxLevel, maxChildrenCount){
		var i, item, res = [];
		var childrenCount = level == 1 ? size : randomNumber(maxChildrenCount);
		for(i = 0; i < childrenCount; ++i){
			item = generateItem(parentId, i);
			res.push(item);
			if(level < maxLevel){
				item.children = generateLevel(item.id, level + 1, size, maxLevel, maxChildrenCount);
			}
		}
		return res;
	};

	var getData = function(size, maxLevel, maxChildrenCount){
		size = size === undefined ? 100 : size;
		maxLevel = maxLevel || 1;
		maxChildrenCount = maxChildrenCount || 10;
		var data = {
			identifier: 'id', 
			label: 'id', 
			items: generateLevel('item', 1, size, maxLevel, maxChildrenCount)
		};
		return data;
	};
	getData.fields = ['id', 'order', 'genre', 'artist', 'album', 'name', 'composer', 'length', 'year', 'progress', 'heard'];
	return getData;
});
