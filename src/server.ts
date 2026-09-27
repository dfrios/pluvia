import handler from '@tanstack/react-start/server-entry';

declare module '@tanstack/react-router' {
  interface Register {
    server: {
      requestContext: {
        cloudflare: { env: Env; ctx: ExecutionContext };
        waitUntil: ExecutionContext['waitUntil'];
      };
    };
  }
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return handler.fetch(request, {
      context: {
        cloudflare: { env, ctx },
        waitUntil: ctx.waitUntil.bind(ctx),
      },
    });
  },
} satisfies ExportedHandler<Env>;
