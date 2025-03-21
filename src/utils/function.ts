export const execShellCommand = (cmd:string) => {
  const exec = require('child_process').exec;
  return new Promise((resolve, reject) => {
   exec(cmd, (error:any, stdout:any, stderr:any) => {
    if (error) {
     console.warn(error);
    }
    resolve(stdout? stdout : stderr);
   });
  });
 }

const send_ok = ( msg = '', data = {}) => {
  return {
    'result': 'ok',
    'message': msg,
    'data': data
  };
};

const send_ok_token = ( msg = '', data = {}, token = null ) => {
  return {
    'result': 'ok',
    'message': msg,
    'data': data,
    'token': token
  };
};
  
const send_fail = ( msg = '', data = {} ) => {
  return {
    'result': 'fail',
    'message': msg,
    'data': data
  };
};

const send_fail_token = (msg = "", data = {}, token = null) => {
  return {
    result: "fail",
    message: msg,
    data: data,
    token: token,
  };
};


const check_function_params = ( param_array ) => {

  if (!Array.isArray(param_array)) {
    return send_fail('array type param required', null);
  }

  if (param_array.length < 1) {
    return send_fail('invalid parameter array length', null);
  }

  if (param_array.includes(false)) {  
    return send_fail('false', param_array);
  } else {
    return send_ok("true", null);
  }
};

  
