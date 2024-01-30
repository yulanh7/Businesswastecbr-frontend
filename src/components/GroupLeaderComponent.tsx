import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import UserTable from './UserTable';
import Link from "next/link";
import { Container, Button } from 'react-bootstrap';
import AddUserModal from './AddUserModule';
import InformationModule from './InformationModule';
import utilStyles from "../styles/utils.module.scss";
import {
  bulkAddNormalUsersSlice,
  resetForm,
  bulkDeleteUsersSlice,
  fetchAllUsersSlice,
  bulkResetPWUsersSlice,
  fetchABusinessSlice
} from "../../store/userSlice";
import { RootState, useAppDispatch } from '../../store';
import pageStyles from "../styles/page.module.scss";
import { useSelector } from 'react-redux';
import { defaultUsersObject } from "../../ultility/interfaces";
import Banner from "./Banner";

interface GroupLeaderComponentProps {
  businessId?: string
}

type UserInfoType = {
  userType: 'Admin' | 'Group Leader';
  firstName: string;
  // ... any other properties you expect on userInfo
} | null;

function GroupLeaderComponent({ businessId }: GroupLeaderComponentProps) {
  const dispatch = useAppDispatch();
  const {
    allUsers:
    { records = [], pageSize = 10, totalRecord = 0 } = defaultUsersObject,
    bulkAddUserMessage,
    submitUserLoading,
    submitUserError,
    business
  } = useSelector((state: RootState) => state.user);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showImage, setShowImage] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfoType>(null);

  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(totalRecord / pageSize);


  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    localStorage.setItem('normalUserPage', '1');
    if (storedUserInfo) {
      const parsedInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedInfo);
    }
  }, [])

  useEffect(() => {
    if (businessId) {
      dispatch(fetchABusinessSlice(businessId))
    }
  }, [])

  const handleShowModal = () => {
    dispatch(resetForm());
    setShowModal(true)
  };
  const handleCloseModal = () => setShowModal(false);
  const handleCloseImgModal = () => setShowImage(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
    setErrorMessage(null);
  };
  const handleResetForm = () => {
    dispatch(resetForm());
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const handleFileUpload = () => {
    if (!selectedFile) {
      setErrorMessage('No file selected. Please select a file before uploading.');
      return;
    }
    if (selectedFile) {
      setErrorMessage(null); // Reset error message if there is a file selected
      if (userInfo) {
        if (userInfo.userType === 'Admin') {
          if (businessId) {
            const payload = {
              file: selectedFile,
              businessId
            }
            dispatch(bulkAddNormalUsersSlice(payload));
          }
        } else {
          const payload = {
            file: selectedFile,
          }
          dispatch(bulkAddNormalUsersSlice(payload));
        }
      }
      resetFileInput();

    }
  };

  const handleDeleteSelectedClick = async () => {
    dispatch(resetForm());
    resetFileInput();
    if (!selectedUsers || selectedUsers.length === 0) {
      alert('Please select at least one user.');
      return;
    }
    const confirmDelete = window.confirm(`Are you sure you want to delete selected users?`);
    if (confirmDelete) {
      if (userInfo) {
        if (userInfo.userType === 'Admin') {
          if (businessId) {
            await dispatch(bulkDeleteUsersSlice({ userIds: selectedUsers, businessId }));
          }
        } else {

          await dispatch(bulkDeleteUsersSlice({ userIds: selectedUsers }));
        }
      }
      setSelectedUsers([]);
      if (page === totalPages && selectedUsers.length === records.length) {
        let newPage = page - 1;
        // Set new page
        setPage(newPage);
        // Update local storage and fetch data for the new page
        localStorage.setItem('normalUserPage', newPage.toString());
        if (userInfo) {
          if (userInfo.userType === 'Admin') {
            if (businessId) {
              const payload = {
                file: selectedFile,
                businessId
              }
              dispatch(fetchAllUsersSlice({ page: newPage, businessId }));
            }
          } else {
            const payload = {
              file: selectedFile,
            }
            dispatch(fetchAllUsersSlice({ page: newPage }));
          }
        }
      }
    }
  };

  const handleResetPWSelectedClick = async () => {
    dispatch(resetForm());
    resetFileInput();

    if (!selectedUsers || selectedUsers.length === 0) {
      alert('Please select at least one user.');
      return;
    }
    const confirmDelete = window.confirm(`Are you sure you want to reset the password of the selected users?`);
    if (confirmDelete) {
      if (userInfo) {
        if (userInfo.userType === 'Admin') {
          if (businessId) {
            await dispatch(bulkResetPWUsersSlice({ userIds: selectedUsers, businessId }));
          }
        } else {
          await dispatch(bulkResetPWUsersSlice({ userIds: selectedUsers }));
        }
      }
      setSelectedUsers([]);
    }
  };

  const resetFileInput = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Layout>
      <Banner screen="lg">
        <ul>
          <li>
            Enter all staff who require access to training, either as individuals or in bulk.

          </li>
          <li>
            To upload in bulk, use the Choose file button to upload an
            <span className={pageStyles.infoText} onClick={() => setShowImage(true)}>excel spreadsheet</span>
            <InformationModule show={showImage} onHide={handleCloseImgModal} />
            with three columns,
            containing staff details: First Name, Last Name and Email.
            Omit the headings from the spreadsheet.
          </li>
          <li>
            Staff will automatically receive an email with a link to reset their password
          </li>

        </ul>
      </Banner>
      <Container className="page-section">
        {business &&
          <p className={pageStyles.businessTitle}>
            / <Link href='/admin_console'>Admin Console</Link> / {business && business.businessName}
          </p>
        }
        <div className={pageStyles.userTableAction}>
          <div className={`${utilStyles.mB10px}`}>
            <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} disabled={submitUserLoading} onClick={handleResetForm} ref={fileInputRef}
            />
            <Button
              onClick={handleFileUpload} disabled={submitUserLoading}
              className={utilStyles.mR10px}
            >
              {submitUserLoading ? 'Loading' : 'Add users in bulk'}
            </Button>
            <Button variant="deepDark" onClick={handleShowModal}>Add a user</Button>

            <div className={utilStyles.mB10px}>
              {bulkAddUserMessage && bulkAddUserMessage.failedCount !== 0 && (
                <div>
                  Success to add <b className="success-message">{bulkAddUserMessage.successCount} </b>users,
                  and failed to add <b className="error-message">{bulkAddUserMessage.failedCount} </b>users.
                  <div className="error-message">
                    {`"${bulkAddUserMessage.duplicateEmails}"`} are already registered in the system.
                  </div>
                </div>
              )}
              {bulkAddUserMessage && !bulkAddUserMessage.failedCount && (
                <div className="success-message">
                  Add users successfully.
                </div>
              )}
              {submitUserError && (
                <div className="error-message">{submitUserError}</div>
              )}
              {errorMessage && (
                <div className="error-message">
                  {errorMessage}
                </div>
              )}
            </div>
          </div>
          <div className="table-action">
            <Button variant="danger" onClick={handleDeleteSelectedClick}>Delete</Button>
            <Button variant="warning" onClick={handleResetPWSelectedClick}>Reset password</Button>
          </div>

        </div>
        {businessId ?
          <>
            <UserTable
              businessId={businessId}
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
              handleDeleteSelectedClick={handleDeleteSelectedClick}
              handleResetPWSelectedClick={handleResetPWSelectedClick}
            />
            <AddUserModal show={showModal} onHide={handleCloseModal} businessId={businessId} />

          </>
          :
          <>
            <UserTable
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
              handleDeleteSelectedClick={handleDeleteSelectedClick}
              handleResetPWSelectedClick={handleResetPWSelectedClick}
            />
            <AddUserModal show={showModal} onHide={handleCloseModal} />

          </>
        }

      </Container>
    </Layout>
  );
}

export default GroupLeaderComponent;
