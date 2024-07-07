/// Core definitions

/**
 * Identity combinator\
 * `λa.a`
 */
export const I = (a) => a;

/**
 * Mockerbird combinator: self-application\
 * `λf.ff`
 */
export const M = (f) => f(f);

/**
 * Kestrel combinator: first\
 * `λab.a`
 */
export const K = (a) => (b) => a;

/**
 * Kite combinator: second (equiv. `CK`)\
 * `λab.b`
 */
export const KI = (a) => (b) => b;

/**
 * Cardinal combinator: reverse arguments\
 * `λfab.fba`
 */
export const C = (f) => (a) => (b) => f(b)(a);

/**
 * Bluebird combinator: composition\
 * `λabc.a(b c)`
 */
export const B = (a) => (b) => (c) => a(b(c));

/// Booleans

/**
 * TRUE: select first argument\
 * `λab.a`
 */
export const TRUE = K;

/**
 * FALSE: select second argument\
 * `λab.b`
 */
export const FALSE = KI;

/**
 * NOT: negation\
 * `λp.pFT`
 */
export const NOT = (p) => p(FALSE)(TRUE);

/**
 * AND: conjunction\
 * `λpq.pqp` (equiv. `λpq.pqF`)
 */
export const AND = (p) => (q) => p(q)(p);

/**
 * OR: disjunction\
 * `λpq.ppq` (equiv. `λpq.pTRUEq` and `M*`)
 */
export const OR = (p) => (q) => p(p)(q);

/// Church encodings
// https://en.wikipedia.org/wiki/Church_encoding

/**
 * Number zero\
 * `λfa.a` (equiv. `FALSE`)
 */
export const _0 = (f) => (a) => a;

/**
 * Number one\
 * `λfa.fa` (equiv. `I*`)
 */
export const _1 = (f) => (a) => f(a);

/**
 * Successor of a Church numeral\
 * `λnfa.f(n f a)`
 */
export const succ = (n) => (f) => (a) => f(n(f)(a));

/**
 * Predecessor of a Church numeral\
 * `λnfa.n(λgh.h(g f))(λu.a)(λu.u)` (equiv. `λnfa.n(λgh.h(g f))(λu.a)I`)
 */
export const pred = (n) => (f) => (a) => n((g) => (h) => h(g(f)))((u) => a)(I);

/**
 * Addition between two Church numerals\
 * `λmnfa.mf(n f a)`
 */
export const plus = (m) => (n) => (f) => (a) => m(f)(n(f)(a));

/**
 * Substraction between two Church numerals\
 * `λmn.(n pred)m`
 */
export const minus = (m) => (n) => n(pred)(m);

/**
 * Multiplication between two Church numerals\
 * `λmnfa.m(n f)a`
 */
export const mult = (m) => (n) => (f) => (a) => m(n(f))(a);

/**
 * Exponentiation between two Church numerals\
 * `λmn.mn` (equiv. composition)
 */
export const exp = (m) => (n) => n(m);
// export const exp = C(C(B)(I)); // pretty neat huh?
// export const exp = m => n => B(n)(I)(m); // with Bluebird

/**
 * Y combinator\
 * `Y = λf. (λx. f(x.x))(λx. f(x.x))`
 */
export const Y = (f) => ((x) => f(x(x)))((x) => f(x(x)));

/**
 * Z combinator, lazy rec version of the `Y combinator`\
 * `Z = λf. (λxy. (f(x.x))y) (λxy. (f(x.x))y)`
 */
export const Z = (f) => ((x) => (y) => f(x(x))(y))((x) => (y) => f(x(x))(y));
// export const Z = (f) => ((x) => x(x))(x => f((y) => x(x)(y)));

/**
 * `λn.n (λx. FALSE) TRUE`
 */
export const IsZero = (n) => n((x) => FALSE)(TRUE);

// Pure version, this will stack-overflow as the two branches will be computed simulatenously..
// Lazy-evaluation by default is not native in js
// FIXME: find a way to lazy eval the paths for this version?
// export const factorialCanon = Z((facto) => (n) =>
//   IsZero(n) (_1) (
//     mult(n)(facto(pred(n)))
//   )
// );

// Same as above but each branch are computed in demand per courtesy of the host language
export const factorial = Z((facto) => (n) => (p) =>
  p(true)(false)(IsZero(n)) ? _1 : (
    mult(n)(facto(pred(n)))
  )
);
