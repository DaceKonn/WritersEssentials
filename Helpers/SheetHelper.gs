var SheetHelper;

(function( SheetHelper, undefined ) { 

  SheetHelper.CreateSheetWithColumns = function(spread, sheetName, columnsArray) {
    var sheet = spread.insertSheet(sheetName);
    DriveHelper.RemoveColumnsAndRows(sheet);
    if (columnsArray.length-1 > 0){
      sheet.insertColumnsAfter(1, columnsArray.length-1);
    }
    
    
    var range = sheet.getRange(1,1,1,columnsArray.length);
    
    var newValues = [columnsArray];
    range.setValues(newValues);
    range.protect().setWarningOnly(true);
    return sheet;
  }
  
  SheetHelper.AddRow = function(sheet, row) {
    var maxRow = sheet.getMaxRows();
    var maxColumn = sheet.getMaxColumns();
    sheet.insertRowAfter(maxRow);
    var range = sheet.getRange(maxRow+1, 1, 1, maxColumn);
    range.setValues([row]);
  }
  
  SheetHelper.ClearRows = function(sheet) {
    var maxRow = sheet.getMaxRows();
    
    while (maxRow > 1) {
      sheet.deleteRow(maxRow);
      maxRow -= 1;
    }
  }
  
  SheetHelper.GetRows = function(sheet) {
    var lastRow = sheet.getLastRow();
    var lastColumn = sheet.getLastColumn();

    if (lastRow > 1){
      
      var range = sheet.getRange(2, 1, lastRow-1, lastColumn);
      return range.getValues();
    }
    
    return undefined;
  }
  
  SheetHelper.GetHeaders = function(sheet) {
    var lastColumn = sheet.getLastColumn();

    var range = sheet.getRange(1, 1, 1, lastColumn);
    return range.getValues()[0];
  }
  
  SheetHelper.ForEachRowGetValuesForHeaderIndex = function(item, index, headerIndex, result) {
    result.push(item[headerIndex]);
  }
  
  SheetHelper.ForEachRowGetValuesForHeaderIndexArray = function(item, index, headerIndexArray, result) {
    var temp = [];
    
    for (i in headerIndexArray) {
      temp.push(item[headerIndexArray[i]])
    }
    
    result.push(temp);
  }
  
  SheetHelper.FindInColumn = function(sheet, a1nColumn, data) {
    
    var column = sheet.getRange(a1nColumn + ":" + a1nColumn);  // like A:A

    var values = column.getValues(); 
    var row = 0;

    while ( values[row] && values[row][0] !== data ) {
      row++;
    }

    if (values[row] === undefined){
      return -1;
    }
    
    if (values[row][0] === data) 
      return row+1;
    else 
      return -1;
    
  }

  SheetHelper.FindInRow = function(sheet, data) {
    var rows  = sheet.getDataRange.getValues(); 
    
    for (var r=0; r<rows.length; r++) { 
      if ( rows[r].join("#").indexOf(data) !== -1 ) {
        return r+1;
      }
    }
    
    return -1;
  }
  
  SheetHelper.LoadSheet = function(spreadId, sheetName){
    var spread = SpreadsheetApp.openById(spreadId);
    return spread.getSheetByName(sheetName);
  }
 
}( SheetHelper = SheetHelper || {} ));