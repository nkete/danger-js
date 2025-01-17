import { AppCenter } from "./AppCenter"
import { Bitrise } from "./Bitrise"
import { BuddyBuild } from "./BuddyBuild"
import { Buildkite } from "./Buildkite"
import { Circle } from "./Circle"
import { CodeBuild } from "./CodeBuild"
import { Codefresh } from "./Codefresh"
import { Codeship } from "./Codeship"
import { Concourse } from "./Concourse"
import { DockerCloud } from "./DockerCloud"
import { Drone } from "./Drone"
import { FakeCI } from "./Fake"
import { GitHubActions } from "./GitHubActions"
import { Jenkins } from "./Jenkins"
import { Netlify } from "./Netlify"
import { Nevercode } from "./Nevercode"
import { Screwdriver } from "./Screwdriver"
import { Semaphore } from "./Semaphore"
import { Surf } from "./Surf"
import { TeamCity } from "./TeamCity"
import { Travis } from "./Travis"
import { VSTS } from "./VSTS"
declare const providers: (
  | typeof AppCenter
  | typeof Bitrise
  | typeof BuddyBuild
  | typeof Buildkite
  | typeof Circle
  | typeof CodeBuild
  | typeof Codefresh
  | typeof Codeship
  | typeof Concourse
  | typeof DockerCloud
  | typeof Drone
  | typeof FakeCI
  | typeof GitHubActions
  | typeof Jenkins
  | typeof Netlify
  | typeof Nevercode
  | typeof Screwdriver
  | typeof Semaphore
  | typeof Surf
  | typeof TeamCity
  | typeof Travis
  | typeof VSTS)[]
declare const realProviders: (
  | typeof AppCenter
  | typeof BuddyBuild
  | typeof Buildkite
  | typeof Circle
  | typeof CodeBuild
  | typeof Codefresh
  | typeof Codeship
  | typeof Concourse
  | typeof DockerCloud
  | typeof Drone
  | typeof GitHubActions
  | typeof Jenkins
  | typeof Netlify
  | typeof Nevercode
  | typeof Screwdriver
  | typeof Semaphore
  | typeof Surf
  | typeof TeamCity
  | typeof Travis
  | typeof VSTS)[]
export { providers, realProviders }
