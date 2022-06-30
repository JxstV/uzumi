"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AyayaError = void 0;
class AyayaError {
    static apiError(msg, url, route, status, method) {
        const error = new Error(msg);
        error.name = "AyayaError -> [DAPIError]";
        //@ts-ignore
        error.url = url;
        //@ts-ignore
        error.route = route;
        //@ts-ignore
        error.code = status;
        //@ts-ignore
        error.method = method;
        throw error;
    }
}
exports.AyayaError = AyayaError;
//# sourceMappingURL=AyayaError.js.map