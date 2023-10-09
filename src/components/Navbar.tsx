// components/ResponsiveNavbar.tsx
import React, { useEffect, useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { useRouter } from 'next/router';
import DropdownAccount from "./DropdownAccount";

type UserInfoType = {
  userType: 'Admin' | 'Group Leader';
  firstName: string;
  // ... any other properties you expect on userInfo
} | null;



const ResponsiveNavbar: React.FC = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string | null>(router.pathname);

  const [userInfo, setUserInfo] = useState<UserInfoType>(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');

    if (storedUserInfo) {
      const parsedInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedInfo);
    }
  }, [])

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      setActiveSection(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    // Clean up the event listener when the component is unmounted
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);



  const isActive = (sectionId: string) => {
    return sectionId === activeSection ? 'active' : '';
  };


  const handleLogout = async () => {
    try {
      router.push('/login')
      localStorage.removeItem("userInfo"); // Clear userInfo from local storage
      localStorage.removeItem("token"); // Clear userInfo from local storage
      setUserInfo(null); // Set userInfo state to null
    } catch (error) {
      // Handle error
    }
  };

  return (
    <Navbar expand="lg">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link className={isActive('/')} href="/">
            HOME
          </Nav.Link>
          {userInfo &&
            <Nav.Link className={isActive('/training')} href="/training">
              TRAINING
            </Nav.Link>
          }
          {userInfo && userInfo.userType === 'Admin' &&
            <Nav.Link className={isActive('/admin_console')} href="/admin_console">
              ADMIN CONSOLE
            </Nav.Link>
          }
          {userInfo && userInfo.userType === "Group Leader" &&
            <Nav.Link className={isActive('/group_leader')} href="/group_leader">
              Group Leader
            </Nav.Link>
          }
          {userInfo && userInfo.firstName ?
            <DropdownAccount userInfo={userInfo} handleLogout={handleLogout} />
            : <Nav.Link className={isActive('/login')} href="/login">
              Login
            </Nav.Link>
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default ResponsiveNavbar;
