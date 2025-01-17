"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var debug_1 = require("../debug");
var node_fetch = __importStar(require("node-fetch"));
var http_proxy_agent_1 = __importDefault(require("http-proxy-agent"));
var https_proxy_agent_1 = __importDefault(require("https-proxy-agent"));
var d = debug_1.debug("networking");
var isJest = typeof jest !== "undefined";
var warn = isJest ? function () { return ""; } : console.warn;
/**
 * Adds logging to every fetch request if a global var for `verbose` is set to true
 *
 * @param {(string | fetch.Request)} url the request
 * @param {fetch.RequestInit} [init] the usual options
 * @returns {Promise<fetch.Response>} network-y promise
 */
function api(url, init, suppressErrorReporting) {
    var _this = this;
    var isTests = typeof jest !== "undefined";
    if (isTests && !url.toString().includes("localhost")) {
        var message = "No API calls in tests please: " + url;
        debugger; // tslint:disable-line
        throw new Error(message);
    }
    if (global.verbose && global.verbose === true) {
        var output = ["curl", "-i"];
        if (init.method) {
            output.push("-X " + init.method);
        }
        var showToken = process.env["DANGER_VERBOSE_SHOW_TOKEN"];
        var token = process.env["DANGER_GITHUB_API_TOKEN"] || process.env["GITHUB_TOKEN"];
        if (init.headers) {
            for (var prop in init.headers) {
                if (init.headers.hasOwnProperty(prop)) {
                    // Don't show the token for normal verbose usage
                    if (init.headers[prop].includes(token) && !showToken) {
                        output.push("-H", "\"" + prop + ": [API TOKEN]\"");
                        continue;
                    }
                    output.push("-H", "\"" + prop + ": " + init.headers[prop] + "\"");
                }
            }
        }
        if (init.method === "POST") {
            // const body:string = init.body
            // output.concat([init.body])
        }
        if (typeof url === "string") {
            output.push(url);
        }
        d(output.join(" "));
    }
    var agent = init.agent;
    var proxy = process.env["HTTPS_PROXY"] || process.env["HTTP_PROXY"];
    if (!agent && proxy) {
        var secure = url.toString().startsWith("https");
        init.agent = secure ? new https_proxy_agent_1.default(proxy) : new http_proxy_agent_1.default(proxy);
    }
    var originalFetch = node_fetch.default;
    return originalFetch(url, init).then(function (response) { return __awaiter(_this, void 0, void 0, function () {
        var clonedResponse, responseBody, responseJSON, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(!suppressErrorReporting && !response.ok)) return [3 /*break*/, 5];
                    clonedResponse = response.clone();
                    warn("Request failed [" + clonedResponse.status + "]: " + clonedResponse.url);
                    return [4 /*yield*/, clonedResponse.text()];
                case 1:
                    responseBody = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, JSON.parse(responseBody.toString())];
                case 3:
                    responseJSON = _a.sent();
                    warn("Response: " + JSON.stringify(responseJSON, null, "  "));
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    warn("Response: " + responseBody);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, response];
            }
        });
    }); });
}
exports.api = api;
//# sourceMappingURL=fetch.js.map