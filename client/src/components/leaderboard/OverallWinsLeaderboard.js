import React,{Fragment} from 'react'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
const OverallWinsLeaderboard = ({leaderboard}) => {
 
  const theOverallWins = leaderboard.map((user, i)=>( 
    <Tr key={user.username}>

     <Td className='hide-sm'>{i+1}</Td>
    <Td className='hide-sm'>{user.username}</Td>
    <Td className ='hide-sm'>{user.won}</Td>

    </Tr>
 ))
  
  
  return (
        <Fragment>
        <h2 className='my-2b' style={{ color: '#4f8737' }}>
            Overall Wins
        </h2>
        <div className='table-responsive'>
          <Table className='table table-dark table-bordered'>
    
            <Thead>
              <Tr>
                <Th className='hide-sm'>Place </Th>
                <Th className='hide-sm'>User</Th>
                <Th className='hide-sm'>Wins</Th>
              </Tr>
            </Thead>
            <Tbody>{theOverallWins}</Tbody>
          </Table>
          </div> 
      </Fragment>
    )
}

export default OverallWinsLeaderboard
