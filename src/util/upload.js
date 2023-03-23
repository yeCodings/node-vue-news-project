import axios from 'axios';

function upload(path, userForm) {
  // 含有图片等复杂信息，需要一个 new FormData() 实例作为 params 参数传到后端
  const params = new FormData();

  for (let i in userForm) {
    params.append(i, userForm[i]);
  }

  return axios.post(path, params, {
    headers: {
      // 头部信息，表明传输的是多部分的 form表单数据
      "Content-Type": "multipart/form-data"
    }
  }).then(res => res.data);
}

export default upload;