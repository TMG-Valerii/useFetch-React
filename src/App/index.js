import './index.css';
import {useState, useEffect} from 'react';
import {useRequest} from 'hooks/useRequest';

function App() {

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');

  const {request, text, json, loading, success, status} = useRequest('https://reqres.in/api/users');

  useEffect(() => {
    request({query: {page: 1}
  })}, []);
  
  const content = loading
    ? <div>FETCH IN PROGRESS</div>
    : (!success)
      ? <div>FAILED, {status} - {text}</div>
      : <table>
        <tbody>
          {json?.data.filter(item => new RegExp(filter.trim(), 'ig').test(item.email)).map(item => <tr key={`json_key:${item.email}`}>
            <td>{item.email}</td>
            <td>{item.first_name}</td>
            <td>{item.last_name}</td>
          </tr>)}
        </tbody>
      </table>

  return (
    <div>
      <input value={filter} onChange={(event) => setFilter(event.target.value)}/>
      <button onClick={() => {
        const next = page + 1;
        setPage(next);
        request({query: {page: next}});
      }}>Next</button>
      {content}
    </div>
  );
}

export default App;
