// .scss/.sass processor
const scss = (source: string, map: boolean, options: any) => {
  const nodeSass = require('sass');
  const finalOptions = {
    ...options,
    data: getSource(source, options.filename, options.additionalData),
    file: options.filename,
    outFile: options.filename,
    sourceMap: !!map,
  };

  const result = nodeSass.renderSync(finalOptions);
  const dependencies = result.stats.includedFiles;
  return { code: result.css.toString(), errors: [], dependencies };
};

// .sass
const sass = (source: string, map: boolean, options: any) => scss(source, map, {
  ...options,
  indentedSyntax: true,
});

// .less
const less = async (source: string, map: boolean, options: any) => {
  const nodeLess = require('less');

  const result = await nodeLess.render(
    getSource(source, options.filename, options.additionalData),
    { ...options },
  );

  return {
    code: result.css.toString(),
    errors: [],
    dependencies: result.imports,
  };
};

// .styl
const styl = (source: string, map: boolean, options: any) => {
  const nodeStylus = require('stylus');
  const ref = nodeStylus(source);
  Object.keys(options).forEach(key => ref.set(key, options[key]));
  if (map) ref.set('sourcemap', { inline: false, comment: false });

  const result = ref.render();
  const dependencies = ref.deps();

  return { code: result, errors: [], dependencies };
};

// .postcss
const postcss = (source: string, map: boolean, options: any) => {
  const postcss = require('postcss');
  const result = postcss(options.plugins || []).process(source);
  return { code: result.css, errors: [], dependencies: [] };
};

// 获取源码
const getSource = (
  source: string,
  filename: string,
  additionalData: string | ((source: string, filename: string) => string),
) => {
  if (!additionalData) return source;
  if (typeof additionalData === 'function') {
    return additionalData(source, filename);
  }
  return additionalData + source;
};

// 转换预处理器
export const transformPreprocessor = (source: string, lang: string, options: any) => {
  const processors = {
    less,
    sass,
    scss,
    styl,
    stylus: styl,
    postcss,
  };
  const processor = processors[lang];
  return processor(source, false, options);
};
