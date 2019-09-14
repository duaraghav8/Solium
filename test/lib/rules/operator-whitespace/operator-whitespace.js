/**
 * @fileoverview Tests for operator-whitespace.js rule
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

let Solium = require("../../../../lib/solium");
let wrappers = require("../../../utils/wrappers");
let toFunction = wrappers.toFunction;

let userConfig = {
    "custom-rules-filename": null,
    "rules": {
        "operator-whitespace": true
    }
};

describe("[RULE] operator-whitespace: Acceptances", function() {

    it("should accept BinaryExpressions having no extraneous whitespace or comments with the operator", function(done) {
        let code = [
            "x [10]+y.foo;",
            "x.foo + bar ();",
            "x.foo * bar ();",
            "x.foo**bar ();",
            "x.foo ^ bar ();",
            "x.foo >> bar ();",
            "x.foo && bar ();",
            "x.foo||bar ();",
            "x.foo - bar ();",
            "x.foo <= bar ();",
            "x.foo%clu++;",
            "x.foo <= (1 - 45);",
            "(90.89 * 1) / (100 - 76 % (3**2));",
            "!x + --8;",
            "(90.89 * 1) / (100 - 76 % 3**2);",
            "a ** b + c ** d;",
            "8 * 9 / 3 % 2;",
            "1 + 8 - 67;",
            "1909 + 189 * 1 ** 29 / 190;",
            "1909 + 189*1 ** 29/190;",
            "1909+189*1**29/190;",
            "x+189 * uy ** dex / 190;",
            "z = foo ().baz;"
        ];
        let errors;

        code = code.map(function(item){return toFunction(item);});
        code.forEach(function(snippet) {
            errors = Solium.lint(snippet, userConfig);
            errors.constructor.name.should.equal("Array");
            errors.length.should.equal(0);
        });

        Solium.reset();
        done();
    });

    it("should accept multi-line Binary Expression whose operator resides on the line where left side expression ends AND whose right side expression begins 1 line below the line where left expression ends.", function(done) {
        let errors, code = [
            "if (foobarMotherfuckers (price, 100) &&\n\t++crazyCounter) {\n}",
            "if (foobarMotherfuckers (price, 100)\t &&\n\t++crazyCounter) {\n}"
        ];

        code = code.map(function(str) { return toFunction(str); });
        code.forEach(function(snippet) {
            errors = Solium.lint(snippet, userConfig);
            errors.constructor.name.should.equal("Array");
            errors.length.should.equal(0);
        });

        code = toFunction(`
            if (
              appWasMade(_listingAddress) &&
              listings[_listingAddress].applicationExpiry < now &&
              !getListingIsWhitelisted(_listingAddress) &&
              (challengeID == NO_CHALLENGE || challenges[challengeID].resolved == true)
            ) {
              return true;
            }
        `);
        errors = Solium.lint(code, userConfig);
        errors.should.be.Array();
        errors.should.be.empty();

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

            "(a, b) = (10, foo(90, \"hello\"));",
            "(a) = 10;",
            "(a) = (10);",
            "(a, b, abra, kadabra) = (i,i,i,i);",
            "(myVar) = callSomeFunc(0x00, true);",

            "(a, b) += (10, foo(90, \"hello\"));",
            "(a) += 10;",
            "(a) += (10);",
            "(a, b, abra, kadabra) += (i,i,i,i);",
            "(myVar) += callSomeFunc(0x00, true);",

            "(a, b) *= (10, foo(90, \"hello\"));",
            "(a) *= 10;",
            "(a) *= (10);",
            "(a, b, abra, kadabra) *= (i,i,i,i);",
            "(myVar) *= callSomeFunc(0x00, true);",

            "(a, b) /= (10, foo(90, \"hello\"));",
            "(a) /= 10;",
            "(a) /= (10);",
            "(a, b, abra, kadabra) /= (i,i,i,i);",
            "(myVar) /= callSomeFunc(0x00, true);",

            "(a, b) -= (10, foo(90, \"hello\"));",
            "(a) -= 10;",
            "(a) -= (10);",
            "(a, b, abra, kadabra) -= (i,i,i,i);",
            "(myVar) -= callSomeFunc(0x00, true);",

            "(a, b) %= (10, foo(90, \"hello\"));",
            "(a) %= 10;",
            "(a) %= (10);",
            "(a, b, abra, kadabra) %= (i,i,i,i);",
            "(myVar) %= callSomeFunc(0x00, true);"
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


describe("[RULE] operator-whitespace: Rejections", function() {

    it("should reject BinaryExpressions with extraneous whitespace or comments next to operators", function(done) {
        let code = [
            "x [10]  +y.foo;",
            "x.foo +  bar ();",
            "x.foo\t* bar ();",
            "x.foo**\tbar ();",
            "x.foo  ^ bar ();",
            "x.foo\t>>\t\tbar ();",
            "x.foo/**/&& bar ();",
            "x.foo||/**/bar ();",
            "x.foo/**/-/**/bar ();",
            "x.foo /**/<=/**/ bar ();",
            "x.foo% clu++;",
            "x.foo/**/ <= /**/(1 - 45);",
            "(90.89 * 1) /**/-/**/ (100 - 76 % (3**2));",
            "x.foo          **\t    \tbar ();",
            "8 *\t9 /\t3 % 2;",
            "1+ 8- 67;",
            "1909\t+\t\t189 * 1 ** 29 / 190;",
            "1909\t+ 189*1\t** 29/190;",
            "1909+ 189 *1**29/190;",
            "x+189 * uy\t**\tdex / 190;"
        ];
        let errors;

        code = code.map(function(item){return toFunction(item);});

        errors = Solium.lint(code [0], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

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
        errors.length.should.equal(2);

        errors = Solium.lint(code [6], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        errors = Solium.lint(code [7], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        errors = Solium.lint(code [8], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        errors = Solium.lint(code [9], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        errors = Solium.lint(code [10], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);

        errors = Solium.lint(code [11], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        errors = Solium.lint(code [12], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        errors = Solium.lint(code [13], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        errors = Solium.lint(code [14], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        errors = Solium.lint(code [15], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        errors = Solium.lint(code [16], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        errors = Solium.lint(code [17], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        errors = Solium.lint(code [18], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        errors = Solium.lint(code [19], userConfig);
        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        Solium.reset();
        done();
    });

    it("should reject multi-line Binary Expression whose operator is not on the line where left side of the exp. ends.", function(done) {
        let code = [
            "if (foobarMotherfuckers (price, 100)\n&&\t++crazyCounter) {\n}",
            "if (foobarMotherfuckers (price, 100)\t\n&&++crazyCounter) {\n}"
        ];

        code = code.map(function(str) { return toFunction(str); });
        code.forEach(function(snippet) {
            let errors = Solium.lint(snippet, userConfig);
            errors.constructor.name.should.equal("Array");
            errors.length.should.equal(1);
        });

        let opErrorAndRightExprErrorCode = "if (foobarMotherfuckers (price, 100)\n&&\n\t++crazyCounter) {\n}",
            errors = Solium.lint(toFunction(opErrorAndRightExprErrorCode), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(2);

        Solium.reset();
        done();
    });

    it("should reject multi-line Binary Expression whose right side doesn't fall exactly 1 line below the ending line of left side of the expr.", function(done) {
        let code = [
            "if (foobarMotherfuckers (price, 100)&&\n\n\t++crazyCounter) {\n}",
            "if (foobarMotherfuckers (price, 100)  &&\t\n\n\n\n++crazyCounter) {\n}"
        ];

        code = code.map(function(str) { return toFunction(str); });
        code.forEach(function(snippet) {
            let errors = Solium.lint(snippet, userConfig);
            errors.constructor.name.should.equal("Array");
            errors.length.should.equal(1);
        });

        Solium.reset();
        done();
    });

    it("should reject SequenceExpression nodes with extraneous whitespace", function(done) {
        const single = [
            "(a, b)\n  = (10, foo(90, \"hello\"));",
            "(a) =         10;",
            "(a)             = (10);",
            "(a, b, abra, kadabra)\n\n\t= (i,i,i,i);",
            "(myVar) = \t \tcallSomeFunc(0x00, true);",

            "(a, b) +=\t(10, foo(90, \"hello\"));",
            "(a) +=10;",
            "(a) +=(10);",
            "(a, b, abra, kadabra)+= (i,i,i,i);",
            "(myVar) +=\t\n\t\ncallSomeFunc(0x00, true);",

            "(a, b)     *=(10, foo(90, \"hello\"));",
            "(a)*=10;",
            "(a)   *=\t(10);",
            "(a, b, abra, kadabra) \n*=\n (i,i,i,i);",
            "(myVar)*=\t\t\t\n\ncallSomeFunc(0x00, true);",

            "(a, b)/=(10, foo(90, \"hello\"));",
            "(a) \n/=\t\t 10;",
            "(a)     /=  (10);",
            "(a, b, abra, kadabra)/=(i,i,i,i);",
            "(myVar)   /=   callSomeFunc(0x00, true);"
        ];

        single.forEach(statement => {
            const errors = Solium.lint(toFunction(statement), userConfig);

            errors.should.be.Array();
            errors.should.have.size(1);
        });

        Solium.reset();
        done();
    });

});

describe("[RULE] operator-whitespace: Fixes", function() {

    it("should fix whitespace around operators when fix is enabled", function(done) {
        const testCases = [
            // Assignments
            {
                input: "foo   \t= bar;\n",
                output: "foo = bar;\n"
            },
            {
                input: "foo =     \t\tbar;\n",
                output: "foo = bar;\n"
            },
            {
                input: "foo      =      bar;\n",
                output: "foo = bar;\n"
            },
            {
                input: "foo    +=    bar;",
                output: "foo += bar;"
            },
            {
                input: "foo  /** **/  +=    bar;",
                output: "foo += bar;"
            },
            {
                input: "foo   += /** **/   bar;",
                output: "foo += bar;"
            },
            {
                input: "foo  /** **/ += /** **/   bar;",
                output: "foo += bar;"
            },
            {
                input: "foo  /** += **/ += /** += **/   bar;",
                output: "foo += bar;"
            },

            // Variable declaration
            {
                input: "var a = \t\t      \"hello\";",
                output: "var a = \"hello\";"
            },
            {
                input: "var a\t  \t      \t= \"hello\";",
                output: "var a = \"hello\";"

            },
            {
                input: "var a  \t\t      =  \t\t      \"hello\";",
                output: "var a = \"hello\";"
            },
            {
                input: "var a= \"hello\";",
                output: "var a = \"hello\";"
            },
            {
                input: "var a/** **/ = \"hello\";",
                output: "var a = \"hello\";"
            },
            {
                input: "var a = /** **/ \"hello\";",
                output: "var a = \"hello\";"
            },
            {
                input: "var a /** **/ = /** **/ \"hello\";",
                output: "var a = \"hello\";"
            },
            {
                input: "var a /** = **/ = /** = **/ \"hello\";",
                output: "var a = \"hello\";"
            },
            {
                input: "var a/****/=/****/\"hello\";",
                output: "var a = \"hello\";"
            },

            // Multiline binary expressions
            {
                input: "if (foo (price, 100)&&\n\n\t++bar) {\n}",
                output: "if (foo (price, 100)&&\n++bar) {\n}"
            },
            {
                input: "if (foo (price, 100)\t\n&&++bar) {\n}",
                output: "if (foo (price, 100) &&\n++bar) {\n}"
            },
            {
                input: "if (foo (price, 100)\t\n&&\n\n\n++bar) {\n}",
                output: "if (foo (price, 100) &&\n++bar) {\n}"
            },

            // Binary operators
            // - force no spacing if no spacing on the left
            {
                input: "if (foo (price, 100)&& bar) {\n}",
                output: "if (foo (price, 100)&&bar) {\n}"
            },

            // - add missing space on the right
            {
                input: "if (foo (price, 100) &&bar) {\n}",
                output: "if (foo (price, 100) && bar) {\n}"
            },
            {
                input: "if (foo (price, 100)\t\t\t   &&bar) {\n}",
                output: "if (foo (price, 100) && bar) {\n}"
            },

            // - trim extra whitespace
            {
                input: "if (foo (price, 100)\t&& bar) {\n}",
                output: "if (foo (price, 100) && bar) {\n}"
            },
            {
                input: "if (foo (price, 100)\t\t\t   && bar) {\n}",
                output: "if (foo (price, 100) && bar) {\n}"
            },

            // - trim comments
            {
                input: "if (foo (price, 100) /** **/ && bar) {\n}",
                output: "if (foo (price, 100) && bar) {\n}"
            },
            {
                input: "if (foo (price, 100) && /** **/ bar) {\n}",
                output: "if (foo (price, 100) && bar) {\n}"
            },
            {
                input: "if (foo (price, 100) /** **/ && /** **/ bar) {\n}",
                output: "if (foo (price, 100) && bar) {\n}"
            },
            {
                input: "if (foo (price, 100) /** **/ &&bar) {\n}",
                output: "if (foo (price, 100) && bar) {\n}"
            },
            {
                input: "if (foo (price, 100) /** && **/ && /** && d**/ bar) {\n}",
                output: "if (foo (price, 100) && bar) {\n}"
            }
        ];

        testCases.forEach(testCase => {
            let fixed = Solium.lintAndFix(toFunction(testCase.input), userConfig);

            fixed.should.be.type("object");
            fixed.should.have.ownProperty("fixedSourceCode");
            fixed.should.have.ownProperty("errorMessages");
            fixed.should.have.ownProperty("fixesApplied");

            fixed.fixedSourceCode.should.equal(toFunction(testCase.output));
            fixed.errorMessages.should.be.Array();
            fixed.errorMessages.length.should.equal(0);

            fixed.fixesApplied.should.be.Array();
            fixed.fixesApplied.length.should.be.aboveOrEqual(1);
        });

        Solium.reset();
        done();
    });
});