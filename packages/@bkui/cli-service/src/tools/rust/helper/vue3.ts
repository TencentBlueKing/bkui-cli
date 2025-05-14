import type {
  IFile,
  IContext,
} from '../../../types/type';

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
  getAbsolutePath,
  getRelativePath,
  getFileName,
  getDirName,
} from '../../../lib/util';

const getPreprocessOptions = (descriptor: SFCDescriptor, context: IContext) => {
  const {
    options,
    workDir,
  } = context;
  const preprocessLangMap = {
    sass: options.css?.sassLoaderOptions,
    scss: options.css?.scssLoaderOptions,
    less: options.css?.lessLoaderOptions,
    stylus: options.css?.stylusLoaderOptions,
  };
  const preprocessLang = descriptor.template!.lang as keyof typeof preprocessLangMap;
  const preprocessOptions = preprocessLangMap[preprocessLang];
  const postcssConfig = require(getAbsolutePath(workDir, 'postcss.config.js'));
  return {
    preprocessLang,
    preprocessOptions,
    postcssOptions: postcssConfig,
    postcssPlugins: postcssConfig?.plugins,
  };
};


const getTemplateOptions = (
  descriptor: SFCDescriptor,
  context: IContext,
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
  } = getPreprocessOptions(descriptor, context);
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
      whitespace: context.options.whitespace,
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
  originAbsoluteFilePath: string,
  context: IContext,
): IFile | null => {
  const fileName = getFileName(originAbsoluteFilePath);
  const hasScript = descriptor.script || descriptor.scriptSetup;
  const templateOptions = getTemplateOptions(descriptor, context, scopeId, fileName);
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
  const scriptOutputAbsoluteFilePath = `${getDirName(originAbsoluteFilePath)}/${fileName}.script.vue.${(compileScriptResult as SFCScriptBlock).lang || 'js'}`;
  const scriptOriginAbsoluteFilePath = `${getDirName(originAbsoluteFilePath)}/${fileName}.script.vue.js`;

  return {
    originAbsoluteFilePath: scriptOriginAbsoluteFilePath,
    outputAbsoluteFilePath: scriptOutputAbsoluteFilePath,
    content,
    needProcess: true,
  };
};

export const compileStyle = (
  descriptor: SFCDescriptor,
  scopeId: string,
  originAbsoluteFilePath: string,
  context: IContext,
): IFile | null => {
  if (descriptor.styles.length <= 0) {
    return null;
  }

  const fileName = getFileName(originAbsoluteFilePath);
  const outputAbsoluteFilePath = `${getDirName(originAbsoluteFilePath)}/${fileName}.vue.css`;

  const {
    preprocessLang,
    preprocessOptions,
    postcssOptions,
    postcssPlugins,
  } = getPreprocessOptions(descriptor, context);

  const styles = descriptor.styles.map((style) => {
    const compileStyleResult = compileSFCStyle({
      id: scopeId,
      filename: originAbsoluteFilePath,
      source: style.content,
      scoped: style.scoped,
      isProd: true,
      // modules: !!style.module,
      preprocessLang,
      preprocessOptions,
      postcssOptions,
      postcssPlugins,
    });
    return compileStyleResult.code;
  });

  return {
    originAbsoluteFilePath: outputAbsoluteFilePath,
    outputAbsoluteFilePath,
    content: styles.join('\n'),
    needProcess: false,
  };
};

export const compileEntry = (
  descriptor: SFCDescriptor,
  scopeId: string,
  originAbsoluteFilePath: string,
  context: IContext,
): IFile => {
  const fileName = getFileName(originAbsoluteFilePath);
  const outputAbsoluteFilePath = `${getDirName(originAbsoluteFilePath)}/${fileName}.vue.js`;
  const originRelativeFilePath = getRelativePath(context.workDir, originAbsoluteFilePath);

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
    originAbsoluteFilePath,
    outputAbsoluteFilePath,
    content,
    needProcess: false,
  };
};
