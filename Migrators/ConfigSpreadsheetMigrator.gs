
var ConfigSpreadsheetMigrator;

(function( ConfigSpreadsheetMigrator, undefined ) { 

  var spreadId = undefined;
  var spread = undefined;
  var spreadVersion = undefined;
  
  ConfigSpreadsheetMigrator.Load = function() {
    spreadId = WEDataHelper.ConfigSpreadsheetId();
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
    
    var sheet = spread.insertSheet("Config");
    DriveHelper.RemoveColumnsAndRows(sheet);
    sheet.insertColumnAfter(1);
    
    var range = sheet.getRange(1,1,1,2);
    
    var newValues = [["_WE_FileTrack", WEDataHelper.FileTrackSpreadsheetId()]];
    range.setValues(newValues);
    range.protect().setWarningOnly(true);
    
    SetVersion(spread, 1);
  }
 
}( ConfigSpreadsheetMigrator = ConfigSpreadsheetMigrator || {} ));