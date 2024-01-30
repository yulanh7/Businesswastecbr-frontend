import React from 'react';
import { useRouter } from 'next/router';
import GroupLeaderComponent from "../../../src/components/GroupLeaderComponent";
import { GetServerSideProps } from 'next';

interface GroupLeaderPageProps {
  businessId: string;
}

const GroupLeaderPage: React.FC<GroupLeaderPageProps> = ({ businessId }) => {
  return (
    <>
      <GroupLeaderComponent businessId={businessId} />
    </>
  )
}

export default GroupLeaderPage;

export const getServerSideProps: GetServerSideProps<GroupLeaderPageProps> = async (context) => {
  const { businessId } = context.query;
  return {
    props: {
      businessId: businessId as string,
    },
  };
}
