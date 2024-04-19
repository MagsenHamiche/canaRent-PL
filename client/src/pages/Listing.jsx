import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

export default function Listing() {
    SwiperCore.use([Navigation]);
    const params = useParams();
    const [lisnting, setListing] = useState(null);
    const [error, setError]= useState(false);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if(data.success === false){
                    setError(true);
                    setLoading(false);
                    return;
                }
                setListing(data);
                setLoading(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
            
        }
        fetchListing();
    }, [params.ListingId])
  return (
    <main>
        {loading && <p className='text-center ny-7 text-2xl'> Chargement ...</p>}
        {error && <p className='text-center ny-7 text-2xl'>Une erreur est survenue</p>}
        {lisnting && !loading && !error && 
            <div>
                <Swiper navigation>
                    {lisnting.imageUrls.map((url) =>(
                        <SwiperSlide key={url}>
                            <div className='h-[550px]' style={{background: `url(${url}) center no-repeat`, backgroundSize: 'cover'}}>

                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        
        }
        
    </main>
  )
}
