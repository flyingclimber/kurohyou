var maxStringLength = 80;
var spreadsheet = SpreadsheetApp.getActive();

function onOpen() {
  var menuItems = [
    {name: 'Check Curent Sheet', functionName: 'checkCurrentSheet'}
    {name: 'Check Done Files', functionName: 'checkDoneFiles'},
  ];
  spreadsheet.addMenu('Translations', menuItems);
}

/* Given a cell range find long and multi line strings */
function checkStrings(cellRange, enColumn, jaColumn) {
  if (typeof cellRange === 'undefined') { cellRange = range ; }

  var data = cellRange.getValues();
  var message;

  range.clearNote();

  for (var i = 0; i < data.length; i++) {
    var cellLoc = i + 1;
    message = '';

    if (typeof data[i][0] == 'number') {
      continue;
    }

    var tooManyLines = checkManyLines(cellLoc, enColumn, jaColumn)

    if (tooManyLines) {
      message += 'Lines Expected: ' + tooManyLines[0] + ' Got: ' + tooManyLines[1] + '\n';
    }

    var isLineTooLong = checkLineTooLong(data[i][0]);

    if (isLineTooLong) {
      message += 'Length Expected: ' + maxStringLength + ' Got: ' + isLineTooLong + '\n';
    }

    if (message) {
      Logger.log(cellRange.getSheet().getName() + ": " + message)
      var cell = sheet.getRange(enColumn + cellLoc);
      cell.setNote(message);
     }
  }
}

/* Given a string check to see if more lines than its ja text */
function checkManyLines(cellLoc, enColumn, jaColumn) {
    var string_en = sheet.getRange(enColumn + cellLoc).getValues()[0][0]
    var lines_en = string_en.split(/\n/).length;

    var string_ja = sheet.getRange(jaColumn + cellLoc).getValues()[0][0]
    var lines_ja = string_ja.split(/\n/).length;

    result = (lines_en > lines_ja) ? [lines_ja, lines_en] : false

    return result;
}

/* Given a string check to see if any of its lines are longer than maxStringLength */
function checkLineTooLong(string) {
  var tooLong = false;
  var strings = string.split(/\n/);
  var result;
  
  for(var i = 0; i < strings.length; i++) {
    if (strings[i].length > maxStringLength) {
      result = strings[i].length;
      break;
    }
  }

  return result;
}

function checkCurrentSheet() {
    var sheetRange = "D1:D";

    sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    range = sheet.getRange(sheetRange);

    checkStrings(range, 'D', 'C');
}

/* Validate all files in the 'Done' folder */
function checkDoneFiles() {
  var folders = DriveApp.getFoldersByName('Done');

  while (folders.hasNext()) {
    var files = folders.next().getFiles();

    while (files.hasNext()) {
       sheet = SpreadsheetApp.open(files.next()).getSheets()[0];
       sheetRange = 'E1:E';
       range = sheet.getRange(sheetRange);

       checkStrings(range, 'E', 'C');
    }
 }
}

/* Log all current notes to the console*/
function getNotes() {
  results = range.getNotes();
  for (var i in results) {
   for (var j in results[i]) {
     if (results[i][j]) {
       Logger.log("Row: " + i + " " + results[i][j]);
     }
   }
  }
}