import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { Avatar } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button, Input, Text } from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react';
import { FiTrash2 } from "react-icons/fi";

import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaMusic, FaDollarSign, FaPlusCircle,FaUser } from "react-icons/fa";



import defaultprofile from "../components/Assets/default_profile.png";
import defaultcover from "../components/Assets/default_cover.png";
import RateCard from "./Ratecard";

function ArtistProfile() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();

  const token = localStorage.getItem('token');
  const [userData, setUserData] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [message, setMessage] = useState('');
  const [deleteIndex, setDeleteIndex] = useState(null);

  const user = userData && userData.userId && userData.userId._id;

  const fetchUserData = (token, setUserData) => {
    axios.get("http://localhost:3001/api/a", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setUserData(response.data);
    })
    .catch(error => {
      console.error("Error fetching user data:", error);
    });
  };

  useEffect(() => {
    fetchUserData(token, setUserData);
  }, []);

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleVideoUpload = async () => {
    if (!videoFile) {
      setMessage('Please select a video file');
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);

    try {
      const response = await axios.post('http://localhost:3001/api/uploadVideo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      toast.success("Video uploaded successfully");
      fetchUserData(token, setUserData);
      setVideoFile(null); 
      onClose();
    } catch (error) {
      console.error('Error uploading video:', error);
      setMessage('Error uploading video');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/d', {
        user: user,
        deleteIndex: deleteIndex
      });
      console.log('Video deleted successfully');
      toast.success("Video deleted successfully");
      fetchUserData(token, setUserData);
      onCloseDelete();
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const handleDeleteindex = (index) => {
    setDeleteIndex(index);
    onOpenDelete();
  };

  return (
    <div>
      <Navbar />
      <div className="relative w-full max-w-6xl mx-auto px-4 md:px-6 py-1 md:py-20">
        <div className="relative">
          <img
            alt="Cover Image"
            className="aspect-[16/6] w-full rounded-lg object-cover"
            height={600}
            src={userData && userData.coverPic ? `http://localhost:3001/Images/${userData.coverPic}` : defaultcover}
            width={1920}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent rounded-lg" />
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-8">
          <div className="flex flex-col items-center md:items-start gap-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar size="2xl" name={userData && userData.name} src={userData && userData.profilePic ? `http://localhost:3001/Images/${userData.profilePic}` : defaultprofile} />
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold">{userData && userData.name}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-left text-2xl">{userData && userData.specialization}</p>
              </div>
            </div>
            <div className="grid gap-4 text-md">
            <div className="flex items-center gap-2">
                <FaUser className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                <span>{userData && userData.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                <span>{userData && userData.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMusic className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                <span>{userData && userData.genres}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaDollarSign className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                <span>{userData && userData.pricePerShow}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                <span>{userData && userData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaPhone className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                <span>{userData && userData.phoneNo}</span>
              </div>
             
            </div>
            
          </div>
          <div className="space-y-6  ">
          <div className="text-left">
              <h2 className="text-lg  md:text-xl font-bold">Bio</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {userData && userData.bio ? userData.bio : "No bio available"}
              </p>
            </div>
            <div className="flex justify">
              <Button className="bg-black text-white" onClick={onOpen}
              >
                Upload Videos <FaPlusCircle className="ml-2"></FaPlusCircle>
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 max-h-96 overflow-y-auto">
              {userData && userData.videos.map((videoUrl, index) => (
                <div key={index} className="relative group">
                  <video controls className="w-full h-60 rounded-lg">
                    <source src={`http://localhost:3001/Videos/${videoUrl}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <Button
                    className="absolute top-2 right-2 bg-dark text-white"
                    onClick={() => handleDeleteindex(index)}
                  >
                    <FiTrash2 className=""/>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 md:mt-20 text-left">
          <h2 className="text-lg md:text-xl font-bold">Rate and Review</h2>
          <div className="mt-4">
            <RateCard userID={user} />
          </div>
        </div>
      </div>
      <Footer />

      {/* Modal for Uploading Video */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Video</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input type="file" accept="video/*" onChange={handleVideoChange} />
            <Text mt={2}>{message}</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button colorScheme="blue" ml={3} onClick={handleVideoUpload}>
              Upload
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal for Deleting Video */}
      <Modal isOpen={isOpenDelete} onClose={onCloseDelete}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Video</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this video?</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onCloseDelete}>Cancel</Button>
            <Button colorScheme="red" ml={3} onClick={handleDelete}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ArtistProfile;
