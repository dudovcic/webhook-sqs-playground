function pause(milli: number): Promise<void> {
  return new Promise<void>(
    (resolve: () => void): NodeJS.Timeout => global.setTimeout(resolve, milli)
  );
}

export async function retry(
  action: () => Promise<void>,
  retries: number = 10,
  backoff: number = 500
): Promise<void> {
  try {
    await action();
  } catch (err) {
    if (retries > 0) {
      await pause(backoff);
      await retry(action, retries - 1, backoff * 2);
    } else {
      throw err;
    }
  }
}
