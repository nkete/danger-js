"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ci_source_helpers_1 = require("../ci_source_helpers");
/**
 * ### CI Setup
 *  1. Log in to your Netlify account and add the `DANGER_GITHUB_API_TOKEN`
 *  environment variable to your site's deploy settings.
 *  `https://app.netlify.com/sites/[site-name]/settings/deploys#build-environment-variables`.
 *
 *  2. Prepend `yarn danger ci && ` to your build command in the Netlify web UI
 *  or in your netlify.toml. For example, `yarn danger ci && yarn build`
 */
var Netlify = /** @class */ (function () {
    function Netlify(env) {
        this.env = env;
    }
    Object.defineProperty(Netlify.prototype, "name", {
        get: function () {
            return "Netlify";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Netlify.prototype, "isCI", {
        get: function () {
            return ci_source_helpers_1.ensureEnvKeysExist(this.env, ["NETLIFY_BUILD_BASE"]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Netlify.prototype, "isPR", {
        get: function () {
            var mustHave = ["REVIEW_ID", "REPOSITORY_URL"];
            var mustBeInts = ["REVIEW_ID"];
            return ci_source_helpers_1.ensureEnvKeysExist(this.env, mustHave) && ci_source_helpers_1.ensureEnvKeysAreInt(this.env, mustBeInts);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Netlify.prototype, "pullRequestID", {
        get: function () {
            return this.env.REVIEW_ID;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Netlify.prototype, "repoSlug", {
        get: function () {
            return this.env.REPOSITORY_URL.replace(/^https:\/\/[^/]+\//, "");
        },
        enumerable: true,
        configurable: true
    });
    return Netlify;
}());
exports.Netlify = Netlify;
//# sourceMappingURL=Netlify.js.map