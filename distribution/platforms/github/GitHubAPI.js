"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var rest_1 = __importDefault(require("@octokit/rest"));
var debug_1 = require("../../debug");
var parse_link_header_1 = __importDefault(require("parse-link-header"));
var p_limit_1 = __importDefault(require("p-limit"));
var githubIssueTemplate_1 = require("../../runner/templates/githubIssueTemplate");
var fetch_1 = require("../../api/fetch");
var limit = p_limit_1.default(25);
// Note that there are parts of this class which don't seem to be
// used by Danger, they are exposed for Peril support.
/** This represent the GitHub API */
var GitHubAPI = /** @class */ (function () {
    function GitHubAPI(repoMetadata, token) {
        var _this = this;
        this.repoMetadata = repoMetadata;
        this.token = token;
        this.d = debug_1.debug("GitHubAPI");
        /**
         * Bit weird, yes, but we want something that can be exposed to an end-user.
         * I wouldn't have a problem with moving this to use this API under the hood
         * but for now that's just a refactor someone can try.
         */
        this.getExternalAPI = function (accessTokenForApp) {
            // A token should have been set by this point
            var token = accessTokenForApp || _this.token;
            var host = process.env["DANGER_GITHUB_API_BASE_URL"] || process.env["GITHUB_URL"] || undefined;
            var options = {
                debug: !!process.env.LOG_FETCH_REQUESTS,
                baseUrl: host,
                auth: "token " + token,
            };
            if (_this.additionalHeaders) {
                options.headers = _this.additionalHeaders;
            }
            return new rest_1.default(options);
        };
        /**
         * Grabs the contents of an individual file on GitHub
         *
         * @param {string} path path to the file
         * @param {string} [ref] an optional sha
         * @returns {Promise<string>} text contents
         *
         */
        this.fileContents = function (path, repoSlug, ref) { return __awaiter(_this, void 0, void 0, function () {
            var prJSON, data, buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!repoSlug || !ref)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getPullRequestInfo()];
                    case 1:
                        prJSON = _a.sent();
                        repoSlug = prJSON.head.repo.full_name;
                        ref = prJSON.head.ref;
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.getFileContents(path, repoSlug, ref)];
                    case 3:
                        data = _a.sent();
                        buffer = new Buffer(data.content, "base64");
                        return [2 /*return*/, buffer.toString()];
                }
            });
        }); };
        // The above is the API for Platform
        this.getDangerCommentIDs = function (dangerID) { return __awaiter(_this, void 0, void 0, function () {
            var userID, allComments, dangerIDMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUserID()];
                    case 1:
                        userID = _a.sent();
                        return [4 /*yield*/, this.getPullRequestComments()];
                    case 2:
                        allComments = _a.sent();
                        dangerIDMessage = githubIssueTemplate_1.dangerIDToString(dangerID);
                        this.d("User ID: " + userID);
                        this.d("Looking at " + allComments.length + " comments for " + dangerIDMessage);
                        return [2 /*return*/, allComments
                                .filter(function (comment) { return comment.body.includes(dangerIDMessage); }) // does it contain the right danger ID?
                                .filter(function (comment) { return comment.user.id === userID; }) // Does it have the right user ID?
                                .filter(function (comment) { return comment.body.includes("Generated by"); }) // Does it look like a danger message?
                                .map(function (comment) { return comment.id; })]; // only return IDs
                }
            });
        }); };
        this.updateCommentWithID = function (id, comment) { return __awaiter(_this, void 0, void 0, function () {
            var repo, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        repo = this.repoMetadata.repoSlug;
                        return [4 /*yield*/, this.patch("repos/" + repo + "/issues/comments/" + id, {}, {
                                body: comment,
                            })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.json()];
                }
            });
        }); };
        this.deleteCommentWithID = function (id) { return __awaiter(_this, void 0, void 0, function () {
            var repo, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        repo = this.repoMetadata.repoSlug;
                        return [4 /*yield*/, this.api("repos/" + repo + "/issues/comments/" + id, {}, null, "DELETE")
                            //https://developer.github.com/v3/issues/comments/#response-5
                        ];
                    case 1:
                        res = _a.sent();
                        //https://developer.github.com/v3/issues/comments/#response-5
                        return [2 /*return*/, Promise.resolve(res.status === 204)];
                }
            });
        }); };
        this.deleteInlineCommentWithID = function (id) { return __awaiter(_this, void 0, void 0, function () {
            var repo, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        repo = this.repoMetadata.repoSlug;
                        return [4 /*yield*/, this.api("repos/" + repo + "/pulls/comments/" + id, {}, null, "DELETE", false)
                            //https://developer.github.com/v3/pulls/comments/#response-5
                        ];
                    case 1:
                        res = _a.sent();
                        //https://developer.github.com/v3/pulls/comments/#response-5
                        return [2 /*return*/, Promise.resolve(res.status === 204)];
                }
            });
        }); };
        this.getUserID = function () { return __awaiter(_this, void 0, void 0, function () {
            var perilID, useGitHubActionsID, info;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        perilID = process.env["PERIL_BOT_USER_ID"];
                        if (perilID) {
                            return [2 /*return*/, parseInt(perilID)];
                        }
                        useGitHubActionsID = process.env["GITHUB_WORKFLOW"];
                        if (useGitHubActionsID) {
                            return [2 /*return*/, 41898282];
                        }
                        return [4 /*yield*/, this.getUserInfo()];
                    case 1:
                        info = _a.sent();
                        return [2 /*return*/, info.id];
                }
            });
        }); };
        this.postPRComment = function (comment) { return __awaiter(_this, void 0, void 0, function () {
            var repo, prID, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        repo = this.repoMetadata.repoSlug;
                        prID = this.repoMetadata.pullRequestID;
                        return [4 /*yield*/, this.post("repos/" + repo + "/issues/" + prID + "/comments", {}, {
                                body: comment,
                            })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.json()];
                }
            });
        }); };
        this.postInlinePRComment = function (comment, commitId, path, position) { return __awaiter(_this, void 0, void 0, function () {
            var repo, prID, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        repo = this.repoMetadata.repoSlug;
                        prID = this.repoMetadata.pullRequestID;
                        return [4 /*yield*/, this.post("repos/" + repo + "/pulls/" + prID + "/comments", {}, {
                                body: comment,
                                commit_id: commitId,
                                path: path,
                                position: position,
                            }, false)];
                    case 1:
                        res = _a.sent();
                        if (!res.ok) return [3 /*break*/, 2];
                        return [2 /*return*/, res.json()];
                    case 2: return [4 /*yield*/, res.json()];
                    case 3: throw _a.sent();
                }
            });
        }); };
        this.updateInlinePRComment = function (comment, commentId) { return __awaiter(_this, void 0, void 0, function () {
            var repo, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        repo = this.repoMetadata.repoSlug;
                        return [4 /*yield*/, this.patch("repos/" + repo + "/pulls/comments/" + commentId, {}, {
                                body: comment,
                            }, false)];
                    case 1:
                        res = _a.sent();
                        if (!res.ok) return [3 /*break*/, 2];
                        return [2 /*return*/, res.json()];
                    case 2: return [4 /*yield*/, res.json()];
                    case 3: throw _a.sent();
                }
            });
        }); };
        this.getPullRequestInfo = function () { return __awaiter(_this, void 0, void 0, function () {
            var repo, prID, res, prDSL;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.pr) {
                            return [2 /*return*/, this.pr];
                        }
                        repo = this.repoMetadata.repoSlug;
                        prID = this.repoMetadata.pullRequestID;
                        return [4 /*yield*/, this.get("repos/" + repo + "/pulls/" + prID)];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        prDSL = (_a.sent());
                        this.pr = prDSL;
                        if (res.ok) {
                            return [2 /*return*/, prDSL];
                        }
                        else {
                            throw "Could not get PR Metadata for repos/" + repo + "/pulls/" + prID;
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        this.getPullRequestCommits = function () { return __awaiter(_this, void 0, void 0, function () {
            var repo, prID;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        repo = this.repoMetadata.repoSlug;
                        prID = this.repoMetadata.pullRequestID;
                        return [4 /*yield*/, this.getAllOfResource("repos/" + repo + "/pulls/" + prID + "/commits")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        /**
         * Get list of commits in pull requests. This'll try to iterate all available pages
         * Until it reaches hard limit of api itself (250 commits).
         * https://developer.github.com/v3/pulls/#list-commits-on-a-pull-request
         *
         */
        this.getAllOfResource = function (path) { return __awaiter(_this, void 0, void 0, function () {
            var ret, getNextPageFromLinkHeader, page, requestUrl, response, _a, _b, _c;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        ret = [];
                        getNextPageFromLinkHeader = function (response) {
                            var linkHeader = response.headers.get("link");
                            if (!linkHeader) {
                                _this.d("getNextPageFromLinkHeader:: Given response does not contain link header for pagination");
                                return -1;
                            }
                            var parsedHeader = parse_link_header_1.default(linkHeader);
                            _this.d("getNextPageFromLinkHeader:: Link header found", parsedHeader);
                            if (!!parsedHeader.next && !!parsedHeader.next.page) {
                                return parsedHeader.next.page;
                            }
                            return -1;
                        };
                        page = 0;
                        _d.label = 1;
                    case 1:
                        if (!(page >= 0)) return [3 /*break*/, 6];
                        requestUrl = "" + path + (page > 0 ? "?page=" + page : "");
                        this.d("getPullRequestCommits:: Sending pull request commit request for " + (page === 0 ? "first" : "" + page) + " page");
                        this.d("getPullRequestCommits:: Request url generated \"" + requestUrl + "\"");
                        return [4 /*yield*/, this.get(requestUrl)];
                    case 2:
                        response = _d.sent();
                        if (!response.ok) return [3 /*break*/, 4];
                        _b = (_a = ret.push).apply;
                        _c = [ret];
                        return [4 /*yield*/, response.json()];
                    case 3:
                        _b.apply(_a, _c.concat([(_d.sent())]));
                        page = getNextPageFromLinkHeader(response);
                        return [3 /*break*/, 5];
                    case 4:
                        this.d("getPullRequestCommits:: Failed to get response while traverse page " + page + " with " + response.status + ", bailing rest of pages if exists");
                        page = -1;
                        _d.label = 5;
                    case 5: return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, ret];
                }
            });
        }); };
        this.getUserInfo = function () { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get("user")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.json()];
                }
            });
        }); };
        this.getPullRequestComments = function () { return __awaiter(_this, void 0, void 0, function () {
            var repo, prID;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        repo = this.repoMetadata.repoSlug;
                        prID = this.repoMetadata.pullRequestID;
                        return [4 /*yield*/, this.getAllOfResource("repos/" + repo + "/issues/" + prID + "/comments")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.getPullRequestInlineComments = function (dangerID) { return __awaiter(_this, void 0, void 0, function () {
            var userID, repo, prID;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUserID()];
                    case 1:
                        userID = _a.sent();
                        repo = this.repoMetadata.repoSlug;
                        prID = this.repoMetadata.pullRequestID;
                        return [4 /*yield*/, this.getAllOfResource("repos/" + repo + "/pulls/" + prID + "/comments").then(function (v) {
                                return v
                                    .filter(Boolean)
                                    .map(function (i) {
                                    return __assign({}, i, { ownedByDanger: i.user.id == userID && i.body.includes(dangerID) });
                                })
                                    .filter(function (i) { return i.ownedByDanger; });
                            })];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.getPullRequestDiff = function () { return __awaiter(_this, void 0, void 0, function () {
            var repo, prID, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        repo = this.repoMetadata.repoSlug;
                        prID = this.repoMetadata.pullRequestID;
                        return [4 /*yield*/, this.get("repos/" + repo + "/pulls/" + prID, {
                                Accept: "application/vnd.github.v3.diff",
                            })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.ok ? res.text() : ""];
                }
            });
        }); };
        this.getFileContents = function (path, repoSlug, ref) { return __awaiter(_this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get("repos/" + repoSlug + "/contents/" + path + "?ref=" + ref)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.ok ? res.json() : { content: "" }];
                }
            });
        }); };
        this.getPullRequests = function () { return __awaiter(_this, void 0, void 0, function () {
            var repo, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        repo = this.repoMetadata.repoSlug;
                        return [4 /*yield*/, this.get("repos/" + repo + "/pulls")];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.ok ? res.json() : []];
                }
            });
        }); };
        this.getReviewerRequests = function () { return __awaiter(_this, void 0, void 0, function () {
            var repo, prID, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        repo = this.repoMetadata.repoSlug;
                        prID = this.repoMetadata.pullRequestID;
                        return [4 /*yield*/, this.get("repos/" + repo + "/pulls/" + prID + "/requested_reviewers", {
                                Accept: "application/vnd.github.v3+json",
                            })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.ok ? res.json() : []];
                }
            });
        }); };
        this.getReviews = function () { return __awaiter(_this, void 0, void 0, function () {
            var repo, prID, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        repo = this.repoMetadata.repoSlug;
                        prID = this.repoMetadata.pullRequestID;
                        return [4 /*yield*/, this.get("repos/" + repo + "/pulls/" + prID + "/reviews", {
                                Accept: "application/vnd.github.v3+json",
                            })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.ok ? res.json() : []];
                }
            });
        }); };
        this.getIssue = function () { return __awaiter(_this, void 0, void 0, function () {
            var repo, prID, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        repo = this.repoMetadata.repoSlug;
                        prID = this.repoMetadata.pullRequestID;
                        return [4 /*yield*/, this.get("repos/" + repo + "/issues/" + prID)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.ok ? res.json() : { labels: [] }];
                }
            });
        }); };
        this.updateStatus = function (passed, message, url, dangerID) { return __awaiter(_this, void 0, void 0, function () {
            var repo, prJSON, ref, state, context, res, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        repo = this.repoMetadata.repoSlug;
                        return [4 /*yield*/, this.getPullRequestInfo()];
                    case 1:
                        prJSON = _a.sent();
                        ref = prJSON.head.sha;
                        state = passed ? "success" : "failure";
                        if (passed === "pending") {
                            state = "pending";
                        }
                        context = dangerID || "Danger";
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.post("repos/" + repo + "/statuses/" + ref, {}, {
                                state: state,
                                context: context,
                                target_url: url || "http://danger.systems/js",
                                description: message,
                            }, true)];
                    case 3:
                        res = _a.sent();
                        return [2 /*return*/, res.ok];
                    case 4:
                        error_1 = _a.sent();
                        if (prJSON.base.repo.private) {
                            console.log("Could not post a commit status.");
                        }
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        this.postCheckRun = function (check, token) { return __awaiter(_this, void 0, void 0, function () {
            var repo, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        repo = this.repoMetadata.repoSlug;
                        return [4 /*yield*/, this.post("repos/" + repo + "/check-runs", {
                                Accept: "application/vnd.github.antiope-preview+json,application/vnd.github.machine-man-preview+json",
                                Authorization: "token " + token,
                            }, check)];
                    case 1:
                        res = _a.sent();
                        if (!res.ok) return [3 /*break*/, 2];
                        return [2 /*return*/, res.json()];
                    case 2: return [4 /*yield*/, res.json()];
                    case 3: throw _a.sent();
                }
            });
        }); };
        // API Helpers
        this.api = function (path, headers, body, method, suppressErrors) {
            if (headers === void 0) { headers = {}; }
            if (body === void 0) { body = {}; }
            if (_this.token && !headers["Authorization"]) {
                headers["Authorization"] = "token " + _this.token;
            }
            var containsBase = path.startsWith("http");
            var baseUrl = process.env["DANGER_GITHUB_API_BASE_URL"] || process.env["GITHUB_URL"] || "https://api.github.com";
            var url = containsBase ? path : baseUrl + "/" + path;
            var customAccept = {};
            if (headers.Accept && _this.additionalHeaders.Accept) {
                // We need to merge the accepts which are comma separated according to the HTML spec
                // e.g. https://gist.github.com/LTe/5270348
                // But make sure it doesn't already include it
                if (headers.Accept.includes(_this.additionalHeaders.Accept)) {
                    // If it's already a subset, ignore
                    customAccept = { Accept: headers.Accept };
                }
                else {
                    customAccept = { Accept: _this.additionalHeaders.Accept + ", " + headers.Accept };
                }
            }
            var finalHeaders = __assign({ "Content-Type": "application/json" }, headers, _this.additionalHeaders, customAccept);
            _this.d("Sending: ", url, finalHeaders);
            return limit(function () {
                return _this.fetch(url, {
                    method: method,
                    body: body,
                    headers: finalHeaders,
                }, suppressErrors);
            });
        };
        this.get = function (path, headers) {
            if (headers === void 0) { headers = {}; }
            return _this.api(path, headers, null, "GET");
        };
        this.post = function (path, headers, body, suppressErrors) {
            if (headers === void 0) { headers = {}; }
            if (body === void 0) { body = {}; }
            return _this.api(path, headers, JSON.stringify(body), "POST", suppressErrors);
        };
        this.patch = function (path, headers, body, suppressErrors) {
            if (headers === void 0) { headers = {}; }
            if (body === void 0) { body = {}; }
            return _this.api(path, headers, JSON.stringify(body), "PATCH", suppressErrors);
        };
        // This allows Peril to DI in a new Fetch function
        // which can handle unique API edge-cases around integrations
        this.fetch = fetch_1.api;
        this.additionalHeaders = {};
    }
    return GitHubAPI;
}());
exports.GitHubAPI = GitHubAPI;
//# sourceMappingURL=GitHubAPI.js.map