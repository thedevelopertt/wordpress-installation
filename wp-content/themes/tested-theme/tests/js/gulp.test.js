const {getWebSockDebuggerUrl, initializePuppeteer, connectLocalPuppeteer, createIncognitoContext, createPage, createProxyWithPath, browserSyncProxy} = require("../../gulpfile")
const _puppeteer = require("puppeteer")

test("Test WebSocket Debugger Url", async () => {
    const _instance = await initializePuppeteer();
    const url = await getWebSockDebuggerUrl();
    expect(url.length).toBeGreaterThan(1);
    console.log(url)
    _instance.close()
})

test('Connects to Local Puppeteer', async () => {
    const _instance = await initializePuppeteer();
    const _browser = await connectLocalPuppeteer();

    expect(_browser).toBeDefined();
    await _browser.close();
    await _instance.close();
})

test("Create IncognitoContext with Device Size at Url returns the Page", async () => {
    const _instance = await initializePuppeteer();
    const _context = await createIncognitoContext();
    expect(_context).toBeDefined();
},10000)


test('Test the creation of multiple new Page using incognitoContext', async () => {
    const _instance = await initializePuppeteer();
    const _context = await createIncognitoContext();

    const _urlToTest = "https://google.com";
    let urlToTest = _urlToTest;

    const pageOne = await createPage(urlToTest,'iPhone 8',_context);
    expect(pageOne).toBeDefined();

    const pageTwo = await createPage(urlToTest,undefined,_context);
    expect(pageTwo).toBeDefined();


})

test('Tests creation of Regular Page takes url and device type returns the Page', async () => {
    const _instance = await initializePuppeteer();
    const page = await createPage("https://google.com");

    expect(page).toBeDefined();
    await page.close();

    const devicePage = await createPage("https://thedevelopertt.ml","iPhone 8")
    expect(devicePage).toBeDefined();
    await devicePage.close();

    const undefinedUrlAndDevice = await createPage();
    expect(undefinedUrlAndDevice).toBeDefined();

    await undefinedUrlAndDevice.close();

    await _instance.close();
},20000)

test('BrowserSync Url', async () => {
    const path = createProxyWithPath("/-developer")
    const result = browserSyncProxy+"-developer";
    expect(path).toBe(result)

    const path2 = createProxyWithPath("-developer")
    expect(path).toBe(result);
    console.log(path, path2);
})