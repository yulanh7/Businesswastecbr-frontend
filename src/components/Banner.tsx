import React, { ReactNode } from 'react';
import { Button } from "react-bootstrap";
import dynamic from 'next/dynamic';
import pageStyles from "../styles/page.module.scss";

const DynamicReactPlayer = dynamic(() => import('./VideoPlayer'), {
  ssr: false, // Render only on the client side
});

interface TopBannerProps {
  children: ReactNode;
  screen: string;
}

const TopBanner = ({ children, screen }: TopBannerProps) => {

  return (
    <div className={screen == "lg" ? `${pageStyles.lgBanner}` : `${pageStyles.mdBanner}`}>
      <div className={pageStyles.banner} >
        <div className={`${pageStyles.innerContainer} ${pageStyles.fadeInRadial}`}>
          {children}
        </div>

      </div>
      <div className={pageStyles.triangleDivider}>

        <div className={pageStyles.triangle}></div>
      </div>
    </div>
  )
};

export default TopBanner;