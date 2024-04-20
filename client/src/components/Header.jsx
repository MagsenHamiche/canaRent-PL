import React, { useEffect,useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import { useSelector, useDispatch } from 'react-redux'
import { deleteUserFailure, signInFailure, signOutUserStart, signOutUserSuccess } from '../redux/user/userSlice'


export default function Header() {
    const {currentUser} = useSelector(state => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
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
      const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
      };

      useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
          setSearchTerm(searchTermFromUrl);
        }
      }, [location.search]);
  return (
    <header className='bg-slate-200 shadow-md '>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                <span className='text-slate-500'>Cana</span>
                <span className='text-stone-700'>Rent</span>
            </h1>
        </Link>
        
        <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center'>
            <input type="text" placeholder="Recherche..." 
            className='bg-transparent focus:outline-none w-24 sm:w-64'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} />
            <button><FaSearch className='text-slate-600'/></button>
           
        </form>
        <ul className='flex gap-4'>
            <Link to='/'>
                <li className='hidden sm:inline text-slate-700 hover:underline'>Accueil</li>            
            </Link>

            <Link to='/about'>
                <li className='hidden sm:inline text-slate-700 hover:underline'>À propos</li>
            </Link>
            <li>
                {currentUser && (
                    <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Se deconnecter</span>
                )}
            </li>
            <Link to='/profile'>
                {currentUser ? (
                    <img src={currentUser.avatar} alt='profile' className=' rounded-full h-7 w-7 object-cover'/>                    
                ): <li className=' text-slate-700 hover:underline'> S'identifier</li>}
            </Link>
            
        </ul>
        </div>
    </header>
  )
}
