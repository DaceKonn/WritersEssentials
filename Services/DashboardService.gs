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
        var i = index;
        while (i >= 0 && i > index-7){
          sevenAvg += wordCounts[i][1];
          i--;
        }
        sevenAvg = sevenAvg/(index-i);
      }
      else {
        sevenAvg = item[1];
      }
      
      SheetHelper.AddRow(sheet, [item[0], item[1], goal, Math.floor(sevenAvg*10)/10]);
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
      SheetHelper.AddRow(sheet, [item[0], fileName, item[1], goal, "", ""]);
    });
  }
  
  function ResetStatsSheet() {
    var sheet = LoadSheet("Stats");
    SheetHelper.ClearRows(sheet);
    SheetHelper.AddRow(sheet, ["ProcessingDay", CheckProcessingDate(), "Dashboard date"]);
    SheetHelper.AddRow(sheet, ["AverageWordCountPerSession", "=FLOOR(AVERAGE(DailyWordCount!B:B); 1)", "Average word count per session"]);
    SheetHelper.AddRow(sheet, ["TotalWordsWritten", "=SUM(FileProgress!C:C)", "Total words written"]);
    SheetHelper.AddRow(sheet, ["DaysSinceInstallation", CheckDaysSinceInstallation(), "Days since instalation"]);
    SheetHelper.AddRow(sheet, ["WrittingDays","=COUNT(DailyWordCount!A:A)", "Writting days"]);
    SheetHelper.AddRow(sheet, ["CurrentGoalStreak", CheckGoalStreak(), "Current goal streak"]);
    SheetHelper.AddRow(sheet, ["LongestGoalStreak", LONGEST_GOAL_STREAK, "Longest goal streak"]);
    SheetHelper.AddRow(sheet, ["CurrentWritingStreak", CheckWritingStreak(), "Current writing streak"]);
    SheetHelper.AddRow(sheet, ["LongestWritingStreak", LONGEST_WRITING_STREAK, "Longest writing streak"]);
    
    
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
  
  function CheckProcessingDate() {
    var sheet = LoadSheet("DailyWordCount");
    var rows = SheetHelper.GetRows(sheet);
    var result;
    
    for (i in rows) {
      if (result == undefined) {
        result = DateTimeHelper.FormatToSimpliefiedCalendar(rows[i][0]);
      }
      else {
        if (new Date(result) < new Date(rows[i][0])) {
          result = DateTimeHelper.FormatToSimpliefiedCalendar(rows[i][0]);
        }
      }
      
    }
    return result.replace("-", "z");
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
  
  DashboardService.GetFileStats = function() {

  }

}( DashboardService = DashboardService || {} ));


function Test() {
  WEDataHelper.LoadData();
  DashboardService.ResetDashboard();
}