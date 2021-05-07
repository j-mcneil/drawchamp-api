import Boom from '@hapi/boom';
import Hapi from '@hapi/hapi';
import { catchError } from 'rxjs/operators';

import { ServerError } from './server-error';

export function handleErrorBoom(request: Hapi.Request) {
  return catchError((error: ServerError) => {
    const code = error.code || 500;

    request.log(['error', `code:${code}`], error.message || error);
    throw new Boom.Boom(code !== 500 ? error.message : undefined, {
      statusCode: code,
    });
  });
}
