import React, { useEffect } from "react";
import stop from "../assets/stop2.png";
import start from "../assets/start_2.png";

const ImagePreloader = () => {
  const imageUrls = [
    // '../assets/loginPage_img.png',
    // '../assets/registerPage2_img.png',
    // '../assets/registerPage_img.png',
    // '../assets/stop2.png',
    // '../assets/start_2.png',
    // '../assets/delete.png',
    // '../assets/log.png',
    // '../assets/logout.png"',
    // '../assets/message.png',
    // '../assets/4left.png',
    // '../assets/3left.png',
    // '../assets/2left.png',
    // '../assets/1left.pn',
    // '../assets/recycle5.png',
    // '../assets/close.png',
    // '../assets/edit.png',
    // '../assets/recyclebins.png',
    // '../assets/makecopy.png',
    // '../assets/markascompleted.png',
    // '../assets/reset.png',
    // '../assets/PayOff.png',
    // '../assets/chart.png',
    // '../assets/reexecute.png',
    // '../assets/part-entry.png',
    // '../assets/close1.png',
    // '../assets/PE.png',
    // '../assets/CE.png',
    // '../assets/SELL.png',
    // '../assets/buy.png',
    // '../assets/Ellipse 50.png',
    // '../assets/Ellipse 51.png',
    // '../assets/Ellipse 52.png',
    start,
    stop,
  ];
  useEffect(() => {
    const preloadImages = () => {
      imageUrls.forEach((imageUrl) => {
        // console.log("imagpreloader")
        const img = new Image();
        img.src = `${imageUrl}`;
      });
    };

    preloadImages();
  }, []);

  return null; // Preloader component does not render anything to the DOM
};

export default ImagePreloader;
