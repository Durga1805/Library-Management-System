import React, { useContext, useState } from 'react'
// import Logo from './Logo'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoSearch } from "react-icons/io5";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";











const Header = () => {

  // const navigate=useNavigate()




  return (
    <header className='h-16 shadow-md bg-red fixed w-full z-40 '>
      <div className=' h-full container mx-auto flex items-center px-4 justify-between'>
        <div className=''>
          <Link to={"/"}>
          hello
          </Link>
        </div>


        {/* <div className='hidden lg:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow pl-2'>
          <input type='text' placeholder='search product here...' className='w-full outline-none' />
          <div className='text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white'>
            <IoSearch />
          </div>
        </div> */}


        <div className='flex items-center gap-7'>
                
                <div className='relative flex justify-center'>

                 
                      <div className='text-3xl cursor-pointer relative flex justify-center' >
                    
                         
                            {/* <img src="./assets/user icon.png" className='w-10 h-10 rounded-full' alt="name" /> */}
                       
                        
                            <FaRegCircleUser/>
                        
                      </div>
                 
                  
                  
                  
                  
                      <div className='absolute bg-white bottom-0 top-11 h-fit p-2 shadow-lg rounded-2xl' >
                       
                      </div>
                 
                </div>

                 
                   
                      {/* <Link to={"/"} className='text-2xl relative'>
                          <span><FaShoppingCart/></span>
      
                          <div className='bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3'>
                              <p className='text-sm'>0</p>
                          </div>
                      </Link>
               */}
              


                <div>
                  
                
                    <Link to={"/login"} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>Login</Link>
                   
                  
                    
                </div>

            </div>


      </div>

    </header>
  )
}

export default Header