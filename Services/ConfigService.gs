var ConfigService;

(function( ConfigService, undefined ) { 
  
  ConfigService.GetCurrentGoal = function() {
    var sheet = LoadDailyGoalSheet();
    var values = SheetHelper.GetRows(sheet);
    
    var sorted = values.sort(function(a,b){
      return new Date(b[0]) - new Date(a[0]);
    });
    
    return sorted[0][1];
  }
  
  ConfigService.GetInstallDate = function() {
    var sheet = SheetHelper.LoadSheet(WEDataHelper.GetConfigSpreadsheetId(), "Config");
    return GetConfigValue(sheet, "InstallDate");
  }
  
  ConfigService.StoreImportantIds = function() {
    var sheet = SheetHelper.LoadSheet(WEDataHelper.GetConfigSpreadsheetId(), "ImportantIds");
    SheetHelper.ClearRows(sheet);
    
    SheetHelper.AddRow(sheet, ["FileTrackSpreadsheet", WEDataHelper.GetFileTrackSpreadsheetId()]);
    SheetHelper.AddRow(sheet, ["DataSpreadsheet", WEDataHelper.GetDataSpreadsheetId()]);
    SheetHelper.AddRow(sheet, ["SnapshotsFolder", WEDataHelper.GetSnapshotsFolderId()]);
    SheetHelper.AddRow(sheet, ["DashboardSpreadsheet", WEDataHelper.GetDashboardSpreadsheetId()]);
  }
  
  ConfigService.GetImportandIds = function() {
    var sheet = SheetHelper.LoadSheet(WEDataHelper.GetConfigSpreadsheetId(), "ImportantIds");
    return SheetHelper.GetRows(sheet);
  }
  
  function LoadDailyGoalSheet(){
    var spread = SpreadsheetApp.openById(WEDataHelper.GetConfigSpreadsheetId());
    return spread.getSheetByName("DailyGoal");
  }
  
  function GetConfigValue(sheet, configName) {
    var values = SheetHelper.GetRows(sheet);
    
    var rowId = SheetHelper.FindInColumn(sheet, "A", configName);
    if (rowId >= 0) {
      var valueCell = sheet.getRange(rowId, 2);
      return valueCell.getValue();
    }
    return undefined;
  }
  
}( ConfigService = ConfigService || {} ));