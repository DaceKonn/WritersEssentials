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
  
  var currentWordCountCheck = FileTrackService.CheckCurrentWordCount();
  root.Stats.push({ Id: "wordCountCheckTime", Value:currentWordCountCheck.checkTime, DisplayName:"Current word count check time" });
  root.Stats.push({ Id: "wordCountCheckValue", Value:currentWordCountCheck.wordCount, DisplayName:"Current word count check" });
    
    
}
 
}( DashboardController = DashboardController || {} ));

function GetDashboardData(){
  var result = DashboardController.GetDashboardData();
  Logger.log(result);
  return result;
}
