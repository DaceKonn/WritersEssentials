var DashboardController;

(function( DashboardController, undefined ) { 
  
DashboardController.GetDashboardData = function() {
  WEDataHelper.LoadData();
  
  var stats = DashboardService.GetStats();
  
  var temp = {};
  temp.Stats = {};
  
  stats.forEach(function(item, index) {
    temp.Stats[item[0]] = item[1];
  });

  return temp;
}
 
}( DashboardController = DashboardController || {} ));

function GetDashboardData(){
  return DashboardController.GetDashboardData();
}
