const { decisionTable } = require("stx-dmn-eval-js");


const dmnEval = async(id,xmlContent, context) => {
    return decisionTable
    .parseDmnXml(xmlContent)
    .then((decisions) => {
      // DMN was successfully parsed
    //   const context = {
    //     // your input for decision execution goes in here
    //     season: "Summer",
    //     guestCount: 15,
    //   };
  
      try {
        const data = decisionTable.evaluateDecision(
          id,
          decisions,
          context
        );
        // data is the output of the decision execution
        // it is an array for hit policy COLLECT and RULE ORDER, and an object else
        // it is undefined if no rule matched
        console.log(data);
        return data
        // do something with the data
      } catch (err) {
        // failed to evaluate rule, maybe the context is missing some data?
        console.log(err);
        return err
      }
    })
    .catch((err) => {
      // failed to parse DMN XML: either invalid XML or valid XML but invalid DMN
      console.log(err);
      return err
    });
}  

module.exports = dmnEval;

