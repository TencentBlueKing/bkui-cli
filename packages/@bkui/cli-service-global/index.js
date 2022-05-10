#!/usr/bin/env node
/*
* Tencent is pleased to support the open source community by making
* 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
*
* Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
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
const parseBoolean = (value = true) => {
  if (typeof value === 'string') {
    return value === 'true';
  }
  return Boolean(value);
};

module.exports = (program) => {
  program
    .command('serve <entry>')
    .description('Single file debugging and local directory proxy commands')
    .option('-p|--port <port>', 'Port', '8080')
    .option('-a|--host <host>', 'Address', '127.0.0.1')
    .option('-d|--showDir <showDir>', 'Whether to display the directory list', parseBoolean)
    .option('-c|--cache <cache>', 'Cache time', 3600)
    .option('-t|--timeout <timeout>', 'Time out', 120)
    .option('-P | --proxy <proxy>', 'Request proxy address')
    .option('-g | --gzip <gzip>', 'Gzip compression', parseBoolean)
    .option('--webpack <webpack>', 'Webpack configuration file path', '')
    .option('--no-dotfiles <dotfiles>', 'Whether to not show hidden files', parseBoolean)
    .option('--open <open>', 'Open in browser', parseBoolean)
    .action((entry, cmd) => {
      require('./lib/server')(entry, cmd);
    });
};
