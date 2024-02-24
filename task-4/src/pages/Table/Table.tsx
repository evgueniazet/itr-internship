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
import UnblockIcon from "@mui/icons-material/CheckCircle";
import { getUsers, blockUser, deleteUser, unblockUser } from "../../firebase";
import { IUser } from "../../interfaces/IUser";

const TablePage = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);

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
    const checked = event.target.checked;
    const allUserIds = users.map((user) => user.id);
  
    const newSelected = checked ? allUserIds : [];
  
    setSelected(newSelected);
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

  const handleBlockSelectedUsers = async () => {
    try {
      for (const id of selected) {
        await blockUser(id);
      }
      const updatedUsers = users.map((user) =>
        selected.includes(user.id) ? { ...user, status: "blocked" } : user
      );
      setUsers(updatedUsers);
      setSelected([]);
    } catch (error) {
      console.error("Error blocking selected users:", error);
    }
  };

  const handleDeleteSelectedUsers = async () => {
    try {
      for (const id of selected) {
        await deleteUser(id);
      }
      const updatedUsers = users.filter((user) => !selected.includes(user.id));
      setUsers(updatedUsers);
      setSelected([]);
    } catch (error) {
      console.error("Error deleting selected users:", error);
    }
  };

  const handleUnblockSelectedUsers = async () => {
    try {
      for (const id of selected) {
        await unblockUser(id);
      }
      const updatedUsers = users.map((user) =>
        selected.includes(user.id) ? { ...user, status: "active" } : user
      );
      setUsers(updatedUsers);
      setSelected([]);
    } catch (error) {
      console.error("Error unblocking selected users:", error);
    }
  };

  return (
    <Box>
      <Toolbar>
        <Typography variant="h6">Users</Typography>
        <IconButton onClick={handleBlockSelectedUsers}>
          <BlockIcon />
        </IconButton>
        <IconButton onClick={handleUnblockSelectedUsers}>
          <UnblockIcon />
        </IconButton>
        <IconButton onClick={handleDeleteSelectedUsers}>
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
            {users.map((user: IUser) => {
              const registrationDate = new Date(
                user.registrationDate.seconds * 1000 +
                  user.registrationDate.nanoseconds / 1000000
              );
              const lastLoginDate = new Date(
                user.lastLoginDate.seconds * 1000 +
                  user.lastLoginDate.nanoseconds / 1000000
              );

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
                  <TableCell>{registrationDate.toString()}</TableCell>
                  <TableCell>{lastLoginDate.toString()}</TableCell>
                  <TableCell>
                    {user.status === "blocked" ? user.status : "active"}
                  </TableCell>
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