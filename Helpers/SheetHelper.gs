var SheetHelper;

(function( SheetHelper, undefined ) { 

  SheetHelper.CreateSheetWithColumns = function(spread, sheetName, columnsArray) {
    var sheet = spread.insertSheet(sheetName);
    DriveHelper.RemoveColumnsAndRows(sheet);
    sheet.insertColumnsAfter(1, columnsArray.length-1);
    
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
 
}( SheetHelper = SheetHelper || {} ));