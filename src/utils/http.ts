import type { HttpNicks } from '#/interfaces/http';

const getHttpStatusCode = (errorNick?: HttpNicks) => {
  let errorNumber = 200;

  switch (errorNick) {
    case 'METHOD_NOT_ALLOWED':
      errorNumber = 405;
      break;
    case 'CREATED':
      errorNumber = 201;
  }

  return errorNumber;
};

const responseSuccessful = (httpNick: HttpNicks, data: Record<string, any>) => {
  const errorHttp = getHttpStatusCode(httpNick);

  return new Response(JSON.stringify({ error: false, data: data }), {
    status: errorHttp,
    headers: { 'Content-Type': 'application/json' },
  });
};

const responseError = (httpNick: HttpNicks, message: string) => {
  const errorHttp = getHttpStatusCode(httpNick);

  return new Response(JSON.stringify({ error: true, errorcode: httpNick, message: message }), {
    status: errorHttp,
    headers:
      httpNick === 'METHOD_NOT_ALLOWED'
        ? { 'Content-Type': 'application/json', Allow: 'POST' }
        : { 'Content-Type': 'application/json' },
  });
};

export { getHttpStatusCode, responseSuccessful, responseError };
