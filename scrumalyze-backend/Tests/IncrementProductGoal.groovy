#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks that every Increment has a ProductGoalID assigned.
 * Fails with severity "Critical" if any Increment has a null ProductGoalID.
 *
 * Usage: groovy IncrementProductGoal.groovy <path_to_json_file>
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Increment Product Goal Check"
    def descriptionPass = "All increments are aligned with a product goal."
    def descriptionFail = "One or more increments are not alligned with product goal."
    
    // ----------------------------------------------------------------------------
    // 2. Retrieve increments and evaluate
    // ----------------------------------------------------------------------------
    def increments = teamData.team?.Increments ?: []
    def violation = increments.any { inc -> inc.ProductGoalID == null }
    
    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = !violation
    def severity = passed ? "None" : "Critical"
    
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
    System.err.println "Usage: groovy IncrementProductGoal.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

def result = evaluate(teamData)
println JsonOutput.toJson(result)
