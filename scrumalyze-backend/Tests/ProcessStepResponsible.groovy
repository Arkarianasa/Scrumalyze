#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Ensures that each Process Step is guided by the correct responsible person.
 * Responsibility expectations:
 * - Daily SCRUM -> Whole Team (null GuidedByPersonID)
 * - Backlog Refinement -> Whole Team (null GuidedByPersonID)
 * - Sprint Review -> SCRUM Master
 * - Sprint Planning -> SCRUM Master
 * - Sprint Retrospective -> SCRUM Master
 *
 * Usage: groovy ProcessStepResponsible.groovy <path_to_json_file>
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Process Step Responsible Person Check"
    def definition = """
        This check ensures that each process step is guided by the expected person or role.
        Daily SCRUM and Backlog Refinement should be guided by the whole team (no specific person).
        Other meetings should be guided by a Scrum Master.
    """.stripIndent().trim()

    // Test Category ID
    categoryID = 2

    def possibleRootCauses = [
        "Meeting facilitation is incorrectly set in the system.",
        "Misunderstanding of who should guide specific Scrum events.",
        "Misconfigured roles in the process step definition."
    ]

    def possibleConsequences = [
        "Loss of team autonomy in meetings intended for the whole team.",
        "Scrum Masters not facilitating key Scrum events.",
        "Ineffective or misdirected meeting facilitation.",
        "Deviation from Scrum practices and guidelines."
    ]

    def symptoms = []
    def processSteps = teamData.team?.ProcessSteps ?: []

    processSteps.each { step ->
        def stepName = step.ProcessStepType?.ProcessStepName ?: "Unnamed Process Step (${step.ProcessStepID})"
        def guidedBy = step.GuidedByPerson
        def guidedRole = guidedBy?.Role?.RoleName

        switch (stepName) {
            case "Daily SCRUM":
            case "Backlog Refinement":
                if (guidedBy != null) {
                    symptoms << "${stepName} should be guided by the whole team (no individual), but is assigned to '${guidedBy.FirstName} ${guidedBy.LastName}'."
                }
                break
            case ["Sprint Review", "Sprint Planning", "Sprint Retrospective"]:
                if (guidedBy == null) {
                    symptoms << "${stepName} should be guided by a Scrum Master, but no one is assigned."
                } else if (guidedRole != "Scrum Master") {
                    symptoms << "${stepName} is assigned to '${guidedBy.FirstName} ${guidedBy.LastName}' with role '${guidedRole}', expected Scrum Master."
                }
                break
        }
    }

    def severity = symptoms.isEmpty() ? "None" : "Major"
    def outcomeDescription = symptoms.isEmpty()
        ? "All process steps have correct responsible guidance."
        : "One or more process steps are guided by an unexpected person or role."

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
    System.err.println "Usage: groovy ProcessStepResponsible.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

def result = evaluate(teamData)
System.err.println "Evaluation complete."

println JsonOutput.toJson(result)