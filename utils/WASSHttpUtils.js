/**
 * WaaS HTTP Utils
 * HTTP request utilities for WaaS API
 * Uses Node.js built-in https/http modules (no deprecated dependencies)
 */
const Cons = require('./Constants');
const https = require('https');
const http = require('http');
const { URL } = require('url');
const querystring = require('querystring');
const RSA = require('./RSAUtil');

const baseArgs = {charset: Cons.UTF8, sign: '', time: Date.now(), app_id: Cons.app_id, version: Cons.VER};


exports.request = async function (data) {
    var allAgrs = Object.assign(baseArgs, data.requestData);
    var orignStr = JSON.stringify(allAgrs);
    if(Cons.DEBUG){
        console.log("orignStr->", orignStr);
    }


    var paramEncrypted = RSA.privateKeyEncrypt(orignStr);
    if(Cons.DEBUG) {
        console.log("paramEncrypted->", paramEncrypted);
    }
    
    const url = Cons.HOST + Cons.VER + data.url;
    const parsedUrl = new URL(url);
    const isHttps = parsedUrl.protocol === 'https:';
    const transport = isHttps ? https : http;
    
    const params = {
        app_id: Cons.app_id,
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
