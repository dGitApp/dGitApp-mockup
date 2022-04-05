import React from 'react';
import { NFTGalleryProps } from '../../NFTGallery';
import { OpenseaAsset } from '../../../../types/OpenseaAsset';
import { getAssetTitle, joinClassNames } from '../../../../library/utils';

import { Lightbox } from '../Lightbox/Lightbox';
import { TradingModal } from '../TradingModal/TradingModal';
import { providers } from "ethers";
import {Box, Image, VStack, Link} from '@chakra-ui/react'

import './gallery-item.css';

const ExternalLink: React.FC<{ href: string }> = ({ href, children }) => (
  <a
    className="rnftg-no-underline rnftg-text-black rnftg-text-gray-200"
    href={href}
    target="_blank"
    rel="noopener"
  >
    {children}
  </a>
);

export interface GalleryItemProps {
  asset: OpenseaAsset;
  index: number;
  WalletProvider: providers.Web3Provider | undefined;
  metadataIsVisible: NFTGalleryProps['metadataIsVisible'];
  hasTransferMode: NFTGalleryProps['hasTransferMode']
  hasLightbox: NFTGalleryProps['hasLightbox'];
  setLightboxIndex: (nextIndex: number) => void;
  increaseLightboxIndex: () => void;
  decreaseLightboxIndex: () => void;
}

export const GalleryItem: React.FC<GalleryItemProps> = ({
  asset,
  index,
  WalletProvider,
  metadataIsVisible,
  hasTransferMode,
  hasLightbox,
  setLightboxIndex,
  increaseLightboxIndex,
  decreaseLightboxIndex,
}) => {
  const assetTitle = getAssetTitle(asset);

  const renderAssetMedia = () => {
    // No media present -> render the name/tokenId as a placeholder.
    if (!asset.image_preview_url) {
      return (
        <div className='img-container'>
          {assetTitle}
        </div>
      );
    }

    const assetMediaExt = asset.image_preview_url.split('.').pop();
    if (assetMediaExt === 'mp4') {
      return (
        <video
          src={asset.image_preview_url}
          preload="auto"
          controlsList="nodownload"
          autoPlay
          loop
          playsInline
          className='img-video'
        ></video>
      );
    }
    return (
        <img
          src={asset.image_preview_url}
          alt={asset.name}
          loading="lazy"
          className='img-video'
        />
    );
  };

  return (
    <Box
    margin={1}
    width={400}
    >
      <VStack>
        {metadataIsVisible && asset.collection.image_url &&  (
              <Box
              position="relative"
              right="110px"
              top='50px'
              height="4.2rem"
              width="4.2rem"
              borderRadius="2.1rem"
              border="2px solid transparent"
              borderColor="black"
              bg="black"
              zIndex={3}
              >
                <Image 
                  src={asset.collection.image_url}
                  alt={asset.collection.name}
                  borderRadius = '50%'
              />
              </Box>
          )
        }
        <Box
          height='-webkit-max-content'
        >
         <Link
            onClick={() => setLightboxIndex(index)}
            href={`#lightbox-${index}`}
          >
           {renderAssetMedia()}
          </Link>
        </Box>

        {metadataIsVisible && 
          <Box
            position='relative'
            top={-12}
            borderRadius={8}
            padding = {1}
            textAlign = 'center'
            backgroundColor= 'white'
          > 
            <ExternalLink href={asset.permalink}>{assetTitle}</ExternalLink>
          </Box>
        }
      
        {hasLightbox && hasTransferMode === false && (
        <Lightbox
          index={index}
          asset={asset}
          increaseLightboxIndex={increaseLightboxIndex}
          decreaseLightboxIndex={decreaseLightboxIndex}
        />
        )}

        {hasTransferMode && WalletProvider !== undefined && (
        <TradingModal
          index={index}
          asset={asset}
          provider = {WalletProvider}
        />
        )}
      </VStack>
    </Box>
  );
};
