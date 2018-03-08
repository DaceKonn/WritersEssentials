var ConfigSpreadsheetMigrator;

(function( ConfigSpreadsheetMigrator, undefined ) { 

  var spreadId = undefined;
  var spread = undefined;
  var spreadVersion = undefined;
  
  ConfigSpreadsheetMigrator.Load = function() {
    spreadId = WEDataHelper.GetConfigSpreadsheetId();
    //Logger.log("WEDataHelper.ConfigSpreadsheetId: "+WEDataHelper.ConfigSpreadsheetId());
    //Logger.log("spreadId: "+spreadId);
    spread = SpreadsheetApp.openById(spreadId);

  }
  
  ConfigSpreadsheetMigrator.GetVersion = function(){
    spreadVersion = DriveHelper.GetVersionCell(spread);
    Logger.log("ConfigSpreadsheet version: "+spreadVersion);
    return spreadVersion;
  }
  
  function SetVersion(spread, version){
    DriveHelper.SetVersionCell(spread, version);
    Logger.log("ConfigSpreadsheet version updated to: "+version);
  }
  
  ConfigSpreadsheetMigrator.MigrateToVersion1 = function(){
    Logger.log("Migrating Config Spreadsheet to version 1");
    var sheet = SheetHelper.CreateSheetWithColumns(spread, "Config", ["Config", "Value"]);
    SheetHelper.AddRow(sheet, ["InstallDate", DateTimeHelper.GetNowUTC()]);
    
    sheet = SheetHelper.CreateSheetWithColumns(spread, "DailyGoal", ["SetDate","Goal"]);
    SheetHelper.AddRow(sheet, [DateTimeHelper.FormatToUTC(new Date(1900, 01, 01)), 500]);
    
    
        
    SetVersion(spread, 1);
  }
 
}( ConfigSpreadsheetMigrator = ConfigSpreadsheetMigrator || {} ));