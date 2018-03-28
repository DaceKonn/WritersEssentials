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
      var devideBy = 1;
      var previous;
      
      if (index > 0) {
        
        var i = index;
        while (i >= 0 && i > index-7){
          sevenAvg += wordCounts[i][1];
          if (previous != undefined) {
            devideBy += Math.abs(DateTimeHelper.DaysBetween(new Date(previous[0]), new Date(wordCounts[i][0])));
          }
          previous = wordCounts[i];
          i--;
        }

        sevenAvg = sevenAvg/devideBy;//(index-i);
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
    var wordCountSheet = LoadSheet("DailyWordCount");
    var statsSheet = LoadSheet("Stats");
    SheetHelper.ClearRows(statsSheet);
    SheetHelper.AddRow(statsSheet, ["ProcessingDay", CheckProcessingDate(wordCountSheet), "Dashboard date"]);
    SheetHelper.AddRow(statsSheet, ["WordCount", CheckLastWordCount(wordCountSheet), "Last word count"]);
    SheetHelper.AddRow(statsSheet, ["SevenDayAverage", CheckSevenAvg(wordCountSheet), "Last 7 days average"]);
    SheetHelper.AddRow(statsSheet, ["AverageWordCountPerSession", "=FLOOR(AVERAGE(DailyWordCount!B:B); 1)", "Average word count per session"]);
    SheetHelper.AddRow(statsSheet, ["TotalWordsWritten", "=SUM(FileProgress!C:C)", "Total words written"]);
    SheetHelper.AddRow(statsSheet, ["DaysSinceInstallation", CheckDaysSinceInstallation(), "Days since instalation"]);
    SheetHelper.AddRow(statsSheet, ["WrittingDays","=COUNT(DailyWordCount!A:A)", "Writting days"]);
    SheetHelper.AddRow(statsSheet, ["LastSetGoal", CheckLastGoal(wordCountSheet), "Last set goal"]);
    SheetHelper.AddRow(statsSheet, ["CurrentGoalStreak", CheckGoalStreak(wordCountSheet), "Current goal streak"]);
    SheetHelper.AddRow(statsSheet, ["LongestGoalStreak", LONGEST_GOAL_STREAK, "Longest goal streak"]);
    SheetHelper.AddRow(statsSheet, ["CurrentWritingStreak", CheckWritingStreak(wordCountSheet), "Current writing streak"]);
    SheetHelper.AddRow(statsSheet, ["LongestWritingStreak", LONGEST_WRITING_STREAK, "Longest writing streak"]);
    
    
    
  }
  
  function CheckGoalStreak(sheet) {
    //var sheet = LoadSheet("DailyWordCount");
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
  
  function CheckProcessingDate(sheet) {
    //var sheet = LoadSheet("DailyWordCount");
    var row = SheetHelper.GetLastRow(sheet);
    
    return DateTimeHelper.FormatToSimpliefiedCalendar(row[0][0]).replace("-", "z");
  }
  
  function CheckLastWordCount(sheet) {
    //var sheet = LoadSheet("DailyWordCount");
    var row = SheetHelper.GetLastRow(sheet);
    
    return row[0][1];
  }
  
  function CheckLastGoal(sheet) {
    //var sheet = LoadSheet("DailyWordCount");
    var row = SheetHelper.GetLastRow(sheet);
    
    return row[0][2];
  }
  
  function CheckSevenAvg(sheet) {
    //var sheet = LoadSheet("DailyWordCount");
    var row = SheetHelper.GetLastRow(sheet);
    
    return row[0][3];
  }
  
  function CheckWritingStreak(sheet) {
    //var sheet = LoadSheet("DailyWordCount");
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
    var sheet = LoadSheet("FileProgress");
    return SheetHelper.GetRows(sheet);
  }

}( DashboardService = DashboardService || {} ));


function Test() {
  WEDataHelper.LoadData();
  DashboardService.ResetDashboard();
}