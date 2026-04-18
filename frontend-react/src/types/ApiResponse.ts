export interface GeneralResponse {
  message: string;
}

export interface ErrorResponse extends GeneralResponse {
  statusCode: number;
}
