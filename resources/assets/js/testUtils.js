/* global global */
import { runSaga } from 'redux-saga';

global.sagaTest = (
  assertionNumber,
  mockedApi,
  mockedApiReturnValue,
  action,
  saga,
  apiCallTime,
  apiCallArgs,
  testDispatchedActions
) => () => {
  expect.assertions(assertionNumber);
  mockedApi.mockClear();
  mockedApiReturnValue(mockedApi);

  const dispatched = [];

  return runSaga(
    {
      dispatch: action => dispatched.push(action),
    },
    saga,
    action
  ).done.then(() => {
    expect(mockedApi).toBeCalledTimes(apiCallTime);
    expect(mockedApi).toBeCalledWith(...apiCallArgs);
    testDispatchedActions(dispatched);
  });
};
