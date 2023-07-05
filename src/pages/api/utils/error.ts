export class CustomError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function error(error: Error): string {
  if (error instanceof CustomError) {
    return error.message;
  }
  return "unknown error";
}
