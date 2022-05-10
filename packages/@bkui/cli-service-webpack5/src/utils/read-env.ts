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
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { appDirectory } from './bundle-config';
import { Envs } from '../typings/config';

export const applyEnv = function (mode: string = process.env.NODE_ENV): void {
  if (fs.existsSync(path.resolve(appDirectory, '.bk.env'))) {
    dotenvExpand(dotenv.config({
      path: path.resolve(appDirectory, '.bk.env'),
    }));
  }
  if (fs.existsSync(path.resolve(appDirectory, `.bk.env.${mode}`))) {
    dotenvExpand(dotenv.config({
      path: path.resolve(appDirectory, `.bk.env.${mode}`),
    }));
  }
  if (fs.existsSync(path.resolve(appDirectory, '.bk.env.local'))) {
    dotenvExpand(dotenv.config({
      path: path.resolve(appDirectory, '.bk.env.local'),
    }));
  }
};

export const resolveClientEnv = function (): Envs {
  const prefixRE = /^BK_/;
  const env: Envs = {};
  Object.keys(process.env).forEach((key) => {
    if (prefixRE.test(key)) {
      env[key] = process.env[key];
    }
  });

  return {
    'process.env': Object.keys(env).reduce((result: Envs, key: string) => {
      // eslint-disable-next-line no-param-reassign
      result[key] = JSON.stringify(env[key]);
      return result;
    }, {
      NODE_ENV: JSON.stringify(process.env.BK_NODE_ENV || process.env.NODE_ENV),
    }),
  };
};
