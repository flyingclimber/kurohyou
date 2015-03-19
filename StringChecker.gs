var maxNumberOfLines = 3
var maxStringLength = 80;

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

  var message

  range.clearNote()

  for (var i = 0; i < data.length; i++) {
    cellLoc = i + 1
    message = ''

    if (typeof data[i][0] == 'number') {
      continue;
    }

    tooManyLines = checkManyLines(data[i][0])
  
    if (tooManyLines) {
      message = 'Lines Expected: ' + maxNumberOfLines + ' Got: ' + tooManyLines + '\n'
    }
    
    isLineTooLong = checkLineTooLong(data[i][0])

    if (isLineTooLong) {
      isLineTooLongText = 'Length Expected: ' + maxStringLength + ' Got: ' + isLineTooLong
      message = message + isLineTooLongText
    }
    
    if (message) {
      var cell = sheet.getRange('D' + cellLoc)
      cell.setNote(message)
     }
  }
}

/* Given a string check to see if its more than maxNumberOfLines */
function checkManyLines(string) {
  var lines = string.split(/\n/).length;
  
  result = (lines > maxNumberOfLines) ? lines : false;
  
  return result
}

/* Given a string check to see if any of its lines are longer than maxStringLength */
function checkLineTooLong(string) {
  var tooLong = false;
  var strings = string.split(/\n/);
  
  for(var i = 0; i < strings.length; i++) {
    if (strings[i].length > maxStringLength) {
      result = strings[i].length;
      break;
    }
  }

  return result;
}
