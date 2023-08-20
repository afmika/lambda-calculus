import {
  _0,
  _1,
  AND,
  B,
  C,
  exp,
  FALSE,
  I,
  K,
  KI,
  M,
  NOT,
  mult,
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

// Equality samples
const samples = [
  [M(FALSE)(TRUE), OR(FALSE)(TRUE)].map(asBoolean),
  [OR(FALSE)(TRUE), K].map(asBoolean),
  [AND(FALSE)(TRUE), KI].map(asBoolean),
  [NOT(TRUE), FALSE].map(asBoolean),
  [KI(1)(2), C(K)(1)(2)],
  [_0, FALSE].map(asBoolean),
  [_1(I)(1), I(1)],
  [succ(_0), _1].map(asNumber),
  [succ(_0), I((f) => f)].map(asNumber),
  [succ(succ(_0)), succ(_1)].map(asNumber),
  [pred(succ(succ(_0))), _1].map(asNumber),
  [numeralPred(numeral(100)), numeral(99)].map(asNumber),
  [plus(_0)(_1), _1].map(asNumber),
  [
    plus(numeral(38))(numeral(63)),
    numeral(101),
  ].map(asNumber),
  [
    mult(numeral(38))(numeral(63)),
    numeral(2394),
  ].map(asNumber),
  [
    exp(numeral(12))(numeral(3)),
    numeral(1728),
  ].map(asNumber),
  [
    exp(numeral(12))(numeral(3)),
    C(C(B)(I))(numeral(12))(numeral(3)),
  ].map(asNumber)
];

for (let i = 0; i < samples.length; i++) {
  const [lhs, rhs] = samples[i];
  if (lhs !== rhs) {
    throw Error(`mismatch at sample #${i}: ${lhs} != ${rhs}`);
  }
}
console.log("all ok!");