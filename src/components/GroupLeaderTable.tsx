import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Table, Pagination } from 'react-bootstrap';
// import { formatDateForInput, formatDatetimeLocal, formatDatetimeLocalForInput, formatDate } from "../../utils/utils";
import utilStyles from "../styles/utils.module.scss";
import {
  fetchAllGroupLeadersSlice,
  updateGroupLeaderSlice,
  bulkDeleteGroupLeadersSlice,
  bulkResetPWGroupLeadersSlice,
  resetForm
} from "../../store/userSlice"
import { RootState, useAppDispatch } from '../../store';
import { useSelector } from 'react-redux';
import { defaultUsersObject } from "../../ultility/interfaces";
import SortIcons from "./SortIcons";


interface GroupLeader {
  userId: string,
  businessName: string,
  businessType: string,
  firstName: string,
  lastName: string,
  email: string,
  userType: string,
  totalUser: number,
  trainingPercentage: number,
  totalEmployees: number,
  trainedEmployees: number,
}

interface GroupLeaderTableProps {
  allGroupLeaders: GroupLeader[];
}

const GroupLeaderTable: React.FC = () => {
  const {
    allGroupLeaders:
    { records = [], pageIdx = 1, pageSize = 10, totalRecord = 0 } = defaultUsersObject,
    fetchUserLoading
  } = useSelector((state: RootState) => state.user);
  const totalPages = Math.ceil(totalRecord / pageSize);

  const dispatch = useAppDispatch();
  const [selectedLeaders, setSelectedLeaders] = useState<string[]>([]);
  const [editingGroupLeaderId, setEditingGroupLeaderId] = useState<string | null>(null);
  const [editingGroupLeader, setEditingGroupLeader] = useState<Map<string, GroupLeader>>(new Map());
  const [page, setPage] = useState(1);
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
    localStorage.setItem('groupLeaderPage', '1');
    dispatch(fetchAllGroupLeadersSlice({ page }));
  }, [dispatch]);


  const validateEditForm = (editedGroupLeader: GroupLeader) => {
    let isValid = true;
    const newErrors: {
      firstName?: string,
      lastName?: string,
      email?: string,
    } = {};

    if (editedGroupLeader.firstName.trim() === '') {
      newErrors.firstName = 'First Name is required';
      isValid = false;
    }
    if (editedGroupLeader.lastName.trim() === '') {
      newErrors.lastName = 'Last Name is required';
      isValid = false;
    }
    if (editedGroupLeader.email.trim() === '') {
      newErrors.email = 'Email is required';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleEditClick = (userId: string) => {
    setEditingGroupLeaderId(userId);
    const allGroupLeadersToEdit = records.find((item: GroupLeader) => item.userId === userId);
    if (allGroupLeadersToEdit) {
      const updatedEditingGroupLeader = new Map(editingGroupLeader);
      updatedEditingGroupLeader.set(userId, { ...allGroupLeadersToEdit });
      setEditingGroupLeader(updatedEditingGroupLeader);
    }
  };


  const handleCancelEdit = () => {
    setEditingGroupLeaderId(null);
  };

  const handleSaveEdit = async (userId: string) => {
    const editedGroupLeader = editingGroupLeader.get(userId);

    if (!editedGroupLeader) {
      return;
    }
    if (validateEditForm(editedGroupLeader)) {
      const payload = {
        firstName: editedGroupLeader.firstName,
        lastName: editedGroupLeader.lastName,
        email: editedGroupLeader.email,
        userId: userId,
      };
      await dispatch(updateGroupLeaderSlice(payload));
      setEditingGroupLeaderId(null);
    }

  };


  const handleDeleteSelectedClick = async () => {
    if (!selectedLeaders || selectedLeaders.length === 0) {
      alert('Please select at least one group leader.');
      return;
    }
    const confirmDelete = window.confirm(`Are you sure you want to delete selected group leaders?`);
    if (confirmDelete) {
      await dispatch(bulkDeleteGroupLeadersSlice({ userIds: selectedLeaders }));
      setSelectedLeaders([]);
      // Check if it's the last page and all items are selected to be deleted
      if (page === totalPages && selectedLeaders.length === records.length) {
        let newPage = page - 1;
        // Set new page
        setPage(newPage);
        // Update local storage and fetch data for the new page
        localStorage.setItem('groupLeaderPage', newPage.toString());
        dispatch(fetchAllGroupLeadersSlice({ page: newPage }));
      }
    }
  };

  const handleResetPWSelectedClick = async () => {
    if (!selectedLeaders || selectedLeaders.length === 0) {
      alert('Please select at least one group leader.');
      return;
    }
    const confirmDelete = window.confirm(`Are you sure you want to reset the password of the selected group leaders?`);
    if (confirmDelete) {
      await dispatch(bulkResetPWGroupLeadersSlice({ userIds: selectedLeaders }));
      setSelectedLeaders([]);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    localStorage.setItem('groupLeaderPage', newPage.toString());
    dispatch(fetchAllGroupLeadersSlice({ page: newPage }));
  };

  const generatePageItems = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Pagination.Item key={i} active={i === page} onClick={() => handlePageChange(i)}>
          {i}
        </Pagination.Item>
      );
    }
    return pages;
  };

  const handleSort = (column: string, direction: "asc" | "desc") => {
    setSortColumn(column);
    setSortDirection(direction);
    dispatch(fetchAllGroupLeadersSlice({
      page: 1,
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
        <Button variant="warning" onClick={() => handleResetPWSelectedClick()}>Reset Password</Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <Form.Check
                type="checkbox"
                checked={records && records.length > 0 && selectedLeaders.length === records.length}
                onChange={() => {
                  let newSelectedLeaders: string[] = [];
                  if (selectedLeaders.length !== records.length) {
                    newSelectedLeaders = records.map((leader: GroupLeader) => leader.userId);
                  }
                  setSelectedLeaders(newSelectedLeaders);
                }}
              />

            </th>
            <th>#</th>
            <th>
              <div>
                Business Name
                <SortIcons
                  column="businessName"
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              </div>
            </th>

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

            <th>
              <div>
                No.
                <SortIcons
                  column="totalEmployees"
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              </div>
            </th>
            <th>
              <div>
                %
                <SortIcons
                  column="trainingPercentage"
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
          {!fetchUserLoading && records && records.length > 0 ? (
            // If data is loaded, show the data
            records.map((user: GroupLeader, index: number) => (
              <tr key={user.userId}>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={selectedLeaders.includes(user.userId)}  // Check if current user is selected
                    onChange={() => {
                      const newSelectedLeaders = selectedLeaders.includes(user.userId)
                        ? selectedLeaders.filter(id => id !== user.userId)  // If currently selected, remove it from the selection
                        : [...selectedLeaders, user.userId];  // If not selected, add to the selection
                      setSelectedLeaders(newSelectedLeaders);
                    }}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{user.businessName}</td>
                <td>
                  {editingGroupLeaderId === user.userId ? (
                    <>
                      <Form.Control
                        type="text"
                        defaultValue={user.firstName}
                        className={errors.firstName && 'is-invalid'}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          const updatedEditingusers = new Map(editingGroupLeader);
                          const editeduser = updatedEditingusers.get(user.userId);
                          if (editeduser) {
                            editeduser.firstName = newValue;
                            updatedEditingusers.set(user.userId, editeduser);
                            setEditingGroupLeader(updatedEditingusers);
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
                  {editingGroupLeaderId === user.userId ? (
                    <>
                      <Form.Control
                        type="text"
                        defaultValue={user.lastName}
                        className={errors.lastName && 'is-invalid'}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          const updatedEditingusers = new Map(editingGroupLeader);
                          const editeduser = updatedEditingusers.get(user.userId);
                          if (editeduser) {
                            editeduser.lastName = newValue;
                            updatedEditingusers.set(user.userId, editeduser);
                            setEditingGroupLeader(updatedEditingusers);
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
                  {editingGroupLeaderId === user.userId ? (
                    <>
                      <Form.Control
                        type="email"
                        defaultValue={user.email}
                        className={errors.email && 'is-invalid'}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          const updatedEditingusers = new Map(editingGroupLeader);
                          const editeduser = updatedEditingusers.get(user.userId);
                          if (editeduser) {
                            editeduser.email = newValue;
                            updatedEditingusers.set(user.userId, editeduser);
                            setEditingGroupLeader(updatedEditingusers);
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
                  {
                    user.trainedEmployees && (
                      <span>
                        {user.trainedEmployees}
                      </span>
                    )
                  }
                  {
                    user.totalEmployees && (
                      <span>
                        /{user.totalEmployees}
                      </span>
                    )
                  }
                </td>
                <td>
                  {user.trainingPercentage}
                </td>

                <td>
                  {editingGroupLeaderId === user.userId ? (
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
      <Pagination>
        <Pagination.Prev
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        />
        {generatePageItems()}
        <Pagination.Next
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages} // You'll need to calculate `totalRecord` based on your data
        />
      </Pagination>
    </div>

  );
};

export default GroupLeaderTable;