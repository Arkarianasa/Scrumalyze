#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Ensures that none of the SprintGoals have a single "responsible person" assigned.
 * The idea is that the entire team is collectively responsible for the Sprint Goal,
 * so having an explicitly assigned ResponsiblePerson would fail this check.
 *
 * Usage: groovy SprintGoalResponsible.groovy <path_to_json_file>
 *
 * @param teamData A Map containing, among other things, a "team" object that may have "Sprints".
 *                 Each Sprint may or may not have a "SprintGoal" object with a "ResponsiblePerson".
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
    def name = "Sprint Goal Responsible Check"
    def severity = "Major"
    def descriptionPass = "No SprintGoal has a single responsible person set (team-level responsibility)."
    def descriptionFail = "One or more SprintGoals have a responsible person assigned."

    // ----------------------------------------------------------------------------
    // 2. Gather sprints
    // ----------------------------------------------------------------------------
    def sprints = teamData.team?.Sprints ?: []

    // ----------------------------------------------------------------------------
    // 3. Check each sprint's SprintGoal for a responsible person
    // ----------------------------------------------------------------------------
    // We'll fail if any sprint has a SprintGoal object with a 'ResponsiblePerson' (or 'ResponsiblePersonID').
    def anyGoalHasResponsiblePerson = sprints.any { sprint ->
        def sprintGoal = sprint.SprintGoal
        // If there's a SprintGoal object, check if it has a ResponsiblePerson or ResponsiblePersonID
        if (sprintGoal && (sprintGoal.ResponsiblePerson || sprintGoal.ResponsiblePersonID)) {
            return true
        }
        return false
    }

    def passed = !anyGoalHasResponsiblePerson
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
    System.err.println "Usage: groovy SprintGoalResponsible.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

def result = evaluate(teamData)
println JsonOutput.toJson(result)
