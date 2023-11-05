import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import axios from 'axios';
// api_key=AIzaSyDPzdVg-3xqoSLOysjd_F7WsehifbPOeQY
// calendar_id=en.canadian#holiday@group.v.calendar.google.com
import ApiCalendar from 'react-google-calendar-api';

const config = {
  clientId:
    '283353260259-jd40gd4rk86l0peu42ogivn94q8bpshu.apps.googleusercontent.com',
  apiKey: 'AIzaSyDPzdVg-3xqoSLOysjd_F7WsehifbPOeQY',
  scope: 'https://www.googleapis.com/auth/calendar.events.readonly',
  discoveryDocs: [
    'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
  ],
};

const apiCalendar = new ApiCalendar(config);

function App() {
  const [count, setCount] = useState(0);

  const handleClick = async () => {
    try {
      let currentDate = new Date();
      let nextDate = new Date();
      nextDate.setFullYear(currentDate.getFullYear() + 1);
      const response = await apiCalendar.listEvents(
        {
          timeMin: currentDate.toISOString(),
          timeMax: nextDate.toISOString(),
          maxResults: 100,
          orderBy: 'updated',
        },
        'en.canadian#holiday@group.v.calendar.google.com'
      );
      // console.log('response: ', response.result);
      let holidays = [];

      response.result.items.forEach((item) => {
        // using regular expression to filter all statutory holidays in toronto
        if (
          item.summary.match(
            /(Family Day|Good Friday|Victoria Day|Canada Day|Civic|Labour Day|Thanksgiving Day|Christmas Day|Boxing Day \(regional holiday\))/i
          ) ||
          item.summary.match(/^New Year\'s Day$/i)
        ) {
          // create a holiday date object
          let date1 = item.start.date;
          date1 = date1.split('-').map((i, index) => {
            if (index === 1) return parseInt(i) - 1; // month : 0 - 11
            return parseInt(i);
          });
          date1 = new Date(date1[0], date1[1], date1[2]);
          // apply holidays rules to summary
          if (
            item.summary.match(/Canada Day/i) ||
            item.summary.match(/^New Year\'s Day$/i)
          ) {
            // if date.getDay() == 6 || 0, then move it to 1
            if (date1.getDay() === 6) date1.setDate(date1.getDate() + 2);
            else if (date1.getDay() === 0) date1.setDate(date1.getDate() + 1);
          } else if (item.summary.match(/Christmas Day/i)) {
            // if date.getDay() === 6 || 0, then move it to 1
            if (date1.getDay() === 6) date1.setDate(date1.getDate() + 2);
            else if (date1.getDay() === 0) date1.setDate(date1.getDate() + 1);
          } else if (item.summary.match(/Boxing Day \(regional holiday\)/i)) {
            // if date.getDate() ===6 , then move it to 1
            // if date.getDate() ===0 , then move it to 2
            // if date.getDate() ===1, then move it to 2
            if (date1.getDate() === 6) date1.setDate(date1.getDate() + 2);
            else if (date1.getDate() === 0) date1.setDate(date1.getDate() + 2);
            else if (date1.getDate() === 1) date1.setDate(date1.getDate() + 1);
          }
          holidays.push(date1.toDateString());
        }
      });

      console.log('summary: ', holidays);
    } catch (error) {
      console.log('error: ', error);
    }

    // function start() {
    //   gapi.client
    //     .init({
    //       apiKey: 'AIzaSyDPzdVg-3xqoSLOysjd_F7WsehifbPOeQY',
    //       clientId:
    //         '283353260259-jd40gd4rk86l0peu42ogivn94q8bpshu.apps.googleusercontent.com',
    //       scope: 'https://www.googleapis.com/auth/calendar.events.readonly',
    //     })
    //     .then(function () {
    //       return gapi.client.request({
    //         path: 'https://www.googleapis.com/calendar/v3/calendars/en.canadian#holiday@group.v.calendar.google.com/events',
    //       });
    //     })
    //     .then(
    //       function (response) {
    //         console.log(response.result);
    //       },
    //       function (reason) {
    //         console.log('Error: ' + JSON.stringify(reason));
    //       }
    //     );
    // }
    // gapi.load('client', start);

    // const client = google.accounts.oauth2.initTokenClient({
    //   client_id:
    //     '283353260259-jd40gd4rk86l0peu42ogivn94q8bpshu.apps.googleusercontent.com',
    //   scope: 'https://www.googleapis.com/auth/calendar.events.readonly',
    //   callback: (tokenResponse) => {
    //     console.log('hello world');
    //     if (tokenResponse && tokenResponse.access_token) {
    //       gapi.client.setApiKey('AIzaSyDPzdVg-3xqoSLOysjd_F7WsehifbPOeQY');
    //       gapi.client
    //         .load('calendar', 'v3', listUpcomingEvents)
    //         .then((response) => {
    //           console.log('response: ', response);
    //         });
    //     }
    //   },
    // });
    // function listUpcomingEvents() {
    //   gapi.client.calendar.events.list(
    //     'en.canadian#holiday@group.v.calendar.google.com'
    //   );
    // }
    // console.log('client: ', client.requestAccessToken());
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <button onClick={handleClick}>test calendar</button>
    </>
  );
}

export default App;
