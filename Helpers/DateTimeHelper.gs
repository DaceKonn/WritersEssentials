var DateTimeHelper;

(function( DateTimeHelper, undefined ) { 

  function getCalendarTimeZone(){
    return CalendarApp.getDefaultCalendar().getTimeZone();
  }
  
  DateTimeHelper.GetCalendarTimeZone = getCalendarTimeZone;
  
  DateTimeHelper.GetSessionTimeZone = function() {
    return Session.getScriptTimeZone();
  }
  
  DateTimeHelper.GetNowUTC = function() {
    return DateTimeHelper.FormatToUTC(new Date());
  }
  
  DateTimeHelper.GetNowCalendar = function() {
    return DateTimeHelper.FormatToCalendar(new Date());
  }
  
  DateTimeHelper.ReformatUTCToCaldendar = function(utcDate) {
    var preFormat = new Date(utcDate);
    return DateTimeHelper.FormatToCalendar(preFormat);
  }
  
  DateTimeHelper.FormatToUTC = function(inputDate) {
    return Utilities.formatDate(inputDate, "UTC", "yyyy-MM-dd'T'HH:mm:ss'Z'");
  }
  
  DateTimeHelper.FormatToCalendar = function(inputDate) {
    Utilities.formatDate(inputDate, DateTimeHelper.GetCalendarTimeZone(), "yyyy-MM-dd HH:mm:ss z Z");
  }
  
}( DateTimeHelper = DateTimeHelper || {} ));

function Get_TimeZone_Test() {
  Logger.log("Calendar TimeZone: "+DateTimeHelper.GetCalendarTimeZone());
  Logger.log("Session  TimeZone: "+DateTimeHelper.GetSessionTimeZone());
  
  Logger.log("Now Calendar: "+DateTimeHelper.GetNowCalendar());
  Logger.log("Now UTC: "+DateTimeHelper.GetNowUTC());
  
  var date = new Date();
  Logger.log("FormatToCalendar: "+DateTimeHelper.FormatToCalendar(date));
  Logger.log("FormatToUTC: "+DateTimeHelper.FormatToUTC(date));
}