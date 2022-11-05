// @flow
export class Error {
  status: number;
  name: string;
  /**
   * httpStatus 를 포함한 Error
   * @param message
   * @param status
   */
  constructor(message: string, status: number) {
    this.name = "Error";
    this.status = status || 500;
  }
}

export const asyncWrapper = (fn: Function) => async (
  req: any,
  res: any,
  next: any
) => await fn(req, res, next).catch(next);

export function KSTDate(): Date {
  const nowDate = new Date();
  nowDate.setHours(nowDate.getHours() + 9);
  return nowDate;
}
