#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/**
 * Checks that no Work Item has a deadline.
 * Fails with severity "Minor" if any work item has a set deadline.
 *
 * Usage: groovy WorkItemDeadline.groovy <path_to_json_file>
 *
 * @param teamData A Map that includes:
 *   - WorkItems: A list of work items, each possibly with a 'Deadline'.
 * @return A map representing the evaluation result with the standard fields.
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Work Item Deadline Check"
    def severityFail = "Minor"
    def definition = """
        This check ensures that no work items have an explicit deadline. 
        Deadlines at the individual work item level can lead to rigid time 
        constraints and reduce flexibility and should not be used in SCRUM.
    """.stripIndent().trim()

    // Test Category ID
    categoryID = 4

    def possibleRootCauses = [
        "Spikes were created with fixed deadlines instead of using timebox-based planning.",
        "Team members are using deadlines.",
        "Requirement or contractual obligations led to explicit deadlines on work items.",
        "Deadline for one or more work items has been incorectly recorded in the system."
    ]

    def consequences = []
    consequences << "Loss of agility – fixed deadlines reduce the team's ability to adapt to changing priorities."
    consequences << "Increased stress – team members may feel pressured to meet individual work item deadlines instead of focusing on iterative progress."
    consequences << "Reduced collaboration – deadlines on specific work items may encourage individual-focused work rather than team-based effort."
    consequences << "Misalignment with Scrum principles – work should be planned within Sprints rather than through fixed deadlines."
    consequences << "Risk of cutting corners – rushing to meet arbitrary deadlines may lead to lower-quality deliverables."
    consequences << "Potential for scope creep – individual deadlines may introduce unplanned work outside of Sprint boundaries."
    consequences << "Confusion in Sprint Planning – work items with external deadlines may conflict with Sprint commitments."
    consequences << "Reduced transparency – stakeholders may misunderstand the nature of deadlines, expecting rigid delivery dates instead of iterative progress."
    consequences << "Loss of trust – reliance on deadlines for individual work items may indicate a lack of confidence in Scrum’s iterative planning process."


    // We'll collect any work items that have a deadline
    def symptoms = []

    // ----------------------------------------------------------------------------
    // 2. Evaluate all Work Items
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting deadline check for team '${teamName}'"

    def workItems = teamData.WorkItems ?: []
    workItems.each { wi ->
        if (wi.Deadline && wi.Deadline.toString().trim() != "") {
            // Record that this item has a deadline
            def itemDesc = wi.Description ?: "No Description"
            symptoms << "WorkItem '${itemDesc}' has a deadline set: ${wi.Deadline}"
        }
    }

    // ----------------------------------------------------------------------------
    // 3. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed = symptoms.isEmpty()
    def severity = passed ? "None" : severityFail
    def outcomeDescription = passed
        ? "No work items have a set deadline."
        : "One or more work items have a deadline set."

    // ----------------------------------------------------------------------------
    // 4. Return the evaluation result
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
    System.err.println "Usage: groovy WorkItemDeadline.groovy <path_to_json_file>"
    System.exit(1)
}

def jsonFilePath = args[0]
def fileContent = new File(jsonFilePath).text
def teamData = new JsonSlurper().parseText(fileContent)

// Execute the evaluation
def result = evaluate(teamData)
System.err.println "Evaluation complete."

println JsonOutput.toJson(result)
