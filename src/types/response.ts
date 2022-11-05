export type jsonResponse = {
  json(response: { code?: number; result?: any; retcode?: string }): any;
  status(code: number): jsonResponse;
  redirect(response: string): any;
  locals: any;
};
