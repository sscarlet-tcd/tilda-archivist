import React, { useState } from 'react';
import { get, isNil, difference } from "lodash";
import { Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux'
import { CcQuestions } from '../actions'
import { ObjectStatusBar, ObjectStatus } from '../components/ObjectStatusBar'
import { DeleteObjectButton } from '../components/DeleteObjectButton'
import { ObjectCheckForInitialValues } from '../support/ObjectCheckForInitialValues'
import arrayMutators from 'final-form-arrays'
import { OnChange } from 'react-final-form-listeners'
import { makeStyles } from '@material-ui/core/styles';
import { ObjectColour } from '../support/ObjectColour';
import {
  Autocomplete
} from '@material-ui/lab';

import {
  TextField,
  Select
} from 'mui-rff';
import {
  Paper,
  Grid,
  Button,
  CssBaseline,
  MenuItem
} from '@material-ui/core';


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  paper:{
    boxShadow :`5px 5px 15px 5px  #${ObjectColour('question')}`
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
      type: 'select',
      size: 12,
      field: (options) => (
        <Select
          name="question_type"
          label="Type"
          required={true}
          formControlProps={{ margin: 'none' }}
        >
          <MenuItem></MenuItem>
          <MenuItem value='QuestionItem'>Item</MenuItem>
          <MenuItem value='QuestionGrid'>Grid</MenuItem>
        </Select>
      )
  }
];

export const CcQuestionForm = (props) => {
  const {ccQuestion, instrumentId, onChange, path, onDelete, onCreate} = props;

  const questions = useSelector(state => state.cc_questions);
  const cc_questions = get(questions, instrumentId, {})
  const allQuestionItems = useSelector(state => state.questionItems);
  const questionItems = get(allQuestionItems, instrumentId, {})
  const allQuestionGrids = useSelector(state => state.questionGrids);
  const questionGrids = get(allQuestionGrids, instrumentId, {})

  const allResponseUnits = useSelector(state => state.response_units);
  const responseUnits = get(allResponseUnits, instrumentId, {})

  const [questionOptions, setQuestionOptions] = useState((ccQuestion.question_type === 'QuestionGrid') ? questionGrids : questionItems);

  const changeQuestionOptions = (question_type) => {
    setQuestionOptions((question_type === 'QuestionGrid') ? questionGrids : questionItems)
  }

  const dispatch = useDispatch();
  const classes = useStyles();

  const status = ObjectStatus(ccQuestion.id || 'new', 'CcQuestion')

  const onSubmit = (values) => {
    values = ObjectCheckForInitialValues(ccQuestion, values)
    if(isNil(ccQuestion.id)){
      dispatch(CcQuestions.create(instrumentId, values, (newObject) => {
        onChange({node: { ...values, ...newObject  }, path: path})
        onCreate()
      }))
    }else{
      dispatch(CcQuestions.update(instrumentId, ccQuestion.id, values, (newObject) => {
        onChange({ node: values, path: path })
      }))
    }
  }

  const intervieweeOptions = () => {
    const allOptions = ['Cohort/sample member','Main parent of cohort/sample member','Partner of main parent/Father','Child of cohort/panel member','Proxy','Interviewer','Other']
    const rdOptions = Object.values(responseUnits).map(item => {return item.label})
    return difference(allOptions, rdOptions);
  }

  return (
    <div style={{ padding: 16, margin: 'auto', maxWidth: 1000 }}>
      <ObjectStatusBar id={ccQuestion.id || 'new'} type={'CcQuestion'} />
      <CssBaseline />
      <Form
        onSubmit={onSubmit}
        initialValues={ccQuestion}
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
                <OnChange name="question_type">
                  {(value, previous) => {
                    changeQuestionOptions(value)
                    values.question_type = value
                  }}
                </OnChange>
                <Grid item xs="12" key="question">
                  <Autocomplete
                    freesolo="true"
                    options={Object.values(questionOptions)}
                    getOptionLabel={(option) => option.label}
                    onChange={(event, value, reason) => {
                      values.question_id = value?.id
                    }}
                    value={Object.values(questionOptions).find((q)=>{return q.id === values.question_id})}
                    getOptionSelected={(option, value) => {
                      return option.id == value
                    }}
                    renderInput={(params) => (
                      <TextField name={`question_id`}
                        {...params}
                        variant="outlined"
                        label="Question"
                        placeholder="Question"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs="12" key="response_unit_id">
                  <Select
                    name="response_unit_id"
                    label="Interviewee"
                    required={true}
                    formControlProps={{ margin: 'none' }}
                  >
                    <MenuItem></MenuItem>
                    {Object.values(responseUnits).map((item, idx) => (
                      <MenuItem value={item.id}>{item.label}</MenuItem>
                    ))}
                    {intervieweeOptions().map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </Select>
                </Grid>
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
                <DeleteObjectButton id={values.id} instrumentId={instrumentId} action={CcQuestions} onDelete={()=> { onDelete({ path }) }} />
              </Grid>
            </Paper>
          </form>
        )}
      />
    </div>
  );
}
