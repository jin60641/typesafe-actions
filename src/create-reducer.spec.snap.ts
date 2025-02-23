import * as T from './type-helpers'; // type-tests global
import { ActionType } from './type-helpers';
import { createAction } from './create-action';
import { createReducer } from './create-reducer';
import { getType } from './get-type';

const add = createAction('ADD')<number>();
const increment = createAction('INCREMENT')();
const decrement = createAction('DECREMENT')();
const reduxInit = createAction('@@redux/INIT.1')();
const actions = {
  add,
  increment,
  decrement,
  reduxInit,
};

declare module './type-helpers' {
  interface Types {
    RootAction: ActionType<typeof actions>;
  }
}

const initialState = 0;

// @dts-jest:group With Action Creators
{
  const emptyReducer = createReducer(initialState);

  const counterReducer1 = emptyReducer.handleAction(
    [add, increment],
    (state, action) => state + (action.type === 'ADD' ? action.payload : 1)
  );
  // @dts-jest:pass:snap -> Record<"ADD" | "INCREMENT", (state: number, action: T.PayloadAction<"ADD", number> | T.EmptyAction<"INCREMENT"> | T.EmptyAction<"DECREMENT"> | T.EmptyAction<"@@redux/INIT.1">) => number>
  counterReducer1.handlers;
  // @dts-jest:pass
  Object.keys({ ...counterReducer1.handlers }); // => ["ADD", "INCREMENT"]
  // @dts-jest:pass
  Object.keys({ ...emptyReducer.handlers }); // => []

  const counterReducer2 = emptyReducer
    .handleAction([add], (state, action) => state + action.payload)
    .handleAction([increment], (state, _) => state + 1);
  // @dts-jest:pass:snap -> Record<"ADD" | "INCREMENT", (state: number, action: T.PayloadAction<"ADD", number> | T.EmptyAction<"INCREMENT"> | T.EmptyAction<"DECREMENT"> | T.EmptyAction<"@@redux/INIT.1">) => number>
  counterReducer2.handlers;
  // @dts-jest:pass
  Object.keys({ ...counterReducer2.handlers }); // => ["ADD", "INCREMENT"]
  // @dts-jest:pass
  Object.keys({ ...emptyReducer.handlers }); // => []

  const counterReducer3 = emptyReducer.handleAction(
    add,
    (state, action) => state + action.payload
  );
  // @dts-jest:pass:snap -> Record<"ADD", (state: number, action: T.PayloadAction<"ADD", number> | T.EmptyAction<"INCREMENT"> | T.EmptyAction<"DECREMENT"> | T.EmptyAction<"@@redux/INIT.1">) => number>
  counterReducer3.handlers;
  // @dts-jest:pass
  Object.keys({ ...counterReducer3.handlers }); // => [ "ADD"]
  // @dts-jest:pass
  Object.keys({ ...emptyReducer.handlers }); // => []

  const counterReducer4 = emptyReducer.handleAction(
    increment,
    (state, _) => state + 1
  );
  // @dts-jest:pass:snap -> Record<"INCREMENT", (state: number, action: T.PayloadAction<"ADD", number> | T.EmptyAction<"INCREMENT"> | T.EmptyAction<"DECREMENT"> | T.EmptyAction<"@@redux/INIT.1">) => number>
  counterReducer4.handlers;
  // @dts-jest:pass
  Object.keys({ ...counterReducer4.handlers }); // => [ "INCREMENT"]
  // @dts-jest:pass
  Object.keys({ ...emptyReducer.handlers }); // => []

  const counterReducer5 = emptyReducer
    .handleAction(add, (state, action) => state + action.payload)
    .defaultHandler((state, action) => state + 1);

  // @dts-jest:pass:snap -> Record<"ADD" | "INCREMENT" | "DECREMENT" | "@@redux/INIT.1", (state: number, action: T.PayloadAction<"ADD", number> | T.EmptyAction<"INCREMENT"> | T.EmptyAction<"DECREMENT"> | T.EmptyAction<"@@redux/INIT.1">) => number>
  counterReducer5.handlers;
  // @dts-jest:pass
  Object.keys({ ...counterReducer5.handlers }); // => [ "ADD"]
  // @dts-jest:pass
  Object.keys({ ...emptyReducer.handlers }); // => []

  {
    [
      counterReducer1,
      counterReducer2,
      createReducer(initialState, {
        [getType(add)]: counterReducer3.handlers.ADD,
        [getType(increment)]: counterReducer4.handlers.INCREMENT,
      }),
      createReducer(initialState, {
        [getType(add)]: (state: any, action: any) => state + action.payload,
        [getType(increment)]: (state: any, _: any) => state + 1,
      }),
      createReducer<number, ActionType<typeof actions>>(initialState, {
        [getType(add)]: (state: any, action: any) => state + action.payload,
        [getType(increment)]: (state: any, _: any) => state + 1,
      }),
    ].forEach(fn => {
      // @dts-jest:pass
      fn(0, {} as any); // => 0
      // @dts-jest:pass
      fn(0, increment()); // => 1
      // @dts-jest:pass
      fn(0, add(4)); // => 4
    });
    // @dts-jest:pass
    counterReducer5(0, {} as any); // => 1
    // @dts-jest:pass
    counterReducer5(0, add(4)); // => 4
  }
}

