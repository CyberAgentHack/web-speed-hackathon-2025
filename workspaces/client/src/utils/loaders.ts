import pMinDelay from 'p-min-delay';

export function createLazyRoute<T>(
  importer: () => Promise<T>,
  store: any,
  delay = 1000
): () => Promise<{
  Component: any;
  loader: (args?: { params?: unknown }) => Promise<any>;
}> {
  return async () => {
    const module = await pMinDelay(importer(), delay);
    const Component =
      (module as any).default ??
      (module as any).Component ??
      Object.values(module).find((v: any) => typeof v === 'function');

    const prefetch = (module as any).prefetch;

    return {
      Component,
      async loader({ params }: any = {}) {
        return prefetch ? await prefetch(store, params) : {};
      },
    };
  };
}
