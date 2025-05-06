export default class apiError extends Error {
  statusCode: number;
  errorMessage: string;
  errors: any[];
  data: any;
  success: boolean;

  constructor(
    statusCode: number,
    errorMessage = "Something went wrong",
    errors: any[] = [],
    stack = ""
  ) {
    super(errorMessage);

    this.statusCode = statusCode;
    this.errorMessage = errorMessage;
    this.errors = errors;
    this.data = null;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
