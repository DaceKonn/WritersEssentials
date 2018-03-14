function doGet(request) {
  WEDataHelper.InitData();

  return HtmlService.createTemplateFromFile('Index')
      .evaluate()
  .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}