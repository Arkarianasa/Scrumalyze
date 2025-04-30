import React, { useState, useContext } from 'react';
import {
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Alert
} from '@mui/material';
import { GlobalContext } from '../../context/GlobalContext';

import StepScrumTeam from './Steps/StepScrumTeam';
import StepTeamRoles from './Steps/StepTeamRoles';
import StepInvolvedPersons from './Steps/StepInvolvedPersons';
import StepProductGoals from './Steps/StepProductGoals';
import StepProductBacklog from './Steps/StepProductBacklog';
import StepProductBacklogSample from './Steps/StepProductBacklogSample';
import StepTimeboxes from './Steps/StepTimeboxes';
import StepSprints from './Steps/StepSprints';
import StepProcessSteps from './Steps/StepProcessSteps';
import StepDefinitionsOfDone from './Steps/StepDefinitionsOfDone';
import StepWorkItems from './Steps/StepWorkItems';
import StepIncrements from './Steps/StepIncrements';
import StepCommunication from './Steps/StepCommunication';

const steps = [
  'SCRUM Team',
  'SCRUM Roles',
  'Involved Persons',
  'Product Goal',
  'Product Backlog',
  'Product Backlog Sample',
  'Timeboxes Sample',
  'Sprints Sample',
  'Process Steps',
  'Definitions Of Done',
  'Work Items Sample',
  'Increments Sample',
  'Communication Matrix'
];

