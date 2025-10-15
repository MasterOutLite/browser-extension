#### Test macros

https://script.google.com/macros/s/AKfycbxffjjttcceGT67kHJO9ahoYyHKx1DKhEDmKVT2yJfTtVXYQ9pqfcD5cBWE4A8omgZB/exec

### Example vacancy

https://pl.indeed.com/praca?q=React&sc=0kf%3Aattr%28DSQF7%29%3B&rbl=zdalnie&jlid=f5e3f7d1cbcc32b2&vjk=4d687cf361b85e73

### App Script

Script for insert data

```
function doPost(request) {
  let response = {};

  Logger.log(request)
  try {
    response = JSON.parse(request.postData.contents) || {};
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ succes: false, message: 'No valid parametr', err, request }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (!response?.data || !Array.isArray(response.data))
    return ContentService.createTextOutput(JSON.stringify({ succes: false, message: 'Some atribute null.', request }))
      .setMimeType(ContentService.MimeType.JSON);

  response?.data
    .filter(v => Boolean(v) && Boolean(v.name) && Boolean(v.ref))
    .map(v => {
      const { name, ref, companyName, date } = v;

      const sheet = SpreadsheetApp.getActiveSheet();
      const lastRow = sheet.getLastRow() + 1;

      sheet.getRange(lastRow, 1).setValue(name);
      sheet.getRange(lastRow, 2).setValue(companyName);
      sheet.getRange(lastRow, 3).setValue(new Date());
      sheet.getRange(lastRow, 4).setValue(date || '');
      sheet.getRange(lastRow, 5).setValue(ref);
    });

  const result = { succes: true, data: response?.data };

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
```
