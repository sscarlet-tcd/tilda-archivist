import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { AdminImport } from '../actions'
import { Dashboard } from '../components/Dashboard'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { get } from 'lodash'

const AdminImportView = (props) => {

  const dispatch = useDispatch()
  const importId = get(props, "match.params.importId", "")
  const imports = useSelector(state => state.imports);
  const importObj = get(imports, importId, { logs: [] })
  const logs = get(importObj, 'logs', [])
  const rows: RowsProp = Object.values(logs);

  useEffect(() => {
    dispatch(AdminImport.show(importId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <div style={{ height: 500, width: '100%' }}>
      <Dashboard title={'DDI Imports'}>
        <ul>
          <li>Filename : {importObj.filename}</li>
          <li>State : {importObj.state}</li>
          <li>Created At : {importObj.created_at}</li>
        </ul>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Input</TableCell>
              <TableCell>Matches</TableCell>
              <TableCell>Outcome</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.original_text}</TableCell>
                <TableCell>{row.matches}</TableCell>
                <TableCell>{row.outcome}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Dashboard>
    </div>
  );
}

export default AdminImportView;
