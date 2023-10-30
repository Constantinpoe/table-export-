function doGet(e) {
  try {
    // табла
    var sheetId = '1DRSCjzKcAs3EJt8T22-H7FVES2iSMPgoyFQpMRyCnOA';

    var params = e.parameter;

    // направляем по ключу компании бинома
    var sheetName = params.acc;
    if (!sheetName) {
      return ContentService.createTextOutput("нет ключа").setMimeType(ContentService.MimeType.TEXT);
    }

    var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
    if (!sheet) {
      return ContentService.createTextOutput("Лист не найден: " + sheetName).setMimeType(ContentService.MimeType.TEXT);
    }

    // парсим из а6 час пояс
    var timeZoneCell = sheet.getRange('A6').getValue();
    var timeZone = timeZoneCell.split('=')[1];
    if (!timeZone) {
      return ContentService.createTextOutput("нет час пояса A6").setMimeType(ContentService.MimeType.TEXT);
    }

    var lastRow = sheet.getLastRow();
    var firstEmptyRowAfterA7 = Math.max(7, lastRow + 1);

    // время из UNIX timestamp to Date
    var date = new Date(parseInt(params.time) * 1000);

    // Форматируем
    var formattedDate = Utilities.formatDate(date, timeZone, "MM/dd/yyyy HH:mm:ss");

    sheet.getRange('A' + firstEmptyRowAfterA7).setValue(params.exec);
    sheet.getRange('B' + firstEmptyRowAfterA7).setValue('contact');
    sheet.getRange('C' + firstEmptyRowAfterA7).setValue(formattedDate);

    return ContentService.createTextOutput("+").setMimeType(ContentService.MimeType.TEXT);
  } catch (error) {
    // Возвращаем ошибку, если что-то пошло не так
    return ContentService.createTextOutput("Произошла ошибка: " + error.message).setMimeType(ContentService.MimeType.TEXT);
  }
}
