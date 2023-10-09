import React, { useState } from 'react';
import Layout from '../src/components/Layout';
import GroupLeaderTable from '../src/components/GroupLeaderTable';
import AdminTable from '../src/components/AdminTable';
import AddGroupLeaderModule from '../src/components/AddGroupLeaderModule';
import utilStyles from "../src/styles/utils.module.scss";
import { Container, Button } from 'react-bootstrap';
import { UserData } from '../ultility/interfaces';
import AddUserModal from '../src/components/AddUserModule';

function HomePage() {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const addUser = async (userData: UserData) => {
    try {

      setShowModal(false); // Close the modal
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };
  return (

    <Layout>
      <Container className='page-section'>
        <h5 className={utilStyles.sectionTitleCenter}>Group Leader</h5>
        <p className={utilStyles.sectionSubTitleCenter}>
          The group leader is your main contact person at the business. Enter their details. The group leader will automatically receive a link to logon to their account,
          and will be able to add staff singly or in bulk. The reset password button will generate and send the link again if required.
        </p>
        <Button onClick={handleShowModal} className={`${utilStyles.mB20px} ${utilStyles.floatR}`}>Add Group Leader</Button>

        <GroupLeaderTable />
        <div className={utilStyles.pB50px}></div>
        <h5 className={utilStyles.sectionTitleCenter}>Admin</h5>
        <p className={utilStyles.sectionSubTitleCenter}>
          Add or delete ACT Government Sustainable Business Program team members to enable them access to the Admin console
        </p>
        <AdminTable />
        <AddGroupLeaderModule show={showModal} onHide={handleCloseModal} />
      </Container>
    </Layout>
  )
}

export default HomePage;
