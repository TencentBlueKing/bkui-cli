const puppeteer = require('puppeteer')
const execa = require('execa')
const stripAnsi = require('strip-ansi')

module.exports = class PuppeteerServe {
  constructor(options) {
    this.options = options
    this.browser = null
    this.page = null
    this.logs = []
    this.requestUrls = []
    this.childProcess = null
  }

  async launch(url) {
    this.browser = await puppeteer.launch(url)
    this.page = await this.browser.newPage()

    this.page.on('console', msg => this.logs.push(msg.text()))
    await this.page.setRequestInterception(true)
    this.page.on('request', (interceptedRequest) => {
      this.requestUrls.push(interceptedRequest.url())
      interceptedRequest.continue()
    })

    await this.page.goto(url)

    return this
  }

  async serve(cmd, args, opts) {
    return new Promise((resolve, reject) => {
      this.childProcess = execa(cmd, args, opts)

      let isFirstMatch = true
      this.childProcess.stdout.on('data', async (_data) => {
        try {
          const data = _data.toString()
          const urlMatch = data.match(/http:\/\/[^/]+\//)
          if (urlMatch && isFirstMatch) {
            isFirstMatch = false
            let [url] = urlMatch

            // fix "Protocol error (Page.navigate): Cannot navigate to invalid URL undefined" error
            // when running test in vscode terminal(zsh)
            url = stripAnsi(url)
            const { page, browser, requestUrls, logs } = await this.launch(url)
            resolve({
              browser,
              page,
              url,
              logs
            })
          } else if (data.match(/Failed to compile/)) {
            await this.close()
            reject(data)
          }
        } catch (err) {
          await this.close()
          reject(err)
        }
      })

      this.childProcess.on('exit', async (code) => {
        if (code !== 0) {
          await this.close()
          reject(`serve exited with code ${code}`)
        }
      })
    })
  }

  async close() {
    this.browser && await this.browser.close()
    this.browser = null

    this.childProcess && this.childProcess.stdin.write('close')
    this.childProcess = null
  }

  getText(selector) {
    if (!this.page || !selector) return ''

    return this.page.evaluate(selector => document.querySelector(selector).textContent, selector)
  }

  hasElement(selector) {
    if (!this.page || !selector) return false

    return this.page.evaluate(selector => !!document.querySelector(selector), selector)
  }

  hasClass(selector, cls) {
    if (!this.page || !selector) return false

    return this.page.evaluate((selector, cls) => {
      const el = document.querySelector(selector)
      return el && el.classList.contains(cls)
    }, selector, cls)
  }
}
