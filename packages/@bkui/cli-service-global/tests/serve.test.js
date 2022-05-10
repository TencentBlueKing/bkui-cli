const { resolve } = require('path')
const PuppeteerServe = require('./puppeteerServe')

describe('测试单文件调试功能', () => {
  const binPath = resolve(__dirname, '../bin/index.js')
  const cwd = resolve(__dirname, '.')
  test('serve entry.vue', async () => {
    const puppeteerServe = new PuppeteerServe()
    await puppeteerServe.serve(binPath, ['serve', 'entry.vue'], { cwd })
    const txt = await puppeteerServe.getText('div')
    expect(txt).toMatch('vue')
    puppeteerServe.close()
  })
})
