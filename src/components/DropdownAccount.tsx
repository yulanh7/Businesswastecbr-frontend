import { Dropdown } from 'react-bootstrap';
import { RootState, useAppDispatch } from '../../store';
import { getUserScoreSlice } from '../../store/quizSlice';
import { useSelector } from 'react-redux';
import React, { useEffect } from 'react';

type UserInfoType = {
  userType: 'Admin' | 'Group Leader';
  firstName: string;
  // ... any other properties you expect on userInfo
} | null;


interface DropdownAccountProps {
  userInfo: UserInfoType;
  handleLogout: () => void;
}


function DropdownAccount({ userInfo, handleLogout }: DropdownAccountProps) {
  const dispatch = useAppDispatch();
  const { quizScore } = useSelector((state: RootState) => state.quiz);
  useEffect(() => {
    // This fetches the quiz data when the component mounts
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parseUserInfo = JSON.parse(userInfo);
      const payload = {
        userId: parseUserInfo.id,
      }
      dispatch(getUserScoreSlice(payload));
    }
  }, [dispatch]);

  return (
    <div>
      {
        userInfo && (

          <Dropdown className='nav-dropdown'>
            <Dropdown.Toggle variant="success">
              {userInfo.firstName}{`'s  Account`}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="/my_account?para=profile">Profile</Dropdown.Item>

              <Dropdown.Item href="/my_account?para=changePassword">Change Password</Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )
      }
    </div>
  );
}

export default DropdownAccount;