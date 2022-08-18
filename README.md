[install stx-dmn-eval-js](https://www.npmjs.com/package/stx-dmn-eval-js)
<br>
(The examples in this repo were created at https://demo.bpmn.io/dmn. You can download the rules you created here and use them directly in the library.)
<br>
(Bu repodaki örnekler https://demo.bpmn.io/dmn adresinde oluşturulmuştur. Siz de burada oluşturduğunuz kuralları indirip direkt olarak kütüphanede kullanabilirsiniz.)


[English](#About) | [Türkçe](#Hakkında)

---

# Hakkında

stx-dmn-eval-js, karar tablolarını **[DMN](http://www.omg.org/spec/DMN/1.3/)** standardına göre yürütmek için bir Javascript kural motorudur. Bu uygulama **[FEEL by EdgeVerve](https://github.com/EdgeVerve/feel)**'e dayanmaktadır. Basit ifade dilinin (S-FEEL) ve ayrıca FEEL'in seçilmiş bazı bölümlerinin hesaplanması için uyarlanmıştır. Javascript uygulamanıza (tarayıcı veya NodeJS) bir DMN motoru yerleştirmek için stx-dmn-eval-js kullanın. 

stx-dmn-eval-js, XML'den DMN karar tablolarının yüklenmesine ve yürütülmesine izin verir. DRG'ler (decision requirements diagram) desteklenir. Karar tablolarının değerlendirilmesi şu anda isabet politikası FIRST (F), UNIQUE (U), RULE ORDER (R) ve COLLECT(C) (aggregation olmadan) sınırlıdır.


# İçeri Aktarmak ve Karar Tablolarına Ayırmak

```jsx
var { decisionTable, dateTime } = require('stx-dmn-eval-js');
```

stx-dmn-eval-js, XML içeriğinden DMN'yi ayrıştırır. XML içeriğini elde etmek size kalmıştır, ör. dosya sisteminden veya servis çağrısından. Parsing, Promise kullanan asekron bir işlemdir; oysa bir kararın değerlendirilmesi (yürütülmesi) sekrondur. 

```jsx
const { decisionTable } = require('stx-dmn-eval-js');
 
const xmlContent = // wherever it may come from
 
decisionTable.parseDmnXml(xmlContent)
    .then((decisions) => {
        // DMN was successfully parsed
        const context = {
            // your input for decision execution goes in here
        };

        try {
            const data = decisionTable.evaluateDecision('decide-approval', decisions, context);
            // data is the output of the decision execution
            // it is an array for hit policy COLLECT and RULE ORDER, and an object else
            // it is undefined if no rule matched
            
            // do something with the data
            
        } catch (err) {
            // failed to evaluate rule, maybe the context is missing some data?
            console.log(err)
        };
    })
    .catch(err => {
         // failed to parse DMN XML: either invalid XML or valid XML but invalid DMN
         console.log(err)
    });
```

> Bir DMN karar tablosunu ayrıştırmanın oldukça pahalı bir işlem olduğunu unutmayın. Bir karar tablosunun her değerlendirmesi için yapılmamalıdır (yukarıdaki örnek sadece tamamını göstermek adına hem ayrıştırmayı hem de değerlendirmeyi içermektedir).


# Sonuç Hesaplanması

`evaluateDecision(...)` çağrısının sonucu şudur:

- hiçbir kural eşleşmediyse `undefined`
- karar tablosunun isabet ilkesi Collect veya Rule Order ise bir dizi nesne (her eşleşen kural için bir dizi öğesi)
- karar tablosunun isabet politikası First veya Unique ise ve bir kural eşleşirse bir nesne

Eşleşen bir kuralın nesnesi, kuralın değerlendirilen çıktı değerlerini içerir. Yapı, çıktı adlarıyla tanımlanır. İçinde nokta (.) bulunan nitelikli adlar, iç içe nesnelere yol açar. Aşağıdaki örneğe bakın:

![Evaluation Result](https://github.com/HBTGmbH/dmn-eval-js/blob/master/dmn-output.png)

Yukarıdaki tablonun eşleştirme kuralı için bir nesne şöyle görünür:

```jsx
{
  plainOutputProperty: '...',
  output: {
    property: '...',
    nested: {
       property: '...',
    },
  }
}
```


# Karar tablolarındaki desteklenen içerikler

## Giriş ifadeleri
- customerAge
    
    ```jsx
    const context = {
      customerAge: 18;
    };
    ```
    
- customer.age
    
    ```jsx
    const context = {
      customer: {
        age: 18;
      }
    };
    ```
    

- employee.salary * 12
- convertToUSD(employee.salary)

```jsx
const context = {
  employee: {
    salary: 100000;
  },
  convertToUSD: (valueInEUR) => {
     // your conversion logic here
  };
};
```

## Yerleşik işlevler
dmn-eval-js, DMN 1.3'ten gelen aşağıdaki yerleşik işlevleri destekler:

- string functions: `starts with, ends with, contains, upper case, lower case`
- boolean functions: `not`
- list functions: `list contains, count, min, max, sum, mean, and, or, append, concatenate, insert before, remove, reverse, index of, union, distinct values, flatten`

## Giriş girdileri
- bir bitiş noktası aritmetik ifade de olabilir
- basit bir değer, fonksiyon çağırma da olabilir
- basit bir değişmez değer, boş bir değişmez de olabilir
- bir tarih saat kelimesi kelimesine "tarih ve saat" de olabilir
- aritmetik ifadelerdeki parantezler desteklenir
- ek ad sembolleri desteklenmez

| Input entry                 | matches if the input expression evaluates to...                                                                 |
| --------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 42                          | the numeric value 42                                                                                            |
| < 42                        | a value less than 42                                                                                            |
| [41 .. 50]                  | a value between 41 and 50 (inclusive)                                                                           |
| 10, 20                      | either 10 or 20                                                                                                 |
| <10, >20                    | a value either less than 10 or greater than 20                                                                  |
| "A"                         | the string "A"                                                                                                  |
| "A", "B"                    | the string "A" or "B"                                                                                           |
| true                        | the boolean value true                                                                                          |
| -                           | any value, even undefined                                                                                       |
|                             | any value, even undefined (sams as -)                                                                           |
| null                        | the value null or undefined                                                                                     |
| not(null)                   | any value other than null or undefined                                                                          |
| property                    | the same value as the property (must be given in the context)                                                   |
| object.property             | the same value as the property of the object                                                                    |
| f(a)                        | the same value as the function evaluated with the property (function and property must be given in the context) |
| limit - 10                  | the same value as the limit minus 10                                                                            |
| limit * 2                   | the same value as the limit times 2                                                                             |
| [limit.upper, limit.lower]  | a value between the value of two given properties of object limit                                               |
| date("2017-05-01")          | the date value Mai 1st, 2017 (date is a built-in function)                                                      |
| date(property)              | the date which is defined by the value of the given property, the time if cropped to 00:00:00                   |
| date and time(property)     | the date and time which is defined by the value of the given property (date and time is a built-in function)    |
| duration(d)                 | the duration specified by d, an ISO 8601 duration string like P3D for three days (duration is built-in either)  | 
| duration(d) * 2             | twice the duration                                                                                              |
| duration(begin, end)        | the duration between the specified begin and end date                                                           |
| date(begin) + duration(d)   | the date that results by adding the given duration to the given date                                            |
| < date(begin) + duration(d) | any date before the date that results by adding the given duration to the given date                            |

Yukarıdaki sözdizimi öğelerinin çoğu birleşimleri de geçerlidir. Örneğin, aşağıdaki geçerli bir giriş girişidir (muhtemelen bir anlam ifade etmese de):

```jsx
not(f(a + 1), [ date(b) + duration(c.d) .. g(d) ])
```

## Giriş girdilerindeki fonksiyonlara parametre olarak giriş değişkenleri verilmesi
Bazen, bir girdi ifadesinin değerini, örneğin belirli bir girdi dizisinin belirli bir alt diziyi içerdiğini test etmek için bir girdi girdisindeki bir işleve parametre olarak kullanmak istenir, burada test edilecek her bir alt dizi farklı bir kural oluşturur.

![Input Variables](https://github.com/HBTGmbH/dmn-eval-js/blob/master/dmn-input-variables.png)

## Çıkış girdileri
DMN belirtimine göre basit bir ifade, giriş girişleri için belirtilenlerle aynı eklemelerle çıkış girişi olarak desteklenir. Çıktı girdileri karşılaştırma değil ifade olduğundan, aşağıdaki gibi değerlere izin verilmez:

- < 1
- [1 .. 2]
- not("A")
- boş değerler (dash işareti de dahil -)


---


# About
stx-dmn-eval-js is a Javascript rule engine to execute decision tables according to the **[DMN](http://www.omg.org/spec/DMN/1.3/)** standard. This implementation is based on **[FEEL by EdgeVerve](https://github.com/EdgeVerve/feel)**. It is tailored to evaluation of simple expression language (S-FEEL), plus some cherry-picked parts of FEEL. Use dmn-eval-js to embed a DMN engine in your Javascript application (browser or NodeJS).

stx-dmn-eval-js allows to load and execute DMN decision tables from XML. DRGs are supported. Evaluation of decision tables is currently limited to those of hit policy FIRST (F), UNIQUE (U), RULE ORDER (R), and COLLECT (C) without aggregation.


# Import and Parsing decision tables
```jsx
var { decisionTable, dateTime } = require('stx-dmn-eval-js');
```

stx-dmn-eval-js parses DMN from XML content. It is up to you to obtain the XML content, e.g. from file system or service call. Parsing is asynchronous using a Promise, while evaluation (execution) of a decision is synchronous.

```jsx
const { decisionTable } = require('stx-dmn-eval-js');
 
const xmlContent = // wherever it may come from
 
decisionTable.parseDmnXml(xmlContent)
    .then((decisions) => {
        // DMN was successfully parsed
        const context = {
            // your input for decision execution goes in here
        };

        try {
            const data = decisionTable.evaluateDecision('decide-approval', decisions, context);
            // data is the output of the decision execution
            // it is an array for hit policy COLLECT and RULE ORDER, and an object else
            // it is undefined if no rule matched
            
            // do something with the data
            
        } catch (err) {
            // failed to evaluate rule, maybe the context is missing some data?
            console.log(err)
        };
    })
    .catch(err => {
         // failed to parse DMN XML: either invalid XML or valid XML but invalid DMN
         console.log(err)
    });
```

> Note than parsing a DMN decision table is a rather expensive operation. It should not be done for each evaluation of a decision table (the example above contains both parsing and evaluation just for the sake of completeness).


# Evaluation result
The result of the `evaluateDecision(...)` call is

- `undefined` if no rule matched
- an array of objects if the hit policy of the decision table is COLLECT or RULE ORDER (one array item for each matching rule)
- an object if the hit policy of the decision table is FIRST or UNIQUE and a rule matched

The object for a matching rule contains the evaluated output value(s) of the rule. The structure is defined by the output names. Qualified names with a dot (.) inside lead to nested objects. See the following example:

![Evaluation Result](https://github.com/HBTGmbH/dmn-eval-js/blob/master/dmn-output.png)

An object for a matching rule of the above table would look like this:

```jsx
{
  plainOutputProperty: '...',
  output: {
    property: '...',
    nested: {
       property: '...',
    },
  }
}
```


# Supported content in decision tables

## Input expressions
- customerAge
    
    ```jsx
    const context = {
      customerAge: 18;
    };
    ```
    
- customer.age
    
    ```jsx
    const context = {
      customer: {
        age: 18;
      }
    };
    ```
    

- employee.salary * 12
- convertToUSD(employee.salary)

```jsx
const context = {
  employee: {
    salary: 100000;
  },
  convertToUSD: (valueInEUR) => {
     // your conversion logic here
  };
};
```

## Built-in functions
dmn-eval-js supports the following built-in functions from DMN 1.3:

- string functions: `starts with, ends with, contains, upper case, lower case`
- boolean functions: `not`
- list functions: `list contains, count, min, max, sum, mean, and, or, append, concatenate, insert before, remove, reverse, index of, union, distinct values, flatten`

## Input entries
- an endpoint can also be arithmetic expression
- a simple value can also be function invocation
- a simple literal can also be a null literal
- a date time literal can also be "date and time"
- brackets in arithmetic expressions are supported
- additional name symbols are not supported

| Input entry                 | matches if the input expression evaluates to...                                                                 |
| --------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 42                          | the numeric value 42                                                                                            |
| < 42                        | a value less than 42                                                                                            |
| [41 .. 50]                  | a value between 41 and 50 (inclusive)                                                                           |
| 10, 20                      | either 10 or 20                                                                                                 |
| <10, >20                    | a value either less than 10 or greater than 20                                                                  |
| "A"                         | the string "A"                                                                                                  |
| "A", "B"                    | the string "A" or "B"                                                                                           |
| true                        | the boolean value true                                                                                          |
| -                           | any value, even undefined                                                                                       |
|                             | any value, even undefined (sams as -)                                                                           |
| null                        | the value null or undefined                                                                                     |
| not(null)                   | any value other than null or undefined                                                                          |
| property                    | the same value as the property (must be given in the context)                                                   |
| object.property             | the same value as the property of the object                                                                    |
| f(a)                        | the same value as the function evaluated with the property (function and property must be given in the context) |
| limit - 10                  | the same value as the limit minus 10                                                                            |
| limit * 2                   | the same value as the limit times 2                                                                             |
| [limit.upper, limit.lower]  | a value between the value of two given properties of object limit                                               |
| date("2017-05-01")          | the date value Mai 1st, 2017 (date is a built-in function)                                                      |
| date(property)              | the date which is defined by the value of the given property, the time if cropped to 00:00:00                   |
| date and time(property)     | the date and time which is defined by the value of the given property (date and time is a built-in function)    |
| duration(d)                 | the duration specified by d, an ISO 8601 duration string like P3D for three days (duration is built-in either)  | 
| duration(d) * 2             | twice the duration                                                                                              |
| duration(begin, end)        | the duration between the specified begin and end date                                                           |
| date(begin) + duration(d)   | the date that results by adding the given duration to the given date                                            |
| < date(begin) + duration(d) | any date before the date that results by adding the given duration to the given date                            |

Most combinations of the syntax elements above are valid, too. For example the following is a valid input entry (although it probably does not make any sense):

```jsx
not(f(a + 1), [ date(b) + duration(c.d) .. g(d) ])
```

## Input variables as parameters to functions in input entries
Sometimes, one whishes to use the value of an input expression as a parameter to a function in an input entry, for example to test that a given input string contains a certain substring, where each substring to test for constitutes a different rule. 

![Input Variables](https://github.com/HBTGmbH/dmn-eval-js/blob/master/dmn-input-variables.png)

## Output entries
A simple expression according to the DMN specification is supported as output entry, with the same additions as mentioned for input entries. Since output entries are expressions, not comparisons, values like the following are not allowed:

- < 1
- [1 .. 2]
- not("A")
- empty values (this includes the dash -)

