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
 * Kestrel combinator: first, export const\
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
export const pred = (n) => (f) => (a) => n(g => h => h(g(f)))(u => a)(I);

/**
 * Addition between two Church numerals\
 * `λmnfa.mf(n f a)`
 */
export const plus = (m) => (n) => (f) => (a) => m(f)(n(f)(a));

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
