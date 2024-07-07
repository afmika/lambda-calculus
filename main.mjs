import {
  _0,
  _1,
  AND,
  B,
  C,
  exp,
  factorial,
  FALSE,
  I,
  IsZero,
  K,
  KI,
  M,
  minus,
  mult,
  NOT,
  OR,
  plus,
  pred,
  succ,
  TRUE,
} from "./lambda.mjs";

// lambda => js converters
const asNumber = (n) => n((x) => x + 1)(0);
const asBoolean = (p) => p(true)(false);

// js => lambda converters
const iter = (n = 0) => (f) => (x) => {
  let ff = f(x);
  while (n > 1) {
    ff = f(ff);
    n--;
  }
  return ff;
};
const numeral = (n = 0) => iter(n)(succ)(_0);
const numeralPred = (n = _0) => iter(n)(pred)(n);
const cast = (lifted, { stmt, eq }) => ({ stmt: lifted(stmt), eq: lifted(eq) });

[
  cast(asBoolean, { stmt: M(FALSE)(TRUE), eq: OR(FALSE)(TRUE) }),
  cast(asBoolean, { stmt: OR(FALSE)(TRUE), eq: K }),
  cast(asBoolean, { stmt: AND(FALSE)(TRUE), eq: KI }),
  cast(asBoolean, { stmt: NOT(TRUE), eq: FALSE }),
  cast(I, { stmt: KI(1)(2), eq: C(K)(1)(2) }),
  cast(asBoolean, { stmt: _0, eq: FALSE }),
  cast(I, { stmt: _1(I)(1), eq: I(1) }),
  cast(asNumber, { stmt: succ(_0), eq: _1 }),
  cast(asNumber, { stmt: succ(_0), eq: I((f) => f) }),
  cast(asNumber, { stmt: succ(succ(_0)), eq: succ(_1) }),
  cast(asNumber, { stmt: pred(succ(succ(_0))), eq: _1 }),
  cast(asNumber, { stmt: numeralPred(numeral(100)), eq: numeral(99) }),
  cast(asNumber, { stmt: plus(_0)(_1), eq: _1 }),
  cast(asNumber, { stmt: minus(numeral(10))(numeral(3)), eq: numeral(7) }),
  cast(asNumber, { stmt: minus(numeral(111))(numeral(42)), eq: numeral(69) }),
  cast(asNumber, { stmt: plus(numeral(38))(numeral(63)), eq: numeral(101) }),
  cast(asNumber, { stmt: mult(numeral(38))(numeral(63)), eq: numeral(2394) }),
  cast(asNumber, { stmt: exp(numeral(12))(numeral(3)), eq: numeral(1728) }),
  cast(asNumber, {
    stmt: exp(numeral(12))(numeral(3)),
    eq: C(C(B)(I))(numeral(12))(numeral(3)),
  }),
  cast(asBoolean, { stmt: IsZero(pred(pred(pred(numeral(3))))), eq: TRUE }),
  cast(asBoolean, { stmt: IsZero(numeral(8)), eq: FALSE }),
  cast(asBoolean, { stmt: IsZero(mult(_0)(_1)), eq: TRUE }),
  cast(asNumber, { stmt: factorial(_0), eq: _1 }),
  cast(asNumber, { stmt: factorial(numeral(5)), eq: numeral(120) }),
].forEach(({ stmt, eq }, i) => {
  if (stmt !== eq) {
    throw Error(`mismatch at sample #${i + 1}: ${stmt} != ${eq}`);
  }
});

console.log("all ok!");
