import React,{Fragment} from 'react'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
const YearlyEarningsLeaderboard = ({leaderboard}) => {

  const theOverallYearlyEarnings = leaderboard.map((user, i)=>( 
    <Tr key={user.username}>

     <Td className='hide-sm'>{i+1}</Td>
    <Td className='hide-sm'>{user.username}</Td>
    <Td className ='hide-sm'>${user.yearlyEarnings}</Td>

    </Tr>
 ))

    return (
        <Fragment>
        <h2 className='my-2b' style={{ color: '#4f8737' }}>
            Yearly Earnings
        </h2>
        <div className='table-responsive'>
          <Table className='table table-dark table-bordered'>
    
            <Thead>
              <Tr>
                <Th className='hide-sm'>Place </Th>
                <Th className='hide-sm'>User</Th>
                <Th className='hide-sm'>YearlyEarnings</Th>
              </Tr>
            </Thead>
            <Tbody>{theOverallYearlyEarnings}</Tbody>
          </Table>
          </div> 
      </Fragment>
    )
}

export default YearlyEarningsLeaderboard
