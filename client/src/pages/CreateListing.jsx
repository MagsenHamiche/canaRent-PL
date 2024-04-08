import { useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'

export default function CreateListing() {
    const [files, setFiles] = useState([]);
     const [formData, setFormData] = useState({
        imageUrls: [], 
    });
    const [imageUploadError, setImageUploadError] = useState(null);
     const [uploading, setUploading] = useState(false);
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
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create Listnig</h1>
        <form className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input type="text" placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='70' minLength='10' required />
                <textarea type="text" placeholder='Description' className='border p-3 rounded-lg' id='description' required />
                <input type="text" placeholder='Address' className='border p-3 rounded-lg' id='address' required />
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type="checkbox" name="sale" id="sale" className='w-4' />
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" name="rent" id="rent" className='w-4' />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" name="parking" id="parking" className='w-4' />
                        <span>parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" name="furnished" id="furnished" className='w-4' />
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" name="offer" id="offer" className='w-4' />
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex flex-wrap gap-6'>
                    <div className='flex items-center gap-2'>
                        <input type="number" name="bedrooms" id="bedrooms" required min='1' max='30' className='p-3 border border-gray-300 rounded-lg w-16'/>
                        <p>Bedrooms</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type="number" name="bathrooms" id="bathrooms" required min='1' max='30' className='p-3 border border-gray-300 rounded-lg w-16'/>
                        <p>Bathrooms</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type="number" name="regularPrice" id="regularPrice" required min='1' className='p-3 border border-gray-300 rounded-lg w-32'/>
                        <div className="flex flex-col items-center">
                            <p>Regular price</p>
                            <span className='text-xs'>($ / month)</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type="number" name="discountedPrice" id="discountedPrice" required min='0' className='p-3 border border-gray-300 rounded-lg w-32'/>
                        <div className="flex flex-col items-center">
                            <p>Discounted price</p>
                            <span className='text-xs'>($ / month)</span>
                        </div>
                    </div>
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
                        <div  className="flex justify-between p-3 border items-center">
                            <img key={url} src={url} alt="listing image" className='w-40 h-40 object-contain rounded-lg'/>
                            <button type='button' onClick={() => handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
                        </div>
                    ))
                }
                <button className='p-3  bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>
                
            </div>
            
            </form>
    </main>
  )
}
