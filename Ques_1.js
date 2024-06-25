const Lib = require('./Lib');

const url = "https://asiayo.com/zh-tw/package/sport-activities/";
const _MyLib = new Lib();

async function mainProcess() {
  let htmlContent;

  htmlContent = await _MyLib.fetchContent(url);

  var csvContent = _MyLib.ParseHTML(htmlContent);

  _MyLib.WriteFile(csvContent, "activity.csv");
}

mainProcess();