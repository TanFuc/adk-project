/**
 * Extract detailed error message from API error response
 * @param error - The error object from API call
 * @param fallbackMessage - Default message if no specific error found
 * @returns Formatted error message
 */
export function getErrorMessage(error: any, fallbackMessage: string): string {
  // Check for validation errors with details array
  if (error?.response?.data?.error?.details) {
    const details = error.response.data.error.details;
    if (Array.isArray(details) && details.length > 0) {
      return details.join("; ");
    }
  }

  // Check for general error message
  if (error?.response?.data?.error?.message) {
    return error.response.data.error.message;
  }

  // Check for direct message
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // Fallback to default message
  return fallbackMessage;
}
