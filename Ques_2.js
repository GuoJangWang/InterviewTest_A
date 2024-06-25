const Lib = require("./Lib");

const csvFilePath = "./activity.csv";
const outputFilePath = "activity.json";

const _MyLib = new Lib();

async function mainProcess() {
  var csvData = await _MyLib.readFile(csvFilePath);
  var jsonData = _MyLib.csvToJson(csvData);
//   console.log(jsonData);
  _MyLib.WriteFile(jsonData,'activity.json');
}

mainProcess();
