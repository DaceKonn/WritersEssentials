var DriveHelper;

(function( DriveHelper, undefined ) { 
  var versionSheetName = "Version";
  var versionParamName = "Version";
  var initVersionFlag = 0;
  
  DriveHelper.VersionSheetName = versionSheetName;
  DriveHelper.VersionParamName = versionParamName;
  DriveHelper.InitVersionFlag = initVersionFlag;
  
  DriveHelper.GetOrInitGoogleFile = function (name, parentFolderId, type) {
    var logTag = "{GetOrInitFile} : ";
    //Logger.log(logTag+"Fetching file: ["+ name+"]; from folder: ["+parentFolderId+"]; of type: ["+type+"]");
    Logger.log(logTag+"Fetching file: ["+ name+"]");
    var parentFolder =  DriveApp.getFolderById(parentFolderId);
    var fileIterator = parentFolder.getFilesByName(name);
    
    var fileId;
    
    if (!fileIterator.hasNext()){
      Logger.log(logTag+"File not found: ["+ name+"]");
      
      if (type == "document")
      {
        var doc =  DocumentApp.create(name);
        
        fileId = doc.getId();
      }
      else if (type == "spreadsheet")
      {
        var spreadsheet =  SpreadsheetApp.create(name, 1, 2);
        
        InitVersionFieldForSpreadsheet(spreadsheet);
        
        fileId = spreadsheet.getId();
      }
      else
      {
        return null;
      }
      
      
      var file = DriveApp.getFileById(fileId);
      
      parentFolder.addFile(file);
      DriveApp.removeFile(file);
      
      //Logger.log(logTag+"File created: ["+ name+"] - ["+fileId+"]; in folder: ["+parentFolderId+"]; of type: ["+type+"]");
      Logger.log(logTag+"File created: ["+ name+"]");
    }
    else
    {
      fileId = fileIterator.next().getId();
      //Logger.log(logTag+"File found: ["+ name+"] - ["+fileId+"]; in folder: ["+parentFolderId+"]");
      Logger.log(logTag+"File found: ["+ name+"]");
    }
    
    return fileId;
  }
  
  /**
  *Gets folder by name or creates one
  *@param {string} name - the name of the folder to find/create
  *@param {string} parentId - id of parent folder, will use root if not given
  */
  DriveHelper.GetOrInitFolder = function(name, parentId) {
    var logTag = "{GetOrInitFolder} : ";
    var parentFolder = undefined;
    
    if (parentId == undefined) {
      parentFolder = DriveApp.getRootFolder();
    }
    else {
      parentFolder = DriveApp.getFolderById(parentId);
    }
      
    Logger.log(logTag+"Fetching folder: ["+ name+"]");
    var folderIterator =  parentFolder.getFoldersByName(name);
    
    var folderId;
    
    if (!folderIterator.hasNext()){
      Logger.log(logTag+"Folder not found: ["+ name+"]");
      
      var folder =  parentFolder.createFolder(name);
      folderId = folder.getId();
      
      //Logger.log(logTag+"Folder created: ["+ name+"] - ["+folderId+"]");
      Logger.log(logTag+"Folder created: ["+ name+"]");
    }
    else
    {
      folderId = folderIterator.next().getId();
      //Logger.log(logTag+"Folder found: ["+ name+"] - ["+folderId+"]");
      Logger.log(logTag+"Folder found: ["+ name+"]");
    }
    
    return folderId;
    
  }
  
  function InitVersionFieldForSpreadsheet(spreadsheet) {
    var sheet = spreadsheet.getSheets().pop();
    
    sheet.setName(versionSheetName);
    
    var range = sheet.getRange(1, 1, 1, 2);
    var values = range.getValues();
    //Logger.log(values);
    range.protect().setWarningOnly(true).setDescription("This represents file version for automated file updates - do not edit");
    var newValues = [[versionParamName, initVersionFlag]];
    
    range.setValues(newValues);
    
    
    var values = range.getValues();
    //Logger.log(values);
  }
  
  DriveHelper.GetVersionCell = function(spread){
    var versionSheet = spread.getSheetByName(versionSheetName);
    var range = versionSheet.getRange(1, 2);
    return range.getValue();
  }
  
  DriveHelper.SetVersionCell = function(spread, version){
    var versionSheet = spread.getSheetByName(versionSheetName);
    var range = versionSheet.getRange(1, 2);
    range.setValue(version);
  }
  
  DriveHelper.RemoveColumns = function(sheet) {
    var max = sheet.getMaxColumns();
    sheet.deleteColumns(1, max-1);
  }
  
  DriveHelper.RemoveRows = function(sheet) {
    var max = sheet.getMaxRows();
    sheet.deleteRows(1, max-1);
  }
  
  DriveHelper.RemoveColumnsAndRows = function(sheet) {
    DriveHelper.RemoveColumns(sheet);
    DriveHelper.RemoveRows(sheet);
  }
 
}( DriveHelper = DriveHelper || {} ));
