import React from "react";

function TopButtons () {
    const cities = [
        {
            id: 1,
            title: 'Tel Aviv-Yafo'
        },
        {
            id: 2,
            title: 'Sudan'
        },
        {
            id: 3,
            title: 'Tokyo'
        },
        {
            id: 4,
            title: 'Toronto'
        },
        {
            id: 5,
            title: 'Paris'
        }
    ]
    return <div className='flex items-center justify-around my-6'>
        {cities.map((city) => (

            <button key={city.id} className='text-white text-xl font-medium'>{city.title}</button>

            ))}
    </div>
}

export default TopButtons