import { GitHubDSL, GitHubJSONDSL } from "../dsl/GitHubDSL"
import { GitHubAPI } from "./github/GitHubAPI"
import NodeGitHub from "@octokit/rest"
import { Platform } from "./platform"
/** Handles conforming to the Platform Interface for GitHub, API work is handle by GitHubAPI */
export declare type GitHubType = Platform & {
  api: GitHubAPI
}
export declare const GitHub: (api: GitHubAPI) => GitHubType
export declare const githubJSONToGitHubDSL: (gh: GitHubJSONDSL, api: NodeGitHub) => GitHubDSL
