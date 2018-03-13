var FileTrackSpreadsheetMigrator;

(function( FileTrackSpreadsheetMigrator, undefined ) { 

  var spreadId = undefined;
  var spread = undefined;
  var spreadVersion = undefined;
 
  FileTrackSpreadsheetMigrator.Load = function() {
    spreadId = WEDataHelper.GetFileTrackSpreadsheetId();
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
    SheetHelper.CreateSheetWithColumns(spread, "FileTrack", ["FileId", "SnapshotId"]);
    SheetHelper.CreateSheetWithColumns(spread, "FileGoals", ["FileId", "Goal"]);
    
    SetVersion(spread, 1);
  }
 
}( FileTrackSpreadsheetMigrator = FileTrackSpreadsheetMigrator || {} ));
