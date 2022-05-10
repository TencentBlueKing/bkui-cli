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
const moduleHelp = require('../../../util/module-helper');
const presetHelp = require('../../../util/preset-helper');
const loadTemplateConfig = require('./template-extend');

async function getManualData() {
  const { template, version } = await chooseTemplate();
  const answers = await answerTemplate(template, version);
  const preset = { template, version, answers };
  await updateRcFile(preset);
  return preset;
}

async function chooseTemplate() {
  const presetRcFile = presetHelp.presetRcFile || {};
  const templateList = presetRcFile.templates || {};

  const choices = Object.keys(templateList).map((key) => {
    const name = `${key}@${templateList[key]}`;
    const value = { template: key, version: templateList[key] };
    return { name, value };
  });
  const prompts = [{
    name: 'template',
    message: 'Choose a template',
    type: 'list',
    choices,
  }];
  const { template } = await ask(prompts);
  return template;
}

async function answerTemplate(template, version) {
  const isExistsModule = await moduleHelp.existsModule(template);
  if (!isExistsModule) await moduleHelp.installPackage([`${template}@${version}`, '-g']);
  // load & exec template prompts
  const customConfig = await loadTemplateConfig(template);
  const answers = customConfig.prompts.length ? await ask(customConfig.prompts) : [];
  return answers;
}

async function updateRcFile(preset, name) {
  // ask save or not
  const updatePrompt = [{ name: 'save', message: `Update preset ${name}?`, type: 'confirm' }];
  const addPrompt = [
    { name: 'save', message: 'Save as a preset?', type: 'confirm' },
    { name: 'presetName', message: 'Input a presetName', type: 'input', when: answer => (answer.save) },
  ];
  const prompts = name ? updatePrompt : addPrompt;
  const { save, presetName } = await ask(prompts);
  const key = name || presetName;
  if (save && key) {
    // update
    await presetHelp.modifyPresetFile((file) => {
      const presets = file.presets || {};
      presets[key] = preset;
    });
  }
}

module.exports = {
  getManualData,
  answerTemplate,
  updateRcFile,
};
