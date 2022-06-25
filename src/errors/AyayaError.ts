export class AyayaError {
  static apiError(
    msg: string,
    url: string,
    route: string,
    status: number,
    method: string,
  ) {
    const error = new Error(msg);
    error.name = "AyayaError -> [DAPIError]";
    //@ts-ignore: valid
    error.url = url;
    //@ts-ignore: valid
    error.route = route;
    //@ts-ignore: valid
    error.code = status;
    //@ts-ignore: valid
    error.method = method;

    throw error;
  }
}
