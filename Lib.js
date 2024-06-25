const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const fsp = require("fs").promises;
const fs = require("fs");
const csv = require("csv-parser");

class MyLib {
  ParseHTML(html) {
    const $ = cheerio.load(html);

    const activities = [];

    // 從解析後的DOM中找到所有活動資訊
    $(".sc-bTUVah.hQmcPY").each((index, element) => {
      const title = $(element)
        .find(".sc-JHWBx.ekLBiL")
        .text()
        .replace(/([\u4E00-\u9FFF]+)\s.*/, "$1");
      let price = $(element).find(".sc-bRlCZA.nucFW").text();
      price = extractPrice(price);

      // 將資料加入activities陣列
      activities.push({
        title: title,
        price: price,
      });
    });

    // 格式化資料並準備輸出到CSV檔案
    let csvContent = "賽事名稱\t每人最低價\n";
    activities.forEach((activity) => {
      csvContent += `${activity.title}\t${activity.price}\n`;
    });

    return csvContent;
  }

  async fetchContent(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle2" }); // 等待網頁完全加載

    const html = await page.content(); // 取得完整的HTML內容
    await browser.close();

    return html;
  }

  WriteFile(fileData, fileName) {
    fs.writeFileSync(fileName, fileData, "utf8");
  }

  async readFile(filePath) {
    let dataContent;
    dataContent = fsp.readFile(filePath, "utf-8");
    return dataContent;
  }

  csvToJson(csv) {
    const lines = csv.trim().split("\n");
    const headers = lines[0].split("\t");

    const result = lines.slice(1).map((line) => {
      const values = line.split("\t");
      let obj = {};

      headers.forEach((header, index) => {
        if (header === "每人最低價") {
          obj[header] = values[index] ? Number(values[index]) : null;
        } else {
          obj[header] = values[index];
        }
      });

      return obj;
    });

    let jsonResult = JSON.stringify(result);

    return jsonResult;
  }
}

function extractPrice(data) {
  // 使用正規表達式來匹配 "NT$xxxxxxxx" 格式的價格
  const regex = /NT\$([0-9,]+)/;

  // 用空白分割每筆資料
  const parts = data.split(" ");

  // 找到第一個符合條件的價格部分
  for (let part of parts) {
    const match = regex.exec(part);
    if (match) {
      // 將匹配到的價格部分返回，去掉 "NT$"
      return match[1].replace(",", ""); // 如果有千分位逗號，去除掉
    }
  }

  // 如果沒有找到符合的價格，返回空字符串或者其他適當的值
  return "";
}

module.exports = MyLib;
