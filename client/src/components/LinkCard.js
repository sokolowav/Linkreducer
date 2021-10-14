import React from 'react'

export const LinkCard = ({link}) => { //компонент будет принимать параметр link
    return (//формируем шаблон для отдельной ссылки
        <>
        <h2>Reduced Link</h2>
        <p><a href={link.to} target="_blank" rel="noopener noreferrer">{link.to}</a></p>
        <p>From <a href={link.from} target="_blank" rel="noopener noreferrer">{link.from}</a></p>
        <p>Clicked for <strong>{link.clicks}</strong> times</p>
        <p>Was created <strong>{new Date(link.date).toLocaleDateString()}</strong></p>
        </>
    )
}