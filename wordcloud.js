var text1 = "two two seven seven seven seven seven seven seven three three three eight eight eight eight eight eight eight eight five five five five five four four four four nine nine nine nine nine nine nine nine nine one ten ten ten ten ten ten ten ten ten ten six six six six six six",
	text2 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ac condimentum tortor. Maecenas porta id tortor dapibus ultrices. Pellentesque a ligula sapien. Nam scelerisque dictum metus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nec quam vitae lacus pharetra lobortis at in est. Cras semper massa et fringilla vehicula. Nunc eros metus, ultrices nec commodo ut, lacinia ac enim. Sed cursus mattis sapien et sodales. Aliquam pulvinar nec sem vel elementum. Integer non lectus varius, viverra lacus non, pulvinar tellus.",
	words = sortByFrequency( text2.split(/[ ,.]+/) )
		.map(function(d,i) {
			//console.log(d);
        	return {text: d, size: -i};
        });

var fontName = "Impact",
	cWidth = 720,
	cHeight = 400,
	svg,
	wCloud,
	bbox,
	ctm,
	bScale,
	bWidth,
	bHeight,
	bMidX,
	bMidY,
	bDeltaX,
	bDeltaY;

var cTemp = document.createElement('canvas'),
	ctx = cTemp.getContext('2d');
	ctx.font = "100px " + fontName;

var fRatio = Math.min(cWidth, cHeight) / ctx.measureText(words[0].text).width,
	fontScale = d3.scale.linear()
		.domain([
			d3.min(words, function(d) { return d.size; }), 
			d3.max(words, function(d) { return d.size; })
		])
		//.range([20,120]),
		.range([20,100*fRatio/2]), // tbc
	fill = d3.scale.category20();

d3.layout.cloud()
	.size([cWidth, cHeight])
	.words(words)
	//.padding(2) // controls
	.rotate(function() { return ~~(Math.random() * 2) * 90; })
	.font(fontName)
	.fontSize(function(d) { return fontScale(d.size) })
	.on("end", draw)
	.start();

function draw(words, bounds) {
	// move and scale cloud bounds to canvas
	// bounds = [{x0, y0}, {x1, y1}]
	bWidth = bounds[1].x - bounds[0].x;
	bHeight = bounds[1].y - bounds[0].y;
	bMidX = bounds[0].x + bWidth/2;
	bMidY = bounds[0].y + bHeight/2;
	bDeltaX = cWidth/2 - bounds[0].x + bWidth/2;
	bDeltaY = cHeight/2 - bounds[0].y + bHeight/2;
	bScale = bounds ? Math.min( cWidth / bWidth, cHeight / bHeight) : 1;
	
	console.log(
		"bounds (" + bounds[0].x + 
		", " + bounds[0].y + 
		", " + bounds[1].x + 
		", " + bounds[1].y + 
		"), width " + bWidth +
		", height " + bHeight +
		", mid (" + bMidX +
		", " + bMidY +
		"), delta (" + bDeltaX +
		", " + bDeltaY +
		"), scale " + bScale
	);
	
	// the library's bounds seem not to correspond to reality?
	// try using .getBBox() instead?
	
	svg = d3.select(".cloud").append("svg")
		.attr("width", cWidth)
		.attr("height", cHeight);
	
	wCloud = svg.append("g")
		//.attr("transform", "translate(" + [bDeltaX, bDeltaY] + ") scale(" + 1 + ")") // nah!
		.attr("transform", "translate(" + [bWidth>>1, bHeight>>1] + ") scale(" + bScale + ")") // nah!
		.selectAll("text")
		.data(words)
		.enter().append("text")
		.style("font-size", function(d) { return d.size + "px"; })
		.style("font-family", fontName)
		.style("fill", function(d, i) { return fill(i); })
		.attr("text-anchor", "middle")
		.transition()
		.duration(500)
		.attr("transform", function(d) {
			return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
		})
		.text(function(d) { return d.text; });
	
	// TO DO: function to find min and max x,y of all words
	// and use it as the group's bbox
	// then do the transformation
	bbox = wCloud.node(0).getBBox();
	//ctm = wCloud.node().getCTM();
	console.log(
		"bbox (x: " + bbox.x + 
		", y: " + bbox.y + 
		", w: " + bbox.width + 
		", h: " + bbox.height + 
		")"
	);
	
};

function sortByFrequency(arr) {
	var f = {};
	arr.forEach(function(i) { f[i] = 0; });
	var u = arr.filter(function(i) { return ++f[i] == 1; });
	return u.sort(function(a, b) { return f[b] - f[a]; });
}







