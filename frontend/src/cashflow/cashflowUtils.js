//https://stackoverflow.com/questions/30464628/javascript-get-all-months-between-two-dates#:~:text=it's%20pretty%20ugly%3A-,var%20startDate%20%3D%20'2012%2D04%2D01'%3B%20var,getFullYear()%3B%20i%20%3C%20end.

const dateRange = (startDate, endDate) => {
    var start      = startDate.split('-');
    var end        = endDate.split('-');
    var startYear  = parseInt(start[0]);
    var endYear    = parseInt(end[0]);
    var dates      = [];
  
    for(var i = startYear; i <= endYear; i++) {
      var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
      var startMon = i === startYear ? parseInt(start[1])-1 : 0;
      for(var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j+1) {
        var month = j+1;
        var displayMonth = month < 10 ? '0'+month : month;
        dates.push([i, displayMonth].join('-'));
      }
    }
    return dates;
  }

  const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  export { dateRange, MONTHS };