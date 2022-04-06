import React from 'react';
import { NFTGalleryProps } from '../../NFTGallery';
import { OpenseaAsset } from '../../../../types/OpenseaAsset';
import { getAssetTitle } from '../../../../library/utils';

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
        <div className='item-container'>
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
        />
    );
  };

  return (
    <div className='container'>
      <VStack>
        <div className='item-container'>
          {metadataIsVisible && asset.collection.image_url &&  (
              <div className='token-logo'>
                <Image 
                  src={asset.collection.image_url}
                  alt={asset.collection.name}
                  borderRadius = '50%'
              />
              </div>
              )
            }
          
          <Link
            onClick={() => setLightboxIndex(index)}
            href={`#lightbox-${index}`} 
          >
               {renderAssetMedia()}
          </Link>
          
          {metadataIsVisible && 
            <div className='token-id'> 
              <ExternalLink href={asset.permalink}>{assetTitle}</ExternalLink>
            </div>
          }
        </div>

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
    </div>
  );
};
