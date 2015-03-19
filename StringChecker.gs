function onOpen() {
  var spreadsheet = SpreadsheetApp.getActive();
  var menuItems = [
    {name: 'Find overly long strings...', functionName: 'findLongStrings'},
  ];
  spreadsheet.addMenu('Translations', menuItems);
}

/* Given a defined cell range find long and multi line strings */
function findLongStrings() {
  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getSheetByName('global_24');  

  var range = sheet.getRange('D1:D508')
  var data = range.getValues();
  
  var tooManyLinesText = 'Over 3 lines of text\n'
  var isLineTooLongText = 'Over 80 characters on a single line\n'

  var message

  range.clearNote()

  for (var i = 0; i < data.length; i++) {
    cellLoc = i + 1
    message = ''
    
    if (typeof data[i][0] == 'number') {
      continue;
    }
  
    if (tooManyLines(data[i][0])) {
      message = tooManyLinesText
    }
    
    if (isLineTooLong(data[i][0])) {
      message = message + isLineTooLongText
    }
    
    if (message) {
      var cell = sheet.getRange('D' + cellLoc)
      cell.setNote(message)
     }
  }
}

/* Given a string check to see if its more than maxNumberOfLines */
function tooManyLines(string) {
  var maxNumberOfLines = 3
  var lines = string.split(/\n/).length;
  
  result = (lines > maxNumberOfLines) ? true : false;
  
  return result
}

/* Given a string check to see if any of its lines are longer than maxStringLength */
function isLineTooLong(string) {
  var maxStringLength = 80;
  var tooLong = false;
  var strings = string.split(/\n/);
  
  for(var i = 0; i < strings.length; i++) {
    if (strings[i].length > maxStringLength) {
      result = true;
      break;
    }
  }
  
  return result;
}
