import { request } from "undici";
import { Client } from "../client/client";
import { AyayaError } from "../errors/AyayaError";
import { requestData, requestOption, RoutedData } from "../typings/interface";
import { userAgent } from "../utils/constants";
import { ConvertObjectToSnakeCase } from "../utils/functions";

export async function nonRouteRequest(
  data: requestData,
  options: requestOption,
  client: Client,
) {
  const reqData = await request(data.url, options);

  if (reqData.headers["x-ratelimit-bucket"]) {
    const routeData: RoutedData = {
      bucket: <string>reqData.headers["x-ratelimit-bucket"],
      route: data.route,
      limit: Number(reqData.headers["x-ratelimit-limit"]),
      remaining: Number(reqData.headers["x-ratelimit-remaining"]),
      reset: <string>reqData.headers["x-ratelimit-reset"],
      resetAfter: Number(reqData.headers["x-ratelimit-reset-after"]) * 1000,
    };
    client.apiQueue.set(data.route, routeData);
    const t = setTimeout(() => {
      client.apiQueue.delete(data.route);
      clearTimeout(t);
    }, routeData.resetAfter);
  }
  const globalRoute = client.apiQueue.get("global");
  const newgroute: RoutedData = {
    bucket: "global",
    route: "global",
    limit: globalRoute?.limit ?? 50,
    remaining: (globalRoute?.remaining ?? 50) - 1,
    reset: globalRoute?.reset ?? new Date(Date.now() + 1000).toISOString(),
    resetAfter: -1,
  };
  newgroute.resetAfter = new Date(newgroute.reset).getTime() - Date.now();
  client.apiQueue.set("global", newgroute);
  if (!globalRoute) {
    const t = setTimeout(() => {
      client.apiQueue.delete("global");
      clearTimeout(t);
    }, 1000);
  }
  return reqData;
}
export async function requestApi(data: requestData, client: Client) {
  const d = client.apiQueue.get(data.route);
  let getData;
  let globalRoute = client.apiQueue.get("global");
  const options: requestOption = {
    method: data.method,
    headers: {
      "user-agent": userAgent,
      "content-type": "application/json",
      authorization: `Bot ${client.token}`,
    },
  };
  if (data.params)
    options.body = JSON.stringify(ConvertObjectToSnakeCase(data.params));
  if (data.auditLogReason)
    options.headers["X-Audit-Log-Reason"] = data.auditLogReason;
  if (globalRoute && globalRoute.remaining === 0) {
    return new Promise((res, rej) => {
      const t = setTimeout(async () => {
        const getData = await nonRouteRequest(data, options, client);
        if (getData.statusCode >= 200 && getData.statusCode < 300) {
          res(getData.body.json());
        } else {
          return AyayaError.apiError(
            (await getData.body.json()).message,
            data.url,
            data.route,
            getData.statusCode,
            options.method,
          );
        }
        clearTimeout(t);
      }, globalRoute?.resetAfter);
    });
  } else {
    if (!d) {
      getData = await nonRouteRequest(data, options, client);
      if (getData.statusCode >= 200 && getData.statusCode < 300) {
        return getData.body.json();
      } else {
        return AyayaError.apiError(
          (await getData.body.json()).message,
          data.url,
          data.route,
          getData.statusCode,
          options.method,
        );
      }
    } else {
      if (d.remaining === 0) {
        getData = new Promise((res, rej) => {
          const t = setTimeout(async () => {
            const getData = await nonRouteRequest(data, options, client);
            if (getData.statusCode >= 200 && getData.statusCode < 300) {
              res(getData.body.json());
            } else {
              return AyayaError.apiError(
                (await getData.body.json()).message,
                data.url,
                data.route,
                getData.statusCode,
                options.method,
              );
            }
            clearTimeout(t);
          }, d.resetAfter);
        });
      } else {
        getData = await nonRouteRequest(data, options, client);
        if (getData.statusCode >= 200 && getData.statusCode < 300) {
          return getData.body.json();
        } else {
          return AyayaError.apiError(
            (await getData.body.json()).message,
            data.url,
            data.route,
            getData.statusCode,
            options.method,
          );
        }
      }
    }
  }
  return getData;
}
