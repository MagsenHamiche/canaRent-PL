import { useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { useSelector } from 'react-redux'
import {useNavigate} from 'react-router-dom'

export default function CreateListing() {
    const {currentUser} = useSelector(state => state.user);
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        imageUrls: [], 
        name: '',
        description:'',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });
    const [imageUploadError, setImageUploadError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError]= useState(false);
    const [loading, setLoading] = useState(false);
    
    const handleImageSubmit = (e)=>{
       if(files.length > 0 && files.length +formData.imageUrls.length < 7){
        setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for(let i = 0; i < files.length; i++){
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls) => {
                setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)});  
                setImageUploadError(false); 
                setUploading(false);             
            }).catch((err) => {
                setImageUploadError('Image uploaded failed (2 Mo max per image)');
                setUploading(false); 
            });
        }else{
            setImageUploadError('You can upload only 6 images');
            setUploading(false); 
        }
    };
     const storeImage = async (file)=>{
        return new Promise((resolve, reject) =>{
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`upload is ${progress}% done`); 
                },
                (error)=> {
                    reject(error);
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>{
                        resolve(downloadURL);
                    });
                    
                },
            );
        });
     };

     const handleRemoveImage = (index)=>{
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_,i) => i !== index)
        })
     };

     const handleChange =(e) =>{
        if(e.target.id === 'sale' || e.target.id === 'rent'){
            setFormData({...formData, type: e.target.id})
        }

        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setFormData({...formData, [e.target.id]: e.target.checked})
        }

        if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
            setFormData({...formData, [e.target.id]: e.target.value})
        }
     }
     console.log(formData)
     
     const handleSubmite= async (e) => {
        e.preventDefault();
        try {
            if(formData.imageUrls.length < 1) return setError('You must upload a least one image');
            if(+formData.regularPrice <= +formData.discountPrice) return setError('Dsicount price must be lower that the regular price')
            setLoading(true);
            setError(false);
            const res = await fetch('/api/listing/create', {
                method: 'POST',
                headers:{
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({...formData, userRef: currentUser._id}),
            });

            const data = await res.json();
            setLoading(false);
            if(data.success === false){
                setError(data.message)
            }
            navigate(`/listing/${data._id}`)
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
     }
    return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create Listnig</h1>
        <form onSubmit={handleSubmite} className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input onChange={handleChange} value={formData.name} type="text" placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='70' minLength='10' required />
                <textarea onChange={handleChange} value={formData.description} type="text" placeholder='Description' className='border p-3 rounded-lg' id='description' required />
                <input onChange={handleChange} value={formData.address} type="text" placeholder='Address' className='border p-3 rounded-lg' id='address' required />
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type="checkbox" name="sale" id="sale" className='w-4' onChange={handleChange} checked={formData.type === 'sale'}/>
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" name="rent" id="rent" className='w-4' onChange={handleChange} checked={formData.type === 'rent'}/>
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input onChange={handleChange} value={formData.parking} type="checkbox" name="parking" id="parking" className='w-4' />
                        <span>parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input onChange={handleChange} value={formData.furnished} type="checkbox" name="furnished" id="furnished" className='w-4' />
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input onChange={handleChange} value={formData.offer} type="checkbox" name="offer" id="offer" className='w-4' />
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex flex-wrap gap-6'>
                    <div className='flex items-center gap-2'>
                        <input onChange={handleChange} value={formData.bedrooms} type="number" name="bedrooms" id="bedrooms" required min='1' max='30' className='p-3 border border-gray-300 rounded-lg w-16'/>
                        <p>Bedrooms</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input onChange={handleChange} value={formData.bathrooms} type="number" name="bathrooms" id="bathrooms" required min='1' max='30' className='p-3 border border-gray-300 rounded-lg w-16'/>
                        <p>Bathrooms</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input onChange={handleChange} value={formData.regularPrice} type="number" name="regularPrice" id="regularPrice" required min='50' max='10000000' className='p-3 border border-gray-300 rounded-lg w-32'/>
                        <div className="flex flex-col items-center">
                            <p>Regular price</p>
                            <span className='text-xs'>($ / month)</span>
                        </div>
                    </div>
                    {formData.offer && (
                    <div className='flex items-center gap-2'>
                    <input onChange={handleChange} value={formData.discountPrice} type="number" name="discountPrice" id="discountPrice" required min='0'  max='10000000' className='p-3 border border-gray-300 rounded-lg w-32'/>
                    <div className="flex flex-col items-center">
                        <p>Discounted price</p>
                        <span className='text-xs'>($ / month)</span>
                    </div>
                    </div>
                    )}
                    
                </div>
            </div>
            <div className="flex flex-col flex-1 gap-6">
                <p className='font-semibold '>Images: 
                <span className='font-normal text-gray-600 ml-2'>the first image will be the cover (max 6)</span>
                </p>
                <div className="flex gap-4">
                    <input onChange={(e) => setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple />
                    <button onClick={handleImageSubmit} type='button' className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80' disabled={uploading}>{uploading ? 'uploading...': 'uploading'}</button>
                </div>
                <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                        <div key={url} className="flex justify-between p-3 border items-center">
                            <img  src={url} alt="listing image" className='w-40 h-40 object-contain rounded-lg'/>
                            <button type='button' onClick={() => handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
                        </div>
                    ))
                }
                <button disabled={loading || uploading} className='p-3  bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Creating...' : 'Create Listing'}</button>
                {error && <p className='text-red-700 text-sm'>{error}</p>}
            </div>
            
            </form>
    </main>
  )
}
