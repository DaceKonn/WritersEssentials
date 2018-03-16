var DashboardController;

(function( DashboardController, undefined ) { 
  
DashboardController.GetDashboardData = function() {
  WEDataHelper.LoadData();
  
  var temp = {};
  AddStats(temp);

  return temp;
}

function AddStats(root) {
  var stats = DashboardService.GetStats();
  root.Stats = [];
  
  stats.forEach(function(item, index) {
    root.Stats.push({ Id: item[0], Value:item[1], DisplayName:item[2] });
  });
}
 
}( DashboardController = DashboardController || {} ));

function GetDashboardData(){
  var result = DashboardController.GetDashboardData();
  Logger.log(result);
  return result;
}
