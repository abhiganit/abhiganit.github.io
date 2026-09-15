/* Hand-written sets. Everything else on the map comes from the data files.
   Add your own entries here — name, latitude, longitude, one sentence. */

window.JG_ROCKETS = [
["Kennedy Space Center",28.57,-80.65,"Florida, USA. The rockets that went to the Moon launched from here."],
["Johnson Space Center",29.56,-95.09,"Texas, USA. This is Mission Control — the people who talk to the astronauts."],
["Jet Propulsion Laboratory",34.20,-118.17,"California, USA. They build the robots that drive around on Mars."],
["Goddard Space Flight Center",38.99,-76.85,"Maryland, USA. They look after satellites and space telescopes."],
["Marshall Space Flight Center",34.65,-86.68,"Alabama, USA. Rocket engines get designed here."],
["Ames Research Center",37.41,-122.06,"California, USA. Giant wind tunnels for testing things that fly."],
["Wallops Flight Facility",37.94,-75.47,"Virginia, USA. Small rockets and enormous science balloons."],
["Vandenberg Space Force Base",34.74,-120.57,"California, USA. Rockets here launch out over the ocean."],
["Starbase, Boca Chica",25.99,-97.16,"Texas, USA. Where the huge Starship is built and flown."],
["Guiana Space Centre",5.17,-52.68,"French Guiana. Close to the equator, which gives a rocket extra speed."],
["Baikonur Cosmodrome",45.96,63.31,"Kazakhstan. The first person ever to go to space launched from here."],
["Sriharikota",13.72,80.23,"India. ISRO launches from this island. It is India's spaceport."],
["Jiuquan Launch Centre",40.96,100.29,"China. Out in the middle of a big desert."],
["Tanegashima Space Center",30.40,130.97,"Japan. The launch pad sits right beside the sea."],
["Plesetsk Cosmodrome",62.93,40.57,"Russia. Far up north, where it snows a lot."],
["Rocket Lab, Mahia",-39.26,177.86,"New Zealand. Small rockets launched from a sheep farm by the sea."],
["Esrange",67.89,21.10,"Sweden. Inside the Arctic Circle. They launch rockets to study the sky."]
];

window.JG_ANIMALS = [
["Emperor penguin",-75,10,"Antarctica. The fathers keep the egg warm on their feet all winter."],
["Polar bear",78,-45,"The Arctic. They walk on floating ice to hunt."],
["Kangaroo",-25,134,"Australia. The babies ride in a pocket called a pouch."],
["Giant panda",31,103,"China. They eat bamboo nearly all day long."],
["Bengal tiger",22,80,"India. Every tiger's stripes are different, like fingerprints."],
["African elephant",-2,35,"Africa. The biggest animal that walks on land."],
["Gorilla",-1,29,"Central Africa. They build a fresh nest to sleep in every night."],
["Sloth",-4,-62,"The Amazon rainforest. So slow that tiny plants grow on their fur."],
["Camel",22,12,"The Sahara desert. Their humps store fat, not water."],
["Llama",-15,-70,"The Andes mountains. They carry bags up very steep paths."],
["Moose",55,-100,"Canada. Their antlers can be wider than a doorway."],
["Bison",44,-104,"The American plains. They used to roam in enormous herds."],
["Blue whale",-35,-140,"The open ocean. The biggest animal that has ever lived."],
["Kiwi",-42,172,"New Zealand. It cannot fly, and it comes out at night."],
["Reindeer",68,25,"Northern Europe. They can see a kind of light that we cannot."],
["Snow leopard",34,78,"High in the Himalaya. Almost nobody ever sees one."],
["Komodo dragon",-8.6,119.5,"Indonesia. A lizard longer than a grown-up is tall."],
["Orangutan",0.5,113,"Borneo. The name means 'person of the forest'."]
];

window.JG_LANDMARKS = [
["Great Pyramid of Giza",29.98,31.13,"Egypt. Built about 4,500 years ago out of enormous stone blocks."],
["Great Wall of China",40.43,116.57,"China. Long enough to stretch most of the way around the world."],
["Taj Mahal",27.17,78.04,"India. White marble that changes colour as the light changes."],
["Eiffel Tower",48.86,2.29,"France. Made of iron, and it sways a little in the wind."],
["Statue of Liberty",40.69,-74.04,"New York, USA. She is green because her copper skin changed colour."],
["Colosseum",41.89,12.49,"Italy. A huge stadium from the time of the Romans."],
["Machu Picchu",-13.16,-72.55,"Peru. A stone city high in the mountains, often up in the clouds."],
["Sydney Opera House",-33.86,151.21,"Australia. The roof looks like sails on a boat."],
["Christ the Redeemer",-22.95,-43.21,"Brazil. A giant statue standing on a mountain above the city."],
["Stonehenge",51.18,-1.83,"England. Nobody is quite sure how they moved the stones."],
["Angkor Wat",13.41,103.87,"Cambodia. The biggest temple in the world, hidden in a jungle."],
["Petra",30.33,35.44,"Jordan. Buildings carved straight into a pink cliff."],
["Golden Temple",31.62,74.88,"India. It is covered in real gold and sits in the middle of a pool."],
["Moai of Easter Island",-27.12,-109.37,"Chile. Hundreds of huge stone heads looking inland."],
["Hagia Sophia",41.01,28.98,"Turkey. Nearly 1,500 years old, with a dome that seemed impossible."],
["Chichén Itzá",20.68,-88.57,"Mexico. Clap in front of the steps and the echo chirps like a bird."]
];

