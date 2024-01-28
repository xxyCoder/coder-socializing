export const serviceError = {
    code: 500,
    msg: "服务器出错了"
}

export const successObj = {
    code: 200,
}

export const modifySuc = {
    code: 200,
    msg: "修改成功"
}

export const userIsNotExistsOrPassErr = {
    code: 400,
    msg: "用户不存在或密码不正确"
}

export const importArgsIsNull = {
    code: 400,
    msg: "重要参数为空"
}

export const csrfSessionIsNull = {
    code: 401,
    msg: "不是本网站发出的请求"
}

export const csrfSessionError = {
    code: 402, msg: "csrf token不对"
}

export const csrfSessionTimeout = {
    code: 403,
    msg: "csrf token过期"
}

export const csrfSessionLapse = {
    code: 404,
    msg: "csrf token失效"
}

export const tokenIsNull = {
    code: 405,
    msg: "token为空"
}

export const tokenError = {
    code: 406,
    msg: "token错误"
}

export const tokenLapse = {
    code: 407,
    msg: "token失效"
}

export const tokenTimeout = {
    code: 408,
    msg: "token超时"
}

export const userIsNotExists = {
    code: 409,
    msg: "用户不存在"
}
