import React from 'react';
import { useState } from 'react';
import './App.css';
import axios from 'axios';
const TRAINS_URL = 'https://rata.digitraffic.fi/api/v1/live-trains/station/'
const STATION_URL = 'https://rata.digitraffic.fi/api/v1/metadata/stations'

function App() {

  const [stationName, setStationName] = useState('')
  const [stationOfArrival, setStationOfAffival] = useState('')
  const [departure, setdeparture] = useState([])
  const [trainNumbers, setTrainNumbers] = useState([])
  const [arrivalTimes, setArrivalTimes] = useState([])
  let departureStationShortCode = ''
  let arrivalStationShortCode = ''
  let departureTime = []
  let trainNumber = []
  let arrivalTime = []
  let stationNameUpper=''
  let stationOfArrivalUpper=''

  const getTrains = async () => {
    try {
      const response = await axios.get(STATION_URL)
      const dataStations = await response.data
      /*Muuttaa aseman nimen ensimmäisen kirjaimen isoksi, jos se on kirjoitettu pienellä */
      stationNameUpper=stationName.charAt(0).toUpperCase()+ stationName.slice(1)
      /*Haetaan lähtöaseman asemakoodi. Tämä ei ole vielä huomioinut niitä kaupunkeja, joilla on monta lähtöasemaa(esim Oulu)*/
      dataStations.forEach(element => {
        if (element.stationName === stationNameUpper) {
          departureStationShortCode = element.stationShortCode
        }
      });
      /*Haetaan saapumisaseman asemakoodi */
      stationOfArrivalUpper=stationOfArrival.charAt(0).toUpperCase()+ stationOfArrival.slice(1)
      dataStations.forEach(element => {
        if (element.stationName === stationOfArrivalUpper) {
          arrivalStationShortCode = element.stationShortCode
        }
      });

      /*Hakee junan numerot ja lähtö- ja saapumisajan */
      const getTrainsResponse = await axios.get(TRAINS_URL + departureStationShortCode + '/' + arrivalStationShortCode)
      const dataGetTrains = getTrainsResponse.data
      dataGetTrains.forEach(element => {
        element.timeTableRows.forEach(i => {
          /*Lisätää listaan departureTime junan lähtöaika ja listaan trainNumber junan numerot  */
          if (i.stationShortCode === departureStationShortCode &&
            i.type === "DEPARTURE") {
            departureTime.push(new Date(i.scheduledTime).toLocaleTimeString())
            trainNumber.push(i.trainNumber)
          }
          /*Lisätään listaan arrivalTime junan saapumisaika */
          if (i.stationShortCode === arrivalStationShortCode &&
            i.type === "ARRIVAL") {
            arrivalTime.push(new Date(i.scheduledTime).toLocaleTimeString())

          }
        })
        setdeparture(departureTime)
        setTrainNumbers(trainNumber)
        setArrivalTimes(arrivalTime)
        /*console.log(departureTime)*/
      });
    } catch (err) {
      alert("Asemien välillä ei ole suoria junayhteyksiä");
    }
  }

  return (
    <div className='container'>
      <div>
        <h1>Juna</h1>
        <p>Kirjoita lähtöasema ja määränpää, niin saat junat, jotka menevät 24 tunnin sisällä asemien välillä.</p>
        <p>Tämä ohjelma näyttää vain suorat yhteydet.</p>   
        <p>Huomaa, että suurissa kaupungeissa on monta asemaa, joten laita suuren kaupungin nimen perään asema. 
          Esimerkiksi jos haluat hakea Oulusta lähteviä junia, niin kirjoita hakukenttään "Oulu asema".</p>   
      </div>
      <div>
        <div>
          <label>Kirjoita lähtöasema</label>
          <input type="text" value={stationName} onChange={e => setStationName(e.target.value)}></input>
        </div>
        <div>
          <label>Kirjoita määränpääasema</label>
          <input type="text" value={stationOfArrival} onChange={e => setStationOfAffival(e.target.value)}></input>
        </div>
        <button onClick={() => getTrains({ stationName }, { stationOfArrival })} >Hae
        </button>

        <table>
          <thead>
            <tr>
              <th>Lähtöaika</th>
              <th>Juna</th>
              <th>Saapumisaika</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <dl>{departure.map((time, index) => (
                  <dt key={index}>{time}</dt>
                ))}
                </dl>
              </td>
              <td>
                <dl>
                  {trainNumbers.map((train, index) => (
                    <dt key={index}>{train}</dt>
                  ))}
                </dl>
              </td>
              <td>
                <dl>
                  {arrivalTimes.map((arrivalTime, index) => (
                    <dt key={index}>{arrivalTime}</dt>
                  ))}
                </dl>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

}

export default App;
