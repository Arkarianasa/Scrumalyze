#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Ensures that each Process Step is linked to the one (and only one) expected artifact.
 * Any deviation—either missing the correct linkage or linking to unintended artifacts—is flagged.
 *
 * Usage: groovy ProcessStepArtifactLinkage.groovy <path_to_json_file>
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Process Step Artifact Linkage Check"
    def definition = """
        This check ensures that each process step is linked to exactly the artifact
        that is expected for its type. Any extra or missing linkage is considered a deviation.
    """.stripIndent().trim()

    // Test Category ID
    categoryID = 1

    def possibleRootCauses = [
        "Artifact linkage incorrectly set in the system.",
        "Misunderstanding of Scrum process step purposes.",
        "Legacy processes from traditional project management approaches influenced the process steps and their linkages to artifacts.",
        "Vertical development instead of horizontal - process steps are used instead of individual tasks."
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
                    symptoms << "${stepName} step is missing artifact linkage: '${flagName}'."
                } else {
                    symptoms << "${stepName} step has unexpected artifact linkage set: '${flagName}'."
                }
            }
        }
    }

    def severity = symptoms.isEmpty() ? "None" : "Major"
    def outcomeDescription = symptoms.isEmpty()
        ? "All process steps are linked to their expected artifacts."
        : "One or more process steps have missing or unexpected artifact linkage."

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
    System.err.println "Usage: groovy ProcessStepArtifactLinkage.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

def result = evaluate(teamData)
System.err.println "Evaluation complete."

println JsonOutput.toJson(result)
