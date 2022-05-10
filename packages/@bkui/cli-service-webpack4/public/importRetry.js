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
const webpack = require('webpack');
class AssetStaticReload {
  constructor({
    fmtRequireUrlFuncStr,
    cdnDomain,
  } = {}) {
    this.options = {
      fmtRequireUrlFuncStr: `function (htmlNode, chunkId, __webpack_require__, options){
            var modifyReloadQry = function(url, reloadTimes){
                if(/reloadAssets=(\\d+)&?/.test(url)){
                    return url.replace('reloadAssets='+reloadTimes, 'reloadAssets='+(1+reloadTimes));
                }
                return url + (url.indexOf('?')!=-1 ? '&':'?') + 'reloadAssets='+(reloadTimes+1);
            }
            options = options || {
                LINK: 0,
                SCRIPT: 0
            };
            var nodeName = htmlNode.nodeName;
            var reloadTimes = options[nodeName] || 0;
            var linkKey = 'src';
            if(nodeName =='LINK'){
                linkKey = 'href';
            }
            if(!htmlNode[linkKey]) return;
            if(reloadTimes == 0 || reloadTimes > 2) return;
            var replaceUrl = modifyReloadQry(htmlNode[linkKey], reloadTimes-1);
            ${
  cdnDomain
    ? `if(reloadTimes == 2){replaceUrl = replaceUrl.replace('${
      cdnDomain
    }', location.hostname)}`
    : ''
}
            
            htmlNode[linkKey] = replaceUrl;
        }`,
    };
    if (fmtRequireUrlFuncStr) {
      this.options.fmtRequireUrlFuncStr =                typeof fmtRequireUrlFuncStr === 'function'
        ? fmtRequireUrlFuncStr.toString()
        : fmtRequireUrlFuncStr;
    }
  }
  apply(compiler) {
    compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
      const {
        Template,
      } = webpack;
      const {
        mainTemplate,
      } = compilation;
      mainTemplate.hooks.requireExtensions.tap('assets-static-reload', source => source.replace(
        'function requireEnsure(chunkId) {',
        'function requireEnsure(chunkId, options) {',
      ));
      mainTemplate.hooks.bootstrap.tap('assets-static-reload', (source) => {
        if (!source) {
          return;
        }
        /** 全局加入降级函数 */
        return Template.asString([
          source,
          `window.fmtRequireUrl = ${this.options.fmtRequireUrlFuncStr}`,
        ]);
      });
      mainTemplate.hooks.beforeStartup.tap(
        'assets-static-reload',
        (source) => {
          if (!source) {
            return;
          }
          /** 重写webpack-require */
          const newRequireEnsure = `function newRequireEnsure (chunkId, options) {
                    return __webpack_require__.oldE(chunkId, options).then(function () {}, function (err) {
                        console.error(err);
                        var type;
                        if (/.*\\.css\\??/.test(err.request)) {
                            type = 'LINK';
                        } else if (/.*\\.js\\??.*/.test(err.request)) {
                            type = 'SCRIPT';
                        }
                        if (options === undefined) {
                            options = {
                                LINK: 0,
                                SCRIPT: 0
                            };
                        }
                        options[type]++;
                        // 最小值为1
                        if (options[type] <= 2) {
                            return newRequireEnsure(chunkId, options);
                        }
                    })
                }`;

          return Template.asString([
            source,
            '__webpack_require__.oldE = __webpack_require__.e;',
            `__webpack_require__.e = ${newRequireEnsure}`,
          ]);
        },
      );

      mainTemplate.hooks.requireEnsure.tap(
        'assets-static-reload',
        (source) => {
          const cssHackReplace = 'linkTag.href = fullhref;';
          // eslint-disable-next-line no-param-reassign
          source = source.replace(
            cssHackReplace,
            Template.asString([
              cssHackReplace,
              'window.fmtRequireUrl && window.fmtRequireUrl(linkTag, chunkId, __webpack_require__, options);',
            ]),
          );
          const jsHackReplace = 'script.src = jsonpScriptSrc(chunkId);';
          // eslint-disable-next-line no-param-reassign
          source = source.replace(
            jsHackReplace,
            Template.asString([
              jsHackReplace,
              'window.fmtRequireUrl && fmtRequireUrl(script, chunkId, __webpack_require__, options);',
            ]),
          );
          return source;
        },
      );
    });
  }
}
module.exports = AssetStaticReload;
