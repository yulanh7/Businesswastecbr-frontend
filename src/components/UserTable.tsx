import React, { useState, useEffect, useCallback } from 'react';
import { Button, Form, Table, Pagination } from 'react-bootstrap';
import utilStyles from "../styles/utils.module.scss";
import {
  fetchAllUsersSlice,
  updateUserSlice,
} from "../../store/userSlice"
import { RootState, useAppDispatch } from '../../store';
import { useSelector } from 'react-redux';
import { defaultUsersObject } from "../../ultility/interfaces";
import SortIcons from "./SortIcons";


const defaultUserProps = {
  userId: "",
  firstName: "",
  lastName: "",
  email: "",
}

interface Users {
  userId: string,
  firstName: string,
  lastName: string,
  email: string,
  streamsCompleted: number,
  quizScore: number,
}

interface UserTableProps {
  selectedUsers: string[];
  businessId?: string;
  setSelectedUsers: React.Dispatch<React.SetStateAction<string[]>>;
  handleDeleteSelectedClick: () => void;
  handleResetPWSelectedClick: () => void;
}

type UserInfoType = {
  userType: 'Admin' | 'Group Leader';
  firstName: string;
  // ... any other properties you expect on userInfo
} | null;



const UserTable: React.FC<UserTableProps> = ({
  selectedUsers,
  setSelectedUsers,
  businessId
}) => {
  const dispatch = useAppDispatch();

  const [userInfo, setUserInfo] = useState<UserInfoType>(null);
  const {
    allUsers:
    { records = [], pageIdx = 1, pageSize = 10, totalRecord = 0 } = defaultUsersObject,
    fetchUserLoading,
  } = useSelector((state: RootState) => state.user);

  const [page, setPage] = useState(1);
  const [editingUsersId, setEditingUsersId] = useState<string | null>(null);
  const [editingUsers, setEditingUsers] = useState<Map<string, Users>>(new Map());
  const [errors, setErrors] = useState(defaultUserProps);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const totalPages = Math.ceil(totalRecord / pageSize);
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    localStorage.setItem('normalUserPage', '1');
    if (storedUserInfo) {
      const parsedInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedInfo);
    }
  }, [])

  useEffect(() => {
    if (userInfo) {
      if (userInfo.userType === 'Admin') {
        if (businessId) {
          dispatch(fetchAllUsersSlice({ page, businessId }));
        }
      } else {
        dispatch(fetchAllUsersSlice({ page }));
      }
    }
  }, [userInfo, dispatch, page, businessId])


  const validateEditForm = (editedUsers: Users) => {
    let isValid = true;
    const newErrors = defaultUserProps;
    const fieldsToCheck: Array<keyof typeof defaultUserProps> = ['firstName', 'lastName', 'email'];
    fieldsToCheck.forEach(field => {
      if (editedUsers[field]?.trim() === '') {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleEditClick = useCallback((userId: string) => {
    setEditingUsersId(userId);
    const userToEdit = records.find((item: any) => item.userId === userId);
    if (userToEdit) {
      setEditingUsers(prevState => new Map(prevState).set(userId, { ...userToEdit }));
    }
  }, [records]);

  const handleCancelEdit = () => {
    setEditingUsersId(null);
  };

  const handleSaveEdit = async (userId: string) => {
    const editedUsers = editingUsers.get(userId);
    if (!editedUsers) {
      return;
    }
    if (validateEditForm(editedUsers) && userInfo) {
      if (userInfo.userType === 'Admin') {
        const payload = {
          firstName: editedUsers.firstName,
          lastName: editedUsers.lastName,
          email: editedUsers.email,
          userId: userId,
          businessId,
        };
        await dispatch(updateUserSlice(payload));
      } else {
        const payload = {
          firstName: editedUsers.firstName,
          lastName: editedUsers.lastName,
          email: editedUsers.email,
          userId: userId,
        };
        await dispatch(updateUserSlice(payload));
      }

      setEditingUsersId(null);
    }

  };


  useEffect(() => {
    if (userInfo) {
      if (userInfo.userType === 'Admin') {
        if (businessId) {
          dispatch(fetchAllUsersSlice({ page, businessId }));
        }
      } else {
        dispatch(fetchAllUsersSlice({ page }));
      }
    }
  }, [userInfo, dispatch, page, businessId])


  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    localStorage.setItem('normalUserPage', newPage.toString());
    dispatch(fetchAllUsersSlice({ page: newPage }));
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
    dispatch(fetchAllUsersSlice({
      page: 1,
      sortColumn: column,
      sortDirection: direction
    }));
  };

  return (
    <div className="scroll-section">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <Form.Check
                type="checkbox"
                checked={records && records.length > 0 && selectedUsers.length === records.length}
                onChange={() => {
                  let newSelectedUsers: string[] = [];
                  if (selectedUsers.length !== records.length) {
                    newSelectedUsers = records.map((leader: Users) => leader.userId);
                  }
                  setSelectedUsers(newSelectedUsers);
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
            <th>
              <div>
                Streams Completed
                <SortIcons
                  column="streamsCompleted"
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              </div>
            </th>
            <th>
              <div>
                Quiz Score
                <SortIcons
                  column="quizScore"
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
          {fetchUserLoading &&
            <tr>
              <td colSpan={5} className={utilStyles.loadingRow}>
                Loading...
              </td>
            </tr>
          }
          {records && records.length > 0 && !fetchUserLoading && records.map((user: Users, index: number) => (
            <tr key={user.userId}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedUsers.includes(user.userId)}  // Check if current user is selected
                  onChange={() => {
                    const newSelectedUsers = selectedUsers.includes(user.userId)
                      ? selectedUsers.filter(id => id !== user.userId)  // If currently selected, remove it from the selection
                      : [...selectedUsers, user.userId];  // If not selected, add to the selection
                    setSelectedUsers(newSelectedUsers);
                  }}
                />
              </td>
              <td>{index + 1}</td>
              <td>
                {editingUsersId === user.userId ? (
                  <>
                    <Form.Control
                      type="text"
                      defaultValue={user.firstName}
                      className={errors.firstName && 'is-invalid'}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        const updatedEditingusers = new Map(editingUsers);
                        const editeduser = updatedEditingusers.get(user.userId);
                        if (editeduser) {
                          editeduser.firstName = newValue;
                          updatedEditingusers.set(user.userId, editeduser);
                          setEditingUsers(updatedEditingusers);
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
                {editingUsersId === user.userId ? (
                  <>
                    <Form.Control
                      type="text"
                      defaultValue={user.lastName}
                      className={errors.lastName && 'is-invalid'}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        const updatedEditingusers = new Map(editingUsers);
                        const editeduser = updatedEditingusers.get(user.userId);
                        if (editeduser) {
                          editeduser.lastName = newValue;
                          updatedEditingusers.set(user.userId, editeduser);
                          setEditingUsers(updatedEditingusers);
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
                {editingUsersId === user.userId ? (
                  <>
                    <Form.Control
                      type="email"
                      defaultValue={user.email}
                      className={errors.email && 'is-invalid'}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        const updatedEditingusers = new Map(editingUsers);
                        const editeduser = updatedEditingusers.get(user.userId);
                        if (editeduser) {
                          editeduser.email = newValue;
                          updatedEditingusers.set(user.userId, editeduser);
                          setEditingUsers(updatedEditingusers);
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
                {user.streamsCompleted}
              </td>
              <td>
                {user.quizScore}
              </td>
              <td>
                {editingUsersId === user.userId ? (
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
          ))}
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

export default UserTable;