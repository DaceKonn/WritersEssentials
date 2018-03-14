var DashboardController;

(function( DashboardController, undefined ) { 
  
DashboardController.GetDashboardData = function() {
  WEDataHelper.LoadData();
  
  var stats = DashboardService.GetStats();
  
  var template = "{ \"Stats\": {";
  var temp = {};
  temp.Stats = {};
  
  var statsTemp = [];
  stats.forEach(function(item, index) {
    temp.Stats[item[0]] = item[1];
    statsTemp.push("\""+item[0]+"\": "+"\""+item[1]+"\"");
  });
  template += statsTemp.join(",");
  template += "} }";
  
  var result = JSON.stringify(template);
  
  
  
  return temp;
}
 
}( DashboardController = DashboardController || {} ));

function GetDashboardData(){
  return DashboardController.GetDashboardData();
}
