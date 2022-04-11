import React, {useEffect, useState } from 'react';
import InView from 'react-intersection-observer';

import { GalleryItem } from './components/GalleryItem/GalleryItem';
import { OpenseaAsset } from '../../types/OpenseaAsset';
import { isEnsDomain } from '../../library/utils';
import {
  Box,
  HStack
} from '@chakra-ui/react'

import {
  fetchOpenseaAssets,
  OPENSEA_API_OFFSET,
  resolveEnsDomain,
} from '../../library/api';

import { providers } from "ethers";
import { useLightboxNavigation } from './hooks/useLightboxNavigation';

export interface NFTGalleryProps {
  /**
   * Ethereum address (`0x...`) or ENS domain (`vitalik.eth`) for which the gallery should contain associated NFTs.
   * Required.
   */
  ownerAddress: string;

  /**
   * OpenSea API key, which is required for non-trivial use cases of the OpenSea API's `/assets` endpoint.
   * See the endpoint's documentation for more information: https://docs.opensea.io/reference/getting-assets
   */
  openseaApiKey?: string;

    /**
     * wallet provider to validate/create the transaction
   */
  walletProvider?: providers.Web3Provider | undefined;
  /**
   * Display asset metadata underneath the NFT.
   * Defaults to `true`.
   */
  metadataIsVisible?: boolean;

  /**
   *  Transfer Options available
   *  Activate P2P trading features
   *  default to 'true'
   */

   hasTransferMode?: boolean;

  /**
   * Display gallery in dark mode.
   * Defaults to `false`.
   */
  darkMode?: boolean;

  /**
   * Display gallery in showcase mode. Only NFTs specified in `showcaseItemIds` will be rendered.
   * Defaults to `false`.
   */
  showcaseMode?: boolean;

  /**
   * An array of IDs for assets that should be displayed when `showcaseMode` is active.
   * Each ID is formed by combining the asset's contract address and the asset's own tokenId: `{:assetContractAddress}/{:tokenId}`
   *
   * For example:
   *
   * ```jsx
   * showcaseItemIds={["0xabcdef.../123", "0xa1b2c3.../789"]}
   * ```
   */
  showcaseItemIds?: string[];

  /**
   * Enables/disables the lightbox being shown when a gallery item is clicked/tapped.
   * Defaults to `true`.
   */
  hasLightbox?: boolean;
}

