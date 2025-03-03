#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

/**
 * Checks whether each Sprint:
 *  1) Has a non-null Timebox (i.e., TimeboxID and a referenced Timebox object).
 *  2) Does not exceed the timebox duration (based on start/end date difference 
 *     multiplied by team.WorkDayHours).
 *
 * Fails with:
 *  - "Major" severity if any sprint is missing a timebox.
 *  - "Minor" severity if no sprint is missing a timebox but at least one sprint exceeds its timebox duration.
 *  - Otherwise, passes with "None".
 *
 * Usage: groovy SprintTimebox.groovy <path_to_json_file>
 *
 * @param teamData A Map containing:
 *   - team -> Sprints (list of sprints, each potentially having TimeboxID, Timebox)
 *   - team -> WorkDayHours (number of hours per day; defaults to 8 if absent)
 * @return A map (as JSON) with standard fields:
 *         - name
 *         - definition
 *         - severity
 *         - passed
 *         - outcomeDescription
 *         - symptoms
 *         - possibleRootCauses
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Metadata
    // ----------------------------------------------------------------------------
    def name = "Sprint Timebox Check"
    def definition = """
        This check ensures that each Sprint references a defined Timebox (i.e., 
        TimeboxID and Timebox object) and that its actual duration (start-to-end 
        dates multiplied by the team's daily working hours) does not exceed the 
        Timebox's allocated duration.
    """.stripIndent().trim()

    // Potential reasons for missing or exceeding timeboxes
    def possibleRootCauses = [
        "Sprints were set up without linking to a timebox.",
        "Team does not use any timebox for their Sprints.",
        "Timebox duration was underestimated or the Sprint ran longer than planned.",
        "Dates for the Sprint (start/end) or the timebox are entered incorrectly."
    ]

    // We'll gather info about which sprints fail each condition
    def symptoms = []

    // ----------------------------------------------------------------------------
    // 2. Retrieve data
    // ----------------------------------------------------------------------------
    def teamName = teamData.team?.TeamName ?: "Unknown Team"
    System.err.println "Starting timebox check for team '${teamName}'"

    def sprints = teamData.team?.Sprints ?: []
    def workDayHours = teamData.team?.WorkDayHours ?: 8

    // Helper method for date parsing
    def parseDateTime = { dtString ->
        if (!dtString) return null
        LocalDateTime.parse(dtString, DateTimeFormatter.ISO_DATE_TIME)
    }

    // Flags to track whether we have major/minor conditions
    def missingTimeboxFound = false
    def exceedTimeboxFound = false

    // ----------------------------------------------------------------------------
    // 3. Evaluate each sprint
    // ----------------------------------------------------------------------------
    sprints.each { sprint ->
        def sprintName = sprint.SprintGoal.Description ?: "that started on " + sprint.StartDate

        // Condition A: Missing Timebox
        if (!sprint.TimeboxID || !sprint.Timebox) {
            missingTimeboxFound = true
            symptoms << "Sprint '${sprintName}' is missing a valid timebox (TimeboxID or Timebox object)."
            // If this sprint is missing a timebox, we don't need to check the next condition for it
            return
        }

        // Condition B: Timebox exceeded
        def timeboxHours = sprint.Timebox?.Duration
        if (timeboxHours == null) {
            // If we can't confirm a duration, skip the exceed check for this sprint
            return
        }

        // Calculate actual hours from start/end date
        def startDt = parseDateTime(sprint.StartDate)
        def endDt   = parseDateTime(sprint.EndDate)
        if (startDt && endDt) {
            def daysBetween = ChronoUnit.DAYS.between(startDt, endDt)
            def actualHours = daysBetween * workDayHours

            if (actualHours > timeboxHours) {
                exceedTimeboxFound = true
                symptoms << "Sprint '${sprintName}' (actual ${actualHours}h) exceeds timebox limit (${timeboxHours}h)."
            }
        }
    }

    // ----------------------------------------------------------------------------
    // 4. Determine pass/fail severity
    // ----------------------------------------------------------------------------
    // If any sprint is missing a timebox, that's a Major fail
    def severity = "None"
    def outcomeDescription = "All sprints reference a timebox and are within the allocated duration."

    if (missingTimeboxFound) {
        severity = "Major"
        outcomeDescription = "One or more sprints do not reference a timebox."
    } else if (exceedTimeboxFound) {
        severity = "Minor"
        outcomeDescription = "One or more sprints exceed the allocated timebox duration."
    }

    def passed = (severity == "None")

    // ----------------------------------------------------------------------------
    // 5. Return the result
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
    System.err.println "Usage: groovy SprintTimebox.groovy <path_to_json_file>"
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
