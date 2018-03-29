var WordCountProcessor;

(function( WordCountProcessor, undefined ) {   
  
  function getWordCount(text) {
    text = text.replace(/(^\s*)|(\s*$)/gi,"");
    text = text.replace(/[ ]{2,}/gi," ");
    text = text.replace(/\n/g," "); 
    return text.split(' ').length;
  }
  WordCountProcessor.GetWordCount = getWordCount;
  
  function getCharCount(text) {
    text = text.replace(/(^\s*)|(\s*$)/gi,"");
    text = text.replace(/[ ]{2,}/gi,"");
    text = text.replace(/\n/g,""); 
    return text.length;
  }
  WordCountProcessor.GetCharCount = getCharCount;
  
}( WordCountProcessor = WordCountProcessor || {} ));

function Get_WordCount_Test(){
  var sampleText = "W szczebrzeszynie chrząszcz brzmi w trzcinie bo szczebrzeszyn z tego słynie sia ba da";
  Logger.log(WordCountProcessor.GetWordCount(sampleText));
}

function Get_CharCount_Test(){
  var sampleText = "W szczebrzeszynie chrząszcz brzmi w trzcinie bo szczebrzeszyn z tego słynie sia ba da";
  Logger.log(WordCountProcessor.GetCharCount(sampleText));
}

function Get_CharCount_Test_B(){
  var sampleText = DocumentApp.openById('').getText();
  Logger.log(WordCountProcessor.GetCharCount(sampleText));
}