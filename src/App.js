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
  const [usuarios, setUsuarios] = useState();
  const [puntosInteres, setPuntosInteres] = useState([]);
  const [bar, setBar] = useState([]);
  const [bar2, setBar2] = useState([]);
  const [barHours, setBarHours] = useState([]);
  const [puntos, setPuntos] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [address, setAddress] = useState([]);
  const [barWeekdays, setBarWeekDays] = useState([]);
  const [barUsers, setBarUser] = useState([]);


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
    db.collection("markersMapa")
      .get()
      .then(e => {
        const data = e.docs.map(e => e.data());
        setMarkers(data);
      });
    // eslint-disable-next-line
  }, []);


  useEffect(() => {
    markers.forEach(mark => {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${mark.ubicacion._lat},${mark.ubicacion._long}&key=AIzaSyCqMkRlzo-OHKohU-0ovuLBbNvt6O4wczQ`
      fetch(url).then(e => {
        e.json().then(res => {
          setAddress(prevState => [
            ...prevState, [mark.descripcion, res.results[1]['formatted_address']]
          ]
          )
        })
      })
    })

  }, [markers])

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
  let coordsParada;
  if (rutas) {
    coordsParada = rutas.map(rute => [
      rute['latitudParada'],
      rute['longitudParada']
    ])
  }

  function getAvgTripTime() {
    let a = 0;
    if (rutas)
      rutas.forEach(element => {
        if (element.duracion) a += element.duracion;
      });
    const ret = (a / rutas.length).toFixed(1);
    return isNaN(ret) ? 0 : ret;
  }


  function getAvgDistance() {
    let a = 0;
    if (rutas)
      rutas.forEach(element => {
        if (element.distancia) a += element.distancia;
      });
    const ret = (a / rutas.length - 20).toFixed(1);
    return isNaN(ret) ? 0 : ret;
  }
  function getAvgAge() {
    let age = 0;
    if (usuarios) {
      usuarios.forEach(user => {
        age += moment().diff(user['fechaNacimiento'], 'years');

      })
      const val = (age / usuarios.length).toFixed(0)

      return val;
    }
    return 0;
  }
  function getAvgWeight() {
    let peso = 0;
    if (usuarios) {
      usuarios.forEach(user => {
        peso += user['peso']

      })
      const val = (peso / usuarios.length).toFixed(0)

      return val;
    }
    return 0;
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
  // const getStops = () => {
  //   const b = {};
  //   if (rutas) {
  //     const a = rutas.map(parada => {
  //       return parada.nombreParada;
  //     });

  //     for (let i = 0; i < a.length; i++) {
  //       b[a[i]] == null ? (b[a[i]] = 1) : (b[a[i]] += 1);
  //     }
  //   }

  //   const c = [];
  //   Object.entries(b).forEach(function (e) {
  //     if (e[0] !== "")
  //       c.push({ title: e[0], value: e[1], color: getRandomColor() });
  //   });

  //   return c;
  // };


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

  useEffect(() => {
    const arr = [];
    const data = [];
    if (usuarios) {
      usuarios.forEach(e => {
        arr.push(e.nombre)
      });
      usuarios.forEach((e, i) => {
        data[i] = e.contribuciones
      })
    }
    const newData = [["Element", "Contributions", { role: "style" }]];
    for (let i = 0; i < arr.length; i++) {
      newData[i + 1] = [arr[i], data[i], getRandomColor()];
    }
    setBarUser(newData);

  }, [usuarios])


  useEffect(() => {
    const arr = [0, 0];
    const week = ["WeekEnd", "Week"]
    if (rutas) {
      rutas.forEach(data => {
        const day = moment(data.timeStamp).weekday();
        day === 0 || day === 6 ?
          arr[0] += 1
          :
          arr[1] += 1
      })
    }
    const newData = [["Element", "Weekday/Weekend", { role: "style" }]];
    for (let i = 0; i < arr.length; i++) {
      newData[i + 1] = [week[i], arr[i], getRandomColor()];
    }
    setBarWeekDays(newData);
  }, [rutas]);

  useEffect(() => {
    const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
    const count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    if (rutas) {
      rutas.forEach(data => {
        const hour = moment(data.timeStamp).hour();
        count[hour] += 1;
      })
    }
    const newData = [["Element", "Cyclist/Hour", { role: "style" }]]

    for (let i = 0; i < hours.length; i++) {
      newData[i + 1] = [hours[i], count[i], getRandomColor()];
    }
    setBarHours(newData);
  }, [rutas])

  const classes = useStyles();
  const classes2 = useStyles2();

  return (
    <div className="wrapper">
      {rutas.length > 0 && (
        <Map
          coordsInicio={coordsStart}
          coordsFinal={coordsFinal}
          coordsParadas={coordsParada}
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
              <TableCell>{`${getAvgTripTime()} minutes`}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2</TableCell>
              <TableCell>Average Trip Distance</TableCell>
              <TableCell>{`${getAvgDistance()} km`}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>3</TableCell>
              <TableCell>Average Burnt Calories per trip</TableCell>
              <TableCell>{`${getCalories()}  calories`}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>4</TableCell>
              <TableCell>Average age of the users</TableCell>
              <TableCell>{`${getAvgAge()}  years`}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>5</TableCell>
              <TableCell>Average weight of the users</TableCell>
              <TableCell>{`${getAvgWeight()}  Kg`}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>

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
      <div className="content">
        <div className="title">Avg cyclist per hour</div>

        <Chart chartType="ColumnChart" width="100%" height="400px" data={barHours} />
      </div>
      <div className="content">
        <div className="title">Cyclist by week and weekend</div>

        <Chart chartType="ColumnChart" width="100%" height="400px" data={barWeekdays} />
      </div>
      <div className="content">
        <div className="title">Top contributors to the app</div>

        <Chart chartType="ColumnChart" width="100%" height="400px" data={barUsers} />
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
      <Paper className={classes2.root}>
        <span className="tabletitle">
          Routes that require mantainence
        </span>
        <Table className={classes.root}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.root}>Address</TableCell>
              <TableCell className={classes.root}>Problem</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {address.length > 0 &&
              address.map((e) => (
                <TableRow key={e[0]}>
                  <TableCell>{e[1]}</TableCell>
                  <TableCell>{e[0]}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

export default App;
