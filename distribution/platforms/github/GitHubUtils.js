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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var DangerUtils_1 = require("../../runner/DangerUtils");
var debug_1 = require("../../debug");
var memfs_or_file_map_to_github_branch_1 = require("memfs-or-file-map-to-github-branch");
var d = debug_1.debug("GitHub::Utils");
// We need to curry in access to the GitHub PR metadata
var utils = function (pr, api) {
    /**
     * Converts a set of filepaths into a sentence'd set of hrefs for the
     * current PR. Can be configured to just show the name (instead of full filepath), to
     * change the github repo or branch.
     *
     */
    var fileLinks = function (paths, useBasename, repoSlug, branch) {
        // To support enterprise github, we need to handle custom github domains
        // this can be pulled out of the repo url metadata
        if (useBasename === void 0) { useBasename = true; }
        var githubRoot = pr && pr.head.repo.html_url.split(pr.head.repo.owner.login)[0];
        var slug = repoSlug || (pr && pr.head.repo.full_name);
        var ref = branch || (pr && pr.head.ref);
        var toHref = function (path) { return "" + githubRoot + slug + "/blob/" + ref + "/" + path; };
        // As we should only be getting paths we can ignore the nullability
        var hrefs = paths.map(function (p) { return DangerUtils_1.href(toHref(p), useBasename ? path_1.basename(p) : p); });
        return DangerUtils_1.sentence(hrefs);
    };
    return {
        fileLinks: fileLinks,
        fileContents: exports.fileContentsGenerator(api, pr && pr.head.repo.full_name, pr && pr.head.ref),
        createUpdatedIssueWithID: exports.createUpdatedIssueWithIDGenerator(api),
        createOrAddLabel: exports.createOrAddLabel(pr, api),
        createOrUpdatePR: exports.createOrUpdatePR(pr, api),
    };
};
/** Generates the fileContents function, needed so that Peril can re-create this func for an event */
exports.fileContentsGenerator = function (api, defaultRepoSlug, defaultRef) { return function (path, repoSlug, ref) { return __awaiter(_this, void 0, void 0, function () {
    var opts, response, buffer, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                // Use the current state of PR if no repo/ref is passed
                if (!repoSlug) {
                    repoSlug = defaultRepoSlug;
                }
                if (!ref) {
                    ref = defaultRef;
                }
                if (!repoSlug) {
                    throw new Error("You used fileContentsGenerator in a non-PR without specifying the repoSlug");
                }
                opts = {
                    ref: ref,
                    path: path,
                    repo: repoSlug.split("/")[1],
                    owner: repoSlug.split("/")[0],
                };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, api.repos.getContents(opts)];
            case 2:
                response = _b.sent();
                if (response && response.data && response.data.type === "file") {
                    buffer = new Buffer(response.data.content, response.data.encoding);
                    return [2 /*return*/, buffer.toString()];
                }
                else {
                    return [2 /*return*/, ""];
                }
                return [3 /*break*/, 4];
            case 3:
                _a = _b.sent();
                return [2 /*return*/, ""];
            case 4: return [2 /*return*/];
        }
    });
}); }; };
/** Generates the createUpdatedIssueWithID function, needed so that Peril can re-create this func for an event */
exports.createUpdatedIssueWithIDGenerator = function (api) { return function (id, content, settings) { return __awaiter(_this, void 0, void 0, function () {
    var uniqueHeader, q, searchResults, body, repo, owner, title, state, issueToUpdate, issue, issue;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                uniqueHeader = "Danger-Issue-ID-" + id.replace(/ /g, "_");
                q = "user:" + settings.owner + " repo:" + settings.repo + " " + uniqueHeader;
                return [4 /*yield*/, api.search.issues({ q: q })];
            case 1:
                searchResults = (_a.sent()).data;
                d("Got " + searchResults.total_count + " for " + uniqueHeader);
                body = content + "\n\n" + uniqueHeader;
                repo = settings.repo, owner = settings.owner, title = settings.title;
                state = settings.open ? "open" : "closed";
                if (!(searchResults.total_count > 0 && searchResults.items[0])) return [3 /*break*/, 3];
                issueToUpdate = searchResults.items[0];
                d("Found: " + issueToUpdate);
                return [4 /*yield*/, api.issues.update({ body: body, owner: owner, repo: repo, title: title, number: issueToUpdate.number, state: state })];
            case 2:
                issue = (_a.sent()).data;
                return [2 /*return*/, issue.html_url];
            case 3: return [4 /*yield*/, api.issues.create({ body: body, owner: owner, repo: repo, title: title })];
            case 4:
                issue = (_a.sent()).data;
                return [2 /*return*/, issue.html_url];
        }
    });
}); }; };
exports.createOrUpdatePR = function (pr, api) { return function (config, fileMap) { return __awaiter(_this, void 0, void 0, function () {
    var repo, owner, branchSettings, prs, existingPR;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                repo = config.repo || (pr && pr.base.repo.name);
                if (!repo) {
                    throw new Error("You need to set a `repo` in the config for `createOrUpdatePR`");
                }
                owner = config.owner || (pr && pr.base.user.login);
                if (!owner) {
                    throw new Error("You need to set a `owner` in the config for `createOrUpdatePR`");
                }
                branchSettings = {
                    fullBaseBranch: "heads/" + config.baseBranch,
                    fullBranchReference: "heads/" + config.newBranchName,
                    message: config.commitMessage,
                    owner: owner,
                    repo: repo,
                };
                d("Creating a branch");
                return [4 /*yield*/, memfs_or_file_map_to_github_branch_1.filepathContentsMapToUpdateGitHubBranch(api, fileMap, branchSettings)];
            case 1:
                _a.sent();
                d("Getting open PRs");
                return [4 /*yield*/, api.pulls.list({ repo: repo, owner: owner, state: "open" })];
            case 2:
                prs = _a.sent();
                existingPR = prs.data.find(function (pr) { return pr.base.ref === config.newBranchName; });
                if (!existingPR) return [3 /*break*/, 4];
                d("Updating existing PR");
                return [4 /*yield*/, api.pulls.update({
                        number: existingPR.number,
                        base: config.baseBranch,
                        owner: owner,
                        repo: repo,
                        title: config.title,
                        body: config.body,
                    })];
            case 3: return [2 /*return*/, _a.sent()];
            case 4:
                d("Creating a new PR");
                return [4 /*yield*/, api.pulls.create({
                        base: config.baseBranch,
                        head: config.newBranchName,
                        owner: owner,
                        repo: repo,
                        title: config.title,
                    })];
            case 5: return [2 /*return*/, _a.sent()];
        }
    });
}); }; };
exports.createOrAddLabel = function (pr, api) { return function (labelConfig, repoConfig) { return __awaiter(_this, void 0, void 0, function () {
    var config, label, existingLabels, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Create or re-use an existing label
                if (!repoConfig && !pr) {
                    throw new Error("To use createOrAddLabel without a PR you need to add a repoConfig arg");
                }
                config = repoConfig || (pr && { owner: pr.base.repo.owner.login, repo: pr.base.repo.name, id: pr.number });
                d("Checking for existing labels");
                label = null;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, api.issues.listLabelsForRepo({ owner: config.owner, repo: config.repo })];
            case 2:
                existingLabels = _a.sent();
                label = existingLabels.data.find(function (l) { return l.name == labelConfig.name; });
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                d("api.issues.getLabels gave an error", e_1);
                return [3 /*break*/, 4];
            case 4:
                if (!!label) return [3 /*break*/, 6];
                d("no label found, creating a new one for this repo");
                return [4 /*yield*/, api.issues.createLabel({
                        owner: config.owner,
                        repo: config.repo,
                        name: labelConfig.name,
                        color: labelConfig.color,
                        description: labelConfig.description,
                    })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                d("adding a label to this pr");
                // Then add the label
                return [4 /*yield*/, api.issues.addLabels({
                        owner: config.owner,
                        repo: config.repo,
                        number: config.id,
                        labels: [labelConfig.name],
                    })];
            case 7:
                // Then add the label
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }; };
exports.default = utils;
//# sourceMappingURL=GitHubUtils.js.map