import React from 'react'

export default function TableTrains(props) {
    const departureTime = props.departureTime

  return (
    <div>
        <tr>
            <th>Lähtöaika asemalta: {props.departureStation} </th>
            <th> Saapumisaika asemalle: {props.arrivalStation}</th>
            <th>Junan numero</th>
        </tr>
        

    </div>
  )
}

