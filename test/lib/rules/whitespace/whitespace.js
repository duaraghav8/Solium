/**
 * @fileoverview Tests for all whitespace rules
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

const { EOL } = require("os");
const Solium = require("../../../../lib/solium"),
    wrappers = require("../../../utils/wrappers"), { toContract, toFunction, addPragma } = wrappers;

let userConfig = {
    "custom-rules-filename": null,
    "rules": {
        "whitespace": true,
        "conditionals-whitespace": true,
        "comma-whitespace": true,
        "operator-whitespace": true,
        "semicolon-whitespace": true,
        "function-whitespace": true
    }
};

describe("[RULE] whitespace: Acceptances", function() {

    it("should allow function / event calls with 0 args only if the name is followed by \"()\"", function(done) {
        let code = "func ();",
            errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "foo.func ();";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should allow function / event calls with no extraneous whitespace", function(done) {
        let code = "spam(ham[1], Coin({name: \"ham\"}));",
            errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "foo.bar (10, 20, 30);";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "foo.bar (10, 20, 30);";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "foo (10, 20).func ();";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "foo [\"func ()\"] ();";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "foo [\"func (10, 20)\"] ();";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should allow single-line function body to have 1 extraneous space on either side", function(done) {
        let code = "function singleLine() { spam(); }",
            errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "constructor() { spam(); }";
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        //it is fine EVEN IF there is no extraneous space
        code = "function singleLine() {spam();}";
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "constructor() {spam();}";
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should allow informal params in function declaration which don't have whitespace immediately before a comma or semicolon", function(done) {
        let code = "function spam(uint i, Coin coin);",
            errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "var foobar = \"Hello World\";";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "fooBar (baz ({\nhello: \"world\"\n}));";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "function foo (uint x, string y);";
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "constructor(uint x, string y) {}";
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "constructor() {}";
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "constructor(uint x, string y, address z, string foobar) {}";
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should allow informal params in modifier declaration which don't have whitespace immediately before a comma or semicolon", function(done) {
        let code = "modifier spam(uint i, Coin coin) {_;}",
            errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "modifier foo (uint extralargevarname, string yoloswag) {_;}";
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should allow exactly 1 space on either side of an assignment operator", function(done) {
        let code = "x = 100; y = \"hello world\"; string exa = \"bytes\";",
            errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "x += 100; y *= 10; z -= 10; f /= 100; p |= akjh; ufx ^= 10.289; jack &= jones; p <<= 78; c >>= 100; perc %= 0;";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "var x = 100;";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "var (x, y, z) = (10, 20, 30);";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "var (x, y, z) = fooBar ();";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "uint newNumber = (10 * 78 + 982 % 6**2);";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "x = foo ().baz;";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should allow the code that provides nothing to check, i.e., no arguments in CallExpression", function(done) {
        let code = "call ();",
            errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "function foo () {}";
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "constructor() {}";
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        code = "if (true) {}";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should allow Name-Value assignments following either of the spacing patterns: \":\", \" : \", \": \"", function(done) {
        let code = "myStruct ({a: 100, b : \"hello\", c : -1908});",
            errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should allow acceptable comma whitespace between Name-Value declarations", function(done) {
        let code = `myStruct ({a:100, b:9028,${EOL}c: 19082,d:\"hello world\",${EOL}\t\te:\"this passes YOLO\"});`,
            errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });

    it("should allow a valid mix of CallExpression & MemberExpression", function(done) {
        let errors, statements = [
            "d(wall.dir()[9]);",
            "require(msg.sender == address(wallet.directory().brg()));",
            "balance = balance.add(balance.mul(dividends[currentDividend].amount).div(dividends[currentDividend].supply));",
            "require(destination.call.value(value)(data));"
        ];

        statements.forEach(function(stmt) {
            errors = Solium.lint(toFunction(stmt), userConfig);

            errors.should.be.Array();
            errors.length.should.equal(0);
        });

        Solium.reset();
        done();
    });

    it("should accept SequenceExpression & tuple nodes with no extraneous whitespace", function(done) {
        const code = [
            "var (a, b) = (10, foo(90, \"hello\"));",
            "var (a) = 10;",
            "var (a) = (10);",
            "var (a, b, abra, kadabra) = (i,i,i,i);",
            "var (myVar) = callSomeFunc(0x00, true);",
            "var (,, myVar, ,,) = callSomeFunc(0x00, true);",

            "(a, b) = (10, foo(90, \"hello\"));",
            "(a) = 10;",
            "(a) = (10);",
            "(a, b, abra, kadabra) = (i,i,i,i);",
            "(myVar) = callSomeFunc(0x00, true);",
            "(,, myVar, ,,) = callSomeFunc(0x00, true);",

            "(a, b) += (10, foo(90, \"hello\"));",
            "(a) += 10;",
            "(a) += (10);",
            "(a, b, abra, kadabra) += (i,i,i,i);",
            "(myVar) += callSomeFunc(0x00, true);",
            "(,, myVar, ,,) += callSomeFunc(0x00, true);",

            "(a, b) *= (10, foo(90, \"hello\"));",
            "(a) *= 10;",
            "(a) *= (10);",
            "(a, b, abra, kadabra) *= (i,i,i,i);",
            "(myVar) *= callSomeFunc(0x00, true);",
            "(,, myVar, ,,) *= callSomeFunc(0x00, true);",

            "(a, b) /= (10, foo(90, \"hello\"));",
            "(a) /= 10;",
            "(a) /= (10);",
            "(a, b, abra, kadabra) /= (i,i,i,i);",
            "(myVar) /= callSomeFunc(0x00, true);",
            "(,, myVar, ,,) /= callSomeFunc(0x00, true);",

            "(a, b) -= (10, foo(90, \"hello\"));",
            "(a) -= 10;",
            "(a) -= (10);",
            "(a, b, abra, kadabra) -= (i,i,i,i);",
            "(myVar) -= callSomeFunc(0x00, true);",
            "(,, myVar, ,,) -= callSomeFunc(0x00, true);",

            "(a, b) %= (10, foo(90, \"hello\"));",
            "(a) %= 10;",
            "(a) %= (10);",
            "(a, b, abra, kadabra) %= (i,i,i,i);",
            "(myVar) %= callSomeFunc(0x00, true);",
            "(,, myVar, ,,) %= callSomeFunc(0x00, true);"
        ];

        code.forEach(statement => {
            const errors = Solium.lint(toFunction(statement), userConfig);

            errors.should.be.Array();
            errors.should.have.size(0);
        });

        Solium.reset();
        done();
    });

});


describe("[RULE] whitespace: Rejections", function() {

    it("should reject function / event calls with 0 args if the name is followed by brackets with whitespace between them", function(done) {
        let code = "func ( );",
            errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "func (\t);";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "func (\n);";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "func (/**/);";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "foo [\"func ()\"] ( );";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "foo ().func (\t);";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        Solium.reset();
        done();
    });

    it("should reject function / event calls having extraneous whitespace", function(done) {
        let code = "spam( ham[ 1 ], Coin( { name: \"ham\" } ) );",
            errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(4);

        code = "ham[/**/\"1\"/**/];";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        code = "ham[\t\"1\"\t];";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        Solium.reset();
        done();
    });

    it("should reject code which has whitespace immediately before a comma or semicolon", function(done) {
        ////////////////////////////////////////////////////////////////////////////
        // SEMICOLON

        let code = "function spam(uint i , Coin coin) ;",
            errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        code = "function spam() ;";
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "constructor(uint i , Coin coin) {}",
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "constructor(uint i , Coin coin\t,address lulu) {}",
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        code = "var foobar = 100 ;";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "var foobar = 100\n;";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "var foobar = 100\t;";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "var foobar = 100/*abc*/;";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "function foo (uint x, string y) ;";
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "function foo (uint x, string y)\t;";
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "function foo (uint x, string y)\n;";
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "function foo (uint x, string y)/*abc*/;";
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "x [0] = fooBar () ;";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "x [0] = fooBar ()/**/;";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "import * as C from \"chuh\"/**/;";
        errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "using Foo for *\t;";
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "using Foo for Bar.baz\t;";
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        ////////////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////////////////////////////
        // COMMA

        code = "[1 , 2, 3 , 4,5];",
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        code = "call (10\t, 20, 30 ,40,50);",
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        code = "call ({name: \"foo\"\n, age: 20,id: 1 ,dept: \"math\"});",
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        code = "(1 ,2\t,3\n,4);",
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(3);

        code = "var (x  , y,z\t,  foo) = (1,2,3,4);",
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        code = "var (x, y, z, foo) = (1 ,2,3\t,4);",
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        code = "modifier foo (uint xyz , string less\t, string chiken\n, address bar/*hello*/, mapping mp, uint errorless) {_;}",
        errors = Solium.lint(toContract(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(4);

        Solium.reset();
        done();
    });

    it("should reject assignment operators that do not have exactly 1 space on either side of them", function(done) {
        let code = [
            "x             = 1;",
            "y =             1;",
            "string exa\t=\t\"bytes\";",
            "uint a = \t20;",
            "uint c\t=190;",
            "string octa\n= \"gon\";",
            "bytes32 hexa=\"gon\";",
            "address mine= 0x0;",
            "address his =0x1;",
            "var humpty\n=\"dumpty\";"
        ];
        let errors;

        code = code.map(function(item){return toFunction(item);});

        errors = Solium.lint(code [0], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        errors = Solium.lint(code [1], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        errors = Solium.lint(code [2], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        errors = Solium.lint(code [3], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        errors = Solium.lint(code [4], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        errors = Solium.lint(code [5], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        errors = Solium.lint(code [6], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        errors = Solium.lint(code [7], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        errors = Solium.lint(code [8], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        errors = Solium.lint(code [9], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        code = "var x\n=\n\"hello world\";";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        code = "var x\t=\t\"hello world\";";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        code = "var x = /*abc*/\"hello world\";";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "var x =/*abc*/ \"hello world\";";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "var x/*abc*/ = \"hello world\";";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "var x /*abc*/= \"hello world\";";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        Solium.reset();
        done();
    });

    it("should reject control structures 'if', 'while', and 'for' if there is no space between them and the parenthetic block representing their conditional.", function(done) {
        let code = "if(true) {}\nelse if(true) {}",
            errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        code = "for(;;) {}";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        code = "while(true) {}";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        Solium.reset();
        done();
    });

    it("should reject the Name-Value assignments NOT following either of the spacing patterns: \":\", \" : \", \": \"", function(done) {
        let code = "myStruct ({a: 100, b : \"hello\", c : -1908, d:  10, e :190, f  :  19098, g   : 100, h        :       19028, i\n:100, j\n:\n81972, k : \t\"hola\"});",
            errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(8);

        //With comments
        code = "myStruct ({a: /*hello*/\"hello\", b/*ss*/: 190, c/*ssaa*/:/*67*/-19028});";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(3);

        Solium.reset();
        done();
    });

    it("should reject unacceptable comma whitespace between Name-Value declarations", function(done) {
        let code = "myStruct ({a:100 , b:9028 ,c: 19082,  d:\"hello world\",\n\ne:\"this passes YOLO\"  ,e: 100\t,\tf: 18972, \ng: \"cola\"});",
            errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(7);

        //even comments are not acceptable between commas
        code = "myStruct ({a:100/*hello*/, b:foo (100),/**/c: 19082, /*shi*/d:\"hello world\",\n/**/e:\"this passes YOLO\",e: 100/**/,/**/f: 18972});";
        errors = Solium.lint(toFunction(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(5);

        Solium.reset();
        done();
    });

});
