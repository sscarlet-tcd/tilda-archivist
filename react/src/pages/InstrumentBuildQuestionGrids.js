import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { QuestionGrids, CodeLists } from '../actions'
import { Dashboard } from '../components/Dashboard'
import { QuestionGridForm } from '../components/QuestionGridForm'
import { CreateNewBuildObjectButtons } from '../components/CreateNewBuildObjectButtons'
import { get, isNil } from "lodash";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useHistory } from 'react-router-dom';
import { reverse as url } from 'named-urls'
import routes from '../routes'
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  control: {
    width: '100%',
    padding: theme.spacing(2),
  },
  truncate: {
    width: 70,
    'white-space': 'nowrap',
    overflow: 'hidden',
    'text-overflow': 'ellipsis'
  }
}));

const InstrumentBuildQuestionGrids = (props) => {
  let history = useHistory();

  const dispatch = useDispatch()
  const classes = useStyles();
  const [questionGridId, setquestionGridId] = React.useState(get(props, "match.params.questionGridId", null));

  const instrumentId = get(props, "match.params.instrument_id", "")
  const questionGrids = useSelector(state => get(state.questionGrids, instrumentId, {}));
  const selectedQuestion = get(questionGrids, questionGridId, {used_by: []})

  useEffect(() => {
    dispatch(QuestionGrids.all(instrumentId, () => {
      if(!isNil(questionGridId)){
        // We have to retrieve the selected QuestionGrid because
        // of an unexplained issue where the selected QuestionGrid
        // was turning a blank rd when going through QuestionGrid.all
        // this does not happen when running QuestionGrid.show
        dispatch(QuestionGrids.show(instrumentId, questionGridId));
      }
    }));
    dispatch(CodeLists.all(instrumentId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(() => {
    dispatch(QuestionGrids.show(instrumentId, questionGridId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[questionGridId]);

  const QuestionGrid = (props) => {
    const {label, id} = props
    const classes = useStyles();

    return (
      <ListItem>
        <ListItemText
          className={classes.truncate} primary={label} onClick={()=>{handleQuestionSelection(id)}}/>
      </ListItem>
    )
  }

  const handleQuestionSelection = (id) => {
    const path = url(routes.instruments.instrument.build.questionGrids.show, { instrument_id: instrumentId, questionGridId: id })
    history.push(path);
    setquestionGridId(id)
  }

  return (
    <div style={{ height: 500, width: '100%' }}>
      <Dashboard title={instrumentId} instrumentId={instrumentId}>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <Paper className={classes.control}>
              <h2>Question Grids <Link to={url(routes.instruments.instrument.build.questionItems.all, { instrument_id: instrumentId })}>Question Items</Link></h2>
              <CreateNewBuildObjectButtons instrumentId={instrumentId} objectTypes={['QuestionItem', 'QuestionGrid']} callback={setquestionGridId} />
              <List dense={true}>
                {Object.values(questionGrids).map((questionGrid) => {
                  return <QuestionGrid label={questionGrid.label} id={questionGrid.id} />
                })}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={9}>
            {!isNil(selectedQuestion) && (
              <QuestionGridForm questionGrid={selectedQuestion} instrumentId={instrumentId} />
            )}
          </Grid>
        </Grid>
      </Dashboard>
    </div>
  );
}

export default InstrumentBuildQuestionGrids;