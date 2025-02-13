#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks if there are any persons that are part of the Scrum team (IsScrumTeamMember == true)
 * and have a custom role (anything other than "Scrum Master", "Product Owner", or "Developer").
 *
 * Usage: groovy NewRoles.groovy <path_to_json_file>
 *
 * @param teamData A Map containing, among other things, a "team" object and a list of work items ("WorkItems").
 * @return A map representing the evaluation result.
 */

def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Custom Role Check"
    def severity = "Major"
    def descriptionPass = "All Scrum team members have standard roles."
    def descriptionFail = "One or more Scrum team members have custom (non-standard) roles."

    // ----------------------------------------------------------------------------
    // 2. Begin evaluation
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting custom role check for team '${teamName}'"

    def persons = teamData.team?.Persons ?: []

    // Defining the standard Scrum roles
    def standardRoles = ["Scrum Master", "Product Owner", "Developer"]

    // Find any persons who are team members but have a role outside the standard list
    def customRolePersons = persons.findAll { person ->
        person.IsScrumTeamMember &&
        person?.Role?.RoleName &&
        !(person.Role.RoleName in standardRoles)
    }

    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = customRolePersons.isEmpty()
    def outcomeDescription = passed ? descriptionPass : descriptionFail

    System.err.println "Found ${customRolePersons.size()} person(s) with custom roles."

    // ----------------------------------------------------------------------------
    // 4. Return the evaluation result
    // ----------------------------------------------------------------------------
    return [
        name              : name,
        severity          : severity,
        passed            : passed,
        outcomeDescription: outcomeDescription
    ]
}

// ----------------------------------------------------------------------------
// Main script logic
// ----------------------------------------------------------------------------
System.err.println "Script started..."

if (args.length < 1) {
    System.err.println "Usage: groovy NewRoles.groovy <path_to_json_file>"
    System.exit(1)
}

// Read and parse the JSON file
def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

// Call the evaluation function
def result = evaluate(teamData)
System.err.println "Evaluation complete."

// Print the result as JSON
println JsonOutput.toJson(result)
