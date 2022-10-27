const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe("the heading class", () => {

  it("should have font with 50 pixel size", async () => {
    const fontSize = await page.$eval("div", (div) => {
      let style = window.getComputedStyle(div);
      return style.getPropertyValue("font-size");
    });

    expect(fontSize).toEqual("50px");
  });

  it("should have bold font", async () => {
    const fontWeight = await page.$eval("div", (div) => {
      let style = window.getComputedStyle(div);
      return style.getPropertyValue("font-weight");
    });

    expect(fontWeight).toEqual("700");
  });

  it("should have Lucida Grande font", async () => {
    const fontFamily = await page.$eval("div", (div) => {
      let style = window.getComputedStyle(div);
      return style.getPropertyValue("font-family");
    });

    expect(fontFamily).toEqual('"Lucida Grande"');
  });

  it("should have centered text", async () => {
    const textAlign = await page.$eval("div", (div) => {
      let style = window.getComputedStyle(div);
      return style.getPropertyValue("text-align");
    });
    
    expect(textAlign).toEqual("center");
  });

  it("should have lower case text", async () => {
    const textTransform = await page.$eval("div", (div) => {
      let style = window.getComputedStyle(div);
      return style.getPropertyValue("text-transform");
    });
    
    expect(textTransform).toEqual("lowercase");
  });
});
