import http from './request';

interface User {
  username: string;
  avatar_url: string;
}

const apiPrefix = 'api';

export const getUser = () => http.get<User>(`${apiPrefix}/user`, {
  params: {
    username: 'test',
  },
});
