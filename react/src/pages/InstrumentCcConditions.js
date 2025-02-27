import React, {  } from 'react';
import { useDispatch } from 'react-redux'
import { CcConditions } from '../actions'
import { Dashboard } from '../components/Dashboard'
import { DataTable } from '../components/DataTable'
import { get } from 'lodash'

const InstrumentCcConditions = (props) => {

  const dispatch = useDispatch()
  const instrumentId = get(props, "match.params.instrument_id", "")

  const actions = (row) => {
    return ''
  }

  const headers = ["ID", "Literal", "Logic", "Label"]
  const rowRenderer = (row) => {
    return [row.id, row.literal, row.logic, row.label]
  }
  return (
    <div style={{ height: 500, width: '100%' }}>
      <Dashboard title={'CcConditions'} instrumentId={instrumentId}>
        <DataTable actions={actions}
          fetch={[dispatch(CcConditions.all(instrumentId))]}
          stateKey={'cc_conditions'}
          parentStateKey={instrumentId}
          searchKey={'literal'}
          headers={headers}
          sortKeys={[{ key: 'label', label: 'Label' }, { key: 'id', label: 'ID' }]}
          rowRenderer={rowRenderer}
          />
      </Dashboard>
    </div>
  );
}

export default InstrumentCcConditions;
