import { useCallback } from 'react'

export const useMessage = () => {
	//экспортируем константу useMessage, что будет возвращать callback ф-ию, обернутую в хук useCallback (чтобы реакт не входил в цикличную рекурсию), куда будем передавать callback ф-ию первым параметром, а вторым набор зависимосте (по умолчанию пустой объект)
	return useCallback(text => {
		//в функцию принимаем text
		if (window.M && text) {
			//и если объект М существует И также сущ-ет text, то выводим этот текст сообщением
			window.M.toast({ html: text })
		}
	}, [])
}
