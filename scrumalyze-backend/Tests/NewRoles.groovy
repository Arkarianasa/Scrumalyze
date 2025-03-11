#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks if there are any persons that are part of the Scrum team (IsScrumTeamMember == true)
 * and have a custom role (anything other than "Scrum Master", "Product Owner", or "Developer").
 *
 * Usage: groovy NewRoles.groovy <path_to_json_file>
 *
 * @param teamData A Map containing, among other things, a "team" object 
 *        (with "Persons") and a list of work items ("WorkItems").
 * @return A map representing the evaluation result with standard fields.
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Custom Role Check"
    def severityFail = "Major"
    def definition = """
        This check ensures that Scrum team members only hold standard roles: 
        'Scrum Master', 'Product Owner', or 'Developer'.
    """.stripIndent().trim()

    def possibleRootCauses = [
        "Team is using standard Scrum roles but they are named differently.",
        "Some individuals have specialized titles or responsibilities that deviate from Scrum roles.",
    ]

    def possibleRootCauses = [
        "Scrum roles are used correctly but named differently due to organizational conventions.",
        "Some team members have specialized responsibilities (e.g., 'Tech Lead', 'QA Specialist') that do not align with Scrum roles.",
        "Scrum Team lacks clarity on team roles definitions, leading to role variations.",
        "The organization is using a hybrid non SCRUM only framework that incorporates non-Scrum roles into the team.",
        "Team members are assigned multiple conflicting roles, making it unclear how they contribute to the Scrum Team."
    ]

    def consequences = []
    consequences << "Deviation from Scrum framework – unclear roles may reduce team efficiency and agility."
    consequences << "Role confusion – non-standard roles create ambiguity in responsibilities and decision-making."
    consequences << "Reduced transparency – stakeholders and management may not understand who is accountable for what."
    consequences << "Weakened self-organization – non-standard roles may introduce hierarchy or micromanagement."
    consequences << "Disrupted team dynamics – additional roles may interfere with the collaborative nature of Scrum."
    consequences << "Sprint inefficiencies – misaligned roles can lead to gaps or overlaps in responsibility."
    consequences << "Failure in Scrum events – unclear roles may lead to ineffective Sprint Planning, Reviews, and Retrospectives."
    consequences << "Loss of adaptability – additional roles may slow down decision-making and reduce agility."

    // We'll collect any team members who have a non-standard role
    def symptoms = []

    // ----------------------------------------------------------------------------
    // 2. Retrieve Persons and evaluate
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting custom role check for team '${teamName}'"

    def persons = teamData.team?.Persons ?: []

    // Define the standard Scrum roles
    def standardRoles = ["Scrum Master", "Product Owner", "Developer"]

    // Identify members who have a custom (non-standard) role
    persons.each { person ->
        if (person.IsScrumTeamMember &&
            person?.Role?.RoleName &&
            !(person.Role.RoleName in standardRoles)) {
            symptoms << "Team member '${person.FirstName} ${person.LastName}' has a custom role: '${person.Role.RoleName}'"
        }
    }

    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = symptoms.isEmpty()
    def severity = passed ? "None" : severityFail
    def outcomeDescription = passed
        ? "All Scrum team members have standard roles."
        : "One or more Scrum team members have custom (non-standard) roles."

    System.err.println "Found ${symptoms.size()} person(s) with custom roles."

    // ----------------------------------------------------------------------------
    // 4. Return the evaluation result
    // ----------------------------------------------------------------------------
    return [
        name                : name,
        definition          : definition,
        severity            : severity,
        passed              : passed,
        outcomeDescription  : outcomeDescription,
        symptoms            : symptoms,
        possibleRootCauses  : possibleRootCauses,
        possibleConsequences: consequences
    ]
}

// -----------------------------------------------------------------------------
// Main script logic
// -----------------------------------------------------------------------------
System.err.println "Script started..."

if (args.length < 1) {
    System.err.println "Usage: groovy NewRoles.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

// Call the evaluation function
def result = evaluate(teamData)
System.err.println "Evaluation complete."

println JsonOutput.toJson(result)
