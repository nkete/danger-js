import * as child_process from "child_process"
import { Env, CISource } from "../ci_source"
import { ensureEnvKeysExist, getPullRequestIDForBranch } from "../ci_source_helpers"
import { getRepoSlug } from "../../commands/init/get-repo-slug"

/**
 * Nevercode.io CI Integration
 *
 * Environment Variables Documented: https://developer.nevercode.io/v1.0/docs/environment-variables-files
 */
export class Nevercode implements CISource {
  private default = { prID: "0", repoURL: "" }
  constructor(private readonly env: Env) {}

  async setup(): Promise<any> {
    const prID = await getPullRequestIDForBranch(this, this.env, this.branchName)
    this.default.prID = prID.toString()
    const prURL = child_process
      .execSync("git remote get-url origin")
      .toString()
      .trim()
    if (prURL.length > 0) {
      this.default.repoURL = prURL
    }
  }

  get name(): string {
    return "Nevercode"
  }

  get isCI(): boolean {
    return ensureEnvKeysExist(this.env, ["NEVERCODE"])
  }

  get isPR(): boolean {
    const mustHave = ["NEVERCODE_PULL_REQUEST"]
    const mustBeInts = ["NEVERCODE_GIT_PROVIDER_PULL_REQUEST"]
    return ensureEnvKeysExist(this.env, mustHave) && ensureEnvKeysAreInt(this.env, mustBeInts)
  }

  private _parseRepoURL(): string {
    // Nevercode doesn't currently provide NEVERCODE_REPO itself
    // but consumers have the option of setting it themselves.
    let repoURL = this.env.NEVERCODE_REPO || ""
    if (repoURL.length == "") {
      repoURL = this.default.repoURL
    }
    const regexp = new RegExp("([/:])([^/]+/[^/.]+)(?:.git)?$")
    const matches = repoURL.match(regexp)
    return matches ? matches[2] : ""
  }

  get pullRequestID(): string {
    return this.default.prID
  }

  get repoSlug(): string {
    return getRepoSlug()
  }

  get supportedPlatforms(): string[] {
    return ["github"]
  }

  get ciRunURL() {
    return process.env.NEVERCODE_BUILD_URL
  }

  private get branchName(): string {
    if (this.isPR) {
      return this.env.NEVERCODE_PULL_REQUEST_SOURCE
    } else {
      return this.env.NEVERCODE_BRANCH
    }
  }
}
