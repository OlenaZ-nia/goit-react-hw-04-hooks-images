import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import { Container } from './components/Container/Container';
import Loader from "react-loader-spinner";
import  imgApi from './api/pixabey-api';
import Searchbar from './components/Searchbar/Searchbar';
import  {ImageGallery}  from './components/ImageGallery/ImageGallery';
import Modal from './components/Modal/Modal';
import { Button } from './components/Button/Button';
import { mapper } from './helpers/mapper';

export default function App() {
  
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalImg, setModalImg] = useState('');
  const [alt, setAlt] = useState('');

  useEffect(() => {
    if (!searchQuery) {
      return;
    }
    const fetchImg = () => {
      setIsLoading(true);
    
      imgApi
        .fetchImg(searchQuery, currentPage)
        .then(images => {
          if (images.total === 0) {
            return toast.error('Not found!')
          }
        
          setImages(prevState => [...prevState, ...mapper(images.hits)])

          setTimeout(() => {
            document.querySelector('#gallery').scrollIntoView({
              behavior: 'smooth', block: 'end',
            });
          }, 1000)
        })
        .catch(error => setError(error))
        .finally(() => setIsLoading(false));
    };
    fetchImg();
  }, [searchQuery, currentPage])

  const onClickLoadMore = () => {
    setCurrentPage(prevState =>prevState + 1);
  };

  const onChangeQuery = (query) => {
    setImages([]);
    setCurrentPage(1);
    setSearchQuery(query);
    setError(null);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const onClickImg = (img, alt) => {
    setShowModal(true);
    setModalImg(img);
    setAlt(alt);
  }


  return (
      <Container>
        <Searchbar onSubmit={onChangeQuery} />
      <ToastContainer autoClose={3000} theme={'dark'} />
      
      {error && toast.error('An error occured, please retry the request!')}

        {images.length>0 && <ImageGallery images={images} onClickImg={onClickImg} />}

        {isLoading && <Loader
          type="ThreeDots"
          color="#00BFFF"
          height={80}
          width={80}
          timeout={3000} 
      />}

        {images.length > 11 && <Button onClickLoadMore={onClickLoadMore} />}
        
        {showModal && (
          <Modal src={modalImg } alt={alt} onClose={toggleModal}/>
        )}
      </Container>
  );
}




