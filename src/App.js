import React from 'react';
import Amplify from 'aws-amplify';
import { Auth } from 'aws-amplify';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignOut } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

const App = () => {
    const [authState, setAuthState] = React.useState();
    const [user, setUser] = React.useState();

    React.useEffect(() => {
        return onAuthUIStateChange((nextAuthState, authData) => {
            setAuthState(nextAuthState);
            setUser(authData)
        });
    }, []);

  return authState === AuthState.SignedIn && user ? (
    <body>      
      <div className="App">
        <div>ユーザ：{user.username}</div>
        <table>
          <thead>
            <tr>
              <th>日にち</th>
              <th>開始時間</th>
              <th>終了時間</th>
              <th>休憩時間</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span id="date_0"><CalcDate num={0}/></span></td>
              <td><input type="time" id="start_time_0" required /></td>
              <td><input type="time" id="end_time_0" required /></td>
              <td><input type="time" id="rest_time_0" required /></td>
            </tr>

            <tr>
              <td><span id="date_1"><CalcDate num={1}/></span></td>
              <td><input type="time" id="start_time_1" required /></td>
              <td><input type="time" id="end_time_1" required /></td>
              <td><input type="time" id="rest_time_1" required /></td>
            </tr>
            
            <tr>
              <td><span id="date_2"><CalcDate num={2}/></span></td>
              <td><input type="time" id="start_time_2" required /></td>
              <td><input type="time" id="end_time_2" required /></td>
              <td><input type="time" id="rest_time_2" required /></td>
            </tr>
            
            <tr>
              <td><span id="date_3"><CalcDate num={3}/></span></td>
              <td><input type="time" id="start_time_3" required /></td>
              <td><input type="time" id="end_time_3" required /></td>
              <td><input type="time" id="rest_time_3" required /></td>
            </tr>

            <tr>
              <td><span id="date_4"><CalcDate num={4}/></span></td>
              <td><input type="time" id="start_time_4" required /></td>
              <td><input type="time" id="end_time_4" required /></td>
              <td><input type="time" id="rest_time_4" required /></td>
            </tr>

            <tr>
              <td><span id="date_5"><CalcDate num={5}/></span></td>
              <td><input type="time" id="start_time_5" required /></td>
              <td><input type="time" id="end_time_5" required /></td>
              <td><input type="time" id="rest_time_5" required /></td>
            </tr>
            
            <tr>
              <td><span id="date_6"><CalcDate num={6}/></span></td>
              <td><input type="time" id="start_time_6" required /></td>
              <td><input type="time" id="end_time_6" required /></td>
              <td><input type="time" id="rest_time_6" required /></td>
            </tr>
          </tbody>
        </table>

        <button type="button" onClick={invoke.bind(null, user.username)}>送信</button>
        
      </div>
      <AmplifySignOut />
    </body>
  
    ) : (
      <AmplifyAuthenticator>
        <AmplifySignUp
          slot="sign-up"
          formFields={[
            { type: "username" },
            { type: "password" },
            { type: "email" }
          ]}
        />
      </AmplifyAuthenticator>
  );
}

const CalcDate = ({ num }) => {
  var dateArray = [];
  const date = new Date() 
  const dayOfWeek = date.getDay() // 曜日を取得
  const today = date.getDate()    // 日にちを取得
  for (let i = 0; i < 7; i++) {
    if (i <= dayOfWeek) {
      date.setDate(today - (dayOfWeek - i))
      dateArray[i] = date.toLocaleDateString()
    } else {
      date.setDate(today + i - dayOfWeek)
      dateArray[i] = date.toLocaleDateString()
    }
  }
  return dateArray[num]
}

function createBody(name) {
  var date, start, end, rest

  var body = "{\"user\": \"" + name + "\"," 
      + "\"attendance\": ["
  for (let i = 0; i < 7; i++) {
    date = document.getElementById('date_' + i).innerHTML
    start = document.getElementById('start_time_' + i).value
    end = document.getElementById("end_time_" + i).value
    rest = document.getElementById("rest_time_" + i).value

    body = body 
      + "{\"date\": \"" + date   + "\"," 
      + "\"start_time\": \"" + start  + "\","
      + "\"end_time\": \"" + end    + "\","
      + "\"rest_time\": \"" + rest   + "\"},";
  }
  body = body.slice(0, -1);
  body = body + "]}";
  return body;
}

const invoke = async(name) => {
  const credentials = await Auth.currentCredentials()
  const client = new LambdaClient({
    credentials: Auth.essentialCredentials(credentials),
    region: "ap-northeast-1"
  })
  const input = {
    FunctionName: "TODO lambdaの関数名",
    Payload: createBody(name)
  }
  const command = new InvokeCommand(input)
  const response = await client.send(command)
  if (response.StatusCode === 200) {
    alert("入力完了しました")
  } else {
    console.error(response.error)
  }
}

export default App;