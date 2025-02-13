#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Ensures that none of the Sprint Backlogs have a single "responsible person" assigned.
 * The idea is that the entire team is collectively responsible for the Sprint Backlog,
 * so having an explicitly assigned ResponsiblePerson would fail this check.
 *
 * Usage: groovy SprintBacklogResponsible.groovy <path_to_json_file>
 *
 * @param teamData A Map containing, among other things, a "team" object that may have "Sprints",
 *                 each potentially referencing a SprintBacklog.
 *                 The actual structure of "SprintBacklog" may vary, but the concept is the same:
 *                 if there's a "ResponsiblePerson" or "ResponsiblePersonID" on the SprintBacklog, this fails.
 * @return A map representing the evaluation result with fields:
 *         - name
 *         - severity
 *         - passed
 *         - outcomeDescription
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Define metadata
    // ----------------------------------------------------------------------------
    def name = "Sprint Backlog Responsible Check"
    def severity = "Major"
    def descriptionPass = "No SprintBacklog has a single responsible person set (team-level responsibility)."
    def descriptionFail = "One or more SprintBacklogs have a responsible person assigned."

    // ----------------------------------------------------------------------------
    // 2. Gather sprints
    // ----------------------------------------------------------------------------
    def sprints = teamData.team?.Sprints ?: []

    // ----------------------------------------------------------------------------
    // 3. Check each sprint's SprintBacklog for a responsible person
    // ----------------------------------------------------------------------------
    // This portion depends on how your data references the SprintBacklog.
    // We'll assume there's a top-level "SprintBacklog" object or reference in each sprint.
    // Adjust the property access below if your data model is different.

    def anyBacklogHasResponsiblePerson = sprints.any { sprint ->
        def sprintBacklog = sprint.SprintBacklog
        // If there's a SprintBacklog object, check if it has a ResponsiblePerson or ResponsiblePersonID
        if (sprintBacklog && (sprintBacklog.ResponsiblePerson || sprintBacklog.ResponsiblePersonID)) {
            return true
        }
        return false
    }

    def passed = !anyBacklogHasResponsiblePerson
    def outcomeDescription = passed ? descriptionPass : descriptionFail

    return [
        name               : name,
        severity           : severity,
        passed             : passed,
        outcomeDescription : outcomeDescription
    ]
}

// ----------------------------------------------------------------------------
// Main script logic
// ----------------------------------------------------------------------------
if (args.length < 1) {
    System.err.println "Usage: groovy SprintBacklogResponsible.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

def result = evaluate(teamData)
println JsonOutput.toJson(result)
