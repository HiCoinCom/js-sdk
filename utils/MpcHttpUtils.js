/**
 * MPC HTTP Utils
 * HTTP request utilities for MPC API
 * Uses Node.js built-in https/http modules (no deprecated dependencies)
 */
const MpcCons = require('./MpcConstants');
const https = require('https');
const http = require('http');
const { URL } = require('url');
const querystring = require('querystring');
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
    
    const url = MpcCons.HOST + data.url;  // MPC API 不需要版本前缀
    const parsedUrl = new URL(url);
    const isHttps = parsedUrl.protocol === 'https:';
    const transport = isHttps ? https : http;
    
    const params = {
        app_id: MpcCons.app_id,
        data: paramEncrypted
    };
    
    const postData = querystring.stringify(params);
    
    const options = {
        method: data.method,
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (isHttps ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    };
    
    return await new Promise(function (resolve, reject) {
        const req = transport.request(options, function (response) {
            let body = '';
            
            response.on('data', function (chunk) {
                body += chunk;
            });
            
            response.on('end', function () {
                resolve(body);
            });
        });
        
        req.on('error', function (error) {
            reject(error);
        });
        
        if (data.method === 'POST') {
            req.write(postData);
        }
        
        req.end();
    });
};
