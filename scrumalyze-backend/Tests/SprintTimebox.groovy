#!/usr/bin/env groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

/**
 * Checks whether each Sprint:
 *   1) Has a Timebox assigned (i.e., TimeboxID is not null).
 *   2) The actual duration (in hours) of the Sprint (difference between StartDate and EndDate, in days, times team.WorkDayHours)
 *      does not exceed the Timebox's duration property.
 *
 * Fails if either condition is not met for any Sprint.
 *
 * Usage: groovy SprintTimebox.groovy <path_to_json_file>
 *
 * @param teamData A Map containing:
 *                 - team -> Sprints (array of sprints)
 *                 - team -> WorkDayHours (number of hours per day)
 * @return A map (as JSON) with the fields:
 *         - name
 *         - severity
 *         - passed
 *         - outcomeDescription
 */
def evaluate(teamData) {
    // ----------------------------------------------------------------------------
    // 1. Define Metadata
    // ----------------------------------------------------------------------------
    def name = "Sprint Timebox Check"
    def severity = "Major"
    def descriptionPass = "All sprints reference a Timebox and are within the allocated timebox duration."
    def descriptionFailNoTimebox = "One or more sprints do not reference a timebox."
    def descriptionFailDuration = "One or more sprints exceed the allocated timebox duration."

    // ----------------------------------------------------------------------------
    // 2. Parse relevant data
    // ----------------------------------------------------------------------------
    def sprints = teamData.team?.Sprints ?: []
    def workDayHours = teamData.team?.WorkDayHours ?: 8 // Default to 8 if missing

    // Helper method to parse date strings
    def parseDateTime = { dtString ->
        if(!dtString) return null
        LocalDateTime.parse(dtString, DateTimeFormatter.ISO_DATE_TIME)
    }

    // ----------------------------------------------------------------------------
    // 3. Check conditions for each sprint
    // ----------------------------------------------------------------------------

    // Condition A: Any sprint missing TimeboxID or no actual Timebox reference?
    def anyMissingTimebox = sprints.any { sprint ->
        !sprint.TimeboxID || !sprint.Timebox
    }

    // Condition B: Any sprint that exceeds the timebox duration?
    def anyExceedTimeboxDuration = sprints.any { sprint ->
        // Skip if timebox is missing or has no duration
        if (!sprint.TimeboxID || !sprint.Timebox?.Duration) return false

        // Parse start/end, calculate difference in days
        def startDt = parseDateTime(sprint.StartDate)
        def endDt   = parseDateTime(sprint.EndDate)
        if (!startDt || !endDt) return false  // If dates can't be parsed, skip or consider failing

        def daysBetween = ChronoUnit.DAYS.between(startDt, endDt)
        def actualHours = daysBetween * workDayHours
        def timeboxHours = sprint.Timebox.Duration

        // True if actual sprint hours exceed timebox hours
        actualHours > timeboxHours
    }

    // ----------------------------------------------------------------------------
    // 4. Determine pass/fail
    // ----------------------------------------------------------------------------
    def passed
    def outcomeDescription

    if (anyMissingTimebox) {
        passed = false
        outcomeDescription = descriptionFailNoTimebox
    } else if (anyExceedTimeboxDuration) {
        passed = false
        severity = "Minor"
        outcomeDescription = descriptionFailDuration
    } else {
        passed = true
        outcomeDescription = descriptionPass
    }

    // ----------------------------------------------------------------------------
    // 5. Return the result
    // ----------------------------------------------------------------------------
    return [
        name               : name,
        severity           : severity,
        passed             : passed,
        outcomeDescription : outcomeDescription
    ]
}

// ----------------------------------------------------------------------------
// Main script logic
// ----------------------------------------------------------------------------
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
