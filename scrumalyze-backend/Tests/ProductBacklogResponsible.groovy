#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks whether the Product Backlog has a responsible person assigned, and that person is a Product Owner.
 * Fails if the Product Backlog is missing, if responsible person is missing, or if the assigned person is not a Product Owner.
 *
 * Usage: groovy ProductBacklogResponsible.groovy <path_to_json_file>
 *
 * @param teamData A Map containing, among other things, a "team" object with a "ProductBacklog".
 * @return A map representing the evaluation result.
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Define metadata
    // ----------------------------------------------------------------------------
    def name = "Product Backlog Responsible Check"
    def severity = "Critical"
    def descriptionPass = "ProductBacklog has a Product Owner as responsible."
    def descriptionFailNoBacklog = "No ProductBacklog found for this team."
    def descriptionFailMissingResponsible = "ProductBacklog does not have a responsible person assigned."
    def descriptionFailNotProductOwner = "ProductBacklog responsible person is not a Product Owner."

    // ----------------------------------------------------------------------------
    // 2. Begin the evaluation
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting Product Backlog responsible check for team '${teamName}'"

    // Retrieve the ProductBacklog object (if any)
    def productBacklog = teamData.team?.ProductBacklog
    if (!productBacklog) {
        // If there's no ProductBacklog at all, fail immediately
        return [
            name                : name,
            severity            : severity,
            passed              : false,
            outcomeDescription  : descriptionFailNoBacklog,
        ]
    }

    // Check if a responsible person is assigned
    def responsiblePerson = productBacklog.ResponsiblePerson
    if (!responsiblePerson) {
        // If there's no responsible person, fail
        return [
            name                : name,
            severity            : severity,
            passed              : false,
            outcomeDescription  : descriptionFailMissingResponsible,
        ]
    }

    // Check if the responsible person is a Product Owner
    def isProductOwner = (responsiblePerson?.Role?.RoleName == "Product Owner")
    def passed = isProductOwner
    def outcomeDescription = passed ? descriptionPass : descriptionFailNotProductOwner

    // ----------------------------------------------------------------------------
    // 3. Return the evaluation result as a map
    // ----------------------------------------------------------------------------
        return [
            name                : name,
            severity            : severity,
            passed              : passed,
            outcomeDescription  : outcomeDescription,
        ]
}

// ----------------------------------------------------------------------------
// Main script logic
// ----------------------------------------------------------------------------
System.err.println "Script started..."

if (args.length < 1) {
    System.err.println "Usage: groovy ProductBacklogResponsible.groovy <path_to_json_file>"
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
