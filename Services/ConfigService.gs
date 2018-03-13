var ConfigService;

(function( ConfigService, undefined ) { 
  
  ConfigService.GetCurrentGoal = function() {
    var sheet = LoadDailyGoalSheet();
    var values = SheetHelper.GetRows(sheet);
    
    var sorted = values.sort(function(a,b){
      return new Date(b[0]) - new Date(a[0]);
    });
    
    return sorted[0][1];
  }
  
  function LoadDailyGoalSheet(){
    var spread = SpreadsheetApp.openById(WEDataHelper.GetConfigSpreadsheetId());
    return spread.getSheetByName("DailyGoal");
  }
  
}( ConfigService = ConfigService || {} ));