import React, { useState, useEffect } from "react";
import moment from "moment";
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
import Chart from "react-google-charts";

console.log(moment);

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
  const [, setPuntosInteres] = useState();
  const [bar, setBar] = useState([]);
  const [bar2, setBar2] = useState([]);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];
  useEffect(() => {
    //RFYcvR2DtSN4KfFV9F7vnjTbupE3
    db.collection("rutas")
      .doc("667oybZ1kGlTwwzfDGFV")
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

  useEffect(() => {
    const data = [0, 0, 0, 0, 0, 0, 0];
    if (rutas) {
      rutas.forEach(time => {
        const day = moment(time.timeStamp).weekday();
        data[day] += 1;
      });
    }
    const newData = [["Element", "User/weekDay", { role: "style" }]];
    for (let i = 0; i < data.length; i++) {
      newData[i + 1] = [days[i], data[i], getRandomColor()];
    }
    setBar(newData);
  }, [rutas]);

  useEffect(() => {
    const data = [0, 0, 0, 0, 0, 0, 0];
    if (rutas) {
      rutas.forEach(data => {
        const day = moment(data.timeStamp).weekday();
        if (data.calorias) data[day] += data.calorias;
      });
    }
    console.log(data);
    const newData = [["Element", "User/weekDay", { role: "style" }]];
    for (let i = 0; i < data.length; i++) {
      newData[i + 1] = [days[i], data[i], getRandomColor()];
    }
    setBar2(newData);
    console.log(newData);
  }, [rutas]);

  let coordsStart;
  if (rutas) {
    coordsStart = rutas.map(rute => [
      rute["latitudInicio"],
      rute["longitudInicio"]
    ]);
  }
  let coordsFinal;
  if (rutas) {
    coordsFinal = rutas.map(rute => [
      rute["latitudFinal"],
      rute["longitudFinal"]
    ]);
  }

  function getAvgDistance() {
    let a = 0;
    if (rutas)
      rutas.forEach(element => {
        if (element.duracion) a += element.duracion;
      });
    const ret = (a / rutas.length).toFixed(1);
    return isNaN(ret) ? 0 : ret;
  }
  function getCalories() {
    let a = 0;
    if (rutas)
      rutas.forEach(element => {
        if (element.calorias) a += element.calorias;
      });
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

  return (
    <div className="wrapper">
      {rutas.length > 0 && (
        <Map
          coordsInicio={coordsStart}
          coordsFinal={coordsFinal}
          className="map"
        />
      )}
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
      <div className="content">
        <div className="title">Avg cyclist per day of week</div>

        <Chart chartType="ColumnChart" width="100%" height="400px" data={bar} />
      </div>
      <div className="content">
        <div className="title">Avg cyclist per day of week</div>

        <Chart
          chartType="ColumnChart"
          width="100%"
          height="400px"
          data={bar2}
        />
      </div>
    </div>
  );
}

export default App;
