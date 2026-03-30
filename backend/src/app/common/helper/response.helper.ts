export const createResponse = <T>(
  data: T | null = null,
  message: string = "Success",
  success: boolean = true
) => {
  return { success, message, data };
};

export const createErrorResponse = (
  message: string = "An error occurred",
  error: any = null
) => {
  return { success: false, message, error };
};
