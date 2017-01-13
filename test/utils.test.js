// @flow

import { compact } from '../src/utils';

const simple = {
  foo: 'bar',
  und: undefined,
  nil: null,
  obj: {},
  arr: []
};

const simpleExpected = {
  foo: 'bar'
};

const crazy = {
  foo: 'a',
  bar: null,
  baz: [
    simple,
    [ null ],
    undefined,
    [ simple, undefined, { a: null }, { key: 'val' } ],
    null,
    123
  ]
};

const crazyExpected = {
  foo: 'a',
  baz: [
    simpleExpected,
    [ simpleExpected, { key: 'val' } ],
    123
  ]
};

describe('utils', () => {
  describe('compact', () => {
    it('does not modify strings', () => {
      expect(compact('foobar')).toBe('foobar');
      expect(compact('')).toBe('');
    });

    it('does not modify numbers', () => {
      expect(compact(0)).toBe(0);
      expect(compact(42)).toBe(42);
    });

    it('does not modify booleans', () => {
      expect(compact(true)).toBe(true);
      expect(compact(false)).toBe(false);
    });

    it('does not modify undefined', () => {
      expect(compact(undefined)).toBeUndefined();
    });

    it('converts "null" to undefined', () => {
      expect(compact(null)).toBeUndefined();
    });

    it('converts {} to undefined', () => {
      expect(compact({})).toBeUndefined();
    });

    it('creates a copy of objects', () => {
      const o = { a: 'b' };
      expect(compact(o)).not.toBe(o);
    });

    it('converts [] to undefined', () => {
      expect(compact([])).toBeUndefined();
    });

    it('creates a copy of arrays', () => {
      const a = [ 'a', 'b' ];
      expect(compact(a)).not.toBe(a);
    });

    it('removes undefined keys from objects', () => {
      const res = compact({ a: 'a', b: undefined });
      expect(Object.keys(res)).not.toContain('b');
    });

    it('removes undefined elements from arrays', () => {
      expect(compact([ 'a', undefined, 'b' ])).toEqual([ 'a', 'b' ]);
    });

    it('recursively compacts nested objects', () => {
      expect(compact({ a: { b: { c: null } } })).toEqual(undefined);
    });

    it('recursively compacts nested arrays', () => {
      expect(compact([ 'a', [ 'b', [ null ] ] ])).toEqual([ 'a', [ 'b' ] ]);
    });

    /*
     * Everything should be covered by the tests above, but let's add a couple
     * of lifelike ones for the sake of sanity.
     */

    it('works as expected with a simple object', () => {
      const res = compact(simple);
      expect(res).toEqual(simpleExpected);
      expect(Object.keys(res)).not.toContain('und');
      expect(Object.keys(res)).not.toContain('nil');
      expect(Object.keys(res)).not.toContain('obj');
      expect(Object.keys(res)).not.toContain('arr');
    });

    it('works as expected with a crazy object', () => {
      const res = compact(crazy);
      expect(res).toEqual(crazyExpected);
    });
  });
});
