
import {GetUserInfo} from './UserDatabaseClient';

export const emailValidator = email => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return '邮箱不能为空';
  if (!re.test(email)) return '请输入有效邮箱';

  return '';
};

export const passwordValidator = password => {
  if (!password || password.length <= 0) return '密码不能为空';

  return '';
};

export const nameValidator = name => {
  if (!name || name.length <= 0) return '名字不能为空';

  // 查询用户是否存在
  // var res = GetUserInfo(name);
  // if(res) return '用户名已存在';

  return '';
};
