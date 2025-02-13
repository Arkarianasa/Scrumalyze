#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks that no Increment has a deadline set.
 * Fails with severity "Minor" if any Increment has a non-null Deadline.
 *
 * Usage: groovy IncrementDeadline.groovy <path_to_json_file>
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Increment Deadline Check"
    def descriptionPass = "No increments have a deadline set."
    def descriptionFail = "One or more increments have a deadline set."
    
    // ----------------------------------------------------------------------------
    // 2. Retrieve increments and evaluate
    // ----------------------------------------------------------------------------
    def increments = teamData.team?.Increments ?: []
    def violation = increments.any { inc -> inc.Deadline != null }
    
    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = !violation
    def severity = passed ? "None" : "Minor"
    
    // ----------------------------------------------------------------------------
    // 4. Return the evaluation result
    // ----------------------------------------------------------------------------
    return [
        name               : name,
        severity           : severity,
        passed             : passed,
        outcomeDescription : passed ? descriptionPass : descriptionFail,
    ]
}

// ----------------------------------------------------------------------------
// Main script logic
// ----------------------------------------------------------------------------
if (args.length < 1) {
    System.err.println "Usage: groovy IncrementDeadline.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

def result = evaluate(teamData)
println JsonOutput.toJson(result)
