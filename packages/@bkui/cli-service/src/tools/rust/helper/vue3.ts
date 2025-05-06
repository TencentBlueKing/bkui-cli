import type {
  IFile,
  IOptions,
  IContext,
} from '../../../types/type';

import path from 'node:path';
import type {
  SFCDescriptor,
  SFCScriptBlock,
  SFCTemplateCompileOptions,
  SFCTemplateCompileResults,
} from 'vue/compiler-sfc';
import {
  parse as compileSFCParse,
  compileScript as compileSFCScript,
  compileStyle as compileSFCStyle,
  compileTemplate as compileSFCTemplate,
} from 'vue/compiler-sfc';
import {
  getRelativePath,
} from '../../../lib/util';

const getFilePath = (relativeFilePath: string, fileName: string, context: IContext) => {
  return getRelativePath(context.workDir, path.join(path.dirname(relativeFilePath), fileName));
};

const getFileName = (relativeFilePath: string) => {
  return path.basename(relativeFilePath, path.extname(relativeFilePath));
};

const getPreprocessOptions = (descriptor: SFCDescriptor, options: IOptions) => {
  const preprocessLangMap = {
    sass: options.css?.sassLoaderOptions,
    scss: options.css?.scssLoaderOptions,
    less: options.css?.lessLoaderOptions,
    stylus: options.css?.stylusLoaderOptions,
  };
  const preprocessLang = descriptor.template!.lang as keyof typeof preprocessLangMap;
  const preprocessOptions = preprocessLangMap[preprocessLang] || options.css?.cssLoaderOptions;
  return {
    preprocessLang,
    preprocessOptions,
  };
};

const getTemplateOptions = (
  descriptor: SFCDescriptor,
  options: IOptions,
  scopeId: string,
  filename: string,
): SFCTemplateCompileOptions => {
  const block = descriptor.template;
  const hasScoped = descriptor.styles.some(s => s.scoped);
  const lang = descriptor.script?.lang || descriptor.scriptSetup?.lang;
  const isTS = !!(lang && /tsx?$/.test(lang));
  const {
    preprocessLang,
    preprocessOptions,
  } = getPreprocessOptions(descriptor, options);
  return {
    id: scopeId,
    source: block?.content || '',
    filename,
    scoped: hasScoped,
    slotted: descriptor.slotted,
    isProd: true,
    inMap: block?.src ? undefined : block?.map,
    preprocessLang,
    preprocessOptions,
    ssr: false,
    ssrCssVars: descriptor.cssVars,
    compilerOptions: {
      isTS,
      whitespace: options.whitespace,
      scopeId: `data-v-${scopeId}`,
      prefixIdentifiers: true,
      bindingMetadata: descriptor.script?.bindings,
    },
  };
};

export const parse = (content: string): SFCDescriptor => {
  const {
    descriptor,
  } = compileSFCParse(content);
  return descriptor;
};

export const compileScript = (
  descriptor: SFCDescriptor,
  scopeId: string,
  originRelativeFilePath: string,
  context: IContext,
): IFile | null => {
  const fileName = getFileName(originRelativeFilePath);
  const hasScript = descriptor.script || descriptor.scriptSetup;
  const templateOptions = getTemplateOptions(descriptor, context.options, scopeId, fileName);
  // compile
  const compileScriptResult = hasScript
    ? compileSFCScript(descriptor, {
      id: scopeId,
      isProd: true,
      inlineTemplate: true,
      templateOptions,
    })
    : compileSFCTemplate({
      ...templateOptions,
    });
  // 输出
  const content = hasScript
    ? (compileScriptResult as SFCScriptBlock).content
    : (compileScriptResult as SFCTemplateCompileResults).code;
  const scriptOutputRelativeFilePath = getFilePath(originRelativeFilePath, `${fileName}.script.vue.${(compileScriptResult as SFCScriptBlock).lang || 'js'}`, context);
  const scriptOriginRelativeFilePath = getFilePath(originRelativeFilePath, `${fileName}.script.vue.js`, context);

  return {
    originRelativeFilePath: scriptOriginRelativeFilePath,
    outputRelativeFilePath: scriptOutputRelativeFilePath,
    content,
    needProcess: true,
  };
};

export const compileStyle = (
  descriptor: SFCDescriptor,
  scopeId: string,
  originRelativeFilePath: string,
  context: IContext,
): IFile | null => {
  if (descriptor.styles.length <= 0) {
    return null;
  }

  const fileName = getFileName(originRelativeFilePath);
  const outputRelativeFilePath = getFilePath(originRelativeFilePath, `${fileName}.vue.css`, context);

  const {
    preprocessLang,
    preprocessOptions,
  } = getPreprocessOptions(descriptor, context.options);

  const styles = descriptor.styles.map((style) => {
    const compileStyleResult = compileSFCStyle({
      id: scopeId,
      filename: originRelativeFilePath,
      source: style.content,
      scoped: style.scoped,
      isProd: true,
      // modules: !!style.module,
      preprocessLang,
      preprocessOptions,
    });
    return compileStyleResult.code;
  });

  return {
    originRelativeFilePath: outputRelativeFilePath,
    outputRelativeFilePath,
    content: styles.join('\n'),
    needProcess: false,
  };
};

export const compileEntry = (
  descriptor: SFCDescriptor,
  scopeId: string,
  originRelativeFilePath: string,
  context: IContext,
): IFile => {
  const fileName = getFileName(originRelativeFilePath);
  const outputRelativeFilePath = getFilePath(originRelativeFilePath, `${fileName}.vue.js`, context);

  // 引入脚本
  const hasScript = descriptor.script || descriptor.scriptSetup;
  const scriptImportCode = hasScript
    ? `import script from './${fileName}.script.vue.js';\n`
    : `import { render } from './${fileName}.script.vue.js';\nconst script = { render };\n`;

  // 注入scopeId
  const hasScoped = descriptor.styles.some(s => s.scoped);
  const scopedCode = hasScoped ? `script.__scopeId = "data-v-${scopeId}";\n` : '';

  // fileName
  const fileNameCode = `script.__file = "${originRelativeFilePath}";\n`;

  // 注入css引用
  const hasStyleFile = descriptor.styles.length > 0;
  const styleImportCode = hasStyleFile ? `import './${fileName}.vue.css';\n` : '';

  // 导出
  const exportCode = 'export default script;';

  const content = `${scriptImportCode}${scopedCode}${fileNameCode}${styleImportCode}${exportCode}`;

  return {
    originRelativeFilePath,
    outputRelativeFilePath,
    content,
    needProcess: false,
  };
};
