#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks whether each ProductGoal has a responsible person assigned, and that person is a Product Owner.
 * Fails if responsible person is missing or if the assigned person is not a Product Owner.
 *
 * Usage: groovy ProductGoalResponsible.groovy <path_to_json_file>
 *
 * @param teamData A Map containing, among other things, a "team" object that has "ProductGoals".
 * @return A map representing the evaluation result.
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Define metadata
    // ----------------------------------------------------------------------------
    def name = "Product Goal Responsible Check"
    def severity = "Critical"
    def descriptionPass = "All ProductGoals have a Product Owner as responsible."
    def descriptionFailMissingResponsible = "One or more ProductGoals do not have a responsible person assigned."
    def descriptionFailNotProductOwner = "One or more ProductGoals have a responsible person who isn't a Product Owner."

    // ----------------------------------------------------------------------------
    // 2. Begin the evaluation
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting ProductGoal responsible check for team '${teamName}'"

    // Retrieve the product goals array (if any)
    def productGoals = teamData.team?.ProductGoals ?: []
    System.err.println "Found ${productGoals.size()} ProductGoal(s)."

    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    // We fail if:
    //   A) Any ProductGoal has no responsible person, OR
    //   B) Responsible person is not a Product Owner.
    // We pass only if all ProductGoals have a responsible person with RoleName == "Product Owner".

    def anyMissingResponsible = productGoals.any { pg -> 
        pg.ResponsiblePerson == null
    }
    def anyNotProductOwner = productGoals.any { pg ->
        // If there's a ResponsiblePerson, check their role name
        pg.ResponsiblePerson != null && pg.ResponsiblePerson?.Role?.RoleName != "Product Owner"
    }

    def passed
    def outcomeDescription

    if (anyMissingResponsible) {
        passed = false
        outcomeDescription = descriptionFailMissingResponsible
    } else if (anyNotProductOwner) {
        passed = false
        outcomeDescription = descriptionFailNotProductOwner
    } else {
        // If neither of the fail conditions applies, we pass
        passed = true
        outcomeDescription = descriptionPass
    }

    // ----------------------------------------------------------------------------
    // 4. Return the evaluation result as a map
    // ----------------------------------------------------------------------------
    return [
        name                              : name,
        severity                          : severity,
        passed                            : passed,
        outcomeDescription                : outcomeDescription
    ]
}

// ----------------------------------------------------------------------------
// Main script logic
// ----------------------------------------------------------------------------
System.err.println "Script started..."

if (args.length < 1) {
    System.err.println "Usage: groovy ProductGoalResponsible.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

// Perform the check
def result = evaluate(teamData)

System.err.println "Evaluation complete."

// Print the result as JSON
println JsonOutput.toJson(result)
