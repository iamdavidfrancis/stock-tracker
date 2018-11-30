import React, { Component } from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import './App.css';
import About from './components/About';
import Stocks from './components/Stocks';

const styles = (theme: any) => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  layout: {
    width: 'auto',
    margin: theme.spacing.unit * 3,
  },
  footer: {
    padding: theme.spacing.unit * 6,
    textAlign: "center" as any,
  },
});

class App extends Component<any, {}> {
  render() {
    const { classes } = this.props;
    const homeLink = (props: any) => <Link to="/" {...props} />;
    const aboutLink = (props: any) => <Link to="/about" {...props} />;

    return (
      <Router>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" color="inherit" className={classes.grow}>
                Stocks
              </Typography>
              <Button component={homeLink} color="inherit">Home</Button>
              <Button component={aboutLink} color="inherit">About</Button>
            </Toolbar>
          </AppBar>
          <main>
            <div className={classes.layout}>
              <Switch>
                <Route exact={true} path="/" component={Stocks} />
                <Route exact={true} path="/about" component={About} />
              </Switch>
            </div>
          </main>
          <footer className={classes.footer}>
            <div>
              Copyright &copy; 2018
            </div>
            <span className="iex-footer">
              Data provided for free by <a href="https://iextrading.com/developer">IEX</a>. View <a href="https://iextrading.com/api-exhibit-a/">IEX's Terms of Use</a>
            </span>
          </footer>
        </div>
      </Router>
    );
  }
}

export default withStyles(styles)(App);
