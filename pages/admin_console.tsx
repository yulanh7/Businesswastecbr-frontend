import React, { useState } from 'react';
import Layout from '../src/components/Layout';
import GroupLeaderTable from '../src/components/GroupLeaderTable';
import AdminTable from '../src/components/AdminTable';
import AddGroupLeaderModule from '../src/components/AddGroupLeaderModule';
import utilStyles from "../src/styles/utils.module.scss";
import { Container, Button } from 'react-bootstrap';
import AddAdminModule from '../src/components/AddAdminModule';
import { useAppDispatch } from '../store';
import { resetForm } from "../store/userSlice";

function HomePage() {
  const dispatch = useAppDispatch();
  const [showGLModal, setShowGLModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const handleShowGLModal = () => {
    dispatch(resetForm());
    setShowGLModal(true)
  };
  const handleCloseGLModal = () => setShowGLModal(false);
  const handleShowAdminModal = () => {
    dispatch(resetForm());
    setShowAdminModal(true)
  };
  const handleCloseAdminModal = () => setShowAdminModal(false);

  return (

    <Layout>
      <Container className='page-section'>
        <h5 className={utilStyles.sectionTitleCenter}>Group Leader</h5>
        <p className={utilStyles.sectionSubTitleCenter}>
          The group leader is your main contact person at the business. Enter their details. The group leader will automatically receive a link to logon to their account,
          and will be able to add staff singly or in bulk. The reset password button will generate and send the link again if required.
        </p>
        <Button onClick={handleShowGLModal} className={`${utilStyles.mB20px} ${utilStyles.floatR}`}>Add group leader</Button>

        <GroupLeaderTable />
        <div className={utilStyles.pB50px}></div>
        <h5 className={utilStyles.sectionTitleCenter}>Admin</h5>
        <p className={utilStyles.sectionSubTitleCenter}>
          Add or delete ACT Government Sustainable Business Program team members to enable them access to the Admin console
        </p>
        <Button onClick={handleShowAdminModal} className={`${utilStyles.mB20px} ${utilStyles.floatR}`}>Add admin</Button>
        <AdminTable />
        <AddGroupLeaderModule show={showGLModal} onHide={handleCloseGLModal} />
        <AddAdminModule show={showAdminModal} onHide={handleCloseAdminModal} />
      </Container>
    </Layout>
  )
}

export default HomePage;
