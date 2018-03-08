var WEDataHelper;

(function( WEDataHelper, undefined ) { 
  
  var MAIN_FOLDER_NAME = "_WritersEssentialsData";
  var CONFIG_SPREADSHEET_NAME = "_WE_MainConfig";
  var FILE_TRACK_SPREADSHEET_NAME = "_WE_FileTrack";
  var DATA_SPREADSHEET_NAME = "_WE_Data";
  
  var MAIN_FOLDER_ID = undefined;
  var CONFIG_SPREADSHEET_ID = undefined;
  var FILE_TRACK_SPREADSHEET_ID = undefined;
  var DATA_SPREADSHEET_ID = undefined;
  
  WEDataHelper.GetConfigSpreadsheetId = function(){
    return CONFIG_SPREADSHEET_ID;
  }
  
  WEDataHelper.GetFileTrackSpreadsheetId = function(){
    return FILE_TRACK_SPREADSHEET_ID;
  }
  
  WEDataHelper.GetDataSpreadsheetId = function(){
    return DATA_SPREADSHEET_ID;
  }
  
  WEDataHelper.InitData = function() {
    //InitMainFolder();
//    InitFileTrackSpreadsheet();
//    InitConfigSpreadsheet();
    MAIN_FOLDER_ID = DriveHelper.GetOrInitFolder(MAIN_FOLDER_NAME);
    CONFIG_SPREADSHEET_ID = DriveHelper.GetOrInitGoogleFile(CONFIG_SPREADSHEET_NAME, MAIN_FOLDER_ID, "spreadsheet");
    FILE_TRACK_SPREADSHEET_ID = DriveHelper.GetOrInitGoogleFile(FILE_TRACK_SPREADSHEET_NAME, MAIN_FOLDER_ID, "spreadsheet");
    DATA_SPREADSHEET_ID = DriveHelper.GetOrInitGoogleFile(DATA_SPREADSHEET_NAME, MAIN_FOLDER_ID, "spreadsheet");
    
    MainMigrator.Run();
  }
  
  WEDataHelper.GetTrackedFiles = function() {
    SpreadsheetApp.openById(FILE_TRACK_SPREADSHEET_ID);
  }
  
}( WEDataHelper = WEDataHelper || {} ));

function WEDataHelper_InitWESetup_Run(){
  WEDataHelper.InitData();
}



































