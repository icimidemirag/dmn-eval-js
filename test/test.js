const { evaluateDecision, parseDmnXml } = require('dmn-evaluator');
const { readFileSync } = require('fs');
 
// prepare input
const params = {
  giris: 'b'
};
const file = './test1.dmn';
const dmnTable = 'Decision_0te96os';
 
// read file and run test function
try {
    const xml = readFileSync(file, 'utf8');
    test(xml, dmnTable, params);
} catch (err) {
    console.error('error reading file at path: ', file, 'err: ', err);
}
 
// test parser and evaluater
async function test(xml, dmnTable, params) {
    try {
        const parsedDecisionTable = await parseDmnXml(xml)
        const result = evaluateDecision(dmnTable, parsedDecisionTable, params);
        console.log('result: ', result);
    } catch (err) {
        console.error('error: ', err);
    }
 
}