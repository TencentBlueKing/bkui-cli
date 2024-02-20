import fetch from './fetch';

const apiPrefix = 'api';

export const getUser = () => fetch.get(`${apiPrefix}/user`);
