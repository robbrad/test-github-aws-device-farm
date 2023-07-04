"use strict";
const path = require('path');
const { launcher } = require('wdio-aws-device-farm-service')

const fs = require('fs');

exports.config = {
    runner: "local",
    specs: [path.resolve(__dirname, '*.test.js')],
    maxInstances: 12,
    capabilities: [
        {
            browserName: 'chrome',
            acceptInsecureCerts: true,
        },
        {
            browserName: 'firefox',
            acceptInsecureCerts: true,
        }
    ],
    logLevel: 'trace',
    framework: 'mocha',
    outputDir: __dirname,
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 30000,
    },
    services: [
        [
            launcher,
            {
                projectArn: process.env.PROJECT_ARN,
            },
        ],
    ],
    before: function (capabilities, specs, browser) {
        if (browser.sessionId) {
            // Access the session ID
            const sessionId = browser.sessionId;
            const specPath = specs[0];

            const extension = path.extname(specPath);
            const specFilename = path.basename(specPath,extension);
            console.log(specs);
            // Emit the session ID event
            console.log('Session ID:', sessionId);
            const outputFile = `sessions.log`;
            fs.appendFile(outputFile, `${specFilename}:${sessionId}\n`, function (err) {
                if (err) throw err;
                console.log('Session info Saved to sessions.log');
            });
            
        }

    },

};

function checkForFile(fileName,callback)
{
    fs.exists(fileName, function (exists) {
        if(exists)
        {
            callback();
        }else
        {
            fs.writeFile(fileName, {flag: 'wx'}, function (err, data) 
            { 
                callback();
            })
        }
    });
}
