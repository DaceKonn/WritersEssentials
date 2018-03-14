var WEDataHelper;

(function( WEDataHelper, undefined ) { 
  var MAIN_FOLDER_NAME = "_WritersEssentialsData";
  var SNAPSHOTS_FOLDER_NAME = "_WE_Snapshots";
  var CONFIG_SPREADSHEET_NAME = "_WE_MainConfig";
  var FILE_TRACK_SPREADSHEET_NAME = "_WE_FileTrack";
  var DATA_SPREADSHEET_NAME = "_WE_Data";
  var DASHBOARD_SPREADSHEET_NAME = "_WE_Dashboard";
  
  var MAIN_FOLDER_ID = undefined;
  var SNAPSHOTS_FOLDER_ID = undefined;
  
  var CONFIG_SPREADSHEET_ID = undefined;
  var FILE_TRACK_SPREADSHEET_ID = undefined;
  var DATA_SPREADSHEET_ID = undefined;
  var DASHBOARD_SPREADSHEET_ID = undefined;
  
  WEDataHelper.GetConfigSpreadsheetId = function(){
    return CONFIG_SPREADSHEET_ID;
  }
  
  WEDataHelper.GetFileTrackSpreadsheetId = function(){
    return FILE_TRACK_SPREADSHEET_ID;
  }
  
  WEDataHelper.GetDataSpreadsheetId = function(){
    return DATA_SPREADSHEET_ID;
  }
  
  WEDataHelper.GetSnapshotsFolderId = function(){
    return SNAPSHOTS_FOLDER_ID;
  }
  
  WEDataHelper.GetDashboardSpreadsheetId = function(){
    return DASHBOARD_SPREADSHEET_ID;
  }
  
  WEDataHelper.InitData = function() {
    Logger.log("Init data");
    MAIN_FOLDER_ID = DriveHelper.GetOrInitFolder(MAIN_FOLDER_NAME);
    SNAPSHOTS_FOLDER_ID = DriveHelper.GetOrInitFolder(SNAPSHOTS_FOLDER_NAME, MAIN_FOLDER_ID);
    CONFIG_SPREADSHEET_ID = DriveHelper.GetOrInitGoogleFile(CONFIG_SPREADSHEET_NAME, MAIN_FOLDER_ID, "spreadsheet");
    FILE_TRACK_SPREADSHEET_ID = DriveHelper.GetOrInitGoogleFile(FILE_TRACK_SPREADSHEET_NAME, MAIN_FOLDER_ID, "spreadsheet");
    DATA_SPREADSHEET_ID = DriveHelper.GetOrInitGoogleFile(DATA_SPREADSHEET_NAME, MAIN_FOLDER_ID, "spreadsheet");
    DASHBOARD_SPREADSHEET_ID = DriveHelper.GetOrInitGoogleFile(DASHBOARD_SPREADSHEET_NAME, MAIN_FOLDER_ID, "spreadsheet");
    
    MainMigrator.Run();
    ConfigService.StoreImportantIds();
  }
  
  WEDataHelper.LoadData = function() {
    Logger.log("Load data");
    MAIN_FOLDER_ID = DriveHelper.GetOrInitFolder(MAIN_FOLDER_NAME);
    CONFIG_SPREADSHEET_ID = DriveHelper.GetOrInitGoogleFile(CONFIG_SPREADSHEET_NAME, MAIN_FOLDER_ID, "spreadsheet");
    
    var importantIds = ConfigService.GetImportandIds();

    SNAPSHOTS_FOLDER_ID = importantIds[importantIds.map(function(e) { return e[0]; }).indexOf("SnapshotsFolder")][1];
    DASHBOARD_SPREADSHEET_ID = importantIds[importantIds.map(function(e) { return e[0]; }).indexOf("DashboardSpreadsheet")][1];
    DATA_SPREADSHEET_ID = importantIds[importantIds.map(function(e) { return e[0]; }).indexOf("DataSpreadsheet")][1];
    FILE_TRACK_SPREADSHEET_ID = importantIds[importantIds.map(function(e) { return e[0]; }).indexOf("FileTrackSpreadsheet")][1];
  }
  
  WEDataHelper.GenerateUUIDV4 = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });}

  
}( WEDataHelper = WEDataHelper || {} ));

function WEDataHelper_InitWESetup_Run(){
  WEDataHelper.InitData();
}



































