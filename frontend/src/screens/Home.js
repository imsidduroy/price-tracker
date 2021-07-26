import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Alert from '@material-ui/lab/Alert';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import axios from "axios";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="#">
        Price Tracker
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Home() {
  const classes = useStyles();
  const [email, setEmail] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [submit, setSubmit] = React.useState("NOT_DONE");
  //0-not submitted --- 1-pending --- 2-submitted

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setSubmit("PENDING");
      const data = await axios.post("/api/", {
        email,
        url,
        price,
      });
      setSubmit("DONE");
      console.log("responce came", data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {submit === 'PENDING' && <Alert severity="warning">Please wait - Subscribing to the product !!</Alert>}
        {submit === 'DONE' && <Alert onClose={() => {setSubmit('NOT_DONE')}}>Sucessfully subscribed !!</Alert>}
        <Avatar className={classes.avatar}>
          <TrendingDownIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Price Tracker
        </Typography>
        <form className={classes.form} noValidate onSubmit={submitHandler}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="url"
            label="Enter the URL of the product"
            type="URL"
            id="url"
            autoComplete="current-password"
            onChange={(e) => setUrl(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="price"
            label="Enter the price you want in INR"
            type="number"
            id="price"
            onChange={(e) => setPrice(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Subscribe
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
