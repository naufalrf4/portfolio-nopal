export function getErrorMessage(error: unknown, fallback: string = 'An error occurred'): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object') {
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }

    if ('error' in error) {
      const nestedError = (error as { error: unknown }).error;
      if (typeof nestedError === 'string') {
        return nestedError;
      }
      if (nestedError && typeof nestedError === 'object' && 'message' in nestedError) {
        return String((nestedError as { message: unknown }).message);
      }
    }
  }

  return fallback;
}
