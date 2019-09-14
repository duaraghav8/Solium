/**
 * @fileoverview Ensure that operators are surrounded by a single space on either side
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

const solparse = require("solparse");

module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "error",
            description: "Ensure that operators are surrounded by a single space on either side"
        },

        schema: [],

        fixable: "whitespace"

    },

    create: function(context) {

        let sourceCode = context.getSourceCode();

        function inspectAssignmentExpression(emitted) {
            const node = emitted.node;
            if (emitted.exit) {
                return;
            }

            const code = sourceCode.getStringBetweenNodes(node.left, node.right);
            const escapedCode = commentsToWhitespace(code);
            const [leftOfOperator, rightOfOperator] = escapedCode.split(node.operator);

            if (leftOfOperator !== " " || rightOfOperator !== " ") {
                context.report({
                    node: node,
                    message: "Assignment operator must have exactly single space on both sides of it.",
                    fix(fixer) {
                        return fixer.replaceTextRange(
                            [node.left.end, node.right.start],
                            ` ${node.operator} `
                        );
                    }
                });
            }
        }

        //statement like `var x = 10` doesn't come under AssignmentExpression, so needs to be checked separately
        function inspectVariableDeclaration(emitted) {
            const node = emitted.node;

            if (emitted.exit) {
                return;
            }

            const escapedCode = commentsToWhitespace(sourceCode.getText(node));

            //if a particular character is '=', check its left and right for single space
            const oneSpaceOnLeft = /^[^\/\s] $/;
            const whitespaceOnLeft = /(\s+)$/;
            const oneSpaceOnRight = /^ [^\/\s]$/;
            const whitespaceOnRight = /^(\s+)/;

            for (let i = 2; i < escapedCode.length; i++) {
                if (escapedCode [i] === "=") {
                    if (!oneSpaceOnLeft.test(escapedCode.slice(i - 2, i))) {
                        context.report({
                            node: node,
                            message: "There should be only a single space between assignment operator '=' and its left side.",
                            fix(fixer) {
                                const match = escapedCode.slice(0, i).match(whitespaceOnLeft);
                                if (!match) {
                                    return fixer.insertTextAt(node.start + i, " ");
                                }

                                const whitespace = match[1];
                                const start = node.start + i - whitespace.length;
                                const end = node.start + i;

                                return fixer.replaceTextRange([start, end], " ");
                            }
                        });
                    }

                    if (!oneSpaceOnRight.test(escapedCode.slice(i + 1, i + 3))) {
                        context.report({
                            node: node,
                            message: "There should be only a single space between assignment operator '=' and its right side.",
                            fix(fixer) {
                                const match = escapedCode.slice(i + 1, escapedCode.length - 1).match(whitespaceOnRight);
                                if (!match) {
                                    return fixer.insertTextAt(node.start + i + 1, " ");
                                }

                                const whitespace = match[1];
                                const start = node.start + i + 1;
                                const end = start + whitespace.length;

                                return fixer.replaceTextRange([start, end], " ");
                            }
                        });
                    }
                }
            }
        }

        function inspectBinaryExpression(emitted) {
            let node = emitted.node;

            if (emitted.exit) {
                return;
            }

            /**
			 * If the left & right side of expression span over multiple lines,
			 * make sure that the operator resides on the same line as the left expression (ie, first line)
			 */
            // 1. take line no. of both left & right expr. Line no (right) = line (left) + 1
            // Take string btw them, should be NO \n before operator. that's it

            const rightNodeStartingLine = sourceCode.getLine(node.right);
            const leftNodeEndingLine = sourceCode.getEndingLine(node.left);
            const opRegExp = node.operator.replace(/([\+\*\/\|\^])/g, "\\$1");

            if (rightNodeStartingLine > leftNodeEndingLine) {
                const validationRegexOpOnSameLineAsLeftNodeEnd = new RegExp("^[^\\n]*" + opRegExp);
                const strBetweenLeftAndRightNode = sourceCode.getStringBetweenNodes(node.left, node.right);

                if (!validationRegexOpOnSameLineAsLeftNodeEnd.test(strBetweenLeftAndRightNode)) {
                    context.report({
                        node: node,
                        location: {
                            column: sourceCode.getEndingColumn(node.left)
                        },
                        message: "Operator \"" + node.operator + "\" should be on the line where left side of the Binary expression ends.",
                        fix(fixer) {
                            // Reduce whitespace to the left of operator to 1 space
                            // Insert a linebreak if there are no linebreaks to the right

                            const operator = sourceCode.getStringBetweenNodes(node.left, node.right);
                            const match = operator.match(/^(\s*)/);
                            if (!match) {
                                return null;
                            }
                            const whitespace = match[1];

                            const start = node.left.end;
                            const end = node.left.end + whitespace.length;

                            const fixes = [fixer.replaceTextRange([start, end], " ")];

                            const rightWhitespace = operator.slice(
                                whitespace.length + node.operator.length,
                                operator.length
                            );
                            if (!rightWhitespace.includes("\n")) {
                                const operatorEnd = end + node.operator.length;
                                fixes.push(fixer.insertTextAt(operatorEnd, "\n"));
                            }

                            return fixes;
                        }
                    });
                }

                if (rightNodeStartingLine !== leftNodeEndingLine + 1) {
                    context.report({
                        node: node,
                        location: {
                            column: sourceCode.getColumn(node.right),
                            line: sourceCode.getLine(node.right)
                        },
                        message: "In Binary Expressions that span over multiple lines, expression on the right side of the operator (" + node.operator + ") must be exactly 1 line below the line on which the left expression ends.",
                        fix(fixer) {
                            const operator = sourceCode.getStringBetweenNodes(node.left, node.right);
                            const match = operator.match(/(\s*)$/);
                            if (!match) {
                                return null;
                            }
                            const whitespace = match[1];

                            const start = node.right.start - whitespace.length;
                            const end = node.right.start;

                            return fixer.replaceTextRange([start, end], "\n");
                        }
                    });
                }

                return;
            }


            const code = sourceCode.getStringBetweenNodes(node.left, node.right);
            const escapedCode = commentsToWhitespace(code);
            const [leftOfOperator, rightOfOperator] = escapedCode.split(node.operator);

            // Force spacing based on the left side of operator
            const forceNoSpacing = leftOfOperator === "";
            const removeRight = forceNoSpacing && rightOfOperator.length > 0;
            const insertSpaceOnRight = !forceNoSpacing && rightOfOperator === "";

            if (removeRight || insertSpaceOnRight) {
                context.report({
                    node: node,
                    location: {
                        column: sourceCode.getEndingColumn(node.left) + 1
                    },
                    message: "Single space should be either on both sides of '" + node.operator + "' or not at all.",
                    fix(fixer) {
                        if (removeRight) {
                            const endOfOperator = node.left.end + node.operator.length;

                            return fixer.removeRange([endOfOperator, endOfOperator + 1]);
                        }

                        return fixer.insertTextAt(node.right.start, " ");
                    }
                });
            }

            if (!forceNoSpacing) {
                if (leftOfOperator.length > 0 && leftOfOperator !== " ") {
                    context.report({
                        node: node,
                        location: {
                            column: sourceCode.getEndingColumn(node.left)
                        },
                        message: "There should be a maximum of single space and no comments between left side and '" + node.operator + "'.",
                        fix(fixer) {
                            const start = node.left.end;
                            const end = start + leftOfOperator.length;

                            return fixer.replaceTextRange([start, end], " ");
                        }
                    });
                }

                if (rightOfOperator.length > 0 && rightOfOperator !== " ") {
                    context.report({
                        node: node,
                        location: {
                            column: sourceCode.getColumn(node.right)
                        },
                        message: "There should be a maximum of single space and no comments between right side and '" + node.operator + "'.",
                        fix(fixer) {
                            const start = node.right.start - rightOfOperator.length;
                            const end = node.right.start;

                            return fixer.replaceTextRange([start, end], " ");
                        }
                    });
                }
            }
        }

        return {
            BinaryExpression: inspectBinaryExpression,
            VariableDeclaration: inspectVariableDeclaration,
            AssignmentExpression: inspectAssignmentExpression
        };

    }

};

function commentsToWhitespace(code) {
    const comments = solparse.parseComments(code);
    comments.forEach(comment => {
        code = code.replace(comment.text, " ".repeat(comment.text.length));
    });

    return code;
}
