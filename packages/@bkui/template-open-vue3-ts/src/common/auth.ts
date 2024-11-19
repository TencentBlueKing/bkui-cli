import {
  showLoginModal,
} from '@blueking/login-modal';

interface ILoginData {
  loginUrl?: string
}

// 获取登录地址
const getLoginUrl = (url: string, cUrl: string, isFromLogout: boolean) => {
  const loginUrl = new URL(url);
  if (isFromLogout) {
    loginUrl.searchParams.append('is_from_logout', '1');
  }
  loginUrl.searchParams.append('c_url', cUrl);
  return loginUrl.href;
};

// 跳转到登录页
export const login = (data: ILoginData = {}) => {
  location.href = data.loginUrl || getLoginUrl(window.BK_LOGIN_URL, location.origin, false);
};

// 打开登录弹框
export const loginModal = () => {
  const loginUrl = getLoginUrl(
    `${window.BK_LOGIN_URL}/plain/`,
    `${location.origin + window.SITE_URL}/static/login_success.html`,
    false
  )
  showLoginModal({ loginUrl })
}

// 退出登录
export const logout = () => {
  location.href = getLoginUrl(window.BK_LOGIN_URL, location.origin, true);
};
