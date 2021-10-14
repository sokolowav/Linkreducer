import React from 'react'
import {Link} from 'react-router-dom'//для кнопки открыть

//пишем компонент, к-ый отвечает за отображение
export const LinksList = ({links}) => { //где мы сразу получаем массив Линкс
    
    //небольшая проверка, если ссылок нет, то вернем параграф
    if (!links.length) {
        return <p className="center">There isn't any link in the list...</p>
    }
    
    return (
        <table className="highlight responsive-table">
        <thead>
          <tr>
              <th>№</th>
              <th>Original</th>
              <th>Reduced</th>
              <th>Open</th>
          </tr>
        </thead>
       
        <tbody>
        {links.map((link, index) =>{
            return (
            <tr key={link._id}>
            <td>{index+1}</td>
            <td>{link.from}</td>
            <td>{link.to}</td>
            <td>
                <Link to={`/detail/${link._id}`}>+</Link>
            </td>
            </tr>)
        })  }
          
        </tbody>
      </table>
    )
} //в таблице делаем итерации по массиву links/ на каждой итерации получать link и index и возвращать jsx