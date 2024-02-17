import React, { useState, useEffect } from "react";
import {
  Box,
  Checkbox,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import UnblockIcon from "@mui/icons-material/Block";
import { getUsers } from "../../firebase";

interface User {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  lastLoginDate: string;
  status: string;
}

const TablePage = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [users, setUsers] = useState<User[] | never[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      // Select all rows
    } else {
      // Deselect all rows
    }
  };

  const handleCheckboxClick = (id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  return (
    <Box>
      <Toolbar>
        <Typography variant="h6">Users</Typography>
        <IconButton>
          <BlockIcon />
        </IconButton>
        <IconButton>
          <UnblockIcon />
        </IconButton>
        <IconButton>
          <DeleteIcon />
        </IconButton>
      </Toolbar>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selected.length > 0 && selected.length < users.length
                  }
                  checked={selected.length === users.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>Identifier</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Registration Date</TableCell>
              <TableCell>Last Login Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user: User) => {
              console.log(user);
              return (
                <TableRow key={user.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.indexOf(user.id) !== -1}
                      onChange={() => handleCheckboxClick(user.id)}
                    />
                  </TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  {/* <TableCell>
        {new Date(user.metadata.creationTime).toISOString()}
      </TableCell>
      <TableCell>
        {new Date(user.metadata.lastSignInTime).toISOString()}
      </TableCell> */}

                  <TableCell>{user.status}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TablePage;
