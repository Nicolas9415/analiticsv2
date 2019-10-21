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
  const [puntosInteres, setPuntosInteres] = useState([]);
  const [bar, setBar] = useState([]);
  const [bar2, setBar2] = useState([]);
  const [puntos, setPuntos] = useState([]);

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
    // eslint-disable-next-line
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
    // eslint-disable-next-line
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
      if (e[0] !== "" )
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

  useEffect(() => {
    const obj = puntosInteres.reduce((acc, curr) => {
      acc.push({
        name: curr.nombre,
        raiting: curr.estrellas,
        address: curr.direccion
      });
      return acc;
    }, []);

    obj.sort((a, b) => {
      return b.raiting - a.raiting;
    });
    setPuntos(obj);
  }, [puntosInteres]);

  useEffect(() => {
    const arr = [0, 0, 0, 0, 0, 0, 0];
    const count = [0, 0, 0, 0, 0, 0, 0];
    if (rutas) {
      rutas.forEach(data => {
        const day = moment(data.timeStamp).weekday();
        if (data.calorias) {
          arr[day] += data.calorias;
          count[day] += 1;
        }
      });
    }
    const newData = [["Element", "Calories/weekDay", { role: "style" }]];
    for (let i = 0; i < arr.length; i++) {
      newData[i + 1] = [days[i], arr[i] / count[i], getRandomColor()];
    }
    setBar2(newData);
    // eslint-disable-next-line
  }, [rutas]);

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
              <TableCell>Average Burnt Calories per trip</TableCell>
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
        <div className="title">Avg burnt calories per day of week</div>

        <Chart
          chartType="ColumnChart"
          width="100%"
          height="400px"
          data={bar2}
        />
      </div>
      <Paper className={classes2.root}>
        <span className="tabletitle">
          Points of interest sorted by raiting (Best to Worst)
        </span>
        <Table className={classes.root}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.root}>Point of interest</TableCell>
              <TableCell className={classes.root}>Raiting</TableCell>
              <TableCell className={classes.root}>Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {puntos.length > 0 &&
              puntos.map(e => (
                <TableRow key={e.name}>
                  <TableCell>{e.name}</TableCell>
                  <TableCell>{e.raiting}</TableCell>
                  <TableCell>{e.address}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

export default App;
