const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/" xmlns:dc="http://www.omg.org/spec/DMN/20180521/DC/" xmlns:di="http://www.omg.org/spec/DMN/20180521/DI/" id="dish" name="Dish" namespace="http://camunda.org/schema/1.0/dmn" exporter="dmn-js (https://demo.bpmn.io/dmn)" exporterVersion="12.2.1">
  <inputData id="dayType_id" name="Type of day">
    <variable id="dayType_ii" name="Type of day" typeRef="string" />
  </inputData>
  <inputData id="temperature_id" name="Weather in Celsius">
    <variable id="temperature_ii" name="Weather in Celsius" typeRef="integer" />
  </inputData>
  <knowledgeSource id="host_ks" name="Host" />
  <decision id="dish-decision" name="Dish Decision">
    <informationRequirement id="InformationRequirement_19y6wcu">
      <requiredInput href="#temperature_id" />
    </informationRequirement>
    <informationRequirement id="InformationRequirement_1ow980u">
      <requiredInput href="#dayType_id" />
    </informationRequirement>
    <authorityRequirement id="AuthorityRequirement_142y75e">
      <requiredAuthority href="#host_ks" />
    </authorityRequirement>
    <decisionTable id="dishDecisionTable">
      <input id="seasonInput" label="Season">
        <inputExpression id="seasonInputExpression" typeRef="string">
          <text>season</text>
        </inputExpression>
      </input>
      <input id="guestCountInput" label="How many guests">
        <inputExpression id="guestCountInputExpression" typeRef="integer">
          <text>guestCount</text>
        </inputExpression>
      </input>
      <output id="output1" label="Dish" name="desiredDish" typeRef="string" />
      <rule id="row-495762709-1">
        <inputEntry id="UnaryTests_1nxcsjr">
          <text>"Winter"</text>
        </inputEntry>
        <inputEntry id="UnaryTests_1r9yorj">
          <text>&lt;= 8</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_1mtwzqz">
          <text>"Spareribs"</text>
        </outputEntry>
      </rule>
      <rule id="row-495762709-2">
        <inputEntry id="UnaryTests_1lxjbif">
          <text>"Winter"</text>
        </inputEntry>
        <inputEntry id="UnaryTests_0nhiedb">
          <text>&gt; 8</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_1h30r12">
          <text>"Pasta"</text>
        </outputEntry>
      </rule>
      <rule id="row-495762709-3">
        <inputEntry id="UnaryTests_0ifgmfm">
          <text>"Summer"</text>
        </inputEntry>
        <inputEntry id="UnaryTests_12cib9m">
          <text>&gt; 10</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_0wgaegy">
          <text>"Light salad"</text>
        </outputEntry>
      </rule>
      <rule id="row-495762709-7">
        <inputEntry id="UnaryTests_0ozm9s7">
          <text>"Summer"</text>
        </inputEntry>
        <inputEntry id="UnaryTests_0sesgov">
          <text>&lt;= 10</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_1dvc5x3">
          <text>"Beans salad"</text>
        </outputEntry>
      </rule>
      <rule id="row-445981423-3">
        <inputEntry id="UnaryTests_1er0je1">
          <text>"Spring"</text>
        </inputEntry>
        <inputEntry id="UnaryTests_1uzqner">
          <text>&lt; 10</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_1pxy4g1">
          <text>"Stew"</text>
        </outputEntry>
      </rule>
      <rule id="row-445981423-4">
        <inputEntry id="UnaryTests_06or48g">
          <text>"Spring"</text>
        </inputEntry>
        <inputEntry id="UnaryTests_0wa71sy">
          <text>&gt;= 10</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_09ggol9">
          <text>"Steak"</text>
        </outputEntry>
      </rule>
    </decisionTable>
  </decision>
  <textAnnotation id="TextAnnotation_1">
    <text>Week day or week end</text>
  </textAnnotation>
  <association id="Association_18hoj4i">
    <sourceRef href="#dayType_id" />
    <targetRef href="#TextAnnotation_1" />
  </association>
  <dmndi:DMNDI>
    <dmndi:DMNDiagram id="DMNDiagram_05sfxgt">
      <dmndi:DMNShape id="DMNShape_1nkrqp5" dmnElementRef="dayType_id">
        <dc:Bounds height="45" width="125" x="417" y="377" />
      </dmndi:DMNShape>
      <dmndi:DMNShape id="DMNShape_0wgwr3t" dmnElementRef="temperature_id">
        <dc:Bounds height="45" width="125" x="188" y="377" />
      </dmndi:DMNShape>
      <dmndi:DMNShape id="DMNShape_17n98pm" dmnElementRef="host_ks">
        <dc:Bounds height="63" width="100" x="646" y="48" />
      </dmndi:DMNShape>
      <dmndi:DMNShape id="DMNShape_0s7a8pk" dmnElementRef="dish-decision">
        <dc:Bounds height="80" width="180" x="301" y="48" />
      </dmndi:DMNShape>
      <dmndi:DMNEdge id="DMNEdge_0qqxexx" dmnElementRef="AuthorityRequirement_142y75e">
        <di:waypoint x="646" y="81" />
        <di:waypoint x="481" y="86" />
      </dmndi:DMNEdge>
      <dmndi:DMNShape id="DMNShape_0bblyhb" dmnElementRef="TextAnnotation_1">
        <dc:Bounds height="45" width="125" x="328" y="477" />
      </dmndi:DMNShape>
      <dmndi:DMNEdge id="DMNEdge_0aqnkob" dmnElementRef="Association_18hoj4i">
        <di:waypoint x="480" y="422" />
        <di:waypoint x="391" y="477" />
      </dmndi:DMNEdge>
      <dmndi:DMNEdge id="DMNEdge_1regsjw" dmnElementRef="InformationRequirement_19y6wcu">
        <di:waypoint x="251" y="377" />
        <di:waypoint x="361" y="148" />
        <di:waypoint x="361" y="128" />
      </dmndi:DMNEdge>
      <dmndi:DMNEdge id="DMNEdge_00xw2mg" dmnElementRef="InformationRequirement_1ow980u">
        <di:waypoint x="480" y="377" />
        <di:waypoint x="421" y="148" />
        <di:waypoint x="421" y="128" />
      </dmndi:DMNEdge>
    </dmndi:DMNDiagram>
  </dmndi:DMNDI>
</definitions>
`;

const { decisionTable } = require("stx-dmn-eval-js");
// const loglevel = require("loglevel");

// const logger = loglevel.getLogger("stx-dmn-eval-js");
// logger.setLevel("debug");

decisionTable
  .parseDmnXml(xmlContent)
  .then((decisions) => {
    // DMN was successfully parsed
    const context = {
      // your input for decision execution goes in here
      season: "Winter",
      guestCount: 15,
    };

    try {
      const data = decisionTable.evaluateDecision("dish-decision", decisions, context);
      // data is the output of the decision execution
      // it is an array for hit policy COLLECT and RULE ORDER, and an object else
      // it is undefined if no rule matched
      console.log(data);
      // do something with the data
    } catch (err) {
      // failed to evaluate rule, maybe the context is missing some data?
      console.log(err);
    }
  })
  .catch((err) => {
    // failed to parse DMN XML: either invalid XML or valid XML but invalid DMN
    console.log(err);
  });
