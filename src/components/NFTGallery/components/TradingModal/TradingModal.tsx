import React, { useState } from 'react';
import './Trading-Modal.css'
import { OpenseaAsset } from '../../../../types/OpenseaAsset';
import {MdSell} from 'react-icons/md'
import { NftSwapV4, SwappableAsset} from '@traderxyz/nft-swap-sdk';
import {SignedERC721OrderStruct} from '@traderxyz/nft-swap-sdk/src/sdk/v4/types'
import { providers } from "ethers";
import swal from 'sweetalert';



export interface TradingModalProps {
    asset: OpenseaAsset;
    index: number;
    provider: providers.Web3Provider;
}

export const TradingModal: React.FC<TradingModalProps> = ({
    asset,
    index,
    provider
}) => {

    const [price, setPrice] = useState<number>(0)

    async function makeTrade() {
      const NFTtoTradeMaker: SwappableAsset = 
      {
        tokenAddress: asset.asset_contract.address, // NFT contract address
        tokenId: asset.token_id,   // Token Id NFT
        type: "ERC721",   // Must be one of 'ERC20', 'ERC721', or 'ERC1155'
      }

      const ETHtoTradeTaker: SwappableAsset = {
        tokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        amount: String(price*1e18),
        type: 'ERC20',
      }

      const signer = provider.getSigner()
      const walletAddressMaker = await signer.getAddress()
      const CHAIN_ID = await signer.getChainId()
      const nftSwapSdk = new NftSwapV4(provider, signer, CHAIN_ID);

      // Check if we need to approve the NFT for swapping
      const approvalStatusForUserA = await nftSwapSdk.loadApprovalStatus(
        NFTtoTradeMaker,
        walletAddressMaker
      );
      // If we do need to approve User A's nft for swapping, let's do that now
      if (!approvalStatusForUserA.contractApproved) {
          const approvalTx = await nftSwapSdk.approveTokenOrNftByAsset(
            NFTtoTradeMaker,
            walletAddressMaker
          );
      
        const approvalTxReceipt = await approvalTx.wait();
        console.log(`Approved ${NFTtoTradeMaker.tokenAddress} contract to swap with 0x v4 (txHash: ${approvalTxReceipt.transactionHash})`);
      }
      
      const order = nftSwapSdk.buildOrder(
        NFTtoTradeMaker,
        ETHtoTradeTaker,
        walletAddressMaker,
        { 
          taker: '0xa5A44E8e1E6F09dA3E69EA77FBfd1c56835074Fa',
        }
      );

      const signedOrder = (await nftSwapSdk.signOrder(order)) as SignedERC721OrderStruct;
      const postedOrder = nftSwapSdk.postOrder(signedOrder, String(CHAIN_ID))

      alert({postedOrder})
      
      swal({
          title: "Done!",
          text: "Offer created",
          icon: "success",
          timer: 2000,
        })

      window.location.assign('#lightbox-untarget');
    }

    function handleTransaction() {
      makeTrade()
    }

    return (
        <div
        id={`lightbox-${index}`}
        className="perfundo__overlay"
        onClick={() => {
          window.location.assign('#lightbox-untarget');
        }}
      >
        <figure
          className="perfundo__figure"
          onClick={(evt) => {
            // Prevents clicks on the image triggering `#lightbox-untarget`.
            evt.stopPropagation();
          }}
        >
              <div className="perfundo__figtitle"> Make Offer </div>
              <img className="perfundo__image" src={asset.image_url} loading="lazy" alt='' />
              <div className='perfundo__figcaption'>
                <input  className='perfundo__inputbox' 
                        placeholder='Amount...'
                        type = 'number'
                        min = '0'
                        step= '0.01'
                        onChange={(event)=>{setPrice(Number(event.target.value))}}
                />
                <MdSell size = {30} onClick={handleTransaction}  style={{cursor:'pointer', margin: 5}}/>
              </div>              
        </figure>
      </div>
    )
}