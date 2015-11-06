//source: http://bl.ocks.org/ZJONSSON/3918369

WIDTH = 1000,
HEIGHT = 380,
MARGINS = {
    top: 20,
    right: 30,
    bottom: 20,
    left: 80
};

 var color_hash = {  0 : ["Participant 24501", "blue"],
              1 : ["Participant 24502", "green"],
}

function getDate(date){
  return new Date(date.slice(0,4), date.slice(4,6), date.slice(6, 8));
}

function graphSurvey(vis,sData, surveyRes) {
  // minDate = new Date();
  // maxDate = new Date();
  // minDate.setDate(new Date(data[data.length-1].date).getDate() - 2);
  // maxDate.setDate(new Date(data[0].date).getDate() + 2);
  data = sData[1];
  maxDate = new Date(data[0].date)
  minDate = new Date(data[data.length-1].date)
  //console.log(minDate);
  //console.log(maxDate);

  maxY = (surveyRes === 'averagePainIntensity') ? 10 : 5;
  xScale = d3.time.scale().domain([minDate, maxDate]).rangeRound([MARGINS.left, WIDTH - MARGINS.right]),
  yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0, maxY]);

  var xAxis = d3.svg.axis().scale(xScale).ticks(d3.time.days, 1).tickFormat(d3.time.format('%a %d'))
    .tickSize(0).tickPadding(8);

  yAxis = d3.svg.axis().scale(yScale).orient("left");


  vis.append("svg:g").attr("class","axis").attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
    .call(xAxis);
   
  vis.append("svg:g").attr("class","axis").attr("transform", "translate(" + (MARGINS.left) + ",0)")
    .call(yAxis);

  var lineGen = d3.svg.line().x(function(d) {
    //console.log(new Date(d.date));
    return xScale(new Date(d.date));
  })
  .y(function(d) {
    // console.log(d.responses[surveyRes]['prompt_response']);
      return yScale(d.responses[surveyRes]['prompt_response']);
  })
  .interpolate("basis");

  vis.append('svg:path').attr('d', lineGen(data)).attr('stroke', 'green')
    .attr('stroke-width', 3).attr('fill', 'none');

  vis.append('svg:path')
  .attr('d', lineGen(sData[0]))
  .attr('stroke', 'blue')
  .attr('stroke-width', 3)
  .attr('fill', 'none');

      // add legend   
  var legend = vis.append("g")
    .attr("class", "legend")
    .attr("height", 100)
    .attr("width", 100)
    .attr('transform', 'translate(-20,50)')    
      
    
    legend.selectAll('rect')
      .data(sData)
      .enter()
      .append("rect")
    .attr("x", WIDTH - 135)
      .attr("y", function(d, i){ return i *  20;})
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function(d) { 
        var color = color_hash[sData.indexOf(d)][1];
        return color;
      })
      
    legend.selectAll('text')
      .data(sData)
      .enter()
      .append("text")
    .attr("x", WIDTH - 120)
      .attr("y", function(d, i){ return i *  20 + 9;})
    .text(function(d) {
        var text = color_hash[sData.indexOf(d)][0];
        return text;
      });
}



function getDate(date){
  return new Date(date.slice(0,4), date.slice(4,6), date.slice(6, 8));
}

function graphMoves(vis, mData) {
  data = mData[1].activity
  minDate = getDate(data[0].date)
  maxDate = getDate(data[data.length-1].date)
  //minDate.setDate(new Date(convertDate(data[0].date)).getDate() - 1);
  //maxDate.setDate(new Date(convertDate(data[data.length-1].date)).getDate() + 2);
  // console.log(minDate);
  // console.log(maxDate);

  //xScale = d3.time.scale().domain([d3.time.day.offset(minDate, 1), maxDate]).rangeRound([MARGINS.left, WIDTH]),
  xScale = d3.time.scale().domain([minDate, maxDate]).rangeRound([MARGINS.left, WIDTH - MARGINS.right]),
  yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0, 11000]);

  var xAxis = d3.svg.axis().scale(xScale).ticks(d3.time.days, 1).tickFormat(d3.time.format('%a %d'))
    .tickSize(0).tickPadding(8);

  yAxis = d3.svg.axis().scale(yScale).orient("left");


  vis.append("svg:g").attr("class","axis").attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
    .call(xAxis);
   
  vis.append("svg:g").attr("class","axis").attr("transform", "translate(" + (MARGINS.left) + ",0)")
    .call(yAxis);

  var lineGen = d3.svg.line()
  .x(function(d) {
    //console.log(getDate(d.date));
    return xScale(getDate(d.date));
  })
  .y(function(d) {
      if (d.summary) {
        for (i = 0; i < d.summary.length; i++) {
          if (d.summary[i].activity === 'walking') {
            //console.log(d.summary[i].steps);
            return yScale(d.summary[i].steps);
          }
        }
      } else {
        //console.log(0);
        return yScale(0);
      }
  })
  .interpolate("basis");

  vis.append('svg:path').attr('d', lineGen(data)).attr('stroke', 'green')
    .attr('stroke-width', 3).attr('fill', 'none');

  //http://jsbin.com/roniwatuvu/edit?html,css,js,output

  vis.append('svg:path')
  .attr('d', lineGen(mData[0].activity))
  .attr('stroke', 'blue')
  .attr('stroke-width', 3)
  .attr('fill', 'none');

      // add legend   
  var legend = vis.append("g")
    .attr("class", "legend")
        //.attr("x", w - 65)
        //.attr("y", 50)
    .attr("height", 100)
    .attr("width", 100)
    .attr('transform', 'translate(-20,50)')    
      
    
    legend.selectAll('rect')
      .data(mData)
      .enter()
      .append("rect")
    .attr("x", WIDTH - 135)
      .attr("y", function(d, i){ return i *  20;})
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function(d) { 
        var color = color_hash[mData.indexOf(d)][1];
        return color;
      })
      
    legend.selectAll('text')
      .data(mData)
      .enter()
      .append("text")
    .attr("x", WIDTH - 120)
      .attr("y", function(d, i){ return i *  20 + 9;})
    .text(function(d) {
        var text = color_hash[mData.indexOf(d)][0];
        return text;
      });
}

function convertDate(date) {
  return new Date(date.slice(0,4), date.slice(4,6), date.slice(6, 8), date.slice(9, 11), date.slice(11, 13));
}

function locationTable(data, pid) {
  locations = data.locations;
  numPlaces = 0.0;
  totHours = 0.0;
  for (j = 0; j < locations.length; j++) {
    d = locations[j];
    maxHours = 0.0;
    if (d.segments) {
      for (i = 0; i < d.segments.length; i++) {
        if (d.segments[i].type === 'place') {
          numPlaces = numPlaces + 1;
          ms = convertDate(d.segments[i].endTime).getTime() - convertDate(d.segments[i].startTime).getTime();
          x = ms / 1000
          x /= 60
          x /= 60
          hours = x % 24
          if (hours > maxHours) {
            maxHours = hours;
          }
        }
      }
    }
    totHours += maxHours;
  }
  numPlaces = numPlaces / locations.length;
  totHours = totHours / locations.length;
  console.log(totHours);

              var trHTML = '';
                trHTML += '<tr><td>' + pid + '</td><td> Lower Back Pain </td>'
                trHTML += '<td>' + Math.round(numPlaces) + '</td><td>' + Math.round(totHours) + '</td></tr>';
            $('.table').append(trHTML);

  return { "numPlaces" : numPlaces, "totHours": totHours};
}