import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Instrument } from '../actions'
import { Dashboard } from '../components/Dashboard'
import { InstrumentHeading } from '../components/InstrumentHeading'
import { get } from "lodash";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';
import { Link } from 'react-router-dom';
import { reverse as url } from 'named-urls'
import routes from '../routes'
import { Alert, AlertTitle } from '@material-ui/lab';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  control: {
    width: '100%',
    padding: theme.spacing(2),
  }
}));

const InstrumentBuild = (props) => {

  const dispatch = useDispatch()
  const classes = useStyles();

  const instrumentId = get(props, "match.params.instrument_id", "")
  const instrument = useSelector(state => get(state.instruments, instrumentId));
  const stats = useSelector(state => get(state.instrumentStats, instrumentId, {}));

  const instrumentStats = get(stats, 'stats', {})
  const {
    categories=0, code_lists=0, response_domain_datetimes=0,
    response_domain_numerics=0, response_domain_texts=0,
    question_items=0, question_grids=0, instructions=0,
    cc_conditions=0, cc_loops=0, cc_questions=0, cc_sequences=0,
    cc_statements=0
  } = instrumentStats

  useEffect(() => {
    dispatch(Instrument.show(instrumentId));
    dispatch(Instrument.stats(instrumentId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const StatCount = (props) => {
    const {label, value} = props
    return (
      <ListItem>
        <ListItemText
          primary={label}/>
        <ListItemSecondaryAction>
          <Chip label={value} />
        </ListItemSecondaryAction>
      </ListItem>
    )
  }

  return (
    <div style={{ height: 500, width: '100%' }}>
      <Dashboard title={instrumentId} instrumentId={instrumentId}>
        <InstrumentHeading instrument={instrument} mode={'build'}/>
        {instrument && instrument.signed_off && (
          <div>
            <Alert severity="error">
              <AlertTitle>Read Only</AlertTitle>
              Instrument has been signed off so you can only view this as read-only.
            </Alert>
          </div>
        )}
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Paper className={classes.control}>
              <h2><Link to={url(routes.instruments.instrument.build.codeLists.all, { instrument_id: instrumentId })}>Code Lists</Link></h2>
              <List dense={true}>
                  <StatCount label="Categories" value={categories} />
                  <StatCount label="Code Lists" value={code_lists} />
              </List>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.control}>
              <h2><Link to={url(routes.instruments.instrument.build.responseDomains.all, { instrument_id: instrumentId })}>ResponseDomains</Link></h2>
              <List dense={true}>
                  <StatCount label="Datetime Answers" value={response_domain_datetimes} />
                  <StatCount label="Numeric Answers" value={response_domain_numerics} />
                  <StatCount label="Text Answers" value={response_domain_texts} />
              </List>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.control}>
              <h2><Link to={url(routes.instruments.instrument.build.questionItems.all, { instrument_id: instrumentId })}>Questions</Link></h2>
              <List dense={true}>
                  <StatCount label="Question Items" value={question_items} />
                  <StatCount label="Question Grids" value={question_grids} />
                  <StatCount label="Instructions" value={instructions} />
              </List>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.control}>
              <h2>
                {instrument && instrument.signed_off ? (
                  'Constructs'
                ) : (
                  <Link to={url(routes.instruments.instrument.build.constructs.show, { instrument_id: instrumentId })}>Constructs</Link>
                )}
              </h2>
              <List dense={true}>
                  <Link to={url(routes.instruments.instrument.build.ccConditions, { instrument_id: instrumentId })}>
                    <StatCount label="Conditions" value={cc_conditions} />
                  </Link>
                  <Link to={url(routes.instruments.instrument.build.ccLoops, { instrument_id: instrumentId })}>
                    <StatCount label="Loops" value={cc_loops} />
                  </Link>
                  <Link to={url(routes.instruments.instrument.build.ccQuestions, { instrument_id: instrumentId })}>
                    <StatCount label="Questions" value={cc_questions} />
                  </Link>
                  <Link to={url(routes.instruments.instrument.build.ccSequences, { instrument_id: instrumentId })}>
                    <StatCount label="Sequences" value={cc_sequences} />
                  </Link>
                  <Link to={url(routes.instruments.instrument.build.ccStatements, { instrument_id: instrumentId })}>
                    <StatCount label="Statements" value={cc_statements} />
                  </Link>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Dashboard>
    </div>
  );
}

export default InstrumentBuild;
