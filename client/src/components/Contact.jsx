import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {
  const [proprietaire, setproprietaire] = useState(null);
  const [message, setMessage] = useState('');
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchproprietaire = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setproprietaire(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchproprietaire();
  }, [listing.userRef]);
  return (
    <>
      {proprietaire && (
        <div className='flex flex-col gap-2'>
          <p>
            Contacter <span className='font-semibold'>{proprietaire.username}</span>{' '}
            pour{' '} 
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
            {' '}via email
          </p>
          
          <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={onChange}
            placeholder='Saisissez votre message ici...'
            className='w-full border p-3 rounded-lg'
          ></textarea>

          <Link
          to={`mailto:${proprietaire.email}?subject=Information sur ${listing.name}&body=${message}`}
          className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
          >
            Envoyer le message          
          </Link>
        </div>
      )}
    </>
  );
}