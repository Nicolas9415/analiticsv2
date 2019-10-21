import React, { useState, useEffect } from "react";
import Map from "./Maps/Maps";
import db from "./Analytics";
import "./styles/map.css";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import PieChart from "react-minimal-pie-chart";

const useStyles = makeStyles({
  root: {
    overflowX: "auto",
    color: "Black"
  },
  table: {
    minWidth: 650
  }
});

const useStyles2 = makeStyles({
  root: {
    margin: "1rem",
    width: "35vw",
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)"
  }
});

function App() {
  const [rutas, setRutas] = useState([]);
  const [, setUsuarios] = useState();
  const [puntosInteres, setPuntosInteres] = useState();

  useEffect(() => {
    db.collection("rutas")
      .doc("RFYcvR2DtSN4KfFV9F7vnjTbupE3")
      .collection("rutas")
      .get()
      .then(e => {
        const data = e.docs.map(e => e.data());
        setRutas(data);
      });

    db.collection("puntosInteres")
      .get()
      .then(e => {
        const data = e.docs.map(e => e.data());
        setPuntosInteres(data);
      });
    db.collection("usuarios")
      .get()
      .then(e => {
        const data = e.docs.map(e => e.data());
        setUsuarios(data);
      });
  }, []);

  let coordsPOI;
  if (puntosInteres) {
    coordsPOI = puntosInteres.map(points => points["coordenadas"]);
  }

  function getAvgDistance() {
    let a = 0;
    if (rutas) rutas.forEach(element => (a += element.duracion));
    const ret = (a / rutas.length / 60).toFixed(1);
    return isNaN(ret) ? 0 : ret;
  }
  function getCalories() {
    let a = 0;
    if (rutas) rutas.forEach(element => (a += element.calorias));
    const ret = (a / rutas.length).toFixed(2);
    return isNaN(ret) ? 0 : ret;
  }
  const getStops = () => {
    const b = {};
    if (rutas) {
      const a = rutas.map(parada => {
        return parada.nombreParada;
      });

      for (let i = 0; i < a.length; i++) {
        b[a[i]] == null ? (b[a[i]] = 1) : (b[a[i]] += 1);
      }
    }

    const c = [];
    Object.entries(b).forEach(function(e) {
      if (e[0] !== "")
        c.push({ title: e[0], value: e[1], color: getRandomColor() });
    });

    return c;
  };
  const getRandomColor = () => {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  getAvgDistance();
  const classes = useStyles();
  const classes2 = useStyles2();

  return rutas.length > 0 ? (
    <div className="wrapper">
      <div className="content">
        <div className="title">Heat Map points of interest</div>
        <Map coords={coordsPOI} className="map" />
      </div>

      <Paper className={classes2.root}>
        <span className="tabletitle">Averages of different statistics</span>
        <Table className={classes.root}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.root}>ID</TableCell>

              <TableCell className={classes.root}>Data Name</TableCell>
              <TableCell className={classes.root}>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>Average Trip Time</TableCell>
              <TableCell>{`${getAvgDistance()} minutes`}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2</TableCell>
              <TableCell>Average Burnt Calories</TableCell>
              <TableCell>{`${getCalories()}  calories`}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
      <div className="content">
        <div className="title">Pie chart of the most visited stops</div>

        <PieChart
          animate
          animationDuration={500}
          style={{ height: "50vh" }}
          data={getStops()}
        />
      </div>
    </div>
  ) : null;
}

export default App;