// @dts-jest:group Type refinement checks
{
  type State = {
    foo: string | null;
  };

  const defaultState: State = {
    foo: null,
  };

  const actions2 = {
    foo1: createAction('foo1')<string>(),
    foo2: createAction('foo2')<string>(),
    foo3: createAction('foo3')(),
    foo4: createAction('foo4')(),
    foo5: createAction('foo5')(),
  };

  type Action = ActionType<typeof actions2>;

  const reducer = createReducer<State, Action>(defaultState)
    .handleAction(actions2.foo1, (state, action) => {
      // @dts-jest:pass:snap -> { foo: string | null; }
      state;
      // @dts-jest:pass:snap -> T.PayloadAction<"foo1", string>
      action;

      return {
        ...state,
        foo: action.payload,
      };
    })
    .handleAction(actions2.foo2, (state, action) => {
      // @dts-jest:pass:snap -> { foo: string | null; }
      state;
      // @dts-jest:pass:snap -> T.PayloadAction<"foo2", string>
      action;

      return {
        ...state,
        foo: action.payload,
      };
    })
    .handleAction(actions2.foo3, (state, action) => {
      // @dts-jest:pass:snap -> { foo: string | null; }
      state;
      // @dts-jest:pass:snap -> T.EmptyAction<"foo3">
      action;

      return {
        ...state,
        foo: 'empty',
      };
    })
    .handleAction(actions2.foo4, (state, action) => {
      // @dts-jest:pass:snap -> { foo: string | null; }
      state;
      // @dts-jest:pass:snap -> T.EmptyAction<"foo4">
      action;

      return {
        ...state,
        foo: 'empty',
      };
    })
    .defaultHandler((state, action) => {
      // @dts-jest:pass:snap -> { foo: string | null; }
      state;
      // @dts-jest:pass:snap -> T.EmptyAction<"foo5">
      action;

      return {
        ...state,
        foo: 'default',
      };
    });

  // @dts-jest:pass:snap -> Record<"foo1" | "foo2" | "foo3" | "foo4" | "foo5", (state: { foo: string | null; }, action: T.PayloadAction<"foo1", string> | T.PayloadAction<"foo2", string> | T.EmptyAction<"foo3"> | T.EmptyAction<"foo4"> | T.EmptyAction<"foo5">) => { foo: string | null; }>
  reducer.handlers;

  {
    [
      reducer(defaultState, actions2.foo1('check')),
      reducer(defaultState, actions2.foo2('check')),
    ].forEach(reducerResult => {
      // @dts-jest:pass:snap -> { foo: string | null; }
      reducerResult; // => { foo: "check" }
    });

    [
      reducer(defaultState, actions2.foo3()),
      reducer(defaultState, actions2.foo4()),
    ].forEach(reducerResult => {
      // @dts-jest:pass:snap -> { foo: string | null; }
      reducerResult; // => { foo: "empty" }
    });

    const reducerDefaultResult = reducer(defaultState, actions2.foo5());
    // @dts-jest:pass:snap -> { foo: string | null; }
    reducerDefaultResult; // => { foo: "default" }
  }
}

