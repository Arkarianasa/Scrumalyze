#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks whether each ProductGoal has a responsible person assigned, and that person is a Product Owner.
 * Fails if any ProductGoal lacks a responsible person or if the assigned person is not a Product Owner.
 *
 * Usage: groovy ProductGoalResponsible.groovy <path_to_json_file>
 *
 * @param teamData A Map containing, among other things, a "team" object that may have "ProductGoals".
 * @return A map representing the evaluation result with the standard fields.
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Product Goal Responsible Check"
    def severityFail = "Critical"
    def definition = """
        This check ensures that each ProductGoal has a responsible person who 
        is specifically a 'Product Owner'.
    """.stripIndent().trim()

    // Test Category ID
    categoryID = 2

    def possibleRootCauses = [
        "The Product Goal has not been created or linked properly in the system.",
        "Whole team is responsible for the Product Goal instead of single 'Product Owner' person.",
        "The assigned role is mislabeled or does not follow the standard 'Product Owner' role naming.",
        "Team might not be aware of the need to explicitly mark a Product Owner as responsible person for Product Goal.", //todo
        "Another role in team is responsible for product goal and not the Product Owner."
    ]

    def consequences = []
    consequences << "Loss of accountability – unclear ownership leads to inconsistent product goal management."
    consequences << "Loss of trust – stakeholders and team members may lose confidence in the product’s direction due to unclear ownership."
    consequences << "Reduced transparency – stakeholders and the team may struggle to understand who is responsible for the Product Goal."
    consequences << "Stakeholder misalignment – unclear ownership may result in conflicting priorities and expectations."
    consequences << "Risk of goal neglect – without a responsible Product Owner, the Product Goal may lose focus and direction."
    consequences << "Scope creep – uncontrolled adjustments to the Product Goal may lead to unstructured product development."
    consequences << "Delays and inefficiencies – time wasted on misaligned work due to unclear Product Goal ownership."
    consequences << "Financial impact – mismanagement of Product Goals may lead to increased costs with reduced value delivery."

    // We'll track any ProductGoal that fails one of the conditions in 'symptoms'
    def symptoms = []

    // ----------------------------------------------------------------------------
    // 2. Retrieve ProductGoals
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting ProductGoal responsible check for team '${teamName}'"

    def productGoals = teamData.team?.ProductGoals ?: []
    System.err.println "Found ${productGoals.size()} ProductGoal(s)."

    // ----------------------------------------------------------------------------
    // 3. Evaluate each ProductGoal
    // ----------------------------------------------------------------------------
    productGoals.each { pg ->
        // Use a name or fallback to "Unnamed"
        def pgName = pg.Description ?: "Unnamed ProductGoal"

        // Condition A: Missing responsible person
        if (!pg.ResponsiblePerson) {
            symptoms << "ProductGoal '${pgName}' has no responsible person assigned."
        }
        // Condition B: If responsible person is present, must be 'Product Owner'
        else {
            def roleName = pg.ResponsiblePerson?.Role?.RoleName ?: ""
            if (roleName != "Product Owner") {
                symptoms << "ProductGoal '${pgName}' is assigned to a role '${roleName}', not 'Product Owner'."
            }
        }
    }

    // ----------------------------------------------------------------------------
    // 4. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = symptoms.isEmpty()
    def severity = passed ? "None" : severityFail
    def outcomeDescription
    if (passed) {
        outcomeDescription = "All ProductGoals have a Product Owner as responsible."
    } else if (symptoms.any { it.contains("no responsible person") }) {
        outcomeDescription = "One or more ProductGoals do not have a responsible person assigned."
    } else {
        outcomeDescription = "One or more ProductGoals have a responsible person who isn't a Product Owner."
    }

    // ----------------------------------------------------------------------------
    // 5. Return the evaluation result
    // ----------------------------------------------------------------------------
    return [
        name                : name,
        definition          : definition,
        categoryID          : categoryID,
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
