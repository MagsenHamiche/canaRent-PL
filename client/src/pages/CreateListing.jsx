import { useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { useSelector } from 'react-redux'
import {useNavigate} from 'react-router-dom'

export default function CreateListing() {
    const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('L\'ajout de l\'image a echoue (2 mb max par image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('Vous pouvez ajoute que 6 images par publication');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Chargement a ${progress}%`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' 
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('Vous devez ajouter au moins une photo');
      
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
     }
    return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Creation d'une publication</h1>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input onChange={handleChange} value={formData.name} type="text" placeholder='Titre' className='border p-3 rounded-lg' id='name' maxLength='70' minLength='10' required />
                <textarea onChange={handleChange} value={formData.description} type="text" placeholder='Description' className='border p-3 rounded-lg' id='description' required />
                <input onChange={handleChange} value={formData.address} type="text" placeholder='Adresse' className='border p-3 rounded-lg' id='address' required />
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type="checkbox" name="sale" id="sale" className='w-4' onChange={handleChange} checked={formData.type === 'sale'}/>
                        <span>Vente</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" name="rent" id="rent" className='w-4' onChange={handleChange} checked={formData.type === 'rent'}/>
                        <span>Louer</span>
                    </div>
                    <div className='flex gap-2'>
                        <input onChange={handleChange} checked={formData.parking} type="checkbox" name="parking" id="parking" className='w-4' />
                        <span>parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input onChange={handleChange} checked={formData.furnished} type="checkbox" name="furnished" id="furnished" className='w-4' />
                        <span>Meublé</span>
                    </div>
                    
                </div>
                <div className='flex flex-wrap gap-6'>
                    <div className='flex items-center gap-2'>
                        <input onChange={handleChange} value={formData.bedrooms} type="number" name="bedrooms" id="bedrooms" required min='1' max='30' className='p-3 border border-gray-300 rounded-lg w-16'/>
                        <p>Chambre a couchée</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input onChange={handleChange} value={formData.bathrooms} type="number" name="bathrooms" id="bathrooms" required min='1' max='30' className='p-3 border border-gray-300 rounded-lg w-16'/>
                        <p>Salle de bain</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input onChange={handleChange} value={formData.regularPrice} type="number" name="regularPrice" id="regularPrice" required min='50' max='10000000' className='p-3 border border-gray-300 rounded-lg w-32'/>
                        <div className="flex flex-col items-center">
                            <p>Prix</p>
                            <span className='text-xs'>($ / mois)</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-1 gap-6">
                <p className='font-semibold '>Images: 
                <span className='font-normal text-gray-600 ml-2'>La premiere images est l'image de couverture (max 6)</span>
                </p>
                <div className="flex gap-4">
                    <input onChange={(e) => setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple />
                    <button onClick={handleImageSubmit} type='button' className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80' disabled={uploading}>{uploading ? 'Chargement...': 'Ajouter'}</button>
                </div>
                <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                        <div key={url} className="flex justify-between p-3 border items-center">
                            <img  src={url} alt="listing image" className='w-40 h-40 object-contain rounded-lg'/>
                            <button type='button' onClick={() => handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Supprimer</button>
                        </div>
                    ))
                }
                <button disabled={loading || uploading} className='p-3  bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Creation...' : 'creer la publication '}</button>
                {error && formData.imageUrls.length <= 0 && <p className='text-red-700 text-sm'>{error}</p>}
            </div>
            
            </form>
    </main>
  )
}
