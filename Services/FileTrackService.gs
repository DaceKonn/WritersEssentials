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
  
  FileTrackService.AddFileToTrack = function(fileId) {
    var sheet = LoadFileTrackSheet();
    SheetHelper.AddRow(sheet, [fileId,"none"]);
  }
  
  function LoadFileTrackSheet(){
    var spread = SpreadsheetApp.openById(WEDataHelper.GetFileTrackSpreadsheetId());
    return spread.getSheetByName("FileTrack");
  }
  

  
}( FileTrackService = FileTrackService || {} ));