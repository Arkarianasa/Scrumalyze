#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Ensures that each Process Step fulfills only the behaviors expected from its type.
 * Any deviation—either missing an expected behavior or performing an unintended one—is flagged.
 *
 * Usage: groovy ProcessStepBehavior.groovy <path_to_json_file>
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Process Step Behavioral Expectation Check"
    def definition = """
        This check ensures that each process step fulfills only and exactly the behaviors
        expected for its type. Any extra or missing behavior is considered a deviation.
    """.stripIndent().trim()

    // Test Category ID
    categoryID = 1

    def possibleRootCauses = [
        "Bbehavioral flags for process steps are incorrectly set in the system.",
        "Misunderstanding of Scrum process step purposes."
    ]

    def possibleConsequences = [
        "Process steps not delivering expected outcomes.",
        "Scrum events being performed incorrectly or ineffectively.",
        "Misalignment with Scrum principles.",
        "Inaccurate reporting or evaluation of team practices.",
        "Confusion or mixed expectations from team members or stakeholders."
    ]

    def symptoms = []
    def processSteps = teamData.team?.ProcessSteps ?: []

    processSteps.each { step ->
        def stepName = step.ProcessStepType?.ProcessStepName ?: "Unnamed Process Step (${step.ProcessStepID})"

        def expectations = [
            "Daily SCRUM"           : [ReviewsIncrement: true],
            "Backlog Refinement"    : [UpdatesProductBacklog: true],
            "Sprint Review"         : [AdjustsProductGoal: true],
            "Sprint Planning"       : [CreatesSprintGoal: true],
            "Sprint Retrospective"  : [ImprovesSprint: true]
        ]

        def allFlags = [
            ReviewsIncrement    : step.ReviewsIncrement,
            UpdatesProductBacklog : step.UpdatesProductBacklog,
            AdjustsProductGoal  : step.AdjustsProductGoal,
            CreatesSprintGoal   : step.CreatesSprintGoal,
            ImprovesSprint      : step.ImprovesSprint
        ]

        def expectedFlags = expectations.get(stepName) ?: [:]

        allFlags.each { flagName, actualValue ->
            def expectedValue = expectedFlags.get(flagName, false)

            if (actualValue != expectedValue) {
                if (expectedValue) {
                    symptoms << "${stepName} step is missing expected behavior: '${flagName}'."
                } else {
                    symptoms << "${stepName} step has unexpected behavior set: '${flagName}'."
                }
            }
        }
    }

    def severity = symptoms.isEmpty() ? "None" : "Major"
    def outcomeDescription = symptoms.isEmpty()
        ? "All process steps fulfill only their expected behaviors."
        : "One or more process steps have missing or unexpected behaviors."

    return [
        name                 : name,
        definition           : definition,
        categoryID           : categoryID,
        severity             : severity,
        passed               : severity == "None",
        outcomeDescription   : outcomeDescription,
        symptoms             : symptoms,
        possibleRootCauses   : possibleRootCauses,
        possibleConsequences : possibleConsequences
    ]
}

// -----------------------------------------------------------------------------
// Main script logic
// -----------------------------------------------------------------------------
System.err.println "Script started..."

if (args.length < 1) {
    System.err.println "Usage: groovy ProcessStepBehavior.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

def result = evaluate(teamData)
System.err.println "Evaluation complete."

println JsonOutput.toJson(result)
