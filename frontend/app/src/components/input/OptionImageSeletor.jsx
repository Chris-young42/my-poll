import React from 'react'
import { HiOutlineTrash, HiMiniPlus } from 'react-icons/hi2'

const OptionImageSeletor = ({ imageList, setImageList }) => {
    const handleAddImage = (event) => {
        const file = event.target.files[0];
        if (file && imageList.length < 4) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageList([...imageList, { base64: reader.result, file }])
            }
            reader.readAsDataURL(file);
            event.target.value = null
        }
    }
    const handleDeleteImage = (index) => {
        const updateList = imageList.filter((_, idx) => idx !== index)
        setImageList(updateList)
    }
    return (
        <div>
            {imageList?.length > 0 && (<div className='grid grid-cols-2 gap-4 mb-4'>
                {imageList.map((item, index) => (<div key={index} className='bg-gray-600/10 rounded-md relative'>
                    <img src={item.base64} alt={`${index}`} className='w-full h-36 object-contain rounded-md' />
                    <button
                        onClick={() => { handleDeleteImage(index) }}
                        className='text-red-500 bg-gray-100 rounded-full absolute top-2 right-2'
                    >
                        <HiOutlineTrash className='text-lg text-red-500' />
                    </button>
                </div>))}

            </div>)}

            {imageList.length < 4 && (
                <div>
                    <input type="file"
                        accept='image/jpep,image/png'
                        onChange={handleAddImage}
                        className='hidden'
                        id='imageInput' />
                    <label htmlFor='imageInput' className='btn-small text-nowrap py-1 cursor-pointer'>
                        <HiMiniPlus />
                        选择图片
                    </label>

                </div>
            )}
        </div>
    )
}

export default OptionImageSeletor