/* Volcanoes everybody has heard of — these show at the very first zoom level. */
window.JG_VOLC_FAMOUS = ["Vesuvius","Etna","Fuji","Kilauea","Mauna Loa","Krakatau","St. Helens",
"Popocatepetl","Eyjafjallajokull","Pinatubo","Stromboli","Cotopaxi","Taal","Erebus","Santorini",
"Tambora","Rainier","Yellowstone","Ol Doinyo Lengai","Nyiragongo","Merapi","Sakura-jima",
"Hekla","Teide","Ruapehu","Villarrica","Arenal","Katmai","Laki","Thera"];

/* An extra line for places a child is likely to ask about twice. */
window.JG_FACTS = {
 "Mount Everest":"The tallest mountain on Earth. Higher up than a low-flying plane.",
 "K2":"The second tallest, and much harder to climb than the tallest.",
 "Kilimanjaro":"A snowy mountain in hot Africa, with elephants down at the bottom.",
 "Denali":"The tallest in North America, and one of the coldest places to stand.",
 "Aconcagua":"The tallest mountain in all of the Americas.",
 "Mont Blanc":"The white mountain, sitting between France and Italy.",
 "Matterhorn":"Shaped like an enormous pointed tooth.",
 "Fuji":"Japan's famous volcano. Almost a perfect triangle.",
 "Mauna Kea":"Measured from the sea floor up, this is really the tallest of them all.",
 "Vesuvius":"It buried a whole Roman town, and the town is still there to visit.",
 "Kilauea":"One of the busiest volcanoes anywhere. It erupts again and again.",
 "Krakatau":"When it erupted in 1883 the bang was heard thousands of miles away.",
 "Erebus":"A volcano in Antarctica with a lake of molten rock inside it.",
 "Nile":"The longest river in the world, and it flows north, not south.",
 "Amazon":"It carries more water than any other river. Pink dolphins live in it.",
 "Ganges":"A very special river in India. People call it Ganga.",
 "Yangtze":"The longest river in Asia. Giant pandas live in the hills beside it.",
 "Mississippi":"It runs right down the middle of the United States.",
 "Congo":"The deepest river on Earth, through an enormous rainforest.",
 "Danube":"It passes through ten countries and four capital cities.",
 "Colorado":"This is the river that carved the Grand Canyon."
};

/* Rivers labelled at the very first zoom level, and a couple of friendlier names. */
window.JG_RIVERS_TOP = ["Nile","Amazon","Yangtze","Mississippi","Missouri","Congo","Ganges",
"Mekong","Indus","Volga","Danube","Niger","Zambezi","Ob","Lena","Yenisey","Amur","Paraná",
"Murray","Brahmaputra","Yellow","Orinoco","St. Lawrence","Mackenzie","Rhine","Euphrates",
"Colorado","Rio Grande","Nelson","Columbia"];

window.JG_RIVER_RENAME = { "Amazonas":"Amazon", "Huang":"Yellow" };

/* Mountains a child meets first. Names must match the data file exactly. */
window.JG_PEAKS_TOP = ["Mount Everest","K2","Kanchenjunga","Cerro Aconcagua","Denali",
"Mount Kilimanjaro","Gora Elbrus","Vinson Massif","Puncak Jaya","Mont Blanc","Matterhorn",
"Fuji","Mount Whitney","Mount Rainier","Mauna Kea","Aoraki (Mount Cook)","Mount Olympus",
"Mount Kosciuszko","Mount Washington","Nanda Devi","Mount Ararat","Ben Nevis","Monte Etna",
"Mount Kenya","Mont Cameroun","Chimborazo","Mount Erebus","Mount Logan","Gunung Kinabalu",
"Mount Damavand","Pico de Orizaba","Zugspitze","Snowdon","Mount Fitz Roy"];

/* Friendlier names where the data uses a local or formal one. */
window.JG_PEAK_RENAME = { "Cerro Aconcagua":"Aconcagua", "Gora Elbrus":"Mount Elbrus",
  "Monte Etna":"Mount Etna", "Fuji":"Mount Fuji", "Kanchenjunga":"Kangchenjunga",
  "Gunung Kinabalu":"Mount Kinabalu", "Vesuvio":"Vesuvius" };
