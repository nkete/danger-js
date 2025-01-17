#! /usr/bin/env node
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var sharedDangerfileArgs_1 = __importDefault(require("./utils/sharedDangerfileArgs"));
var node_cleanup_1 = __importDefault(require("node-cleanup"));
var commander_1 = __importDefault(require("commander"));
var debug_1 = require("../debug");
var get_stdin_1 = __importDefault(require("get-stdin"));
var chalk_1 = __importDefault(require("chalk"));
var inline_1 = __importDefault(require("../runner/runners/inline"));
var fileUtils_1 = require("./utils/fileUtils");
var jsonToContext_1 = require("../runner/jsonToContext");
var getRuntimeCISource_1 = __importDefault(require("./utils/getRuntimeCISource"));
var platform_1 = require("../platforms/platform");
var os_1 = require("os");
var fs_1 = require("fs");
var path_1 = require("path");
var d = debug_1.debug("runner");
// Given the nature of this command, it can be tricky to test, so I use a command like this:
//
// tslint:disable-next-line:max-line-length
//
// yarn build; cat source/_tests/fixtures/danger-js-pr-395.json | env DANGER_FAKE_CI="YEP" DANGER_TEST_REPO='danger/danger-js' DANGER_TEST_PR='395' node distribution/commands/danger-runner.js --text-only
//
// Which will build danger, then run just the dangerfile runner with a fixtured version of the JSON
commander_1.default
    .usage("[options]")
    .description("Handles running the Dangerfile, expects a DSL from STDIN, which should be passed from `danger` or danger run`. You probably don't need to use this command.")
    // Because other calls will trigger this one,
    // and we don't want to keep a white/blacklist
    .allowUnknownOption(true);
var argvClone = process.argv.slice(0);
sharedDangerfileArgs_1.default(commander_1.default).parse(argvClone);
d("Started Danger runner with " + commander_1.default.args);
var foundDSL = false;
var runtimeEnv = {};
var run = function (config) { return function (jsonString) { return __awaiter(_this, void 0, void 0, function () {
    var source, _a, platform, dangerFile, context;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = (config && config.source);
                if (_a) return [3 /*break*/, 2];
                return [4 /*yield*/, getRuntimeCISource_1.default(config)];
            case 1:
                _a = (_b.sent());
                _b.label = 2;
            case 2:
                source = _a;
                platform = platform_1.getPlatformForEnv(process.env, source);
                d("Got STDIN for Danger Run");
                foundDSL = true;
                dangerFile = fileUtils_1.dangerfilePath(commander_1.default);
                return [4 /*yield*/, jsonToContext_1.jsonToContext(jsonString, commander_1.default, source)];
            case 3:
                context = _b.sent();
                return [4 /*yield*/, inline_1.default.createDangerfileRuntimeEnvironment(context)];
            case 4:
                runtimeEnv = _b.sent();
                d("Evaluating " + dangerFile);
                if (!platform.executeRuntimeEnvironment) return [3 /*break*/, 6];
                return [4 /*yield*/, platform.executeRuntimeEnvironment(inline_1.default.runDangerfileEnvironment, dangerFile, runtimeEnv)];
            case 5:
                _b.sent();
                return [3 /*break*/, 8];
            case 6: return [4 /*yield*/, inline_1.default.runDangerfileEnvironment([dangerFile], [undefined], runtimeEnv)];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); }; };
// Wait till the end of the process to print out the results. Will
// only post the results when the process has succeeded, leaving the
// host process to create a message from the logs.
node_cleanup_1.default(function (exitCode, signal) {
    var results = runtimeEnv.results;
    d("Process has finished with " + exitCode + ", sending the results back to the host process " + (signal || ""));
    d("Got md " + results.markdowns.length + " w " + results.warnings.length + " f " + results.fails.length + " m " + results.messages.length);
    if (foundDSL) {
        var resultsPath = path_1.join(os_1.tmpdir(), "danger-results.json");
        d("Writing results into " + resultsPath);
        fs_1.writeFileSync(resultsPath, JSON.stringify(results, null, 2), "utf8");
        process.stdout.write("danger-results:/" + resultsPath);
    }
});
// Add a timeout so that CI doesn't run forever if something has broken.
setTimeout(function () {
    if (!foundDSL) {
        console.error(chalk_1.default.red("Timeout: Failed to get the Danger DSL after 1 second"));
        process.exitCode = 1;
        process.exit(1);
    }
}, 1000);
// Start waiting on STDIN for the DSL
get_stdin_1.default().then(run(commander_1.default));
//# sourceMappingURL=danger-runner.js.map