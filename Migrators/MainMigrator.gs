
var MainMigrator;

(function( MainMigrator, undefined ) { 
  
  var configV = undefined;
  var dataV = undefined;
  var fileV = undefined;
  
  MainMigrator.Run = function() {
    ConfigSpreadsheetMigrator.Load();
    FileTrackSpreadsheetMigrator.Load();
    DataSpreadsheetMigrator.Load();
    
    GetVersions();
    
    if (!VerifyMigrationPackage0()){
      Logger.log("Migration Package 0 failed!");
    }
    
    if (!VerifyMigrationPackage1()){
      RunMigrationPackage1();
    }
    if (!VerifyMigrationPackage2()){
      Logger.log("Mock : Applying migration package 2");
    }
  }
  
  function VerifyMigrationPackage0() {
    return configV >= 0 && dataV >= 0 && fileV >= 0;
  }
  
  function VerifyMigrationPackage1() {
    return configV >= 1 && dataV >= 1 && fileV >= 1;
  }
  
  function VerifyMigrationPackage2() {
    return configV >= 2 && dataV >= 2 && fileV >= 2;
  }
  
  function RunMigrationPackage1() {
    Logger.log("Applying migration package 1");
    if (dataV < 1) DataSpreadsheetMigrator.MigrateToVersion1();
    if (fileV < 1) FileTrackSpreadsheetMigrator.MigrateToVersion1();
    if (configV < 1) ConfigSpreadsheetMigrator.MigrateToVersion1();
  }
  
  function GetVersions() {
    configV = ConfigSpreadsheetMigrator.GetVersion();
    dataV = DataSpreadsheetMigrator.GetVersion();
    fileV = FileTrackSpreadsheetMigrator.GetVersion();
  }
 
}( MainMigrator = MainMigrator || {} ));