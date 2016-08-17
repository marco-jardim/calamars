import test from 'ava';

import ContextSet from 'lib/contextSet';

const storage = new ContextSet({ localPath: '../cache-test' });

test('removeContext', t => {
    const contextId = 1;
    storage.removeContext(contextId);
    t.deepEqual(storage.getContext(contextId), {});
});

test('setContext without id or next context returns null', t => {
    t.falsy(storage.setContext());
    t.falsy(storage.setContext('2'));
});

test('setContext, getContext, getContextProp', t => {
    const contextId = '2';
    const nextContext = {
        id: contextId,
        name: 'foo'
    };
    storage.removeContext(contextId);
    storage.setContext(contextId, nextContext);
    t.deepEqual(storage.getContext(contextId), nextContext);
    t.is(storage.getContextProp(contextId, 'name'), nextContext.name);
});

test('setContextProp, removeContextProp', t => {
    const contextId = '345';
    const context = {
        firstName: 'foo',
        lastName: 'bar'
    };
    const age = 37;
    const age2 = 18;
    storage.removeContext(contextId);
    storage.setContext(contextId, context);
    storage.setContextProp(contextId, 'age', age);
    t.is(storage.getContextProp(contextId, 'age'), age);
    t.deepEqual(storage.getContext(contextId), { id: contextId, age, ...context });
    storage.setContextProp(contextId, 'age', age2);
    t.deepEqual(storage.getContext(contextId), { id: contextId, age: age2, ...context });

    storage.removeContextProp(contextId, 'age');
    t.deepEqual(storage.getContext(contextId), { id: contextId, ...context });
    return t.pass();
});