var DashboardService;

(function( DashboardService, undefined ) { 
  
  DashboardService.RefreshDashboard = function() {
    UpdateDailyWordCountSheet();
    UpdateFileProgressSheet();
  }
  
  function UpdateDailyWordCountSheet(){
    var sheet = LoadDailyWordCountSheet();
    var goal = ConfigService.GetCurrentGoal();
    var wordCounts = DataService.GetDailyWordCounts();
    
    SheetHelper.ClearRows(sheet);
    
    wordCounts.forEach(function (item, index) {
      SheetHelper.AddRow(sheet, [item[0], item[1], goal]);
    });
  }
  
  function UpdateFileProgressSheet() {
    var sheet = LoadFileProgressSheet();
    var totalWordCounts = DataService.GetFilesTotalWordCount();
    var goals = FileTrackService.GetAllFileGoals();
    
    SheetHelper.ClearRows(sheet);
    
    totalWordCounts.forEach(function (item, index) {
      var idx = goals.map(function(e) {return e[0];}).indexOf(item[0]);
      var goal = 0;
      if (idx >= 0){
        goal = goals[idx][1];
      }
      var fileName = DriveApp.getFileById(item[0]).getName();
      SheetHelper.AddRow(sheet, [item[0], fileName, item[1], goal]);
    });
  }
  
  function LoadFileProgressSheet(){
    var spread = SpreadsheetApp.openById(WEDataHelper.GetDashboardSpreadsheetId());
    return spread.getSheetByName("FileProgress");
  }
  
  function LoadDailyWordCountSheet(){
    var spread = SpreadsheetApp.openById(WEDataHelper.GetDashboardSpreadsheetId());
    return spread.getSheetByName("DailyWordCount");
  }
  
}( DashboardService = DashboardService || {} ));


function Test() {
  WEDataHelper.InitData();
  DashboardService.RefreshDashboard();
}