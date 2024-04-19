import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import { useSelector, useDispatch } from 'react-redux'
import { deleteUserFailure, signInFailure, signOutUserStart, signOutUserSuccess } from '../redux/user/userSlice'

export default function Header() {
    const {currentUser} = useSelector(state => state.user);
    const dispatch = useDispatch();
  
    const handleSignOut = async () =>{
        try {
          dispatch(signOutUserStart());
          const res = await fetch(`/api/auth/signout/`);
          const data = await res.json();
          if(data.success == false){ 
            dispatch(signInFailure(data.message))       
            return;
          }
          dispatch(signOutUserSuccess(data))
        } catch (error) {
          dispatch(deleteUserFailure(error.message))
        }
      };
  return (
    <header className='bg-slate-200 shadow-md '>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                <span className='text-slate-500'>Cana</span>
                <span className='text-stone-700'>Rent</span>
            </h1>
        </Link>
        
        <form className='bg-slate-100 p-3 rounded-lg flex items-center'>
            <input type="text" placeholder="Search..." 
            className='bg-transparent focus:outline-none w-24 sm:w-64' />
           <FaSearch className='text-slate-600'/>
        </form>
        <ul className='flex gap-4'>
            <Link to='/'>
                <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>            
            </Link>

            <Link to='/about'>
                <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
            </Link>
            <li>
                {currentUser && (
                    <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign out</span>
                )}
            </li>
            <Link to='/profile'>
                {currentUser ? (
                    <img src={currentUser.avatar} alt='profile' className=' rounded-full h-7 w-7 object-cover'/>                    
                ): <li className=' text-slate-700 hover:underline'> Sing In</li>}
            </Link>
            
        </ul>
        </div>
    </header>
  )
}
