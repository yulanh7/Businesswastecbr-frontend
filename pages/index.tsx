import React, { useState } from 'react';
import Layout from '../src/components/Layout';
// import ContactUs from "../src/components/ContactUs";
import pageStyles from "../src/styles/page.module.scss";
import utilsStyles from "../src/styles/utils.module.scss";
import { Button } from "react-bootstrap";
import dynamic from 'next/dynamic';
import Link from "next/link";

const DynamicReactPlayer = dynamic(() => import('../src/components/VideoPlayer'), {
  ssr: false, // Render only on the client side
});

function HomePage() {

  const [playing, setPlaying] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true)

  const handlePlayVideo = () => {
    const section = document.getElementById("home-video");
    const header = document.getElementById("header"); // Replace "header" with the actual selector for your header element
    if (section && header) {
      const headerHeight = header.clientHeight;
      const sectionRect = section.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollToPosition = sectionRect.top + scrollTop - headerHeight;

      window.scrollTo({
        top: scrollToPosition,
        behavior: "smooth",
      });
      setPlaying(true);
      setHasStarted(true);

    }
  }


  return (

    <Layout loading={videoLoading}>
      <div className={pageStyles.homeContainer} id="home">
        <div id="home-video" className={pageStyles.aboutUsContainer}>
          <DynamicReactPlayer
            videoUrl="/videos/01_Intro.mp4"
            imageSrc="/images/home_banner.jpg"
            altText="Video Cover"
            loading={videoLoading}
            setVideoLoading={setVideoLoading}
            playing={playing}
            setPlaying={setPlaying}
            hasStarted={hasStarted}
            setHasStarted={setHasStarted}
          />
          <p>
            Welcome to Sustainable Business Program recycling training. There are six brief videos and associated quizzes to complete. There will be a final sorting task to test your knowledge. The training will take around 15 minutes in total.
            Once you have completed the training, you will receive confirmation and your organisation will be notified of your success.
          </p>
          <Link href="/training">
            <Button>Start training</Button>
          </Link>
        </div>
      </div>
      {/* <ContactUs /> */}
    </Layout >
  )
}

export default HomePage;
