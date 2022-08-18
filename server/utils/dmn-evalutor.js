const { evaluateDecision, parseDmnXml } = require('dmn-evaluator');

// test parser and evaluater
async function evalute(xml, dmnTable, params) {
    try {
        const parsedDecisionTable = await parseDmnXml(xml)
        const result = evaluateDecision(dmnTable, parsedDecisionTable, params);
        // console.log('result: ', result);
        return result;
    } catch (err) {
        console.error('error: ', err);
        return err
    }
}

module.exports = evalute