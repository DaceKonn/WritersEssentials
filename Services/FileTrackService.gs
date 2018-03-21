var FileTrackService;

(function( FileTrackService, undefined ) { 
  var valueResult = [];
  
  FileTrackService.GetTrackedFilesIds = function() {
    var sheet = LoadFileTrackSheet();
    
    var headers = SheetHelper.GetHeaders(sheet);
    var rows = SheetHelper.GetRows(sheet);
    
    var fileIdIndex = headers.indexOf("FileId");
    
    var result = [];
    rows.forEach(function (item, index) {
      SheetHelper.ForEachRowGetValuesForHeaderIndex(item, index, fileIdIndex, result);
    });
    return result;
  }
  
  FileTrackService.GetTrackingInfo = function() {
    var sheet = LoadFileTrackSheet();
    
    var headers = SheetHelper.GetHeaders(sheet);
    var rows = SheetHelper.GetRows(sheet);
    return rows;
  }
  
  FileTrackService.GetAllFileGoals = function() {
    var sheet = LoadFileGoalSheet();
    
    var headers = SheetHelper.GetHeaders(sheet);
    var rows = SheetHelper.GetRows(sheet);
    
    var fileIdIndex = headers.indexOf("FileId");
    var goalIndex = headers.indexOf("Goal");
    
    var result = [];
    rows.forEach(function (item, index) {
      SheetHelper.ForEachRowGetValuesForHeaderIndexArray(item, index, [fileIdIndex, goalIndex], result);
    });
    return result;
  }
  
  FileTrackService.AddFileToTrack = function(fileId) {
    var sheet = LoadFileTrackSheet();
    SheetHelper.AddRow(sheet, [fileId,"none"]);
  }
  
  function LoadFileTrackSheet(){
    var spread = SpreadsheetApp.openById(WEDataHelper.GetFileTrackSpreadsheetId());
    return spread.getSheetByName("FileTrack");
  }
  
  function LoadFileGoalSheet(){
    var spread = SpreadsheetApp.openById(WEDataHelper.GetFileTrackSpreadsheetId());
    return spread.getSheetByName("FileGoals");
  }
  
  FileTrackService.BackupFile = function(fileId, wordCount) {
    var sheet = LoadFileTrackSheet();
    var rowId = SheetHelper.FindInColumn(sheet, "A", fileId);
    var snapshotCell = sheet.getRange(rowId, 2);
    var wordCountCell = sheet.getRange(rowId, 3);
    
    wordCountCell.setValue(wordCount);
    var snapshotId = snapshotCell.getValue();
    
    if (snapshotId !== "none") {
      DriveApp.getFileById(snapshotId).setTrashed(true);
    }

    var uuid = WEDataHelper.GenerateUUIDV4();
    var baseName = "WE_snapshot_"+uuid;
    
    var snapId = DriveApp.getFileById(fileId).makeCopy(baseName, DriveApp.getFolderById(WEDataHelper.GetSnapshotsFolderId())).getId();
    DriveApp.getFileById(snapId).setName("WE_snapshot_"+snapId);
    snapshotCell.setValue(snapId);
  }
  
  FileTrackService.SetFileGoal = function(fileId, goal) {
    var sheet = LoadFileGoalSheet();
    var rowId = SheetHelper.FindInColumn(sheet, "A", fileId);
    
    if (rowId < 0) {
      SheetHelper.AddRow(sheet, [fileId, goal]);
    }
    else {
      var goalCell = sheet.getRange(rowId, 2);
      goalCell.setValue(goal);
    }
    
    
  }
  
  FileTrackService.GetSnapedWordCount = function(fileId) {
    var sheet = LoadFileTrackSheet();
    var rowId = SheetHelper.FindInColumn(sheet, "A", fileId);

    return sheet.getRange(rowId, 3);
  }
  
  FileTrackService.CheckCurrentWordCount = function() {
    var trackedFiles = FileTrackService.GetTrackingInfo();
    var currentCalendarTime = DateTimeHelper.GetNowCalendar();
    var wordCount = 0;
    
    for (i in trackedFiles) { 
      var doc = DocumentApp.openById(trackedFiles[i][0]);
      var doc1 = doc.getText();  
      var name = doc.getName();
      var totalWords = WordCountProcessor.GetWordCount(doc1);

      
      if (trackedFiles[i][1] != "none"){
        var snapWords = trackedFiles[i][2];
        var diffWords = totalWords - snapWords;
        wordCount += diffWords;
      }
      else {
        wordCount += totalWords;
      }

    }
    
    return { checkTime: currentCalendarTime, wordCount: wordCount };
  }
  
}( FileTrackService = FileTrackService || {} ));

function CheckCurrentWordCount() {
  WEDataHelper.LoadData();
  var wordCount = FileTrackService.CheckCurrentWordCount();
  Logger.log(wordCount);
}
