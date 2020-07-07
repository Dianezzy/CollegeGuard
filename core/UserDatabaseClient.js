// const URL = 'http://' + '192.168.43.117' + ':8003'; // local test
const URL = 'http://' + global.SERVER_IP + ':8003';

import Axios from 'axios';

let instance = Axios.create({
    baseURL: URL,
    timeout: 10000,
    headers: {
        'X-Custom-Header': 'foobar'
    }
});

export async function GetUserInfo(username) {
    let data = { name: username };
    let result = await instance.get('/request/user/selectuser', {
        params: data
    }).then(function (response) {
        return response.data.message;
    }).catch(function (error) {
        console.log(error);
    });
    return result;
}

export async function UpdateUserPwd(username, password) {
    let data = { pwd: password, name: username };
    let result = await instance.post('/request/user/updatepwd', data).then(
        (response) => {
            return response.data.result;
        }
    );
    return result;
}

export async function CreateUser(user) {
    let result = await instance.post(
        '/request/user/insert', user
    ).then(
        function (response) {
            return response.data.result;
        }
    ).catch(function (error) {
        console.log(error);
    });
    return result;
}
