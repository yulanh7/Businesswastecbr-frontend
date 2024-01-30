import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Table, Pagination } from 'react-bootstrap';
// import { formatDateForInput, formatDatetimeLocal, formatDatetimeLocalForInput, formatDate } from "../../utils/utils";
import utilStyles from "../styles/utils.module.scss";
import {
  fetchAllAdminSlice,
  bulkDeleteAdminSlice,
  bulkResetPWAdminSlice,
  updateAdminSlice,
  resetForm
} from "../../store/userSlice"
import { RootState, useAppDispatch } from '../../store';
import { useSelector } from 'react-redux';
import { defaultUsersObject } from "../../ultility/interfaces";
import SortIcons from "./SortIcons";


const defaultAdminProps = {
  userId: "",
  firstName: "",
  lastName: "",
  email: "",
}

interface Admin {
  userId: string,
  firstName: string,
  lastName: string,
  email: string,
  userType: string,

}

interface AdminTableProps {
  allAdmin: Admin[];
}

const AdminTable: React.FC = () => {
  const { allAdmin, fetchUserLoading } = useSelector((state: RootState) => state.user);

  const dispatch = useAppDispatch();
  const [selectedAdmin, setSelectedAdmin] = useState<string[]>([]);
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<Map<string, Admin>>(new Map());
  const [errors, setErrors] = useState<{
    businessName?: string,
    businessType?: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    userType?: string,
  }>({});
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    dispatch(fetchAllAdminSlice({}));
  }, [dispatch]);


  const validateEditForm = (editedAdmin: Admin) => {
    let isValid = true;
    const newErrors: {
      firstName?: string,
      lastName?: string,
      email?: string,
    } = {};

    if (editedAdmin.firstName.trim() === '') {
      newErrors.firstName = 'First Name is required';
      isValid = false;
    }
    if (editedAdmin.lastName.trim() === '') {
      newErrors.lastName = 'Last Name is required';
      isValid = false;
    }
    if (editedAdmin.email.trim() === '') {
      newErrors.email = 'Email is required';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleEditClick = (userId: string) => {
    setEditingAdminId(userId);
    const allAdminToEdit = allAdmin.find((item: Admin) => item.userId === userId);
    if (allAdminToEdit) {
      const updatedEditingAdmin = new Map(editingAdmin);
      updatedEditingAdmin.set(userId, { ...allAdminToEdit });
      setEditingAdmin(updatedEditingAdmin);
    }
  };


  const handleCancelEdit = () => {
    setEditingAdminId(null);
  };

  const handleSaveEdit = async (userId: string) => {
    const editedAdmin = editingAdmin.get(userId);

    if (!editedAdmin) {
      return;
    }
    if (validateEditForm(editedAdmin)) {
      const payload = {
        firstName: editedAdmin.firstName,
        lastName: editedAdmin.lastName,
        email: editedAdmin.email,
        userId: userId,
      };
      await dispatch(updateAdminSlice(payload));
      setEditingAdminId(null);
    }

  };


  const handleDeleteSelectedClick = async () => {
    if (!selectedAdmin || selectedAdmin.length === 0) {
      alert('Please select at least one admin.');
      return;
    }
    const confirmDelete = window.confirm(`Are you sure you want to delete selected admins?`);
    if (confirmDelete) {
      await dispatch(bulkDeleteAdminSlice({ userIds: selectedAdmin }));
      setSelectedAdmin([]);

      dispatch(fetchAllAdminSlice({}));
    }
  };

  const handleResetPWSelectedClick = async () => {
    if (!selectedAdmin || selectedAdmin.length === 0) {
      alert('Please select at least one admin.');
      return;
    }
    const confirmDelete = window.confirm(`Are you sure you want to reset the password of the selected admins?`);
    if (confirmDelete) {
      await dispatch(bulkResetPWAdminSlice({ userIds: selectedAdmin }));
      setSelectedAdmin([]);
    }
  };




  const handleSort = (column: string, direction: "asc" | "desc") => {
    setSortColumn(column);
    setSortDirection(direction);
    dispatch(fetchAllAdminSlice({
      sortColumn: column,
      sortDirection: direction
    }));
  };

  return (
    <div>
      <div className='table-action'>
        <Button variant="danger" onClick={handleDeleteSelectedClick}>
          Delete
        </Button>
        <Button variant="warning" onClick={() => handleResetPWSelectedClick()}>Reset password</Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <Form.Check
                type="checkbox"
                checked={allAdmin && allAdmin.length > 0 && selectedAdmin.length === allAdmin.length}
                onChange={() => {
                  let newSelectedLeaders: string[] = [];
                  if (selectedAdmin.length !== allAdmin.length) {
                    newSelectedLeaders = allAdmin.map((leader: Admin) => leader.userId);
                  }
                  setSelectedAdmin(newSelectedLeaders);
                }}
              />

            </th>
            <th>#</th>
            <th>
              <div>
                First Name
                <SortIcons
                  column="firstName"
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              </div>
            </th>
            <th>
              <div>
                Last Name
                <SortIcons
                  column="lastName"
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              </div>
            </th>
            <th>
              <div>
                Email
                <SortIcons
                  column="email"
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              </div>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {!fetchUserLoading && allAdmin && allAdmin.length > 0 ? (
            // If data is loaded, show the data
            allAdmin.map((user: Admin, index: number) => (
              <tr key={user.userId}>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={selectedAdmin.includes(user.userId)}  // Check if current user is selected
                    onChange={() => {
                      const newSelectedLeaders = selectedAdmin.includes(user.userId)
                        ? selectedAdmin.filter(id => id !== user.userId)  // If currently selected, remove it from the selection
                        : [...selectedAdmin, user.userId];  // If not selected, add to the selection
                      setSelectedAdmin(newSelectedLeaders);
                    }}
                  />
                </td>
                <td>{index + 1}</td>
                <td>
                  {editingAdminId === user.userId ? (
                    <>
                      <Form.Control
                        type="text"
                        defaultValue={user.firstName}
                        className={errors.firstName && 'is-invalid'}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          const updatedEditingusers = new Map(editingAdmin);
                          const editeduser = updatedEditingusers.get(user.userId);
                          if (editeduser) {
                            editeduser.firstName = newValue;
                            updatedEditingusers.set(user.userId, editeduser);
                            setEditingAdmin(updatedEditingusers);
                          }
                        }}
                      />
                      {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                    </>
                  ) : (
                    user.firstName
                  )}
                </td>
                <td>
                  {editingAdminId === user.userId ? (
                    <>
                      <Form.Control
                        type="text"
                        defaultValue={user.lastName}
                        className={errors.lastName && 'is-invalid'}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          const updatedEditingusers = new Map(editingAdmin);
                          const editeduser = updatedEditingusers.get(user.userId);
                          if (editeduser) {
                            editeduser.lastName = newValue;
                            updatedEditingusers.set(user.userId, editeduser);
                            setEditingAdmin(updatedEditingusers);
                          }
                        }}
                      />
                      {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                    </>
                  ) : (
                    user.lastName
                  )}
                </td>
                <td>
                  {editingAdminId === user.userId ? (
                    <>
                      <Form.Control
                        type="email"
                        defaultValue={user.email}
                        className={errors.email && 'is-invalid'}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          const updatedEditingusers = new Map(editingAdmin);
                          const editeduser = updatedEditingusers.get(user.userId);
                          if (editeduser) {
                            editeduser.email = newValue;
                            updatedEditingusers.set(user.userId, editeduser);
                            setEditingAdmin(updatedEditingusers);
                          }
                        }}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </>
                  ) : (
                    user.email
                  )}
                </td>



                <td>
                  {editingAdminId === user.userId ? (
                    <>
                      <div className={utilStyles.pB10px}>
                        <Button variant="success" onClick={() => handleSaveEdit(user.userId)} className={utilStyles.tableButton}>
                          Save
                        </Button>
                      </div>
                      <Button variant="secondary" size="sm" onClick={handleCancelEdit} className={utilStyles.tableButton}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button variant="info" onClick={() => handleEditClick(user.userId)} className={`${utilStyles.tableButton}`} >
                      Edit
                    </Button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            // If no data is available, show a no data message
            <tr>
              <td colSpan={12} style={{ textAlign: 'center' }}>
                No data available
              </td>
            </tr>
          )}



        </tbody>
      </Table >

    </div>

  );
};

export default AdminTable;