import React from 'react'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
const CompletedWagers = ({allTheWagers}) => {
    return (
        <div>
           
   <h2 className='my-2' style={{ color: '#4f8737' }}>
     Previous Wagers
   </h2>

   <div className='table-responsive'>
     <Table className='table table-dark table-bordered'>
       <Thead>
         <Tr>
           <Th className='hide-sm'>Challenger</Th>
           <Th className='hide-sm'>Challengee</Th>
           <Th className='hide-sm'>Game</Th>
           <Th className ='hide-sm'>Best Of</Th>
           <Th className='hide-sm'>Amount</Th>
           <Th className='hide-sm'>Description</Th>
           <Th className='hide-sm'>Date</Th>
           <Th className='hide-sm'>Outcome</Th>
         </Tr>
       </Thead>
       <tbody>{allTheWagers}</tbody>
     </Table>
   </div>

        </div>
    )
}

export default CompletedWagers


  