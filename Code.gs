var WRITING_DATA = "1TpS1a09uQzb_s8dmt9QeotEI-nGbz_9p0dV4R0A_o6A";
var TEST_FILE = "1KSBh8UoKhUTs6ML1jtBeY71KPZC53YLJAGelnncksIQ";

function doGet(request) {
  WEDataHelper.InitData();
  //FileTrackService.AddFileToTrack(TEST_FILE);
  FileTrackService.GetTrackedFilesIds();
  //trigger();
  //logTriggers()
  
  return HtmlService.createTemplateFromFile('Index')
      .evaluate();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function getEmail() {
  return loadConfigData("Writing Total");//Session.getActiveUser().getEmail();
  
}

function trigger() {
    ScriptApp.newTrigger('triggerHook')
      .timeBased()
      .everyHours(1)
      .create();
}

function logTriggers() {
  var allTriggers = ScriptApp.getProjectTriggers();
  
  Logger.log("Trigger count: " + allTriggers.length);
}

function triggerHook() {
  
}

function find(value, range) {
  var data = range.getValues();
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].length; j++) {
      if (data[i][j] == value) {        
        return range.getCell(i + 1, j + 2);
      }
    }
  }
  return null;  
}

function loadConfigData(setting) {
  loadConfigData(setting, null); 
}

function loadConfigData(setting, defaultValue) {
 
 
  try {
    var ss = SpreadsheetApp.openById(WRITING_DATA);
  } catch (e) {
    throw new Error("CONFIGURATION: The writing spreadsheet with ID '" + WRITING_DATA + "' does not exist. Please point to a valid spreadsheet key.");    
  }
  
  var config_sheet = ss.getSheetByName("Config");
  var last_row = config_sheet.getLastRow();
  var range = config_sheet.getRange("A2:B" + last_row);
  var row = find(setting, range);
  if (row == null) {
    if (defaultValue == null) {
      throw new Error ("ERROR: Could not find setting '" + setting + "' in the Config tab.");   
    } else {
      row = defaultValue;
    }
  } else {
    var row_result = row.getRow();
    var result = config_sheet.getRange("B" + row_result).getValue();
    if (config_sheet.getRange("C" + row_result).getValue() == "Required" && result == "") {
      error_count++;
      Logger.log("ERROR: Required setting '" + setting + "' is not set on the Config tab.");
    }
    return result;
  }                           
}
