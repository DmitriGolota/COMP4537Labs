import React from 'react'

function pagination({ numberOfPages, currentPage, setCurrentPage }) {
  const pageNumbers = []
  for (let i = 1; i <= numberOfPages; i++) {
    pageNumbers.push(i)
  }
  const nextPage = () => {
    if (currentPage !== numberOfPages) setCurrentPage(currentPage + 1)
  }
  const prevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1)
  }



  return (
    <div className='button-layer'>
      {(currentPage !== 1) && (<button onClick={prevPage}>prev </button>)}

      {
        pageNumbers.map(number => {
          if (number < currentPage + 6 && number > currentPage - 6)
            return (<>
              <button onClick={() => setCurrentPage(number)} className={(number == currentPage) ? 'focus' : ''}>
                {number}
              </button>

            </>)
        })
      }

      {(currentPage !== numberOfPages) && 
      <div className='button-layer'>
        <button onClick={nextPage}>
        next
      </button>
      </div>}
    </div>
  )
}

export default pagination