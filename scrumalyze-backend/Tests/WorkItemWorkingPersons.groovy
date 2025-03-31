#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Ensures that only Developers are assigned as working persons on work items.
 * Any work item assigned to a non-developer results in a failure:
 * - Minor severity if it's someone other than a Developer.
 * - Critical severity if it's a Scrum Master or Product Owner.
 *
 * Usage: groovy WorkItemWorkingPersons.groovy <path_to_json_file>
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Work Item Working Person Role Check"
    def definition = """
        This check ensures that only Developers are assigned as working persons
        on Work Items. Assigning Product Owners or Scrum Masters to perform tasks
        may violate role boundaries in Scrum.
    """.stripIndent().trim()

    // Test Category ID
    categoryID = 2

    def possibleRootCauses = [
        "Misunderstanding of role responsibilities in Scrum.",
        "Scrum Master or Product Owner stepping in due to lack of Developer capacity.",
        "Improper data entry in the system."
    ]

    def possibleConsequences = [
        "Blurring of Scrum roles and responsibilities.",
        "Loss of team autonomy – Product Owner or Scrum Master micromanaging tasks.",
        "Reduced focus of Scrum Master/Product Owner on their actual responsibilities.",
        "Violation of Scrum principles leading to poor accountability."
    ]

    def workItems = teamData.WorkItems ?: []
    def symptoms = []
    def hasCritical = false
    def hasMinor = false

    workItems.each { wi ->
        def itemDesc = wi.Description ?: "Unnamed WorkItem"
        (wi.Persons ?: []).each { wp ->
            def person = wp.Person
            def roleName = person?.Role?.RoleName ?: "Unknown"

            if (roleName != "Developer") {
                if (roleName in ["Product Owner", "Scrum Master"]) {
                    hasCritical = true
                    symptoms << "WorkItem '${itemDesc}' is assigned to a ${roleName}, which is not allowed."
                } else {
                    hasMinor = true
                    symptoms << "WorkItem '${itemDesc}' is assigned to a non-developer role '${roleName}'."
                }
            }
        }
    }

    def severity = "None"
    if (hasCritical) {
        severity = "Critical"
    } else if (hasMinor) {
        severity = "Minor"
    }

    def outcomeDescription = "All working persons are developers."
    if (hasCritical) {
        outcomeDescription = "One or more work items are assigned to Product Owner or Scrum Master."
    } else if (hasMinor) {
        outcomeDescription = "One or more work items are assigned to non-developer roles."
    }

    def passed = (severity == "None")

    return [
        name                 : name,
        definition           : definition,
        categoryID           : categoryID,
        severity             : severity,
        passed               : passed,
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
    System.err.println "Usage: groovy WorkItemWorkingPersons.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

def result = evaluate(teamData)
System.err.println "Evaluation complete."

println JsonOutput.toJson(result)
