import React, { useContext } from 'react';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Typography
} from '@mui/material';

import { GlobalContext } from '../../../context/GlobalContext';

const StepCommunication = ({ formValues, handleChange }) => {
  const { scrumRoles } = useContext(GlobalContext);

  const persons = formValues.persons || [];

  // If fewer than 2 persons, no matrix needed
  if (persons.length < 2) {
    return (
      <Box>
        <Typography variant="subtitle1">
          Not enough persons for a communication matrix.
        </Typography>
      </Box>
    );
  }

  // communicationMatrix = [{ SourcePersonID, TargetPersonID }, ...]
  const communicationMatrix = formValues.communicationMatrix || [];

  // Updated: Check if there's a link in either direction (row->col OR col->row)
  const isPairChecked = (rowIndex, colIndex) =>
    communicationMatrix.some(
      (item) =>
        (item.SourcePersonID === rowIndex && item.TargetPersonID === colIndex) ||
        (item.SourcePersonID === colIndex && item.TargetPersonID === rowIndex)
    );

  // Toggle the link in both directions to keep them in sync
  const togglePair = (rowIndex, colIndex, checked) => {
    let updatedMatrix = [...communicationMatrix];

    if (checked) {
      // Add row->col if missing
      if (
        !updatedMatrix.some(
          (item) =>
            item.SourcePersonID === rowIndex &&
            item.TargetPersonID === colIndex
        )
      ) {
        updatedMatrix.push({
          SourcePersonID: rowIndex,
          TargetPersonID: colIndex
        });
      }
      // Add col->row if missing
      if (
        !updatedMatrix.some(
          (item) =>
            item.SourcePersonID === colIndex &&
            item.TargetPersonID === rowIndex
        )
      ) {
        updatedMatrix.push({
          SourcePersonID: colIndex,
          TargetPersonID: rowIndex
        });
      }
    } else {
      // Remove row->col if present
      updatedMatrix = updatedMatrix.filter(
        (item) =>
          !(
            (item.SourcePersonID === rowIndex &&
              item.TargetPersonID === colIndex) ||
            (item.SourcePersonID === colIndex &&
              item.TargetPersonID === rowIndex)
          )
      );
    }

    handleChange('communicationMatrix', updatedMatrix);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Communication Matrix
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Click the checkbox to indicate that there is communication
        between the person in the row and the person in the column.
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            {persons.map((person, colIndex) => (
              <TableCell key={colIndex} align="center">
                {person.firstName} {person.lastName}
                <br />
                (
                {(person.roleID - scrumRoles.length > 0
                  ? formValues.scrumRoles[person.roleID - scrumRoles.length - 1].roleName
                  : scrumRoles[person.roleID - 1].roleName)}
                )
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {persons.map((rowPerson, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell component="th" scope="row">
                {rowPerson.firstName} {rowPerson.lastName}
                <br />
                (
                {(rowPerson.roleID - scrumRoles.length > 0
                  ? formValues.scrumRoles[rowPerson.roleID - scrumRoles.length - 1].roleName
                  : scrumRoles[rowPerson.roleID - 1].roleName)}
                )
              </TableCell>

              {persons.map((colPerson, colIndex) => {
                // If it's the same person => diagonal => disabled
                if (colIndex === rowIndex) {
                  return (
                    <TableCell key={colIndex} align="center">
                      <Checkbox disabled />
                    </TableCell>
                  );
                }

                // Otherwise, show a real checkbox
                const checked = isPairChecked(rowIndex, colIndex);

                return (
                  <TableCell key={colIndex} align="center">
                    <Checkbox
                      checked={checked}
                      onChange={(e) =>
                        togglePair(rowIndex, colIndex, e.target.checked)
                      }
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default StepCommunication;
