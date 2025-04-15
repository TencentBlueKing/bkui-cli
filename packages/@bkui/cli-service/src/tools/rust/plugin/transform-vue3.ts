import type {
  FileProcessHandler,
  IOptions,
} from '../../../types/type';

import path from 'node:path';
import type {
  SFCDescriptor,
  SFCTemplateCompileOptions,
} from 'vue/compiler-sfc';
import {
  parse as compileSFCParse,
  compileScript as compileSFCScript,
  compileStyle as compileSFCStyle,
} from 'vue/compiler-sfc';

const getFilePath = (filePath: string, fileName: string) => {
  return path.join(path.dirname(filePath), fileName);
};

const getFileName = (filePath: string) => {
  return path.basename(filePath, path.extname(filePath));
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
): Partial<SFCTemplateCompileOptions> => {
  const block = descriptor.template;
  if (!block) {
    return {};
  }
  const hasScoped = descriptor.styles.some(s => s.scoped);
  const lang = descriptor.script?.lang || descriptor.scriptSetup?.lang;
  const isTS = !!(lang && /tsx?$/.test(lang));
  const {
    preprocessLang,
    preprocessOptions,
  } = getPreprocessOptions(descriptor, options);
  return {
    id: scopeId,
    scoped: hasScoped,
    slotted: descriptor.slotted,
    isProd: true,
    inMap: block.src ? undefined : block.map,
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
  filePath: string,
  options: IOptions,
): Awaited<ReturnType<FileProcessHandler>>[0] => {
  const compileScriptResult = compileSFCScript(descriptor, {
    id: scopeId,
    isProd: true,
    inlineTemplate: true,
    templateOptions: getTemplateOptions(descriptor, options, scopeId),
  });

  const fileName = getFileName(filePath);
  const outputFilePath = getFilePath(filePath, `${fileName}.script.vue.${compileScriptResult.lang || 'js'}`);

  return {
    filePath: outputFilePath,
    content: compileScriptResult.content,
    needProcess: true,
  };
};

export const compileStyle = (
  descriptor: SFCDescriptor,
  scopeId: string,
  filePath: string,
  options: IOptions,
): Awaited<ReturnType<FileProcessHandler>>[0] | null => {
  if (descriptor.styles.length <= 0) {
    return null;
  }

  const fileName = getFileName(filePath);
  const outputFilePath = getFilePath(filePath, `${fileName}.vue.css`);

  const {
    preprocessLang,
    preprocessOptions,
  } = getPreprocessOptions(descriptor, options);

  const styles = descriptor.styles.map((style) => {
    const compileStyleResult = compileSFCStyle({
      id: scopeId,
      filename: filePath,
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
    filePath: outputFilePath,
    content: styles.join('\n'),
    needProcess: false,
  };
};

export const compileEntry = (
  descriptor: SFCDescriptor,
  scopeId: string,
  filePath: string,
): Awaited<ReturnType<FileProcessHandler>>[0] => {
  const fileName = getFileName(filePath);
  const outputFilePath = getFilePath(filePath, `${fileName}.vue.js`);

  // 引入脚本
  const scriptImportCode = `import script from './${fileName}.script.vue.js';\n`;

  // 注入scopeId
  const hasScoped = descriptor.styles.some(s => s.scoped);
  const scopedCode = hasScoped ? `script.__scopeId = "data-v-${scopeId}";\n` : '';

  // fileName
  const fileNameCode = `script.__file = "${filePath}";\n`;

  // 注入css引用
  const hasStyleFile = descriptor.styles.length > 0;
  const styleImportCode = hasStyleFile ? `import './${fileName}.vue.css';\n` : '';

  // 导出
  const exportCode = 'export default script;';

  const content = `${scriptImportCode}${scopedCode}${fileNameCode}${styleImportCode}${exportCode}`;

  return {
    filePath: outputFilePath,
    content,
    needProcess: true,
  };
};
