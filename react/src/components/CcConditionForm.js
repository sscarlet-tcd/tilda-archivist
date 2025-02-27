import React from 'react';
import { isNil } from "lodash";
import { Form } from 'react-final-form';
import { useDispatch } from 'react-redux'
import { CcConditions } from '../actions'
import { ObjectStatusBar, ObjectStatus } from '../components/ObjectStatusBar'
import { DeleteObjectButton } from '../components/DeleteObjectButton'
import { ObjectCheckForInitialValues } from '../support/ObjectCheckForInitialValues'
import arrayMutators from 'final-form-arrays'
import { makeStyles } from '@material-ui/core/styles';
import { ObjectColour } from '../support/ObjectColour'

import {
  TextField} from 'mui-rff';
import {
  Paper,
  Grid,
  Button,
  CssBaseline} from '@material-ui/core';


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  paper:{
    boxShadow :`5px 5px 15px 5px  #${ObjectColour('condition')}`
  }
});

const validate = (values) => {

  const errors = {};

  if (!values.label) {
    errors.label = 'Required';
  }

  return errors;
};

const formFields = [
  {
    size: 12,
    field: (
      <TextField
        label="Label"
        name="label"
        margin="none"
        required={true}
        multiline
      />
    ),
  },
  {
    size: 12,
    field: (
      <TextField
        label="Literal"
        name="literal"
        margin="none"
        required={true}
        multiline
      />
    ),
  },
  {
    size: 12,
    field: (
      <TextField
        label="Logic"
        name="logic"
        margin="none"
        multiline
      />
    ),
  },
];

export const CcConditionForm = (props) => {
  const {ccCondition, instrumentId, onChange, path, onDelete, onCreate} = props;

  const dispatch = useDispatch();
  const classes = useStyles();

  const status = ObjectStatus(ccCondition.id || 'new', 'CcCondition')

  const onSubmit = (values) => {
    values = ObjectCheckForInitialValues(ccCondition, values)

    if(isNil(ccCondition.id)){
      dispatch(CcConditions.create(instrumentId, values, (newObject) => {
        onChange({node: { ...values, ...newObject  }, path: path})
        onCreate()
      }))
    }else{
      dispatch(CcConditions.update(instrumentId, ccCondition.id, values, (newObject) => {
        onChange({ node: values, path: path })
      }))
    }
  }

  return (
    <div style={{ padding: 16, margin: 'auto', maxWidth: 1000 }}>
      <ObjectStatusBar id={ccCondition.id || 'new'} type={'CcCondition'} />
      <CssBaseline />
      <Form
        onSubmit={onSubmit}
        initialValues={ccCondition}
        validate={(values) => validate(values)}
        mutators={{
          ...arrayMutators
        }}
        render={({
        handleSubmit,
        form: {
          mutators: { push, pop }
        }, // injected from final-form-arrays above
        pristine,
        form,
        submitting,
        values
      }) => (
          <form onSubmit={handleSubmit} noValidate>
            <Paper style={{ padding: 16 }} className={classes.paper}>
              <Grid container alignItems="flex-start" spacing={2}>
                {formFields.map((item, idx) => (
                  <Grid item xs={item.size} key={idx}>
                    {item.type && item.type === 'select'
                      ? item.field([])
                      : item.field
                    }
                  </Grid>
                ))}
                <Grid item style={{ marginTop: 16 }}>
                  <Button
                    type="button"
                    variant="contained"
                    onClick={form.reset}
                    disabled={submitting || pristine}
                  >
                    Reset
                  </Button>
                </Grid>
                <Grid item style={{ marginTop: 16 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={submitting}
                  >
                    Submit
                  </Button>
                </Grid>
                <DeleteObjectButton id={values.id} instrumentId={instrumentId} action={CcConditions} onDelete={()=> { onDelete({ path }) }}/>
              </Grid>
            </Paper>
          </form>
        )}
      />
    </div>
  );
}
