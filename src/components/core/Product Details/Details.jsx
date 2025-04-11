import React, { useState } from 'react'

function Details({product}) {
    const[val,setVal] = useState(1)

  return (
    <div className=' mt-[30px] text-[13px]'>

<div>
<div className="border-b-2 pb-2">
      <ul className="flex justify-between lg:w-[90%] mx-auto">
        <li
          onClick={() => setVal(1)}
          className={`cursor-pointer text-[13px] ${
            val === 1 ? "border-b-2 border-blue-500" : ""
          }`}
        >
          DESCRIPTION
        </li>
        {/* <li
          onClick={() => setVal(2)}
          className={`cursor-pointer text-[13px] ${
            val === 2 ? "border-b-2 border-blue-500" : ""
          }`}
        >
          DETAILS
        </li> */}
        <li
          onClick={() => setVal(3)}
          className={`cursor-pointer text-[13px] ${
            val === 3 ? "border-b-2 border-blue-500" : ""
          }`}
        >
          SHIPPING
        </li>
      </ul>
    </div>


<div className='lg:w-[90%] mx-auto text-[11px] mt-1'>
{
  val === 1 && <div>{product.description}</div>
}
{
  val === 2 && <div>

    <ul>
        <li>{product?.fabric}</li>
        <li>{product?.gsm}</li>
        <li>{product?.printing}</li>
        <li>{product?.washingInstructions}</li>
      
    </ul>
  </div>
}
{
  val === 3 && <div>
  <ul>
        <li>PACKED WITHIN 24 HOURS.</li>
        <li>FREE DELIVERY PAN-INDIA.</li>
        <li>DISPATCHES NEXT DAY.</li>
    </ul>
  </div>
}

</div>
</div>

    </div>
  )
}

export default Details