var maxStringLength = 80;

var sheetName = 'global_24';
var sheetRange = 'D1:D508';

var spreadsheet = SpreadsheetApp.getActive();
var sheet = spreadsheet.getSheetByName(sheetName);
var range = sheet.getRange(sheetRange);

function onOpen() {
  var menuItems = [
    {name: 'Check Strings', functionName: 'checkStrings'},
    {name: 'Clear Notes', functionName: 'clearNotes'}
  ];
  spreadsheet.addMenu('Translations', menuItems);
}

/* Given a preset cell range find long and multi line strings */
function checkStrings() {

  var data = range.getValues();
  var message;

  range.clearNote();

  for (var i = 0; i < data.length; i++) {
    var cellLoc = i + 1;
    message = '';

    if (typeof data[i][0] == 'number') {
      continue;
    }

    var tooManyLines = checkManyLines(cellLoc)

    if (tooManyLines) {
      message += 'Lines Expected: ' + tooManyLines[0] + ' Got: ' + tooManyLines[1] + '\n';
    }

    var isLineTooLong = checkLineTooLong(data[i][0]);

    if (isLineTooLong) {
      message += 'Length Expected: ' + maxStringLength + ' Got: ' + isLineTooLong + '\n';
    }

    if (message) {
      var cell = sheet.getRange('D' + cellLoc);
      cell.setNote(message);
     }
  }
}

/* Given a string check to see if more lines than its ja text */
function checkManyLines(cellLoc) {
    var string_en = sheet.getRange('D' + cellLoc).getValues()[0][0]
    var lines_en = string_en.split(/\n/).length;

    var string_ja = sheet.getRange('C' + cellLoc).getValues()[0][0]
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

/* Clear all notes in a preset range*/
function clearNotes() {
  range.clearNote();
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