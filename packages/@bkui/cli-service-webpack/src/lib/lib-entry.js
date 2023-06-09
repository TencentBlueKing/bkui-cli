// runtime file
import mod from '~libEntry';
export default mod;
export * from '~libEntry';

// 基于 script src，懒加载相关资源
if (typeof window !== 'undefined') {
  const { currentScript } = window.document;
  const src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/);
  if (src) {
    __webpack_public_path__ = src[1] // eslint-disable-line
  }
}
