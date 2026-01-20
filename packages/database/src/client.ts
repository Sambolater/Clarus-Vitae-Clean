/**
 * Prisma client instance.
 * Uses a global singleton in development to prevent multiple instances during hot reload.
 * Provides a stub during builds when the client isn't generated.
 *
 * Uses a Proxy to lazily initialize the client, avoiding build-time errors.
 */

const globalForPrisma = globalThis as unknown as {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any | undefined;
  prismaInitialized: boolean;
  prismaInitError: Error | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedClient: any = null;

function getClient() {
  // Return cached client if already initialized
  if (cachedClient) {
    return cachedClient;
  }

  // Return global singleton if available (dev mode)
  if (globalForPrisma.prisma) {
    cachedClient = globalForPrisma.prisma;
    return cachedClient;
  }

  // Try to initialize Prisma client
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require('@prisma/client');
    cachedClient = new PrismaClient({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
    });

    // Store in global for dev mode hot reload
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = cachedClient;
    }

    return cachedClient;
  } catch (e) {
    globalForPrisma.prismaInitError = e as Error;
    // Return null to signal client not available
    return null;
  }
}

// Create a proxy that lazily initializes the client on first access
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createLazyProxy = (): any => {
  return new Proxy(
    {},
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      get: (_target: any, prop: string): any => {
        // Handle special Prisma methods that should work even without client
        if (prop === '$connect') {
          return async () => {
            const client = getClient();
            if (client) {
              return client.$connect();
            }
          };
        }
        if (prop === '$disconnect') {
          return async () => {
            const client = getClient();
            if (client) {
              return client.$disconnect();
            }
          };
        }
        if (prop === 'then' || prop === 'catch' || prop === 'finally') {
          // Prevent Promise-like behavior that can cause issues
          return undefined;
        }

        // For any model access, try to get the real client
        const client = getClient();
        if (client) {
          return client[prop];
        }

        // No client available - return a proxy that throws helpful errors
        return new Proxy(
          {},
          {
            get: () => {
              return () => {
                const errorMsg = globalForPrisma.prismaInitError?.message || 'Unknown error';
                throw new Error(
                  `Database not available. Prisma client not initialized. ` +
                    `Run "prisma generate" to generate the client. Error: ${errorMsg}`
                );
              };
            },
          }
        );
      },
    }
  );
};

// Export a lazy proxy - no initialization happens until first property access
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db: any = createLazyProxy();
