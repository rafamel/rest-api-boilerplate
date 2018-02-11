function dispatch(cb) {
  return async (req, res, next) => {
    try {
      next(await cb(req));
    } catch (err) {
      next(err);
    }
  };
}

function batchDispatch(obj) {
  Object.keys(obj).forEach((key) => {
    const cb = obj[key];
    obj[key] = dispatch(cb);
  });
  return obj;
}

export { dispatch, batchDispatch };
