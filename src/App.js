import React from 'react-leaflet';
import {
  MapContainer,
  TileLayer,
  Polygon
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {statesData} from './data'
import './App.css';
import Box from '@mui/material/Box';
import swal from 'sweetalert2';
import { useEffect, useState } from 'react';


const center = [7.821221738698522, 80.61444800959343];

export default function App() {
  const [Data, setApiData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/user/data");
        const data = await response.json();
        console.log("data", data)
        setApiData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);

  }, []);
  return (
    <MapContainer
    center={center}
    zoom={10}
    style={{width: '100vw', height:'100vh'}}
    >
      <TileLayer
        url = "https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=TK4BGpSEnupmlYv7W20b"
        attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
      />
      {
        statesData.features.map((state) => {
          const coordinates = state.geometry.coordinates[0].map((item) => [item[1],item[0]]);

          return (<Box>
            <Polygon
              pathOptions={{
                fillColor: "#D6DAC8",
                fillOpacity: 0.5,
                weight: 1,
                opacity: 9,
                dashArray: 1,
                color: "white",
              }}
              positions={coordinates}
              eventHandlers={{
                mouseover: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    fillColor: "#FFEBB2",
                    fillOpacity: 0.5,
                    weight: 4,
                    opacity: 9,
                    dashArray: 1,
                    color: "white",
                  });
                },
                mouseout: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    fillColor: "#D6DAC8",
                    fillOpacity: 0.5,
                    weight: 1,
                    opacity: 9,
                    dashArray: 1,
                    color: "white",
                  });
                },
                click: async (e) => {
                  const { temp, humidity, airPressure } = Data.find(dataitem => dataitem.cityName === state.properties.electoralDistrict) || {};
                  // const backgroundGif = await getBackgroundGif(temperature, humidity, airPressure);
                  // const bgimg = await getBackgroundImage(temperature, humidity, airPressure);
                  // const opacity = 0.8;


                  await swal.fire({
                    title: state.properties.electoralDistrict,
                    // title: "Hello",
                    width: 600,
                    padding: "3em",
                    customClass: {
                      title: "swal-title",
                      htmlContainer: "swal-html-container",
                    },
                    html: `
                          <div class="swal-html-content">
                               <div class="weather-info">
                                 <div class="weather-info-item">
                                 <span class="info-label"><b>Temperature:</b></span>
                                 <span class="info-value"><b>${temp || 'N/A'}</b></span>
                                 </div>
                             <div class="weather-info-item">
                               <span class="info-label"><b>Humidity:</b></span>
                               <span class="info-value"><b>${humidity || 'N/A'}</b></span>
                             </div>
                             <div class="weather-info-item">
                             <span class="info-label"><b>Air Pressure:</b></span>
                             <span class="info-value"><b>${airPressure || 'N/A'}</b></span>
                             </div>
                             </div>
                            </div>
                          `,

                    backdrop: `
                             rgba(0, 0, 123, 0.4)
                              left top
                              no-repeat
                             `,
                  });
                }
              }}
            />
          </Box>)
        })
      }
    </MapContainer>
  );
};
