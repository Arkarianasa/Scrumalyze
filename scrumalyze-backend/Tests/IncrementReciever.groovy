#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks the receiver for each increment.
 *
 * For each increment in team.Increments:
 *   - If ReceivedBy is null, that increment triggers a Critical error.
 *   - Else if ReceivedBy.IsScrumTeamMember is true, that increment triggers a Major error.
 *   - Else if ReceivedBy is present but the Role.RoleName is not "Stakeholder",
 *         that increment triggers a Minor error.
 *
 * The overall result reflects the highest severity found.
 *
 * Usage: groovy IncrementReciever.groovy <path_to_json_file>
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Increment Receiver Check"
    
    // We'll use severity levels: None = 0, Minor = 1, Major = 2, Critical = 3.
    int severityLevel = 0
    def severityMapping = [
        0: [severity: "None", outcomeDescription: "All increments have a valid receiver (stakeholder)."],
        1: [severity: "Minor", outcomeDescription: "One or more increments are received by someone who is not a stakeholder."],
        2: [severity: "Major", outcomeDescription: "One or more increments are received by a scrum team member."],
        3: [severity: "Critical", outcomeDescription: "One or more increments have no receiver set."]
    ]
    
    // ----------------------------------------------------------------------------
    // 2. Retrieve increments from team.Increments
    // ----------------------------------------------------------------------------
    def increments = teamData.team?.Increments ?: []
    if (increments.isEmpty()) {
        return [
            name               : name,
            severity           : "None",
            passed             : true,
            outcomeDescription : "No increments found; skipping check."
        ]
    }
    
    // ----------------------------------------------------------------------------
    // 3. Evaluate each increment
    // ----------------------------------------------------------------------------
    increments.each { inc ->
        if (!inc.ReceivedBy) {
            severityLevel = Math.max(severityLevel, 3)
        } else {
            if (inc.ReceivedBy.IsScrumTeamMember == true) {
                severityLevel = Math.max(severityLevel, 2)
            } else {
                def roleName = inc.ReceivedBy.Role?.RoleName ?: ""
                if (roleName != "Stakeholder") {
                    severityLevel = Math.max(severityLevel, 1)
                }
            }
        }
    }
    
    // ----------------------------------------------------------------------------
    // 4. Determine overall result
    // ----------------------------------------------------------------------------
    def resultMapping = severityMapping[severityLevel]
    def passed = (severityLevel == 0)
    
    return [
        name               : name,
        severity           : resultMapping.severity,
        passed             : passed,
        outcomeDescription : resultMapping.outcomeDescription,
    ]
}

// ----------------------------------------------------------------------------
// Main script logic
// ----------------------------------------------------------------------------
if (args.length < 1) {
    System.err.println "Usage: groovy IncrementReciever.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

def result = evaluate(teamData)
println JsonOutput.toJson(result)
