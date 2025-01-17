import { Env, CISource } from "../ci_source"
/**
 * ### CI Setup
 *
 * To make Danger run, add following lines to the `appcenter-pre-build.sh` file:
 *
 * ```
 * - cd $APPCENTER_SOURCE_DIRECTORY
 * - npm install -g danger
 * - swift build
 * - swift run danger-swift ci
 * ```
 *
 *
 *
 * ### Token Setup
 *
 * Add the `DANGER_GITHUB_API_TOKEN` to your environment variables.
 *
 */
export declare class AppCenter implements CISource {
  private readonly env
  private default
  constructor(env: Env)
  setup(): Promise<any>
  readonly name: string
  readonly isCI: boolean
  readonly isPR: boolean
  readonly pullRequestID: string
  readonly repoSlug: string
  private readonly branchName
}
