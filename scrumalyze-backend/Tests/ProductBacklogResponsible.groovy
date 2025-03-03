#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks whether the Product Backlog has a responsible person assigned, 
 * and that person is a Product Owner.
 *
 * Fails if:
 *   1) The team has no ProductBacklog,
 *   2) The ProductBacklog is missing a responsible person, or
 *   3) The responsible person is not a Product Owner
 *
 * Usage: groovy ProductBacklogResponsible.groovy <path_to_json_file>
 *
 * @param teamData A Map with 'team' -> 'ProductBacklog' -> 'ResponsiblePerson' 
 *        (who should be 'Product Owner').
 * @return A map representing the evaluation result with standard fields.
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Product Backlog Responsible Check"
    def severityFail = "Critical"
    def definition = """
        This check ensures that every team's Product Backlog has a clearly assigned 
        responsible person, and that this individual is a Product Owner.
    """.stripIndent().trim()

    def possibleRootCauses = [
        "The Product Backlog has not been created or linked properly in the system.",
        "Whole team is responsible for the Product Backlog instead of 'Product Owner'.",
        "The assigned role is mislabeled or does not follow the standard 'Product Owner' role naming.",
        "Team might not be aware of the need to explicitly mark a Product Owner as responsible."
    ]

    // We'll collect issues in 'symptoms' to provide detailed info on failures.
    def symptoms = []

    // ----------------------------------------------------------------------------
    // 2. Evaluate the Product Backlog
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting Product Backlog responsible check for team '${teamName}'"

    def productBacklog = teamData.team?.ProductBacklog
    if (!productBacklog) {
        // Symptom if there's no Product Backlog at all
        symptoms << "No ProductBacklog found for this team."
    } else {
        // Check responsible person
        def responsiblePerson = productBacklog.ResponsiblePerson
        if (!responsiblePerson) {
            // Symptom if there's no responsible person
            symptoms << "ProductBacklog does not have a responsible person assigned."
        } else {
            // Ensure that responsible person is a 'Product Owner'
            def isProductOwner = (responsiblePerson?.Role?.RoleName == "Product Owner")
            if (!isProductOwner) {
                symptoms << "Responsible person '${responsiblePerson.FirstName ?: 'Unknown'}' is not a Product Owner."
            }
        }
    }

    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = symptoms.isEmpty()
    def severity = passed ? "None" : severityFail
    def outcomeDescription = passed
        ? "ProductBacklog has a Product Owner as responsible."
        : "One or more issues found with ProductBacklog's responsible person."

    // ----------------------------------------------------------------------------
    // 4. Return the evaluation result
    // ----------------------------------------------------------------------------
    return [
        name               : name,
        definition         : definition,
        severity           : severity,
        passed             : passed,
        outcomeDescription : outcomeDescription,
        symptoms           : symptoms,
        possibleRootCauses : possibleRootCauses
    ]
}

// -----------------------------------------------------------------------------
// Main script logic
// -----------------------------------------------------------------------------
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
