var DashboardSpreadsheetMigrator;

(function( DashboardSpreadsheetMigrator, undefined ) { 

  var spreadId = undefined;
  var spread = undefined;
  var spreadVersion = undefined;
  
  DashboardSpreadsheetMigrator.Load = function() {
    spreadId = WEDataHelper.GetDashboardSpreadsheetId();
    spread = SpreadsheetApp.openById(spreadId);
    
  }
  
  DashboardSpreadsheetMigrator.GetVersion = function(){
    spreadVersion = DriveHelper.GetVersionCell(spread);
    Logger.log("DashboardSpreadsheet version: "+spreadVersion);
    return spreadVersion;
  }
  
  function SetVersion(spread, version){
    DriveHelper.SetVersionCell(spread, version);
    Logger.log("DashboardSpreadsheet version updated to: "+version);
  }
  
  DashboardSpreadsheetMigrator.MigrateToVersion1 = function(){
    Logger.log("Migrating Dashboard Spreadsheet to version 1");
    SheetHelper.CreateSheetWithColumns(spread, "DailyWordCount", ["Date", "SumWordCount", "Goal", "7DayAvg"]);
    SheetHelper.CreateSheetWithColumns(spread, "FileProgress", ["FileId", "FileName", "TotalWordCount", "Goal", "CurrentWordCount", "AvgPerSession"]);
    SheetHelper.CreateSheetWithColumns(spread, "Stats", ["StatName", "Value", "DisplayName"]);
    SheetHelper.CreateSheetWithColumns(spread, "Dashboard", [""]);
    SetVersion(spread, 1);
  }
 
}( DashboardSpreadsheetMigrator = DashboardSpreadsheetMigrator || {} ));

