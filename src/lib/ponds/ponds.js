import PublicError, { ErrorTypes } from './public-error';

const ponds = {
  default: {
    data(data, req, res) {
      res.send(data);
    },
    error(err, req, res) {
      res.status(err.status).send(err.message);
    }
  }
};

const transforms = {
  data(data) {
    return data;
  },
  error(e) {
    return e;
  }
};

function createHandler(pond) {
  return [
    (req, res, next) => {
      // 404 Error
      next(new PublicError(ErrorTypes.NotFound));
    },
    (data, req, res, next) => {
      try {
        // Data delivery
        if (!(data instanceof Error)) {
          return pond.data(transforms.data(data) || data, req, res);
        }
      } catch (e) {
        data = e;
      }
      // Error handler
      let err;
      try {
        err = transforms.error(data) || data;
      } catch (e) {
        err = new PublicError(null, { err: e });
      }
      if (!(err instanceof PublicError)) {
        err = new PublicError(null, { err });
      }
      pond.error(err, req, res);
    }
  ];
}

export default {
  set(name, obj) {
    ponds[name] = obj;
  },
  get(name) {
    return createHandler(ponds[name]);
  },
  transform({ data, error }) {
    if (data) transforms.data = data;
    if (error) transforms.error = error;
  }
};
