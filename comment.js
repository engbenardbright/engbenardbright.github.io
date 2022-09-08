// Load in Comments 
d3.csv("Comments.csv")
    .row(function(d){return {comment_id:d.comment_id, Comment:d.Comment.trim()};})
    .get(function(error , data){
        console.log(data);
    })

var dataset = Comments.csv

var svgwidth = 500, svgweight = 300, barpadding =5;
var barwidth = (svgwidth / dataset.length);


