import React, { useState, useContext } from 'react';
import { Button, Stepper, Step, StepLabel, TextField, MenuItem, Typography, Grid, Checkbox, FormControlLabel, Box, Autocomplete, Card, CardContent, CardActions } from '@mui/material';
import { GlobalContext } from '../context/GlobalContext'; // Assuming you have GlobalContext setup for roles, work item types

const steps = ['Team Name', 'Involved Persons', 'Product Goal', 'Product Backlog', 'Timeboxes', 'Sprints', 'Definition Of Done', 'Acceptance Criteria', 'Work Items', 'Increments'];

const AddTeamStepper = () => {
    const { scrumRoles, workItemTypes, setScrumTeams, setCurrentPage } = useContext(GlobalContext); // Fetch roles and work item types from GlobalContext
    const [activeStep, setActiveStep] = useState(0);
    const [formValues, setFormValues] = useState({
        teamName: '',
        persons: [{ firstName: '', lastName: '', roleID: null }],
        productGoal: { Description: '', createdByPersonID: '' },
        backlogItems: [{ itemName: '', itemDescription: '', itemPriority: '', sprintBacklogID: null, done: false }],
        timeboxes: [{ timeboxDescription: '', duration: '' }],
        sprints: [{ sprintGoal: '', startDate: '', endDate: '', TimeboxDtoID: null, backlogItems: [], goalCreatedByPersonID: ''}],
        definitionOfDone: [{constraintDescription: ''}],
        acceptanceCriterias: [{constraintDescription: ''}],
        workItems: [{ description: '', TimeboxDtoID: null, BacklogItemDtoID: null, definitionOfDoneID: null, workItemTypeID: null, deadline: '', done: false, workingPersons: [] }],
        increments: [{ description: '', RelatedSprintDtoID: null, ReceivedByPersonDtoID: null, relatedToSprintGoal: false, deadline: '' }]
    });

    const sendScrumTeam = async () => {
      console.log(formValues);

      formValues.sprints.forEach((sprint, index) => {
        var start = new Date(sprint.startDate??null);
        var end = new Date(sprint.startDate??null);

        sprint.startDate = start.toISOString();
        sprint.endDate = end.toISOString();
      });

      formValues.workItems.forEach((workItem, index) => {
        var deadline = new Date(workItem.startDate??null);
        workItem.deadline = deadline.toISOString();
      });

      formValues.increments.forEach((increment, index) => {
        var deadline = new Date(increment.startDate??null);
        increment.deadline = deadline.toISOString();
      });

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
          break;

        case 1: // Persons Step
        formValues.persons.forEach((person, index) => {
          if (!person.firstName || !person.lastName || !person.roleID) {
            console.log('All fields are required');
            isValid = false;
          }
        });
        break;
        
        case 2: // Product Goal Step
        if (!formValues.productGoal.Description) {
          console.log('Product Goal Description is required');
          isValid = false;
        }
        if (formValues.productGoal.createdByPersonID === '') {
          console.log('Responsible person is required');
          isValid = false;
        }
        break;

        case 3: // Product Backlog Step
          formValues.backlogItems.forEach((item, index) => {
            if (!item.itemName || !item.itemDescription) {
              console.log('Fields item name and item description are required');
              isValid = false;
            }
          });
          break;

        case 4: // Timeboxes Step
          formValues.timeboxes.forEach((timebox, index) => {
            if (!timebox.duration || !timebox.timeboxDescription) {
              console.log('All fields are required');
              isValid = false;
            }
          });
          break;

        case 5: // Sprints Step
          formValues.sprints.forEach((sprint, index) => {
            if (!sprint.sprintGoal || !sprint.startDate) {
              console.log('Fields sprint goal and start date are required');
              isValid = false;
            }
            if (sprint.goalCreatedByPersonID === '') {
              console.log('Goal responsible person is required');
              isValid = false;
            }
          });
          break;

        case 6: // DoD Step
          formValues.definitionOfDone.forEach((DoD, index) => {
            if (!DoD.constraintDescription) {
              console.log('All are required');
              isValid = false;
            }
          });
          break;

        case 7: // Acceptance Criteria Step
          formValues.acceptanceCriterias.forEach((acceptanceCriteria, index) => {
            if (!acceptanceCriteria.constraintDescription) {
              console.log('All are required');
              isValid = false;
            }
          });
          break;

        case 8: // Work Items Step
          console.log(formValues.workItems[0].workingPersons);
          formValues.workItems.forEach((workItem, index) => {
            if (!workItem.description || !workItem.workItemTypeID) {
              console.log('Fields description and type are required');
              isValid = false;
            }
          });
          break;

        case 9: // Increments Step
          console.log(formValues);
          formValues.increments.forEach((increment, index) => {
            if (!increment.RelatedSprintDtoID) {
              console.log('Fields related sprint are required');
              isValid = false;
            }
            if (!increment.description) {
              console.log('Fields description are required');
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
        setActiveStep((prevStep) => prevStep + 1);
      }
    };

    const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

    const handleChange = (field, value) => {
        setFormValues((prevValues) => ({ ...prevValues, [field]: value }));
    };

    // Persons
    const addPerson = () => {
        setFormValues((prevValues) => ({
          ...prevValues,
          persons: [...prevValues.persons, { firstName: '', lastName: '', roleID: '' }]
        }));
      };
    
    const handlePersonChange = (index, field, value) => {
        const updatedPersons = formValues.persons.map((person, i) =>
            i === index ? { ...person, [field]: value } : person
        );
        setFormValues((prevValues) => ({ ...prevValues, persons: updatedPersons }));
    };

    const handleDeletePerson = (index) => {
        const updatedPersons = formValues.persons.filter((_, i) => i !== index);
        setFormValues((prevValues) => ({ ...prevValues, persons: updatedPersons }));
      };
    
      // Product Backlog
      const addBacklogItem = () => {
        setFormValues((prevValues) => ({
          ...prevValues,
          backlogItems: [
            ...prevValues.backlogItems,
            { itemName: '', itemDescription: '', itemPriority: '', productBacklogID: 0, sprintBacklogID: null, done: false }
          ]
        }));
      };
    
      const handleBacklogItemChange = (index, field, value) => {
        const updatedBacklogItems = formValues.backlogItems.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        );
        setFormValues((prevValues) => ({ ...prevValues, backlogItems: updatedBacklogItems }));
      };

      const handleDeleteBacklogTtem = (index) => {
        const updatedBacklogItems = formValues.backlogItems.filter((_, i) => i !== index);
        setFormValues((prevValues) => ({ ...prevValues, backlogItems: updatedBacklogItems }));
      };

      // Timeboxes
      const addTimebox = () => {
          setFormValues((prevValues) => ({
          ...prevValues,
          timeboxes: [...prevValues.timeboxes, { timeboxDescription: '', duration: '' }]
          }));
      };

      const handleTimeboxChange = (index, field, value) => {
          const updatedTimeboxes = formValues.timeboxes.map((timebox, i) =>
          i === index ? { ...timebox, [field]: value } : timebox
          );
          setFormValues((prevValues) => ({ ...prevValues, timeboxes: updatedTimeboxes }));
      };

      const handleDeleteTimebox = (index) => {
        const updatedTimeboxes = formValues.timeboxes.filter((_, i) => i !== index);
        setFormValues((prevValues) => ({ ...prevValues, timeboxes: updatedTimeboxes }));
      };

    // Sprints
    const addSprint = () => {
        setFormValues((prevValues) => ({
        ...prevValues,
        sprints: [...prevValues.sprints, { sprintGoal: '', startDate: '', endDate: '', TimeboxDtoID: '', backlogItems: [], goalCreatedByPersonID: '' }]
        }));
    };

    const handleSprintChange = (index, field, value) => {
        const updatedSprints = formValues.sprints.map((sprint, i) => {
        if (i === index) {
            if (field === 'backlogItems') {
            return { ...sprint, backlogItems: value };
            }
            return { ...sprint, [field]: value };
        }
        return sprint;
        });
        
        setFormValues((prevValues) => ({
        ...prevValues,
        sprints: updatedSprints,
        }));
    };

    const handleDeleteSprint = (index) => {
      const updatedSprints = formValues.sprints.filter((_, i) => i !== index);
      setFormValues((prevValues) => ({ ...prevValues, sprints: updatedSprints }));
    };

      // DoD
      const addDoD = () => {
        setFormValues((prevValues) => ({
        ...prevValues,
        definitionOfDone: [...prevValues.definitionOfDone, { constraintDescription: '' }]
        }));
      };

      const handleDoDChange = (index, field, value) => {
          const updatedDefinitionOfDone = formValues.definitionOfDone.map((DoD, i) =>
          i === index ? { ...DoD, [field]: value } : DoD
          );
          setFormValues((prevValues) => ({ ...prevValues, definitionOfDone: updatedDefinitionOfDone }));
      };

      const handleDeleteDoD = (index) => {
        const updatedDefinitionOfDone = formValues.definitionOfDone.filter((_, i) => i !== index);
        setFormValues((prevValues) => ({ ...prevValues, definitionOfDone: updatedDefinitionOfDone }));
      };

      // Acceptance Criterias
      const addAcceptanceCriteria = () => {
        setFormValues((prevValues) => ({
        ...prevValues,
        acceptanceCriterias: [...prevValues.acceptanceCriterias, { constraintDescription: '' }]
        }));
      };

      const handleAcceptanceCriteriaChange = (index, field, value) => {
          const updatedAcceptanceCriteria = formValues.acceptanceCriterias.map((acceptanceCriteria, i) =>
          i === index ? { ...acceptanceCriteria, [field]: value } : acceptanceCriteria
          );
          setFormValues((prevValues) => ({ ...prevValues, acceptanceCriterias: updatedAcceptanceCriteria }));
      };

      const handleDeleteAcceptanceCriteria = (index) => {
        const updatedAcceptanceCriteria = formValues.acceptanceCriterias.filter((_, i) => i !== index);
        setFormValues((prevValues) => ({ ...prevValues, acceptanceCriterias: updatedAcceptanceCriteria }));
      };

    // Increments
    const addIncrement = () => {
      setFormValues((prevValues) => ({
          ...prevValues,
          increments: [
              ...prevValues.increments,
              {
                  description: '',
                  RelatedSprintDtoID: null,
                  ReceivedByPersonDtoID: null,
                  relatedToSprintGoal: false,
                  relatedToProductGoal: false,
                  hasDeadline: false,
                  done: false,
              },
          ],
      }));
    };
  
    const handleIncrementChange = (index, field, value) => {
        const updatedIncrements = formValues.increments.map((increment, i) =>
            i === index ? { ...increment, [field]: value } : increment
        );
        setFormValues((prevValues) => ({ ...prevValues, increments: updatedIncrements }));
    };
    
    const handleDeleteIncrement = (index) => {
        const updatedIncrements = formValues.increments.filter((_, i) => i !== index);
        setFormValues((prevValues) => ({ ...prevValues, increments: updatedIncrements }));
    };

    // Work Items
    const addWorkItem = () => {
      setFormValues((prevValues) => ({
        ...prevValues,
        workItems: [...prevValues.workItems, { 
          description: '', 
          BacklogItemDtoID: null, 
          workItemTypeID: null, 
          done: false, 
          workingPersons: [], 
          acceptanceCriteriaID: null,
          TimeboxDtoID: null,
        }]
      }));
    };

    const handleWorkItemChange = (index, field, value) => {
      const updatedWorkItems = formValues.workItems.map((item, i) =>
          i === index ? { ...item, [field]: field === 'BacklogItemDtoID' ? Number(value) : value } : item
      );
      setFormValues((prevValues) => ({ ...prevValues, workItems: updatedWorkItems }));
  };

    const handleDeleteWorkItem = (index) => {
      const updatedWorkItems = formValues.workItems.filter((_, i) => i !== index);
      setFormValues((prevValues) => ({ ...prevValues, workItems: updatedWorkItems }));
    };

    const getStepContent = (step) => {
        switch (step) {
        case 0:
            return (
            <TextField
                label="Team Name"
                variant="outlined"
                fullWidth
                value={formValues.teamName}
                onChange={(e) => handleChange('teamName', e.target.value)}
                required
            />
            );
        case 1:
            return (
                <Box>
                {formValues.persons.map((person, index) => (
                    <Grid container spacing={2} key={index} style={{ marginBottom: '20px', alignItems: 'center' }}>
                    <Grid item xs={4}>
                        <TextField
                        label="First Name"
                        variant="outlined"
                        value={person.firstName}
                        onChange={(e) => handlePersonChange(index, 'firstName', e.target.value)}
                        fullWidth
                        required
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                        label="Last Name"
                        variant="outlined"
                        value={person.lastName}
                        onChange={(e) => handlePersonChange(index, 'lastName', e.target.value)}
                        fullWidth
                        required
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                        select
                        label="Role"
                        variant="outlined"
                        value={person.roleID}
                        onChange={(e) => handlePersonChange(index, 'roleID', e.target.value)}
                        fullWidth
                        required
                        >
                        {scrumRoles.map((role) => (
                            <MenuItem key={role.roleID} value={role.roleID}>
                            {role.roleName}
                            </MenuItem>
                        ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={1}>
                        <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeletePerson(index)}
                        fullWidth
                        >
                        Delete
                        </Button>
                    </Grid>
                    </Grid>
                ))}
                <Button variant="contained" color="primary" onClick={addPerson}>
                    Add Person
                </Button>
                </Box>
            );

        case 2:
        return (
          <Box>
            <TextField
              label="Product Goal Description"
              variant="outlined"
              fullWidth
              value={formValues.productGoal.Description} // Updated
              onChange={(e) =>
                handleChange('productGoal', {
                  ...formValues.productGoal,
                  Description: e.target.value,
                })
              }
              required
            />
            <TextField style={{ marginTop: '10px' }}
              select
              label="Responsible Person"
              variant="outlined"
              fullWidth
              value={formValues.productGoal.createdByPersonID} // Updated
              onChange={(e) =>
                handleChange('productGoal', {
                  ...formValues.productGoal,
                  createdByPersonID: e.target.value,
                })
              }
              required
            >
              {formValues.persons.map((person, index) => (
                <MenuItem key={index} value={index}>
                  {person.firstName} {person.lastName} ({scrumRoles[person.roleID-1].roleName})
                </MenuItem>
              ))}
            </TextField>
          </Box>
        );

        case 3:
            return (
              <Box>
                {formValues.backlogItems.map((item, index) => (
                  <Box key={index} style={{ marginBottom: '30px', alignItems: 'center' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={7}>
                        <TextField
                          label="Item Name"
                          variant="outlined"
                          value={item.itemName}
                          onChange={(e) => handleBacklogItemChange(index, 'itemName', e.target.value)}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          label="Item Priority"
                          variant="outlined"
                          type="number"
                          value={item.itemPriority || ''}
                          onChange={(e) => handleBacklogItemChange(index, 'itemPriority', e.target.value)}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={item.done || false}
                              onChange={(e) => handleBacklogItemChange(index, 'done', e.target.checked)}
                              color="primary"
                            />
                          }
                          label="Done"
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteBacklogTtem(index)}
                        fullWidth
                        >
                        Delete
                        </Button>
                    </Grid>
                    </Grid>
          
                    <Grid container spacing={2} style={{ marginTop: '-5px' }}>
                      <Grid item xs={12}>
                        <TextField
                          label="Item Description"
                          variant="outlined"
                          value={item.itemDescription}
                          onChange={(e) => handleBacklogItemChange(index, 'itemDescription', e.target.value)}
                          fullWidth
                          required
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ))}
                <Button variant="contained" color="primary" onClick={addBacklogItem}>
                  Add Backlog Item
                </Button>
              </Box>
            );

        case 4:
          return (
            <Box>
              {formValues.timeboxes.map((timebox, index) => (
                <Grid container spacing={2} key={index} style={{ marginBottom: '20px' }}>
                  <Grid item xs={8}>
                    <TextField
                      label="Timebox Description"
                      variant="outlined"
                      value={timebox.timeboxDescription}
                      onChange={(e) => handleTimeboxChange(index, 'timeboxDescription', e.target.value)}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Duration in human-hours"
                      variant="outlined"
                      value={timebox.duration}
                      onChange={(e) => handleTimeboxChange(index, 'duration', e.target.value)}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={1}>
                      <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteTimebox(index)}
                      fullWidth
                      >
                      Delete
                      </Button>
                  </Grid>
                </Grid>
              ))}
              <Button variant="contained" color="primary" onClick={addTimebox}>
                Add Timebox
              </Button>
            </Box>
          );

        case 5:
          return (
            <Box>
              {formValues.sprints.map((sprint, index) => (
                <Box key={index} style={{ marginBottom: '40px' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={5}>
                      <TextField
                        label="Sprint Goal"
                        variant="outlined"
                        value={sprint.sprintGoal}
                        onChange={(e) => handleSprintChange(index, 'sprintGoal', e.target.value)}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={2}>
                    <TextField
                      select
                      label="Goal Created By"
                      variant="outlined"
                      fullWidth
                      value={sprint.goalCreatedByPersonID} // Updated
                      onChange={(e) => handleSprintChange(index, 'goalCreatedByPersonID', e.target.value)}
                      required
                    >
                      {formValues.persons.map((person, index) => (
                        <MenuItem key={index} value={index}>
                          {person.firstName} {person.lastName} ({scrumRoles[person.roleID-1].roleName})
                        </MenuItem>
                      ))}
                    </TextField>
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        label="Start Date"
                        variant="outlined"
                        type="date"
                        value={sprint.startDate}
                        onChange={(e) => handleSprintChange(index, 'startDate', e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        label="End Date"
                        variant="outlined"
                        type="date"
                        value={sprint.endDate}
                        onChange={(e) => handleSprintChange(index, 'endDate', e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteSprint(index)}
                      fullWidth
                      >
                      Delete
                      </Button>
                  </Grid>
                  </Grid>
        
                  {/* Select for Timebox */}
                  <Grid container spacing={2} style={{ marginTop: '0px' }}>
                    <Grid item xs={4}>
                      <TextField
                        select
                        label="Timebox"
                        value={sprint.TimeboxDtoID}
                        onChange={(e) => handleSprintChange(index, 'TimeboxDtoID', e.target.value)}
                        fullWidth
                      >
                        {formValues.timeboxes.map((timebox, idx) => (
                          <MenuItem key={idx} value={idx}>
                            {timebox.timeboxDescription}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
        
                  {/* Multi-select for Sprint Backlog */}
                    <Grid item xs={8}>
                      <Autocomplete
                        multiple
                        options={formValues.backlogItems}
                        getOptionLabel={(option) => option.itemName}
                        value={formValues.backlogItems.filter((_, i) => sprint.backlogItems.includes(i))}
                        onChange={(e, newValue) => {
                          const selectedIndexes = newValue.map((item) =>
                            formValues.backlogItems.indexOf(item)
                          );
                          handleSprintChange(index, 'backlogItems', selectedIndexes);
                        }}
                        renderInput={(params) => (
                          <TextField {...params} variant="outlined" label="Select Sprint Backlog Items" fullWidth />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button variant="contained" color="primary" onClick={addSprint}>
                Add Sprint
              </Button>
            </Box>
          );

        case 6:
          return (
            <Box>
              {formValues.definitionOfDone.map((DoD, index) => (
                <Grid container spacing={2} key={index} style={{ marginBottom: '20px' }}>
                  <Grid item xs={11}>
                    <TextField
                      label="Definition of Done"
                      variant="outlined"
                      value={DoD.constraintDescription}
                      onChange={(e) => handleDoDChange(index, 'constraintDescription', e.target.value)}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={1}>
                      <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteDoD(index)}
                      fullWidth
                      >
                      Delete
                      </Button>
                  </Grid>
                </Grid>
              ))}
              <Button variant="contained" color="primary" onClick={addDoD}>
                Add Definition of Done
              </Button>
            </Box>
          );

        case 7:
          return (
            <Box>
              {formValues.acceptanceCriterias.map((acceptanceCriteria, index) => (
                <Grid container spacing={2} key={index} style={{ marginBottom: '20px' }}>
                  <Grid item xs={11}>
                    <TextField
                      label="Acceptance Criteria"
                      variant="outlined"
                      value={acceptanceCriteria.constraintDescription}
                      onChange={(e) => handleAcceptanceCriteriaChange(index, 'constraintDescription', e.target.value)}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={1}>
                      <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteAcceptanceCriteria(index)}
                      fullWidth
                      >
                      Delete
                      </Button>
                  </Grid>
                </Grid>
              ))}
              <Button variant="contained" color="primary" onClick={addAcceptanceCriteria}>
                Add Acceptance Criteria
              </Button>
            </Box>
          );

        case 8:
          return (
            <Box>
              {formValues.workItems.map((item, index) => (
                <Box key={index} style={{ marginBottom: '40px' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                    <TextField
                        label="Description"
                        value={item.description || ''}
                        onChange={(e) => handleWorkItemChange(index, 'description', e.target.value)}
                        fullWidth
                        required
                    />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        select
                        label="Backlog Item"
                        value={item.BacklogItemDtoID}
                        onChange={(e) => handleWorkItemChange(index, 'BacklogItemDtoID', e.target.value)}
                        fullWidth
                      >
                        {formValues.backlogItems.map((backlog, i) => (
                          <MenuItem key={i} value={i}>
                            {backlog.itemName}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        select
                        label="Work Item Type"
                        value={item.workItemTypeID}
                        onChange={(e) => handleWorkItemChange(index, 'workItemTypeID', e.target.value)}
                        fullWidth
                        required
                      >
                        {workItemTypes.map((type) => (
                          <MenuItem key={type.workItemTypeID} value={type.workItemTypeID}>
                            {type.typeName}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={1}>
                      <Button variant="outlined" color="error" onClick={() => handleDeleteWorkItem(index)}>
                      Delete
                      </Button>
                    </Grid>
                  </Grid>
        
                  <Grid container spacing={2} style={{ marginTop: '-5px' }}>
                    <Grid item xs={5}>
                      <TextField
                        select
                        label="Definition Of Done"
                        variant="outlined"
                        fullWidth
                        value={item.definitionOfDoneID}
                        onChange={(e) => handleWorkItemChange(index, 'definitionOfDoneID', e.target.value)}
                      >
                        {formValues.definitionOfDone.map((DoD, index) => (
                          <MenuItem key={index} value={index}>
                            {DoD.constraintDescription}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        select
                        label="Acceptance Criteria"
                        variant="outlined"
                        fullWidth
                        value={item.acceptanceCriteriaID}
                        onChange={(e) => handleWorkItemChange(index, 'acceptanceCriteriaID', e.target.value)}
                      >
                        {formValues.acceptanceCriterias.map((acceptanceCriteria, index) => (
                          <MenuItem key={index} value={index}>
                            {acceptanceCriteria.constraintDescription}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={item.done || false}
                            onChange={(e) => handleWorkItemChange(index, 'done', e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Done"
                      />
                    </Grid>
                  </Grid>
        
                  <Grid container spacing={2} style={{ marginTop: '-5px' }}>
                    <Grid item xs={6}>
                    <Autocomplete
                        multiple
                        options={formValues.persons}
                        getOptionLabel={(person) => `${person.firstName} ${person.lastName} (${scrumRoles[person.roleID-1].roleName})`}
                        value={item.workingPersons}
                        onChange={(e, newValue) => handleWorkItemChange(index, 'workingPersons', newValue)}
                        renderInput={(params) => (
                          <TextField {...params} variant="outlined" label="Working Persons" fullWidth />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        select
                        label="Timebox"
                        value={item.TimeboxDtoID}
                        onChange={(e) => handleWorkItemChange(index, 'TimeboxDtoID', e.target.value)}
                        fullWidth
                      >
                        {formValues.timeboxes.map((timebox, i) => (
                          <MenuItem key={i} value={i}>
                            {timebox.timeboxDescription} ({timebox.duration}h)
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={2}>
                    <TextField
                          label="Deadline"
                          variant="outlined"
                          type="date"
                          value={item.deadline}
                          onChange={(e) => handleWorkItemChange(index, 'deadline', e.target.value)}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button variant="contained" color="primary" onClick={addWorkItem}>
                Add Work Item
              </Button>
            </Box>
          );

        case 9:
          return (
              <Box>
                  {formValues.increments.map((increment, index) => (
                      <Grid container spacing={2} key={index} style={{ marginBottom: '40px' }}>
                          <Grid item xs={5}>
                              <TextField
                                  label="Increment Description"
                                  variant="outlined"
                                  value={increment.description}
                                  onChange={(e) => handleIncrementChange(index, 'description', e.target.value)}
                                  fullWidth
                                  required
                              />
                          </Grid>
                          <Grid item xs={4}>
                              <TextField
                                  select
                                  label="Related Sprint"
                                  variant="outlined"
                                  value={increment.RelatedSprintDtoID}
                                  onChange={(e) => handleIncrementChange(index, 'RelatedSprintDtoID', e.target.value)}
                                  fullWidth
                                  required
                              >
                                  {/* Assuming you have a list of sprints to map over */}
                                  {formValues.sprints.map((sprint, index) => (
                                      <MenuItem key={sprint.sprintGoal} value={index}>
                                          {sprint.sprintGoal}
                                      </MenuItem>
                                  ))}
                              </TextField>
                          </Grid>
                          <Grid item xs={3}>
                              <TextField
                                  select
                                  label="Received By"
                                  variant="outlined"
                                  value={increment.ReceivedByPersonDtoID}
                                  onChange={(e) => handleIncrementChange(index, 'ReceivedByPersonDtoID', e.target.value)}
                                  fullWidth
                              >
                                  {/* Assuming you have a list of persons to map over */}
                                  {formValues.persons.map((person, index) => (
                                      <MenuItem key={person.firstName + person.lastName} value={index}>
                                          {person.firstName} {person.lastName} ({scrumRoles[person.roleID-1].roleName})
                                      </MenuItem>
                                  ))}
                              </TextField>
                          </Grid>
                          <Grid item xs={5}>
                            <Autocomplete
                              multiple
                              options={formValues.workItems.filter((item) => item.done === true)}
                              getOptionLabel={(option) => option.description || 'Unnamed Work Item'}
                              value={formValues.workItems.filter((_, i) => increment.workItems?.includes(i))}
                              onChange={(e, newValue) => {
                                const selectedIndexes = newValue.map((item) =>
                                  formValues.workItems.indexOf(item)
                                );
                                handleIncrementChange(index, 'workItems', selectedIndexes);
                              }}
                              renderInput={(params) => (
                                <TextField {...params} variant="outlined" label="Pick Work Items" fullWidth />
                              )}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <TextField
                            label="Deadline"
                            variant="outlined"
                            type="date"
                            value={increment.deadline}
                            onChange={(e) => handleIncrementChange(increment, 'deadline', e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                              <FormControlLabel
                                  control={
                                      <Checkbox
                                          checked={increment.relatedToSprintGoal}
                                          onChange={(e) => handleIncrementChange(index, 'relatedToSprintGoal', e.target.checked)}
                                          color="primary"
                                      />
                                  }
                                  label="Aligned with Sprint Goal"
                              />
                          </Grid>
                          <Grid item xs={2}>
                              <FormControlLabel
                                  control={
                                      <Checkbox
                                          checked={increment.relatedToProductGoal}
                                          onChange={(e) => handleIncrementChange(index, 'relatedToProductGoal', e.target.checked)}
                                          color="primary"
                                      />
                                  }
                                  label="Aligned with Product Goal"
                              />
                          </Grid>
                          <Grid item xs={1}>
                              <Button
                                  variant="outlined"
                                  color="error"
                                  onClick={() => handleDeleteIncrement(index)}
                                  fullWidth
                              >
                                  Delete
                              </Button>
                          </Grid>
                      </Grid>
                  ))}
                  <Button variant="contained" color="primary" onClick={addIncrement}>
                      Add Increment
                  </Button>
              </Box>
          );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Card style={{ textAlign: 'center', padding: '16px', height: '700px', display: 'flex', flexDirection: 'column' }}>
      <CardContent style={{ flexGrow: 1, overflow: 'auto' }}>
        <Typography style={{ paddingBottom: '16px' }} variant="h4">New Team Page</Typography>
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