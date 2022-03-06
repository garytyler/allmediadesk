/*
(5+8)*3/8+3

3+9/3*(8+5)

(8+5)

Approach:

Iterate chars in reverse
    Put each char on a stack
    If *opening* paren:
        Pull chars off stack until closing paren
        this is a base simple expression
        Solve it and add the result to the stack
*/

const solveAdd = (exp) => {
  // Resolve addition
  let n1 = "",
    n2 = "",
    op = "";
  while (exp.length > 0) {
    const c = exp.pop();
    if (c >= "0" && c <= "9") {
      n1 += c;
    } else if (n1.length > 0) {
      op = c;
      while (
        exp.length > 0 &&
        "0" <= exp[exp.length - 1] &&
        exp[exp.length - 1] <= "9"
      ) {
        n2 += exp.pop();
      }

      if (op === "+") {
        let result = String(parseInt(n1) + parseInt(n2));

        for (char of result.split("").reverse()) {
          exp.push(char);
        }
      } else if (op === "-") {
        let result = String(parseInt(n1) - parseInt(n2));

        for (char of result.split("").reverse()) {
          exp.push(char);
        }
      }

      n1 = n2 = op = "";
    }
  }

  if (n1.length > 0) {
    // dd tail operand to stack
    for (char of n1) exp.push(char);
  }

  return exp;
};

const solveMultiply = (expr) => {
  const dst = [];

  // Resolve multiplication
  let n1 = "",
    n2 = "",
    op = "";
  while (expr.length > 0) {
    if ("0" <= expr[expr.length - 1] && expr[expr.length - 1] <= "9") {
      n1 += expr.pop();
    } else if (expr[expr.length - 1] === "*" || expr[expr.length - 1] === "/") {
      op = expr.pop();

      while (
        expr &&
        "0" <= expr[expr.length - 1] &&
        expr[expr.length - 1] <= "9"
      ) {
        n2 += expr.pop();
      }

      if (!n1.length) {
        // When multiple * and / operations are done in sequence,
        // we need to pop from the stack instead of from the expression
        // to get the first operand.
        while (
          dst.length > 0 &&
          dst[dst.length - 1] >= "0" &&
          dst[dst.length - 1] <= "9"
        ) {
          n1 += dst.pop();
        }
        n1 = n1.split("").reverse().join("");
      }

      if (op === "*") {
        for (char of String(parseInt(n1) * parseInt(n2))) {
          dst.push(char);
        }
      } else if (op == "/") {
        for (char of String(Math.floor(parseInt(n1) / parseInt(n2)))) {
          dst.push(char);
        }
      }

      n1 = n2 = op = "";
    } else if (expr[expr.length - 1] === "+" || expr[expr.length - 1] === "-") {
      op = expr.pop();

      if (n1.length > 0) {
        for (char of n1) dst.push(char);

        dst.push(op);
      } else {
        dst.push(op);

        while (
          expr.length > 0 &&
          "0" <= expr[expr.length - 1] &&
          expr[expr.length - 1] <= "9"
        ) {
          n2 += expr.pop();
        }

        for (char of n2) dst.push(char);
      }

      n1 = n2 = op = "";
    }
  }

  if (n1.length > 0) {
    // dd tail operand to stack
    for (char of n1) dst.push(char);
  }

  return dst;
};

const solveSimple = (exp) => {
  const multiplied = solveMultiply(exp);
  multiplied.reverse();
  const added = solveAdd(multiplied);
  // join digits and return integer
  return parseInt(added.join(""));
};

const calculate = (expr) => {
  const complex = expr.split("").reverse();

  const stack = [];

  for (let i = 0; i < complex.length; i++) {
    if (complex[i] !== "(") {
      if (complex[i] !== " ") stack.push(complex[i]);
    } else {
      const simple = [];

      while (stack.length > 0) {
        const c = stack.pop();
        if (c === ")") {
          break;
        } else {
          simple.push(c);
        }
      }

      let solved = solveSimple(simple);

      for (char of String(Math.abs(solved)).split("").reverse()) {
        stack.push(char);
      }

      if (solved < 0) stack.append("-");
    }
  }

  return solveSimple(stack);
};

const getY = (equation, x) => {
  let formula = new String(equation).replaceAll("x", x);
  return calculate(formula);
};

const updateGraph = () => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");
  let eq = document.getElementById("eqInput").value;
  let y;
  let prevX = 0;
  let prevY = getY(eq, prevX);
  ctx.beginPath();
  x = 0;
  for (let x = 0; x < 200; x++) {
    ctx.moveTo(prevX, prevY);
    y = getY(eq, x);
    ctx.lineTo(x, y);
    prevX = x;
    prevY = y;
  }
  ctx.closePath();
  ctx.stroke();
};