// const words = [
//     { key: "word", value: 10 },
//     { key: "words", value: 8 },
//     { key: "sprite", value: 7 },
//     { key: "placed", value: 5 },
//     { key: "layout", value: 4 },
//     { key: "algorithm", value: 4 },
//     { key: "area", value: 4 },
//     { key: "without", value: 3 },
//     { key: "step", value: 3 },
//     { key: "bounding", value: 3 },
//     { key: "retrieve", value: 3 },
//     { key: "operation", value: 3 },
//     { key: "collision", value: 3 },
//     { key: "candidate", value: 3 },
//     { key: "32", value: 2 },
//     { key: "placement", value: 2 },
//     { key: "time", value: 2 },
//     { key: "possible", value: 2 },
//     { key: "even", value: 2 },
//     { key: "simple", value: 2 },
//     { key: "starting", value: 2 },
//     { key: "previously", value: 2 },
//     { key: "move", value: 2 },
//     { key: "perform", value: 2 },
//     { key: "hierarchical", value: 2 },
//     { key: "draw", value: 2 },
//     { key: "pixel", value: 2 },
//     { key: "data", value: 2 },
//     { key: "separately", value: 2 },
//     { key: "expensive", value: 2 },
//     { key: "pixels", value: 2 },
//     { key: "masks", value: 2 },
//     { key: "implementation", value: 2 },
//     { key: "detection", value: 2 },
//     { key: "larger", value: 2 },
//     { key: "whole", value: 2 },
//     { key: "comparing", value: 2 },
//     { key: "box", value: 2 },
//     { key: "large", value: 2 },
//     { key: "think", value: 2 },
//     { key: "version", value: 2 },
//     { key: "single", value: 2 },
//     { key: "tree", value: 2 },
//     { key: "Cloud", value: 1 },
//     { key: "Generator", value: 1 },
//     { key: "Works", value: 1 },
//     { key: "positioning", value: 1 },
//     { key: "overlap", value: 1 },
//     { key: "available", value: 1 },
//     { key: "GitHub", value: 1 },
//     { key: "open", value: 1 },
//     { key: "source", value: 1 },
//     { key: "license", value: 1 },
//     { key: "d3cloud", value: 1 },
//     { key: "Note", value: 1 },
//     { key: "code", value: 1 },
//     { key: "converting", value: 1 },
//     { key: "text", value: 1 },
//     { key: "rendering", value: 1 },
//     { key: "final", value: 1 },
//     { key: "output", value: 1 },
//     { key: "requires", value: 1 },
//     { key: "additional", value: 1 },
//     { key: "development", value: 1 },
//     { key: "quite", value: 1 },
//     { key: "slow", value: 1 },
//     { key: "hundred", value: 1 },
//     { key: "run", value: 1 },
//     { key: "asynchronously", value: 1 },
//     { key: "configurable", value: 1 },
//     { key: "size", value: 1 },
//     { key: "makes", value: 1 },
//     { key: "animate", value: 1 },
//     { key: "stuttering", value: 1 },
//     { key: "recommended", value: 1 },
//     { key: "always", value: 1 },
//     { key: "use", value: 1 },
//     { key: "animations", value: 1 },
//     { key: "prevents", value: 1 },
//     { key: "browsers", value: 1 },
//     { key: "event", value: 1 },
//     { key: "loop", value: 1 },
//     { key: "blocking", value: 1 },
//     { key: "placing", value: 1 },
//     { key: "incredibly", value: 1 },
//     { key: "important", value: 1 },
//     { key: "Attempt", value: 1 },
//     { key: "place", value: 1 },
//     { key: "point", value: 1 },
//     { key: "usually", value: 1 },
//     { key: "near", value: 1 },
//     { key: "middle", value: 1 },
//     { key: "somewhere", value: 1 },
//     { key: "central", value: 1 },
//     { key: "horizontal", value: 1 },
//     { key: "line", value: 1 },
//     { key: "intersects", value: 1 },
//     { key: "one", value: 1 },
//     { key: "along", value: 1 },
//     { key: "increasing", value: 1 },
//     { key: "spiral", value: 1 },
//     { key: "Repeat", value: 1 },
//     { key: "intersections", value: 1 },
//     { key: "found", value: 1 },
//     { key: "hard", value: 1 },
//     { key: "part", value: 1 },
//     { key: "making", value: 1 },
//     { key: "efficiently", value: 1 },
//     { key: "According", value: 1 },
//     { key: "Jonathan", value: 1 },
//     { key: "Feinberg", value: 1 },
//     { key: "Wordle", value: 1 },
//     { key: "uses", value: 1 },
//     { key: "combination", value: 1 },
//     { key: "boxes", value: 1 },
//     { key: "quadtrees", value: 1 },
//     { key: "achieve", value: 1 },
//     { key: "reasonable", value: 1 },
//     { key: "speeds", value: 1 },
//     { key: "Glyphs", value: 1 },
//     { key: "JavaScript", value: 1 },
//     { key: "isnt", value: 1 },
//     { key: "way", value: 1 },
//     { key: "precise", value: 1 },
//     { key: "glyph", value: 1 },
//     { key: "shapes", value: 1 },
//     { key: "via", value: 1 },
//     { key: "DOM", value: 1 },
//     { key: "except", value: 1 },
//     { key: "perhaps", value: 1 },
//     { key: "SVG", value: 1 },
//     { key: "fonts", value: 1 },
//     { key: "Instead", value: 1 },
//     { key: "hidden", value: 1 },
//     { key: "canvas", value: 1 },
//     { key: "element", value: 1 },
//     { key: "Retrieving", value: 1 },
//     { key: "many", value: 1 },
//     { key: "batch", value: 1 },
//     { key: "Sprites", value: 1 },
//     { key: "initial", value: 1 },
//     { key: "performed", value: 1 },
//     { key: "using", value: 1 },
//     { key: "doesnt", value: 1 },
//     { key: "copy", value: 1 },
//     { key: "appropriate", value: 1 },
//     { key: "position", value: 1 },
//     { key: "representing", value: 1 },
//     { key: "advantage", value: 1 },
//     { key: "involves", value: 1 },
//     { key: "relevant", value: 1 },
//     { key: "rather", value: 1 },
//     { key: "previous", value: 1 },
//     { key: "Somewhat", value: 1 },
//     { key: "surprisingly", value: 1 },
//     { key: "lowlevel", value: 1 },
//     { key: "hack", value: 1 },
//     { key: "made", value: 1 },
//     { key: "tremendous", value: 1 },
//     { key: "difference", value: 1 },
//     { key: "constructing", value: 1 },
//     { key: "compressed", value: 1 },
//     { key: "blocks", value: 1 },
//     { key: "1bit", value: 1 },
//     { key: "32bit", value: 1 },
//     { key: "integers", value: 1 },
//     { key: "thus", value: 1 },
//     { key: "reducing", value: 1 },
//     { key: "number", value: 1 },
//     { key: "checks", value: 1 },
//     { key: "memory", value: 1 },
//     { key: "times", value: 1 },
//     { key: "fact", value: 1 },
//     { key: "turned", value: 1 },
//     { key: "beat", value: 1 },
//     { key: "quadtree", value: 1 },
//     { key: "everything", value: 1 },
//     { key: "tried", value: 1 },
//     { key: "areas", value: 1 },
//     { key: "font", value: 1 },
//     { key: "sizes", value: 1 },
//     { key: "primarily", value: 1 },
//     { key: "needs", value: 1 },
//     { key: "test", value: 1 },
//     { key: "per", value: 1 },
//     { key: "whereas", value: 1 },
//     { key: "compare", value: 1 },
//     { key: "every", value: 1 },
//     { key: "overlaps", value: 1 },
//     { key: "slightly", value: 1 },
//     { key: "Another", value: 1 },
//     { key: "possibility", value: 1 },
//     { key: "merge", value: 1 },
//     { key: "fairly", value: 1 },
//     { key: "though", value: 1 },
//     { key: "compared", value: 1 },
//     { key: "analagous", value: 1 },
//     { key: "mask", value: 1 },
//     { key: "essentially", value: 1 },
//     { key: "ORing", value: 1 },
//     { key: "block", value: 1 }
//   ];
  
//   const chart = new Chart(document.getElementById("canvas").getContext("2d"), {
//     type: "wordCloud",
//     data: {
//       labels: words.map((d) => d.key),
//       datasets: [
//         {
//           label: "",
//           data: words.map((d) => 10 + d.value * 10)
//         }
//       ]
//     },
//     options: {
//       title: {
//         display: false,
//         text: "Chart.js Word Cloud"
//       },
//       plugins: {
//         legend: {
//           display: false
//         }
//       }
//     }
//   });