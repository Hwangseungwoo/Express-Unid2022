export type jsonResponse = {
  json(response: { code?: number; result?: any; retcode?: string }): any;
  status(code: number): jsonResponse;
  redirect(response: string): any;
  locals: any;
};

export enum errorList {
  Exception = 0,
  NoUser = 1,
  Unauthorized = 2,
  LackInformation = 3,
  Duplicated = 4,
}
