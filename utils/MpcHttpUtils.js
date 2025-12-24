/**
 * MPC HTTP Utils
 * HTTP request utilities for MPC API
 */
const MpcCons = require('./MpcConstants');
const request = require('request');
const RSA = require('./RSAUtil');

const baseArgs = {charset: MpcCons.UTF8, sign: '', time: Date.now(), app_id: MpcCons.app_id, version: MpcCons.VER};

exports.request = async function (data) {
    var allArgs = Object.assign(baseArgs, data.requestData);
    var originStr = JSON.stringify(allArgs);
    
    if (MpcCons.DEBUG) {
        console.log("originStr->", originStr);
    }

    var paramEncrypted = RSA.privateKeyEncrypt(originStr);
    if (MpcCons.DEBUG) {
        console.log("paramEncrypted->", paramEncrypted);
    }
    
    const options = {
        method: data.method,
        url: MpcCons.HOST + data.url,  // MPC API 不需要版本前缀
        form: {
            app_id: MpcCons.app_id,
            data: paramEncrypted
        }
    };
    
    return await new Promise(function (resolve, reject) {
        request(options, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
};
