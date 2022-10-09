import React from 'react';
import { useState } from 'react';
import './App.css';
import axios from 'axios';
import TableTrains from './TableTrains'
const TRAINS_URL = 'https://rata.digitraffic.fi/api/v1/live-trains/station/'
const STATION_URL = 'https://rata.digitraffic.fi/api/v1/metadata/stations'

function App() {

  const [stationName, setStationName] = useState('')
  const [stationOfArrival, setStationOfAffival] = useState('')

  let departureStationShortCode = ''
  let arrivalStationShortCode = ''
  let departureTime = []
  let trainNumber = []
  let arrivalTime = []

  const getTrains = async () => {
    console.log(stationName)
    try {
      const response = await axios.get(STATION_URL)
      const dataStations = await response.data
      /*Haetaan lähtöaseman asemakoodi. Tämä ei ole vielä huomioinut niitä kaupunkeja, joilla on monta lähtöasemaa*/
      dataStations.forEach(element => {
        if (element.stationName === stationName) {
          console.log("if-lauseessa")
          console.log(element.stationName)
          console.log(element.stationShortCode)
          departureStationShortCode = element.stationShortCode
          console.log(departureStationShortCode)
        }
      });
      /*Haetaan saapumisaseman asemakoodi */
      dataStations.forEach(element => {
        if (element.stationName === stationOfArrival) {
          console.log("if-lauseessa2")
          console.log(element.stationName)
          console.log(element.stationShortCode)
          arrivalStationShortCode = element.stationShortCode
          console.log(arrivalStationShortCode)
        }
      });

        /*Hakee junan numerot ja lähtö- ja saapumisajan */
      const getTrainsResponse = await axios.get(TRAINS_URL + departureStationShortCode + '/' + arrivalStationShortCode)
      console.log(getTrainsResponse)
      const dataGetTrains = getTrainsResponse.data
      console.log(dataGetTrains)
      dataGetTrains.forEach(element => {
        console.log('hep', element.timeTableRows[0])
        element.timeTableRows.forEach(i => {
          /*console.log('i on', i)*/
          /*Lisätää listaan departureTime junan lähtöaika ja listaan trainNumber junan numerot  */
          if (i.stationShortCode === departureStationShortCode &&
            i.type === "DEPARTURE") {
            departureTime.push(i.scheduledTime)
            trainNumber.push(i.trainNumber)
            console.log(departureTime)
            console.log(trainNumber)
            return departureTime, trainNumber
          }
          /*Lisätään listaan arrivalTime junan saapumisaika */
          if (i.stationShortCode === arrivalStationShortCode &&
            i.type === "ARRIVAL") {
            arrivalTime.push(i.scheduledTime)
            console.log(arrivalTime)
            return arrivalTime
          }
        })
      });
    } catch (err) {
      alert(err);
    }
    return departureTime, trainNumber,arrivalTime
  }

console.log()
  return (
    <>
      <div><h1>Juna</h1></div>
      <div>
        <label>Valitse lähtö asema</label>
        <input type="text" value={stationName} onChange={e => setStationName(e.target.value)}></input>
        <label>Kirjoita määränpääasema</label>
        <input type="text" value={stationOfArrival} onChange={e => setStationOfAffival(e.target.value)}></input>
        <button onClick={() => getTrains({ stationName }, { stationOfArrival })} >Hae
        </button>
        <output>
          <TableTrains
          departureStation= {stationName}
          arrivalStation={stationOfArrival}/>
        </output>

      </div>
    </>
  );

}

export default App;
