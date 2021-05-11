import * as Boom from '@hapi/boom';
import * as Hapi from '@hapi/hapi';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { of, throwError } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { stubInterface } from 'ts-sinon';

import { handleErrorBoom } from './handle-error-boom';

describe('handleErrorBoom', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    // deep equals on Boom.Boom is failing, so let's test individual pieces
    scheduler = new TestScheduler(
      (a: { notification: { error: Boom.Boom } }[], b: { notification: { error: Boom.Boom } }[]) => {
        const transformBoom = ({ isBoom, message, output: { statusCode } }: Boom.Boom) => ({
          isBoom,
          message,
          statusCode,
        });
        const transformEmission = (n: { notification: { error: Boom.Boom } }) => ({
          ...n,
          notification: { ...n.notification, error: transformBoom(n.notification.error) },
        });
        const mappedA = a.map(transformEmission);
        const mappedB = b.map(transformEmission);

        expect(mappedA).deep.equal(mappedB);
      }
    );
  });

  it('should throw a Boom error if an errow is thrown', () => {
    const request = stubInterface<Hapi.Request>();
    const message = 'could not find it!';
    const code = 404;

    scheduler.run(({ expectObservable }) => {
      const stream$ = throwError(() => ({ code, message })).pipe(handleErrorBoom(request));

      expectObservable(stream$).toBe(
        '#',
        undefined,
        new Boom.Boom(message, {
          statusCode: code,
        })
      );
    });
  });

  it('should throw a Boom error with a 500 status code if there is no status code', () => {
    const request = stubInterface<Hapi.Request>();

    scheduler.run(({ expectObservable }) => {
      const stream$ = throwError(() => 'oops, there was an error').pipe(handleErrorBoom(request));

      expectObservable(stream$).toBe(
        '#',
        undefined,
        new Boom.Boom('Internal Server Error', {
          statusCode: 500,
        })
      );
    });
  });

  it('should not throw an error if one was not thrown earlier in the stream', () => {
    const request = stubInterface<Hapi.Request>();

    scheduler = new TestScheduler((a, b) => {
      expect(a).deep.equals(b);
    });

    scheduler.run(({ expectObservable }) => {
      const stream$ = of(1).pipe(handleErrorBoom(request));

      expectObservable(stream$).toBe('(c|)', { c: 1 });
    });
  });
});
