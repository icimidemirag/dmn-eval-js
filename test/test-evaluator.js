const { decisionTable } = require('stx-dmn-eval-js');
const { readFileSync } = require('fs');
 
// prepare input
const params = {
  maas: 10000,
  sigorta: true
};
const file = './test-tax.dmn';
const dmnTable = 'Decision_1adfd1s';
 
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
        const parsedDecisionTable = await decisionTable.parseDmnXml(xml)
        const result = decisionTable.evaluateDecision(dmnTable, parsedDecisionTable, params);
        console.log('result: ', result);
    } catch (err) {
        console.error('error: ', err);
    }
 
}