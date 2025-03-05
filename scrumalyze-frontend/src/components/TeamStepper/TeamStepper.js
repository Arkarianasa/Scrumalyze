import React, { useState, useContext } from 'react';
import { Button, Stepper, Step, StepLabel, Typography, Box, Card, CardContent, CardActions } from '@mui/material';
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
const steps = ['SCRUM Team', 'SCRUM Roles', 'Involved Persons', 'Product Goal', 'Product Backlog', 'Product Backlog Sample', 'Timeboxes Sample', 'Sprints Sample', 'Process Steps', 'Definitions Of Done', 'Work Items Sample', 'Increments Sample', 'Communication Matrix'];

const AddTeamStepper = () => {
    const { setScrumTeams, setCurrentPage } = useContext(GlobalContext); // Fetch roles and work item types from GlobalContext
    const [activeStep, setActiveStep] = useState(0);
    const [formValues, setFormValues] = useState({
        teamName: '',
        workDayHours: 8,
        scrumRoles: [],
        persons: [{ firstName: '', lastName: '', roleID: null, isScrumTeamMember: false }],
        productGoals: [{ description: '', responsiblePersonID: null }],
        productBacklog: { responsiblePersonID: null, productGoalID: null, primaryPrioritizationSchemeID: null, secondaryPrioritizationSchemeID: null},
        backlogItems: [{ itemName: '', itemDescription: '', sprintBacklogID: null, done: false }],
        timeboxes: [{ timeboxDescription: '', duration: '' }],
        sprints: [{ sprintGoal: '', startDate: '', endDate: '', TimeboxDtoID: null, backlogItems: [], goalResponsiblePersonID: null, backlogResponsiblePersonID: null}],
        definitionsOfDone: [{constraintDescription: '', isCompanyPolicy: false}],
        workItems: [{ description: '', TimeboxDtoID: null, BacklogItemDtoID: null, definitionOfDoneIDs: [], acceptanceCriterias: [], workItemTypeID: null, deadline: '', done: false, workingPersons: [] }],
        increments: [{ description: '', relatedSprintDtoID: null, receivedByPersonDtoID: null, relatedProductGoalDtoID: null, deadline: '' }]
    });

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
  

    const validateCurrentStep = () => {
      let isValid = true;

      // Validate based on the active step
      switch (activeStep) {
        case 0: // Team Name Step
          if (!formValues.teamName) {
            console.log('Team Name is required');
            isValid = false;
          }
          if (!formValues.workDayHours) {
            console.log('Work Day Hours are required');
            isValid = false;
          }
          break;

        case 1: // Team Roles
        formValues.scrumRoles.forEach((role, index) => {
          if (!role.roleName) {
            console.log('All fields are required.');
            isValid = false;
          }
        });
        break;

        case 2: // Persons Step
        formValues.persons.forEach((person, index) => {
          if (!person.firstName || !person.lastName || !person.roleID) {
            console.log('All fields are required');
            isValid = false;
          }
        });
        break;
        
        case 3: // Product Goals Step
        formValues.productGoals.forEach((productGoal, index) => {
          if (!productGoal.description) {
            console.log('Product Goal Description is required');
            isValid = false;
          }
          if (productGoal.responsiblePersonID === '') {
            console.log('Responsible person is required');
            isValid = false;
          }
        });
        break;

        case 4: // Product Backlog Step
        if (formValues.productBacklog.responsiblePersonID === '') {
          console.log('Responsible person is required');
          isValid = false;
        }
        break;

        case 5: // Product Backlog Items Step
          formValues.backlogItems.forEach((item, index) => {
            if (!item.itemName || !item.itemDescription) {
              console.log('Fields item name and item description are required');
              isValid = false;
            }
          });
          break;

        case 6: // Timeboxes Step
          formValues.timeboxes.forEach((timebox, index) => {
            if (!timebox.duration || !timebox.timeboxDescription) {
              console.log('All fields are required');
              isValid = false;
            }
          });
          break;

        case 7: // Sprints Step
          formValues.sprints.forEach((sprint, index) => {
            if (!sprint.startDate) {
              console.log('Field start date are required');
              isValid = false;
            }
            if (sprint.goalResponsiblePersonID === '') {
              console.log('Goal responsible person is required');
              isValid = false;
            }
            if (sprint.backlogResponsiblePersonID === '') {
              console.log('Backlog responsible person is required');
              isValid = false;
            }
          });
          break;

        case 8: // Process Steps Step
          break;

        case 9: // DoD Step
          formValues.definitionsOfDone.forEach((DoD, index) => {
            if (!DoD.constraintDescription) {
              console.log('All are required');
              isValid = false;
            }
          });
          break;

        case 10: // Work Items Step
          formValues.workItems.forEach((workItem, index) => {
            if (!workItem.description) {
              console.log('Fields description is required');
              isValid = false;
            }
          });
          break;

        case 11: // Increments Step
          console.log(formValues);
          formValues.increments.forEach((increment, index) => {
            if (!increment.description) {
              console.log('Fields description are required');
              isValid = false;
            }
          });
          break;

        case 12: // Communication Step
          break;

        default:
          break;
      }
      return isValid;
    };

    const handleNext = () => {
      if (validateCurrentStep()) {
        setActiveStep((prevStep) => prevStep + 1);
      }
    };

    const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

    const handleChange = (field, value) => {
        setFormValues((prevValues) => ({ ...prevValues, [field]: value }));
    };

    const getStepContent = (step) => {
      switch (step) {
        case 0: return <StepScrumTeam formValues={formValues} handleChange={handleChange} />;
        case 1: return <StepTeamRoles formValues={formValues} handleChange={handleChange} />;
        case 2: return <StepInvolvedPersons formValues={formValues} handleChange={handleChange} />;
        case 3: return <StepProductGoals formValues={formValues} handleChange={handleChange} />;
        case 4: return <StepProductBacklog formValues={formValues} handleChange={handleChange} />;
        case 5: return <StepProductBacklogSample formValues={formValues} handleChange={handleChange} />;
        case 6: return <StepTimeboxes formValues={formValues} handleChange={handleChange} />;
        case 7: return <StepSprints formValues={formValues} handleChange={handleChange} />;
        case 8: return <StepProcessSteps formValues={formValues} handleChange={handleChange} />;
        case 9: return <StepDefinitionsOfDone formValues={formValues} handleChange={handleChange} />;
        case 10: return <StepWorkItems formValues={formValues} handleChange={handleChange} />;
        case 11: return <StepIncrements formValues={formValues} handleChange={handleChange} />;
        case 12: return <StepCommunication formValues={formValues} handleChange={handleChange} />;
        default: return 'Unknown step';
      }
  };

  return (
    <Card style={{ textAlign: 'center', padding: '16px', height: '700px', display: 'flex', flexDirection: 'column' }}>
      <CardContent style={{ flexGrow: 1, overflow: 'auto' }}>
        <Typography style={{ paddingBottom: '16px' }} variant="h4" color='primary'>New Team Page</Typography>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
  
        <Box style={{ marginTop: '20px' }}>
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