export const NFTGallery: React.FC<NFTGalleryProps> = ({
  ownerAddress = '',
  openseaApiKey = '',
  walletProvider = undefined,
  darkMode = false,
  metadataIsVisible = true,
  hasTransferMode = true,
  showcaseMode = false,
  showcaseItemIds,
  hasLightbox = true
}) => {

  const [assets, setAssets] = useState([] as OpenseaAsset[]);
  const [showcaseAssets, setShowcaseAssets] = useState([] as OpenseaAsset[]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    lightboxIndex,
    setLightboxIndex,
    decreaseLightboxIndex,
    increaseLightboxIndex,
  } = useLightboxNavigation(assets.length - 1);

  const displayedAssets = showcaseMode ? showcaseAssets : assets;

  const loadAssets = async (
    ownerAddress: NFTGalleryProps['ownerAddress'],
    apiKey: NFTGalleryProps['openseaApiKey'],
    offset: number
  ) => {
    setIsLoading(true);
    const owner = isEnsDomain(ownerAddress)
      ? await resolveEnsDomain(ownerAddress)
      : ownerAddress;
    const rawAssets = await fetchOpenseaAssets({
      owner,
      apiKey,
      offset,
    });
    setAssets((prevAssets) => [...prevAssets, ...rawAssets]);
    setCanLoadMore(rawAssets.length === OPENSEA_API_OFFSET);
    setIsLoading(false);
  };

  const loadShowcaseAssets = async (
    ownerAddress: NFTGalleryProps['ownerAddress'],
    apiKey: NFTGalleryProps['openseaApiKey']
  ) => {
    setIsLoading(true);
    // Stop if we already have 1000+ items in play.
    const MAX_OFFSET = OPENSEA_API_OFFSET * 20;
    const owner = isEnsDomain(ownerAddress)
      ? await resolveEnsDomain(ownerAddress)
      : ownerAddress;

    let shouldFetch = true;
    let currentOffset = 0;

    // Grab all assets of this address to filter down to showcase-only.
    // TODO: optimise this to exit as soon as all showcase items have been resolved.
    while (shouldFetch) {
      const rawAssets = await fetchOpenseaAssets({
        owner,
        apiKey,
        offset: currentOffset,
      });
      setAssets((prevAssets) => [...prevAssets, ...rawAssets]);
      currentOffset += OPENSEA_API_OFFSET;
      if (rawAssets.length !== 0) setIsLoading(false);

      // Terminate if hit the global limit or we hit a non-full page (i.e. end of assets).
      if (
        rawAssets.length < OPENSEA_API_OFFSET ||
        currentOffset >= MAX_OFFSET
      ) {
        shouldFetch = false;
        setIsLoading(false);
      }
    }
  };

  const updateShowcaseAssets = (
    allAssets: OpenseaAsset[],
    itemIds: string[]
  ) => {
    const nextShowcaseAssets = allAssets.filter((asset) =>
      itemIds.includes(`${asset.asset_contract.address}/${asset.token_id}`)
    );
    setShowcaseAssets(nextShowcaseAssets);
  };

  const onLastItemInView = (isInView: boolean) => {
    if (isInView) {
      setCurrentOffset((prevOffset) => prevOffset + OPENSEA_API_OFFSET);
    }
  };

  // TODO: Move into `Lightbox` component once its refactored to being a singleton.
  const handleKeydownEvent = (evt: KeyboardEvent) => {
    const hasActiveLightbox =
      window.location.hash.includes('lightbox-') &&
      window.location.hash !== '#lightbox-untarget';

    if (!hasActiveLightbox) {
      return;
    }

    switch (evt.key) {
      case 'ArrowLeft':
        return decreaseLightboxIndex();
      case 'ArrowRight':
        return increaseLightboxIndex();
      case 'Escape':
        return window.location.assign(`#lightbox-untarget`);
      default:
        break;
    }
  };

  // Handles fetching of assets via OpenSea API.
  useEffect(() => {
    if (showcaseMode) {
      loadShowcaseAssets(ownerAddress, openseaApiKey);
    } else {
      loadAssets(ownerAddress, openseaApiKey, currentOffset);
    }
  }, [showcaseMode, ownerAddress, openseaApiKey, currentOffset]);

  // Isolates assets specified for showcase mode into their own collection whenever `assets` changes.
  useEffect(() => {
    if (assets.length !== 0 && showcaseMode && Array.isArray(showcaseItemIds)) {
      updateShowcaseAssets(assets, showcaseItemIds);
    }
  }, [assets, showcaseMode, showcaseItemIds]);

  // Binds/unbinds keyboard event listeners.
  useEffect(() => {
    document.addEventListener('keydown', handleKeydownEvent);
    return () => {
      document.removeEventListener('keydown', handleKeydownEvent);
    };
  }, [assets, lightboxIndex]);

  return (
  <Box        
    display="flex"
    alignItems="center"
    overflowX='scroll'
    marginBottom={10}
    sx={{
      '&::-webkit-scrollbar': {
        width: '16px',
        borderRadius: '8px',
        backgroundColor: `rgba(255, 255, 0, 0.05)`,
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: `rgba(255, 255, 255, 0.05)`,
      },
    }}
  >
    <HStack spacing={8}>
      {displayedAssets.length === 0 && isLoading
            ? <div />
            : displayedAssets.map((asset, index) => {
                const item = (
                  <GalleryItem
                    key={asset.id}
                    index={index}
                    asset={asset}
                    WalletProvider={walletProvider}
                    metadataIsVisible={metadataIsVisible}
                    hasTransferMode = {hasTransferMode}
                    hasLightbox={hasLightbox}
                    setLightboxIndex={setLightboxIndex}
                    increaseLightboxIndex={increaseLightboxIndex}
                    decreaseLightboxIndex={decreaseLightboxIndex}
                  />
                );
                const isLastItemInPage =
                  (index + 1) % OPENSEA_API_OFFSET === 0;
                return isLastItemInPage ? (
                  <InView
                    triggerOnce
                    onChange={onLastItemInView}
                    key={asset.id}
                  >
                    {item}
                  </InView>
                ) : (
                  item
                );
              })}
    </HStack>
    
    </Box>
  );
};
