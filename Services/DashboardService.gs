var DashboardService;

(function( DashboardService, undefined ) { 
  
  var LONGEST_GOAL_STREAK = 0;
  var LONGEST_WRITING_STREAK = 0;
  
  
  
  DashboardService.ResetDashboard = function() {
    ResetDailyWordCountSheet();
    ResetFileProgressSheet();
    ResetStatsSheet() ;
  }
  
  function ResetDailyWordCountSheet(){
    var sheet = LoadSheet("DailyWordCount");
    var goal = ConfigService.GetCurrentGoal();
    var wordCounts = DataService.GetDailyWordCounts();
    
    SheetHelper.ClearRows(sheet);
    
    wordCounts.forEach(function (item, index) {
      var sevenAvg = 0;
      if (index > 0) {
        var i = 0;
        while (i <= index && i <= 7){
          sevenAvg += wordCounts[i][1];
          i++;
        }
        sevenAvg = sevenAvg/i;
      }
      else {
        sevenAvg = item[1];
      }
      
      SheetHelper.AddRow(sheet, [item[0], item[1], goal, sevenAvg]);
    });
  }
  
  function ResetFileProgressSheet() {
    var sheet = LoadSheet("FileProgress");
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
  
  function ResetStatsSheet() {
    var sheet = LoadSheet("Stats");
    SheetHelper.ClearRows(sheet);
    
    SheetHelper.AddRow(sheet, ["AverageWordCount", "=AVERAGE(DailyWordCount!B:B)"]);
    SheetHelper.AddRow(sheet, ["TotalWordsWritten", "=SUM(FileProgress!C:C)"]);
    SheetHelper.AddRow(sheet, ["DaysSinceInstallation", CheckDaysSinceInstallation()]);
    SheetHelper.AddRow(sheet, ["WrittingDays","=COUNT(DailyWordCount!A:A)"]);
    SheetHelper.AddRow(sheet, ["CurrentGoalStreak", CheckGoalStreak()]);
    SheetHelper.AddRow(sheet, ["LongestGoalStreak", LONGEST_GOAL_STREAK]);
    SheetHelper.AddRow(sheet, ["CurrentWritingStreak", CheckWritingStreak()]);
    SheetHelper.AddRow(sheet, ["LongestWritingStreak", LONGEST_WRITING_STREAK]);
    
    
  }
  
  function CheckGoalStreak() {
    var sheet = LoadSheet("DailyWordCount");
    var streak = 0;
    var previousDay = undefined;
    
    var rows = SheetHelper.GetRows(sheet);
    
    rows.forEach(function(item, index) {
      if (previousDay == undefined) {
        if (item[1] >= item[2]) {
          streak += 1;
          previousDay = item[0];
          if (LONGEST_GOAL_STREAK < streak) {LONGEST_GOAL_STREAK = streak;}
        }
      }
      else {
        if (DateTimeHelper.DaysBetween(new Date(previousDay), new Date(item[0])) === 1) {
          if (item[1] >= item[2]) {
            streak += 1;
            previousDay = item[0];
            if (LONGEST_GOAL_STREAK < streak) {LONGEST_GOAL_STREAK = streak;}
          }
          else {
            streak = 0;
            previousDay = undefined;
          }
        }
        else {
          streak = 0;
          previousDay = undefined;
        }
      }
    });
    
    return streak;
  }
  
  function CheckWritingStreak() {
    var sheet = LoadSheet("DailyWordCount");
    var streak = 0;
    var previousDay = undefined;
    
    var rows = SheetHelper.GetRows(sheet);
    
    rows.forEach(function(item, index) {
      if (previousDay == undefined) {
        if (item[1] > 0) {
          streak += 1;
          previousDay = item[0];
          if (LONGEST_WRITING_STREAK < streak) {LONGEST_WRITING_STREAK = streak;}
        }
      }
      else {
        if (DateTimeHelper.DaysBetween(new Date(previousDay), new Date(item[0])) === 1) {
          if (item[1] > 0) {
            streak += 1;
            previousDay = item[0];
            if (LONGEST_WRITING_STREAK < streak) {LONGEST_WRITING_STREAK = streak;}
          }
          else {
            streak = 0;
            previousDay = undefined;
          }
        }
        else {
          streak = 0;
          previousDay = undefined;
        }
      }
    });
    
    return streak;
  }
  
  function CheckDaysSinceInstallation() {
    var installDate =  new Date(ConfigService.GetInstallDate());
    var nowDate = new Date();
    
    return DateTimeHelper.DaysBetween(installDate, nowDate);
  }
  
  function LoadSheet(sheetName){
    return SheetHelper.LoadSheet(WEDataHelper.GetDashboardSpreadsheetId(), sheetName);
  }
  
  DashboardService.GetStatValue = function(statName) {
    //WEDataHelper.InitData();
    var sheet = LoadSheet("Stats");
    var values = SheetHelper.GetRows(sheet);
    
    var rowId = SheetHelper.FindInColumn(sheet, "A", statName);
    if (rowId >= 0) {
      var valueCell = sheet.getRange(rowId, 2);
      return valueCell.getValue();
    }
    return undefined;
  }
  
  DashboardService.GetStats = function() {
    var sheet = LoadSheet("Stats");
    return SheetHelper.GetRows(sheet);
  }

}( DashboardService = DashboardService || {} ));


function Test() {
  WEDataHelper.LoadData();
  DashboardService.ResetDashboard();
}