const AddTeamStepper = () => {
  const { setScrumTeams, setCurrentPage } = useContext(GlobalContext);
  const [activeStep, setActiveStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [formValues, setFormValues] = useState({
    teamName: '',
    workDayHours: 8,
    scrumRoles: [],
    persons: [{ firstName: '', lastName: '', roleID: null, isScrumTeamMember: false }],
    productGoals: [{ description: '', responsiblePersonDtoID: '' }],
    productBacklog: { responsiblePersonDtoID: '', productGoalID: null, primaryPrioritizationSchemeID: null, secondaryPrioritizationSchemeID: null },
    backlogItems: [{ itemName: '', itemDescription: '', sprintBacklogID: null, done: false }],
    timeboxes: [{ timeboxDescription: '', days: null, hours: null, minutes: null }],
    sprints: [{ sprintGoal: '', startDate: '', endDate: '', TimeboxDtoID: null, backlogItems: [], goalResponsiblePersonID: '', backlogResponsiblePersonID: '' }],
    definitionsOfDone: [{ constraintDescription: '', isCompanyPolicy: false }],
    workItems: [{ description: '', TimeboxDtoID: null, BacklogItemDtoID: null, definitionOfDoneIDs: [], acceptanceCriterias: [], workItemTypeID: null, deadline: '', done: false, workingPersonIds: [] }],
    increments: [{ description: '', relatedSprintDtoID: null, receivedByPersonDtoID: null, relatedProductGoalDtoID: null, deadline: '' }],
    communicationMatrix: []
  });

  const validateCurrentStep = () => {
    let isValid = true;
    switch (activeStep) {
      case 0: // SCRUM Team
        if (!formValues.teamName || !formValues.workDayHours) {
          isValid = false;
        }
        break;

      case 1: // SCRUM Roles
        formValues.scrumRoles.forEach((role) => {
          if (!role.roleName || !role.roleDescription) {
            isValid = false;
          }
        });
        break;

      case 2: // Involved Persons
        formValues.persons.forEach((person) => {
          if (!person.firstName || !person.lastName || !person.roleID) {
            isValid = false;
          }
        });
        break;

      case 3: // Product Goals
        formValues.productGoals.forEach((productGoal) => {
          if (!productGoal.description || productGoal.responsiblePersonDtoID === '') {
            isValid = false;
          }
        });
        break;

      case 4: // Product Backlog
        if (formValues.productBacklog.responsiblePersonDtoID === '') {
          isValid = false;
        }
        break;

      case 5: // Product Backlog Sample
        formValues.backlogItems.forEach((item) => {
          if (!item.itemName || !item.itemDescription) {
            isValid = false;
          }
        });
        break;

      case 6: // Timeboxes Sample
        formValues.timeboxes.forEach((timebox) => {
          if (
            (timebox.days === '' || timebox.days == null) ||
            (timebox.hours === '' || timebox.hours == null) ||
            (timebox.minutes === '' || timebox.minutes == null) ||
            !timebox.timeboxDescription
          ) {
            isValid = false;
          }
        });
        break;

      case 7: // Sprints Sample
        formValues.sprints.forEach((sprint) => {
          if (!sprint.startDate || sprint.goalResponsiblePersonID === '' || sprint.backlogResponsiblePersonID === '') {
            isValid = false;
          }
        });
        break;

      case 8: // Process Steps Meta Data
        formValues.processSteps.forEach((processStep) => {
          if (
            (processStep.averageDays === '' || processStep.averageDays == null) ||
            (processStep.averageHours === '' || processStep.averageHours == null) ||
            (processStep.averageMinutes === '' || processStep.averageMinutes == null) ||
            (processStep.guidedByPersonID === '')
          ) {
            isValid = false;
          }
        });
        break;

      case 9: // Definitions Of Done
        formValues.definitionsOfDone.forEach((DoD) => {
          if (!DoD.constraintDescription) {
            isValid = false;
          }
        });
        break;

      case 10: // Work Items Sample
        formValues.workItems.forEach((workItem) => {
          if (!workItem.description) {
            isValid = false;
          }
        });
        break;

      case 11: // Increments Sample
        formValues.increments.forEach((increment) => {
          if (!increment.description) {
            isValid = false;
          }
        });
        break;

      default:
        break;
    }
    return isValid;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setErrorMessage('');
      setActiveStep((prevStep) => prevStep + 1);
    } else {
      setErrorMessage('Please fill in all required fields for this step.');
    }
  };

  const handleBack = () => {
    setErrorMessage('');
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (field, value) => {
    setFormValues((prevValues) => ({ ...prevValues, [field]: value }));
  };

  const sendScrumTeam = async () => {
    console.log(formValues);

    formValues.sprints.forEach((sprint) => {
        if (!sprint.startDate || sprint.startDate.trim() === '') {
            sprint.startDate = null;
        } else {
            sprint.startDate = new Date(sprint.startDate).toISOString();
        }

        if (!sprint.endDate || sprint.endDate.trim() === '') {
            sprint.endDate = null;
        } else {
            sprint.endDate = new Date(sprint.endDate).toISOString();
        }

        if (!Number.isInteger(sprint.goalResponsiblePersonID)) {
            sprint.goalResponsiblePersonID = null;
        }

        if (!Number.isInteger(sprint.backlogResponsiblePersonID)) {
            sprint.backlogResponsiblePersonID = null;
        }
    });

    formValues.workItems.forEach((workItem) => {
        if (!workItem.deadline || workItem.deadline.trim() === '') {
            workItem.deadline = null;
        } else {
            const deadline = new Date(workItem.deadline);
            workItem.deadline = isNaN(deadline.getTime()) ? null : deadline.toISOString();
        }
    });

    formValues.increments.forEach((increment) => {
        if (!increment.deadline || increment.deadline.trim() === '') {
            increment.deadline = null;
        } else {
            const deadline = new Date(increment.deadline);
            increment.deadline = isNaN(deadline.getTime()) ? null : deadline.toISOString();
        }
    });

    formValues.productGoals.forEach((productGoal) => {
        if (!Number.isInteger(productGoal.responsiblePersonID)) {
            productGoal.responsiblePersonID = null;
        }
    });

    formValues.processSteps.forEach((processStep) => {
        if (!Number.isInteger(processStep.guidedByPersonID)) {
            processStep.guidedByPersonID = null;
        }
    });

    if (!Number.isInteger(formValues.productBacklog.responsiblePersonID)) {
        formValues.productBacklog.responsiblePersonID = null;
    }

    try {
        const response = await fetch('https://localhost:52765/api/team/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formValues),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const scrumTeams = await response.json();
        console.log('Scrum team saved');
        setScrumTeams(scrumTeams);

        setCurrentPage('main');
    } catch (error) {
        console.error('Error sending formValues:', error);
    }
};

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <StepScrumTeam formValues={formValues} handleChange={handleChange} />;
      case 1:
        return <StepTeamRoles formValues={formValues} handleChange={handleChange} />;
      case 2:
        return <StepInvolvedPersons formValues={formValues} handleChange={handleChange} />;
      case 3:
        return <StepProductGoals formValues={formValues} handleChange={handleChange} />;
      case 4:
        return <StepProductBacklog formValues={formValues} handleChange={handleChange} />;
      case 5:
        return <StepProductBacklogSample formValues={formValues} handleChange={handleChange} />;
      case 6:
        return <StepTimeboxes formValues={formValues} handleChange={handleChange} />;
      case 7:
        return <StepSprints formValues={formValues} handleChange={handleChange} />;
      case 8:
        return <StepProcessSteps formValues={formValues} handleChange={handleChange} />;
      case 9:
        return <StepDefinitionsOfDone formValues={formValues} handleChange={handleChange} />;
      case 10:
        return <StepWorkItems formValues={formValues} handleChange={handleChange} />;
      case 11:
        return <StepIncrements formValues={formValues} handleChange={handleChange} />;
      case 12:
        return <StepCommunication formValues={formValues} handleChange={handleChange} />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Card
      style={{
        textAlign: 'center',
        padding: '16px',
        height: '750px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardContent style={{ flexGrow: 1, overflow: 'auto' }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box style={{ marginTop: '20px' }}>
          {errorMessage && (
            <Alert severity="error" style={{ marginBottom: '20px' }}>
              {errorMessage}
            </Alert>
          )}
          {activeStep === steps.length ? (
            <Typography>All steps completed!</Typography>
          ) : (
            <>
              {getStepContent(activeStep)}
            </>
          )}
        </Box>
      </CardContent>
      <CardActions style={{ justifyContent: 'center' }}>
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button variant="contained" color="primary" onClick={sendScrumTeam}>
            Finish
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleNext}>
            Next
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default AddTeamStepper;
