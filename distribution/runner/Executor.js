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
Object.defineProperty(exports, "__esModule", { value: true });
var DangerResults_1 = require("../dsl/DangerResults");
var githubIssueTemplate_1 = require("./templates/githubIssueTemplate");
var bitbucketServerTemplate_1 = require("./templates/bitbucketServerTemplate");
var exceptionRaisedTemplate_1 = __importDefault(require("./templates/exceptionRaisedTemplate"));
var debug_1 = require("../debug");
var chalk_1 = __importDefault(require("chalk"));
var DangerUtils_1 = require("./DangerUtils");
var DangerDSL_1 = require("../dsl/DangerDSL");
var GitHubGit_1 = require("../platforms/github/GitHubGit");
// This is still badly named, maybe it really should just be runner?
var isTests = typeof jest === "object";
var Executor = /** @class */ (function () {
    function Executor(ciSource, platform, runner, options, process) {
        this.ciSource = ciSource;
        this.platform = platform;
        this.runner = runner;
        this.options = options;
        this.process = process;
        this.d = debug_1.debug("executor");
        this.log = isTests ? function () { return ""; } : console.log;
        this.logErr = isTests ? function () { return ""; } : console.error;
    }
    /**
     *  Runs all of the operations for a running just Danger
     * @param {string} file the filepath to the Dangerfile
     * @returns {Promise<DangerResults>} The results of the Danger run
     */
    Executor.prototype.runDanger = function (file, runtime) {
        return __awaiter(this, void 0, void 0, function () {
            var results, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.runner.runDangerfileEnvironment([file], [undefined], runtime)];
                    case 2:
                        results = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        results = this.resultsForError(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [4 /*yield*/, this.handleResults(results, runtime.danger.git)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, results];
                }
            });
        });
    };
    /**
     * Sets up all the related objects for running the Dangerfile
     * @returns {void} It's a promise, so a void promise
     */
    Executor.prototype.dslForDanger = function () {
        return __awaiter(this, void 0, void 0, function () {
            var useSimpleDSL, git, _a, getDSLFunc, platformDSL, utils;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        useSimpleDSL = this.platform.getPlatformReviewSimpleRepresentation && this.ciSource.useEventDSL;
                        this.d("Using full Danger DSL:", !useSimpleDSL);
                        if (!useSimpleDSL) return [3 /*break*/, 1];
                        _a = GitHubGit_1.emptyGitJSON();
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.platform.getPlatformGitRepresentation()];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        git = _a;
                        getDSLFunc = useSimpleDSL
                            ? this.platform.getPlatformReviewSimpleRepresentation
                            : this.platform.getPlatformReviewDSLRepresentation;
                        return [4 /*yield*/, getDSLFunc()];
                    case 4:
                        platformDSL = _b.sent();
                        utils = { sentence: DangerUtils_1.sentence, href: DangerUtils_1.href };
                        return [2 /*return*/, new DangerDSL_1.DangerDSL(platformDSL, git, utils, this.platform.name)];
                }
            });
        });
    };
    /**
     * Handle the message aspects of running a Dangerfile
     *
     * @param {DangerResults} results a JSON representation of the end-state for a Danger run
     */
    Executor.prototype.handleResults = function (results, git) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.d("Got results back:", results);
                        if (!results) {
                            throw new Error("Got no results back from the Dangerfile evaluation, this is likely an issue with a custom sub-process exiting early.");
                        }
                        DangerResults_1.validateResults(results);
                        this.d("Evaluator settings", this.options);
                        if (!(this.options.stdoutOnly || this.options.jsonOnly || (this.ciSource && this.ciSource.useEventDSL))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.handleResultsPostingToSTDOUT(results)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.handleResultsPostingToPlatform(results, git)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (this.options.failOnErrors && results.fails.length > 0) {
                            this.process.exitCode = 1;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Handle showing results inside the shell.
     *
     * @param {DangerResults} results a JSON representation of the end-state for a Danger run
     */
    Executor.prototype.handleResultsPostingToSTDOUT = function (results) {
        return __awaiter(this, void 0, void 0, function () {
            var fails, warnings, messages, markdowns, results_1, tick, cross, output, s, are, message, message, allMessages, oneMessage, longMessage, table;
            var _this = this;
            return __generator(this, function (_a) {
                fails = results.fails, warnings = results.warnings, messages = results.messages, markdowns = results.markdowns;
                if (this.options.jsonOnly) {
                    results_1 = {
                        fails: fails,
                        warnings: warnings,
                        messages: messages,
                        markdowns: markdowns,
                    };
                    process.stdout.write(JSON.stringify(results_1, null, 2));
                }
                else {
                    this.d("Writing to STDOUT:", results);
                    tick = chalk_1.default.bold.greenBright("✓");
                    cross = chalk_1.default.bold.redBright("ⅹ");
                    output = "";
                    if (fails.length > 0) {
                        s = fails.length === 1 ? "" : "s";
                        are = fails.length === 1 ? "is" : "are";
                        message = chalk_1.default.underline.red("Failing the build");
                        output = "Danger: " + cross + " " + message + ", there " + are + " " + fails.length + " fail" + s + ".";
                    }
                    else if (warnings.length > 0) {
                        message = chalk_1.default.underline("not failing the build");
                        output = "Danger: " + tick + " found only warnings, " + message;
                    }
                    else if (messages.length > 0) {
                        output = "Danger: " + tick + " passed, found only messages.";
                    }
                    else if (!messages.length && !fails.length && !messages.length && !warnings.length) {
                        output = "Danger: " + tick + " passed review, received no feedback.";
                    }
                    allMessages = fails.concat(warnings, messages, markdowns).map(function (m) { return m.message; });
                    oneMessage = allMessages.join("\n");
                    longMessage = oneMessage.split("\n").length > 30;
                    // For a short message, show the log at the top
                    if (!longMessage) {
                        // An empty blank line for visual spacing
                        this.log(output);
                    }
                    table = [
                        fails.length && { name: "Failures", messages: fails.map(function (f) { return f.message; }) },
                        warnings.length && { name: "Warnings", messages: warnings.map(function (w) { return w.message; }) },
                        messages.length && { name: "Messages", messages: messages.map(function (m) { return m.message; }) },
                        markdowns.length && { name: "Markdowns", messages: markdowns.map(function (m) { return m.message; }) },
                    ].filter(function (r) { return r !== 0; });
                    // Consider looking at getting the terminal width, and making it 60%
                    // if over a particular size
                    table.forEach(function (row) {
                        _this.log("## " + chalk_1.default.bold(row.name));
                        _this.log(row.messages.join(chalk_1.default.bold("\n-\n")));
                    });
                    // For a long message show the results at the bottom
                    if (longMessage) {
                        this.log("");
                        this.log(output);
                    }
                    // An empty blank line for visual spacing
                    this.log("");
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Handle showing results inside a code review platform
     *
     * @param {DangerResults} results a JSON representation of the end-state for a Danger run
     * @param {GitDSL} git a reference to a git implementation so that inline comments find diffs to work with
     */
    Executor.prototype.handleResultsPostingToPlatform = function (originalResults, git) {
        return __awaiter(this, void 0, void 0, function () {
            var results, fails, warnings, messages, markdowns, failureCount, messageCount, dangerID, failed, issueURL, previousComments, _i, previousComments_1, comment, s, are, previousComments, inline, inlineLeftovers, regular, mergedResults, commitID, comment, urlForInfo, successPosting;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = originalResults;
                        if (!this.platform.platformResultsPreMapper) return [3 /*break*/, 2];
                        this.d("Running platformResultsPreMapper:");
                        return [4 /*yield*/, this.platform.platformResultsPreMapper(results, this.options)];
                    case 1:
                        results = _a.sent();
                        this.d("Received results from platformResultsPreMapper:", results);
                        _a.label = 2;
                    case 2:
                        fails = results.fails, warnings = results.warnings, messages = results.messages, markdowns = results.markdowns;
                        failureCount = fails.concat(warnings).length;
                        messageCount = messages.concat(markdowns).length;
                        this.d("Posting to platform:", results);
                        dangerID = this.options.dangerID;
                        failed = fails.length > 0;
                        issueURL = undefined;
                        if (!(failureCount + messageCount === 0)) return [3 /*break*/, 9];
                        this.log("Found no issues or messages from Danger. Removing any existing messages on " + this.platform.name + ".");
                        return [4 /*yield*/, this.platform.deleteMainComment(dangerID)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.platform.getInlineComments(dangerID)];
                    case 4:
                        previousComments = _a.sent();
                        _i = 0, previousComments_1 = previousComments;
                        _a.label = 5;
                    case 5:
                        if (!(_i < previousComments_1.length)) return [3 /*break*/, 8];
                        comment = previousComments_1[_i];
                        if (!comment) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.deleteInlineComment(comment)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 5];
                    case 8: return [3 /*break*/, 14];
                    case 9:
                        if (fails.length > 0) {
                            s = fails.length === 1 ? "" : "s";
                            are = fails.length === 1 ? "is" : "are";
                            this.log("Failing the build, there " + are + " " + fails.length + " fail" + s + ".");
                        }
                        else if (warnings.length > 0) {
                            this.log("Found only warnings, not failing the build.");
                        }
                        else if (messageCount > 0) {
                            this.log("Found only messages, passing those to review.");
                        }
                        return [4 /*yield*/, this.platform.getInlineComments(dangerID)];
                    case 10:
                        previousComments = _a.sent();
                        inline = DangerResults_1.inlineResults(results);
                        return [4 /*yield*/, this.sendInlineComments(inline, git, previousComments)];
                    case 11:
                        inlineLeftovers = _a.sent();
                        regular = DangerResults_1.regularResults(results);
                        mergedResults = DangerResults_1.sortResults(DangerResults_1.mergeResults(regular, inlineLeftovers));
                        if (!DangerResults_1.isEmptyResults(mergedResults)) return [3 /*break*/, 12];
                        this.platform.deleteMainComment(dangerID);
                        return [3 /*break*/, 14];
                    case 12:
                        commitID = git.commits && git.commits[git.commits.length - 1].sha;
                        comment = process.env["DANGER_BITBUCKETSERVER_HOST"]
                            ? bitbucketServerTemplate_1.template(dangerID, commitID, mergedResults)
                            : githubIssueTemplate_1.template(dangerID, commitID, mergedResults);
                        return [4 /*yield*/, this.platform.updateOrCreateComment(dangerID, comment)];
                    case 13:
                        issueURL = _a.sent();
                        this.log("Feedback: " + issueURL);
                        _a.label = 14;
                    case 14:
                        urlForInfo = issueURL || this.ciSource.ciRunURL;
                        return [4 /*yield*/, this.platform.updateStatus(!failed, messageForResults(results), urlForInfo, dangerID)];
                    case 15:
                        successPosting = _a.sent();
                        if (!successPosting && this.options.verbose) {
                            this.log("Could not add a commit status, the GitHub token for Danger does not have access rights.");
                            this.log("If the build fails, then danger will use a failing exit code.");
                        }
                        if (!successPosting && failed) {
                            this.d("Failing the build due to handleResultsPostingToPlatform not successfully setting a commit status");
                            process.exitCode = 1;
                        }
                        if (!this.options.verbose) return [3 /*break*/, 17];
                        return [4 /*yield*/, this.handleResultsPostingToSTDOUT(results)];
                    case 16:
                        _a.sent();
                        _a.label = 17;
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Send inline comments
     * Returns these violations that didn't pass the validation (e.g. incorrect file/line)
     *
     * @param results Results with inline violations
     */
    Executor.prototype.sendInlineComments = function (results, git, previousComments) {
        var _this = this;
        if (!this.platform.supportsInlineComments) {
            return new Promise(function (resolve) { return resolve(results); });
        }
        var inlineResults = DangerResults_1.resultsIntoInlineResults(results);
        var sortedInlineResults = DangerResults_1.sortInlineResults(inlineResults);
        var emptyResult = {
            messages: DangerResults_1.emptyDangerResults.messages,
            markdowns: DangerResults_1.emptyDangerResults.markdowns,
            fails: DangerResults_1.emptyDangerResults.fails,
            warnings: DangerResults_1.emptyDangerResults.warnings,
            meta: results.meta,
        };
        // For every inline result check if there is a comment already
        // if there is - update it and remove comment from deleteComments array (comments prepared for deletion)
        // if there isn't - create a new comment
        // Leftovers in deleteComments array should all be deleted afterwards
        var deleteComments = Array.isArray(previousComments) ? previousComments.filter(function (c) { return c.ownedByDanger; }) : [];
        var commentPromises = [];
        var _loop_1 = function (inlineResult) {
            var index = deleteComments.findIndex(function (p) {
                return p.body.includes(githubIssueTemplate_1.fileLineToString(inlineResult.file, inlineResult.line));
            });
            var promise = void 0;
            if (index != -1) {
                var previousComment = deleteComments[index];
                deleteComments.splice(index, 1);
                promise = this_1.updateInlineComment(inlineResult, previousComment);
            }
            else {
                promise = this_1.sendInlineComment(git, inlineResult);
            }
            commentPromises.push(promise.then(function (_r) { return DangerResults_1.emptyDangerResults; }).catch(function (_e) { return DangerResults_1.inlineResultsIntoResults(inlineResult); }));
        };
        var this_1 = this;
        for (var _i = 0, sortedInlineResults_1 = sortedInlineResults; _i < sortedInlineResults_1.length; _i++) {
            var inlineResult = sortedInlineResults_1[_i];
            _loop_1(inlineResult);
        }
        deleteComments.forEach(function (comment) {
            var promise = _this.deleteInlineComment(comment);
            commentPromises.push(promise.then(function (_r) { return DangerResults_1.emptyDangerResults; }).catch(function (_e) { return DangerResults_1.emptyDangerResults; }));
        });
        return Promise.all(commentPromises).then(function (dangerResults) {
            return new Promise(function (resolve) {
                resolve(dangerResults.reduce(function (acc, r) { return DangerResults_1.mergeResults(acc, r); }, emptyResult));
            });
        });
    };
    Executor.prototype.sendInlineComment = function (git, inlineResults) {
        return __awaiter(this, void 0, void 0, function () {
            var comment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        comment = this.inlineCommentTemplate(inlineResults);
                        return [4 /*yield*/, this.platform.createInlineComment(git, comment, inlineResults.file, inlineResults.line)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Executor.prototype.updateInlineComment = function (inlineResults, previousComment) {
        return __awaiter(this, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = this.inlineCommentTemplate(inlineResults);
                        // If generated body is exactly the same as current comment we don't send an API request
                        if (body == previousComment.body) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.platform.updateInlineComment(body, previousComment.id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Executor.prototype.deleteInlineComment = function (comment) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.platform.deleteInlineComment(comment.id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Executor.prototype.inlineCommentTemplate = function (inlineResults) {
        var results = DangerResults_1.inlineResultsIntoResults(inlineResults);
        var comment = process.env["DANGER_BITBUCKETSERVER_HOST"]
            ? bitbucketServerTemplate_1.inlineTemplate(this.options.dangerID, results, inlineResults.file, inlineResults.line)
            : githubIssueTemplate_1.inlineTemplate(this.options.dangerID, results, inlineResults.file, inlineResults.line);
        return comment;
    };
    /**
     * Takes an error (maybe a bad eval) and provides a DangerResults compatible object
     * @param error Any JS error
     */
    Executor.prototype.resultsForError = function (error) {
        // Need a failing error, otherwise it won't fail CI.
        this.logErr(chalk_1.default.red("Danger has failed to run"));
        this.logErr(error);
        return {
            fails: [{ message: "Running your Dangerfile has Failed" }],
            warnings: [],
            messages: [],
            markdowns: [{ message: exceptionRaisedTemplate_1.default(error) }],
        };
    };
    return Executor;
}());
exports.Executor = Executor;
var compliment = function () {
    var compliments = ["Well done.", "Congrats.", "Woo!", "Yay.", "Jolly good show.", "Good on 'ya.", "Nice work."];
    return compliments[Math.floor(Math.random() * compliments.length)];
};
var messageForResults = function (results) {
    if (!results.fails.length && !results.warnings.length) {
        return "All green. " + compliment();
    }
    else {
        return process.env["DANGER_BITBUCKETSERVER_HOST"]
            ? bitbucketServerTemplate_1.messageForResultWithIssues
            : githubIssueTemplate_1.messageForResultWithIssues;
    }
};
//# sourceMappingURL=Executor.js.map