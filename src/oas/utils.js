export function operationId(...strs) {
  const operationId = strs.join('');
  const summary = strs
    .join(' ')
    .split('')
    .reduce((acc, value, i, arr) => {
      if (i === 0) return value.toUpperCase();
      if (i === arr.length - 1) return acc + value;

      return /[A-Z]/.exec(arr[i + 1]) && value !== ' ' && !/[A-Z]/.exec(value)
        ? acc + value + ' '
        : acc + value;
    }, '');
  return {
    summary,
    operationId,
    description: 'Operation: *' + operationId + '*'
  };
}

export function exclude(obj, arr) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (!arr.includes(key)) acc[key] = value;
    return acc;
  }, {});
}

export function request(schema) {
  return {
    content: {
      'application/json': {
        schema
      }
    },
    // description: '',
    required: true
  };
}

export function response(schema) {
  return {
    description: 'Successful operation',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['status', 'data'],
          properties: {
            status: { type: 'string', enum: ['success'] },
            data: schema
          }
        }
      }
    }
  };
}
