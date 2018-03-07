
var FileTrackSpreadsheetMigrator;

(function( FileTrackSpreadsheetMigrator, undefined ) { 

  var spreadId = undefined;
  var spread = undefined;
  var spreadVersion = undefined;
 
  FileTrackSpreadsheetMigrator.Load = function() {
    spreadId = WEDataHelper.FileTrackSpreadsheetId();
    //Logger.log("WEDataHelper.FileTrackSpreadsheetId: "+WEDataHelper.FileTrackSpreadsheetId());
    //Logger.log("spreadId: "+spreadId);
    spread = SpreadsheetApp.openById(spreadId);
    
  }
  
  FileTrackSpreadsheetMigrator.GetVersion = function(){
    spreadVersion = DriveHelper.GetVersionCell(spread);
    Logger.log("FileTrackSpreadsheet version: "+spreadVersion);
    return spreadVersion;
  }
  
  function SetVersion(spread, version){
    DriveHelper.SetVersionCell(spread, version);
    Logger.log("FileTrackSpreadsheet version updated to: "+version);
  }
  
  FileTrackSpreadsheetMigrator.MigrateToVersion1 = function(){
    Logger.log("Migrating FileTrack Spreadsheet to version 1");
    var sheet = spread.insertSheet("FileTrack");
    DriveHelper.RemoveColumnsAndRows(sheet);
    sheet.insertColumnsAfter(1,3);
    
    var range = sheet.getRange(1,1,1,4);
    
    var newValues = [["SourceFile", "SnapshotFile", "SnapshotDate", "FileGoal"]];
    range.setValues(newValues);
    range.protect().setWarningOnly(true);
    
    SetVersion(spread, 1);
  }
 
}( FileTrackSpreadsheetMigrator = FileTrackSpreadsheetMigrator || {} ));