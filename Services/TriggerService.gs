function TriggerHook() {
  WEDataHelper.InitData();
  DataService.UpdateWordCounts();
  DashboardService.ResetDashboard();
}
