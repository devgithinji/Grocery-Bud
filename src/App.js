import React, {useState, useEffect} from 'react'
import List from './List'
import Alert from './Alert'

const getPersistedItems = () => {
    const persistedList = localStorage.getItem('list');

    if (persistedList) {
        return JSON.parse(persistedList)
    } else {
        return [];
    }
}

function App() {
    const [name, setName] = useState('');
    const [list, setList] = useState(getPersistedItems)
    const [isEditing, setIsEditing] = useState(false);
    const [editID, setEditID] = useState(null)
    const [alert, setAlert] = useState({show: false, msg: '', type: ''})


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name) {
            //display alert
            showAlert(true, 'danger', 'please enter value')
        } else if (name && isEditing) {
            setList(list.map(item => {
                if (item.id === editID) {
                    return {...item, title: name}
                }
                return item;
            }))
            setName('')
            setEditID(null)
            setIsEditing(false)
            showAlert(true, 'success', 'Item updated')
        } else {
            showAlert(true, 'success', 'Item added to the list')
            const newItem = {id: new Date().getTime(), title: name}
            setList([...list, newItem])
            setName('');
        }
    }

    const showAlert = (show = false, type = '', msg = '') => {
        setAlert({show, type, msg})
    }

    const clearList = () => {
        showAlert(true, 'danger', 'empty list')
        setList([])
    }

    const removeItem = (id) => {
        showAlert(true, 'danger', 'Item removed')
        setList(list.filter((item) => item.id !== id))
    }

    const editItem = (id) => {
        const specificItem = list.find((item) => item.id === id);
        setIsEditing(true);
        setEditID(id);
        setName(specificItem.title)

    }

    useEffect(() => {
        localStorage.setItem('list', JSON.stringify(list))
    }, [list])


    return (
        <section className='section-center'>
            <form action="" className='grocery-form' onSubmit={handleSubmit}>
                {alert.show && <Alert {...alert} removeAlert={showAlert} list={list}/>}
                <h3>grocery bud</h3>
                <div className="form-control">
                    <input type="text" className='grocery' placeholder='e.g eggs' value={name}
                           onChange={(e) => setName(e.target.value)}/>
                    <button type='submit' className='submit-btn'>
                        {isEditing ? 'edit' : 'submit'}
                    </button>
                </div>
            </form>
            {list.length > 0 && (
                <div className='grocery-container'>
                    <List items={list} removeItem={removeItem} editItem={editItem}/>
                    <button className='clear-btn' onClick={clearList}>
                        clear Items
                    </button>
                </div>
            )}
        </section>
    )
}

export default App
