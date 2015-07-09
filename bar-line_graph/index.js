var data = bumpLayer(56, .1);
var BAR_WIDTH = 20;
var HEIGHT_MULTI = 100;
var DURATION = 500;

var svg = d3.select('body').append('svg')
  .attr('id', 'bar-chart')
  .attr('width', '960px')
  .attr('height', '500px');

var bar = svg.selectAll('g')
  .data(data);

var rect = bar.enter().append('g')
  .append('rect')
    .style('fill', '#9b59b6')
    .attr('x', function (d, i) {
      return (i * (BAR_WIDTH + 10)) + 'px';  
    })
    .attr('y', 500)
    .attr('height', 0);
rect.transition()
  .duration(DURATION)
  .attr('y', function (d) {
    return 500 - d.y * HEIGHT_MULTI;
  })
  .attr('width', BAR_WIDTH + 'px')
  .attr('height', function (d) {
    return d.y * HEIGHT_MULTI;
  });

d3.select('#line').on('click', transitionLine);
d3.select('#bar').on('click', transitionBar);
d3.select('#refresh').on('click', function () {
  data = bumpLayer(56, .1);
  svg.selectAll('g')
  .data(data);
});
  
function transitionLine() {
  svg.selectAll('rect') 
    .transition()
    .duration(DURATION)
    .attr('y', 500)
    .attr('height',0)
  var g = svg.selectAll('g').data(data);
  g.append('line')
    .attr('y1', 500)
    .attr('y2', 500)
    .transition()
    .duration(DURATION)
    .attr('x1', function (d, i) {
      return i * (BAR_WIDTH + 10) + BAR_WIDTH / 2
    })
    .attr('x2', function (d, i) {
      return (i + 1) * (BAR_WIDTH + 10) + BAR_WIDTH / 2
    })
    .attr('y1', function (d) {
      return 500 - d.y * HEIGHT_MULTI;
    })
    .attr('y2', function (d, i) {
      if (i === data.length - 1) {
        return;
      }
      return 500 - data[i + 1].y * HEIGHT_MULTI;
    })
    .style('stroke-width', 2)
    .style('stroke', 'red');
}

function transitionBar() {
  svg.selectAll('line') 
    .transition()
    .duration(DURATION)
    .attr('y1', 500)
    .attr('y2', 500)
    .style('stroke-width', 0);

  var g = svg.selectAll('g').data(data);
  g.append('rect')
    .style('fill', '#9b59b6')
    .attr('x', function (d, i) {
      return (i * (BAR_WIDTH + 10)) + 'px';  
    })
    .attr('y', 500)
  .transition()
  .duration(DURATION)
  .attr('y', function (d) {
    return 500 - d.y * HEIGHT_MULTI;
  })
  .attr('width', BAR_WIDTH + 'px')
  .attr('height', function (d) {
    return d.y * HEIGHT_MULTI;
  });
}

// Inspired by Lee Byron's test data generator.
function bumpLayer(n, o) {

  function bump(a) {
    var x = 1 / (.1 + Math.random()),
        y = 2 * Math.random() - .5,
        z = 10 / (.1 + Math.random());
    for (var i = 0; i < n; i++) {
      var w = (i / n - y) * z;
      a[i] += x * Math.exp(-w * w);
    }
  }

  var a = [], i;
  for (i = 0; i < n; ++i) a[i] = o + o * Math.random();
  for (i = 0; i < 5; ++i) bump(a);
  return a.map(function(d, i) { return {x: i, y: Math.max(0, d)}; });
}