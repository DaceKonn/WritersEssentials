var DashboardController;

(function( DashboardController, undefined ) { 
  
  DashboardController.GetDashboardData = function() {
    WEDataHelper.LoadData();
    
    var temp = {};
    AddStats(temp);
    AddFileTrack(temp);
    
    return temp;
  }
  
  DashboardController.AddFileToTrack = function(fileId) {
    WEDataHelper.LoadData();
    FileTrackService.AddFileToTrack(fileId);
  }
  
  DashboardController.GetFiles = function() {
    WEDataHelper.LoadData();
    var tracks = FileTrackService.GetTrackingInfo();
    var iterator = DriveApp.getFilesByType("application/vnd.google-apps.kix");
    var response = [];
    
    
    
    while (iterator.hasNext())
    {
      var file = iterator.next();
      var id = file.getId();
      if (tracks.map(function(e) {return e[0];}).indexOf(id) === -1)
      {
        response.push({ Id: file.getId(), Name: file.getName()});
      }
    }
    
    return response;
  }
  
  function AddStats(root) {
    var stats = DashboardService.GetStats();
    root.Stats = [];
    
    stats.forEach(function(item, index) {
      root.Stats.push({ Id: item[0], Value:item[1], DisplayName:item[2] });
    });
    
    var currentWordCountCheck = FileTrackService.CheckCurrentWordCount();
    root.Stats.push({ Id: "wordCountCheckTime", Value:currentWordCountCheck.checkTime, DisplayName:"Current word count check time" });
    root.Stats.push({ Id: "wordCountCheckValue", Value:currentWordCountCheck.wordCount, DisplayName:"Current word count check" });
    
    
  }
  
  function AddFileTrack(root) {
    var tracks = FileTrackService.GetTrackingInfo();
    var stats = DashboardService.GetFileStats();
    
    root.FileTrack = [];
    
    tracks.forEach(function(item, index) {
      var statsId = stats.map(function(e) {return e[0];}).indexOf(item[0]);
      
      var name = "";
      var wordCount = "untracked";
      var charCount = "untracked";
      var goal = "none";
      
      if (statsId > -1)
      {
        var fileStat = stats[statsId];
        name = fileStat[1];
        wordCount = fileStat[2];
        goal = fileStat[3];
        charCount = fileStat[6];
      }
      else {
        name = DriveApp.getFileById(item[0]).getName();
      }
      
      root.FileTrack.push({Name: name, WordCount: wordCount, Goal: goal, CharCount: charCount});
    });
  }
 
}( DashboardController = DashboardController || {} ));

function GetDashboardData(){
  var result = DashboardController.GetDashboardData();
  Logger.log(result);
  return result;
}

function AddFileToTrack(fileId){
  var result = DashboardController.AddFileToTrack(fileId);
}

function GetFiles() {
  var result = DashboardController.GetFiles();
  Logger.log(result);
  return result;
}