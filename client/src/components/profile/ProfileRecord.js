import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import moment from 'moment';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

const ProfileRecord = ({
  profile: {
    user: { won, lost },
  },
}) => {
  const record = (
    <Tr key={123}>
      <Td className='hide-sm'>{won}</Td>
      <Td className='hide-sm'>{lost}</Td>
    </Tr>
  );
  return (
    <Fragment>
      
      <div className='profile-record bg-light p-2'>
      <h2 className='my-2' style={{color: '#4f8737'}}>Wager Record</h2>
      <Table className='table'>
        <Thead>
          <Tr>
            <Th className='hide-sm'>WINS</Th>
            <Th className='hide-sm'>LOSSES</Th>
          </Tr>
        </Thead>
        <Tbody>{record}</Tbody>
      </Table>
      </div>
    </Fragment>
  );
};

ProfileRecord.propTypes = {};

export default ProfileRecord;
