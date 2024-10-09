import './App.css'
import { YandexMap } from './components/YandexMap'
import { useAppSelector } from './store/hooks'

function App() {
  const {emptyCount, fullCount, totalCount} = useAppSelector((state) => state.count)

  return (
    <>
    <div className='banner'>
      <strong>Статистика:</strong> 
      <br></br>
      <table className='table'>
        <tbody>
          <tr className='row'>
          <td>Полные:</td>
          <td><span id="full" className='count'>{fullCount}</span></td>
        </tr>	
        <tr className='row'>
          <td>Пустые:</td>
          <td><span id="empty" className='count'>{emptyCount}</span></td>
        </tr>	
        <tr className='row'>
          <td>Итого :</td>
          <td><span id="total" className='count'>{totalCount}</span></td>
        </tr>	
        </tbody>
        
      </table>
    </div>
    <YandexMap/>
    </>
  )
}

export default App