// @dts-jest:group With Action Types
{
  const reducerTest = createReducer(initialState);

  const counterReducer1 = reducerTest.handleType(
    ['ADD', 'INCREMENT'],
    (state, action) => state + (action.type === 'ADD' ? action.payload : 1)
  );
  // @dts-jest:pass:snap -> Record<"ADD" | "INCREMENT", (state: number, action: T.PayloadAction<"ADD", number> | T.EmptyAction<"INCREMENT"> | T.EmptyAction<"DECREMENT"> | T.EmptyAction<"@@redux/INIT.1">) => number>
  counterReducer1.handlers;
  // @dts-jest:pass
  Object.keys({ ...counterReducer1.handlers }); // => ["ADD", "INCREMENT"]
  // @dts-jest:pass
  Object.keys({ ...reducerTest.handlers }); // => []

  const counterReducer2 = reducerTest
    .handleType(['ADD'], (state, action) => state + action.payload)
    .handleType(['INCREMENT'], (state, _) => state + 1);
  // @dts-jest:pass:snap -> Record<"ADD" | "INCREMENT", (state: number, action: T.PayloadAction<"ADD", number> | T.EmptyAction<"INCREMENT"> | T.EmptyAction<"DECREMENT"> | T.EmptyAction<"@@redux/INIT.1">) => number>
  counterReducer2.handlers;
  // @dts-jest:pass
  Object.keys({ ...counterReducer2.handlers }); // => ["ADD", "INCREMENT"]
  // @dts-jest:pass
  Object.keys({ ...reducerTest.handlers }); // => []

  const counterReducer3 = reducerTest.handleType(
    'ADD',
    (state, action) => state + action.payload
  );
  // @dts-jest:pass:snap -> Record<"ADD", (state: number, action: T.PayloadAction<"ADD", number> | T.EmptyAction<"INCREMENT"> | T.EmptyAction<"DECREMENT"> | T.EmptyAction<"@@redux/INIT.1">) => number>
  counterReducer3.handlers;
  // @dts-jest:pass
  Object.keys({ ...counterReducer3.handlers }); // => ["ADD"]
  // @dts-jest:pass
  Object.keys({ ...reducerTest.handlers }); // => []

  const counterReducer4 = reducerTest.handleType(
    'INCREMENT',
    (state, _) => state + 1
  );
  // @dts-jest:pass:snap -> Record<"INCREMENT", (state: number, action: T.PayloadAction<"ADD", number> | T.EmptyAction<"INCREMENT"> | T.EmptyAction<"DECREMENT"> | T.EmptyAction<"@@redux/INIT.1">) => number>
  counterReducer4.handlers;
  // @dts-jest:pass
  Object.keys({ ...counterReducer4.handlers }); // => [ "INCREMENT"]
  // @dts-jest:pass
  Object.keys({ ...reducerTest.handlers }); // => []

  const counterReducer5 = reducerTest
    .handleType(['ADD'], (state, action) => state + action.payload)
    .defaultHandler((state, action) => state + 1);
  // @dts-jest:pass:snap -> Record<"ADD" | "INCREMENT" | "DECREMENT" | "@@redux/INIT.1", (state: number, action: T.PayloadAction<"ADD", number> | T.EmptyAction<"INCREMENT"> | T.EmptyAction<"DECREMENT"> | T.EmptyAction<"@@redux/INIT.1">) => number>
  counterReducer5.handlers;
  // @dts-jest:pass
  Object.keys({ ...counterReducer5.handlers }); // => [ "ADD"]
  // @dts-jest:pass
  Object.keys({ ...reducerTest.handlers }); // => []

  {
    [
      counterReducer1,
      counterReducer2,
      createReducer(initialState, {
        ADD: counterReducer3.handlers.ADD,
        INCREMENT: counterReducer4.handlers.INCREMENT,
      }),
      createReducer(initialState, {
        ADD: (state, action) => state + action.payload,
        INCREMENT: (state, action) => state + 1,
      }),
      createReducer<number, ActionType<typeof actions>>(initialState, {
        ADD: (state, action) => state + action.payload,
        INCREMENT: (state, action) => state + 1,
      }),
    ].forEach(fn => {
      // @dts-jest:pass
      fn(0, {} as any); // => 0
      // @dts-jest:pass
      fn(0, increment()); // => 1
      // @dts-jest:pass
      fn(0, add(4)); // => 4
    });
    // @dts-jest:pass
    counterReducer5(0, increment()); // => 1;
    // @dts-jest:pass
    counterReducer5(0, add(4)); // => 4;
  }
}
