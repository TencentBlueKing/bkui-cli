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
const ask = require('../../../util/ask');
const presetHelp = require('../../../util/preset-helper');
const assets = require('./assets');
const manual = require('./manual');
const preset = require('./preset');

async function generate(context) {
  const presetName = await choosePresetOrPrompt();
  let presetData;
  if (presetName === 'bkui-cli-custom') {
    presetData = await manual.getManualData();
  } else {
    presetData = await preset.getPresetData(presetName);
  }
  await assets.makeAssets(context, presetData);
}

async function choosePresetOrPrompt() {
  const presetRcFile = presetHelp.presetRcFile || {};
  const presets = presetRcFile.presets || {};

  const choices = [
    ...Object.keys(presets).map(preset => ({ name: preset, value: preset })),
    { name: 'Generate the project manually', value: 'bkui-cli-custom' },
  ];
  const prompts = [{
    name: 'presetName',
    message: 'Quickly generate project through presets, or manually',
    type: 'list',
    choices,
  }];
  const { presetName } = await ask(prompts);
  return presetName;
}

module.exports = generate;
