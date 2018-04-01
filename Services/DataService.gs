var DataService;

(function( DataService, undefined ) { 
  function AddProcessingDate(processingDate) {
    var sheet = SheetHelper.LoadSheet(WEDataHelper.GetDataSpreadsheetId(), "Processings");
    SheetHelper.AddRow(sheet, [processingDate]);
  }
  
  DataService.UpdateWordCounts = function() {
    var trackedFiles = FileTrackService.GetTrackingInfo();
    var processingDate = DateTimeHelper.GetNowUTC();
    var sheet = LoadDataSheet();
    var latestSheet = LoadLatestSheet();

    AddProcessingDate(processingDate);    
    
    for (i in trackedFiles) { 
      var doc = DocumentApp.openById(trackedFiles[i][0]);
      var doc1 = doc.getText();  
      var name = doc.getName();
      var totalWords = WordCountProcessor.GetWordCount(doc1);
      var totalChars = WordCountProcessor.GetCharCount(doc1);
      var backup = true;
      
      if (trackedFiles[i][1] != "none"){
        //var doc2 = DocumentApp.openById(trackedFiles[i][1]).getText();
        var snapWords = trackedFiles[i][2]//WordCountProcessor.GetWordCount(doc2);
        var diffWords = totalWords - snapWords;
        if (diffWords > 0){
          SheetHelper.AddRow(sheet, [processingDate, trackedFiles[i][0], name, totalWords, diffWords, totalChars]);
          
          var findId = SheetHelper.FindInRow(latestSheet, trackedFiles[i][0]);
          
          if (findId > -1) {
            SheetHelper.UpdateRow(latestSheet, findId, [trackedFiles[i][0], name, totalWords, totalChars]);
          }
          else{
            SheetHelper.AddRow(latestSheet, [trackedFiles[i][0], name, totalWords, totalChars]);
          }
          
          
        }
        else {
          backup = false;
        }
      }
      else{
        SheetHelper.AddRow(sheet, [processingDate, trackedFiles[i][0], name, totalWords, totalWords, totalChars]);
        SheetHelper.AddRow(latestSheet, [trackedFiles[i][0], name, totalWords, totalChars]);
      }
      if (backup) {FileTrackService.BackupFile(trackedFiles[i][0], totalWords, totalChars);}
    }
  }
  
  DataService.GetLatestData = function() {
    var sheet = LoadLatestSheet();
    var rows = SheetHelper.GetRows(sheet);
    return rows;
  }
  
  DataService.GetDailyWordCounts = function() {
    var sheet = LoadDataSheet();
    var headers = SheetHelper.GetHeaders(sheet);
    var rows = SheetHelper.GetRows(sheet);
    
    var processingDateIndex = headers.indexOf("ProcessingDate");
    var fileIdIndex = headers.indexOf("FileId");
    var dailyWordCountIndex = headers.indexOf("DailyWordCount");
    
    var wordCountsPerFileDay = [];
    
    rows.forEach(function (item, index) {
      SheetHelper.ForEachRowGetValuesForHeaderIndexArray(item, index, [processingDateIndex, fileIdIndex, dailyWordCountIndex], wordCountsPerFileDay);
    });
    
    return DailyWordCountGroupByDate(wordCountsPerFileDay);
  }
  
  DataService.GetFilesTotalWordCount = function() {
    var sheet = LoadDataSheet();
    var rows = SheetHelper.GetRows(sheet);
    var headers = SheetHelper.GetHeaders(sheet);
    var processingDateIndex = headers.indexOf("ProcessingDate");
    var fileIdIndex = headers.indexOf("FileId");
    var totalWordCountIndex = headers.indexOf("TotalWordCount");
    
    var fileTotalCountsPerDay = [];
    
    rows.forEach(function (item, index) {
      SheetHelper.ForEachRowGetValuesForHeaderIndexArray(item, index, [processingDateIndex, fileIdIndex, totalWordCountIndex], fileTotalCountsPerDay);
    });  
    
    return TotalFileWordCountGroupByDate(fileTotalCountsPerDay);
  }
  
  function LoadDataSheet(){
    var spread = SpreadsheetApp.openById(WEDataHelper.GetDataSpreadsheetId());
    return spread.getSheetByName("Data");
  }
  
  function LoadLatestSheet(){
    var spread = SpreadsheetApp.openById(WEDataHelper.GetDataSpreadsheetId());
    return spread.getSheetByName("LatestData");
  }

  function DailyWordCountGroupByDate(array) {
    var result = [];

    array.forEach(function(item, index) {
      
      var date = DateTimeHelper.FormatToSimpliefiedCalendar(new Date(item[0]));
      var idx = result.map(function(e) { return e[0]; }).indexOf(date);
      
      if (idx < 0) {
        var tuple = [date, item[2]];
        result.push(tuple);
      }
      else {
        result[idx][1] += item[2];
      }
    })
    
    return result;
  }
  
  function TotalFileWordCountGroupByDate(array) {
    var result = [];
    array.forEach(function(item, index) {
      var fileId = item[1];
      var idx = result.map(function(e) { return e[0]; }).indexOf(fileId);
      
      if (idx < 0) {
        var tuple = [fileId, item[2], new Date(item[0])];
        result.push(tuple);
      }
      else {
        if (result[idx][2] < new Date(item[0])){
          result[idx][1] = item[2];
          result[idx][2] = new Date(item[0]);
        }

      }
    })

    return result;
  }
                  
}( DataService = DataService || {} ));