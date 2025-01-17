import { DangerResults } from "../../dsl/DangerResults"
export declare const dangerIDToString: (id: string) => string
export declare const fileLineToString: (file: string, line: number) => string
export declare const dangerSignature: (results: DangerResults) => string
/**
 * Postfix signature to be attached comment generated / updated by danger.
 */
export declare const dangerSignaturePostfix: (results: DangerResults, commitID: string) => string
/**
 * Comment to add when updating the PR status when issues are found
 */
export declare const messageForResultWithIssues: string
/**
 * A template function for creating a GitHub issue comment from Danger Results
 * @param {string} dangerID A string that represents a unique build
 * @param {string} commitID The hash that represents the latest commit
 * @param {DangerResults} results Data to work with
 * @returns {string} HTML
 */
export declare function template(dangerID: string, commitID: string, results: DangerResults): string
export declare function inlineTemplate(dangerID: string, results: DangerResults, file: string, line: number): string
