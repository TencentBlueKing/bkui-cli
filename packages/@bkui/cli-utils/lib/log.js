/*
* Tencent is pleased to support the open source community by making
* 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
*
* Copyright (C) 2021 Tencent. All rights reserved.
*
* 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) is licensed under the MIT License.
*
* License for 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition):
*
* ---------------------------------------------------
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
* documentation files (the "Software"), to deal in the Software without restriction, including without limitation
* the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
* to permit persons to whom the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of
* the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
* THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
* CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
* IN THE SOFTWARE.
*/
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

let logs = [];
let logTimes = null;

const format = (label, msg) => msg.split('\n').map((line, i) => (i === 0 ? `${label} ${line}` : line))
  .join('\n');

const printTimes = (name, prev) => {
  const time = process.hrtime.bigint();
  const ms = (time - prev) / 1000000n;
  const msg = `[${name}]: ${ms} ms`;
  if (typeof console.logTime === 'function') {
    console.logTime(msg);
  } else {
    console.log(msg);
  }
};

module.exports = {
  info(msg = '') {
    console.info(format(chalk.bgBlue.black(' INFO '), msg));
  },

  warn(msg = '') {
    console.warn(format(chalk.bgYellow.black(' WARN '), chalk.yellow(msg)));
  },

  done(msg = '') {
    console.log(format(chalk.bgGreen.black(' DONE '), msg));
  },

  error(msg = '') {
    console.error(format(chalk.bgRed.black(' ERROR '), chalk.red(msg)));
    console.error(msg);
  },

  time(label) {
    logTimes = logTimes || new Map();
    logTimes.set(label, process.hrtime.bigint());
  },

  timeLog(name, label) {
    const prev = logTimes.get(label);
    if (!prev) {
      throw new Error(`No such label '${label}' for timeLog()`);
    }
    printTimes(name, prev);
  },

  timeEnd(name, label) {
    const prev = logTimes.get(label);
    if (!prev) {
      throw new Error(`No such label '${label}' for timeEnd()`);
    }
    printTimes(name, prev);
    logTimes.delete(label);
  },

  clear() {
    typeof console.clear === 'function' && console.clear();
  },

  addLog(msg) {
    msg && logs.push({
      date: new Date().toISOString(),
      message: msg,
    });
  },

  clearLogs() {
    logs = [];
  },

  outputLogs() {
    const date = new Date().toISOString()
      .replace(/[:.]/g, '_');
    const logPath = path.resolve(__dirname, `../${date}-debug.txt`);
    const outputLog = logs.reduce((result, item) => {
      if (item.message) {
        return `${result}${item.message}\n`;
      }
      return result;
    }, '');
    outputLog && fs.writeFileSync(logPath, outputLog, (err) => {
      module.exports.error(err);
    });
  },
};
