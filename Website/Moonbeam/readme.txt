
# How everything works
## Creating charity event and Donating NFT
On AcalaGift a event manager can create an auction charity event with the deadline and wallet address. It will ask Universal Profile Extension to confirm. After that, all the created charity eevnt will show in donation page. On any of these charity event users can go into Auction page. There donators can donate(or mint) their NFTs with a given bid price to that charity event. So, that other donators can bid on that NFT. 

## Distributing the NFTs to the highest bidders
When the auction deadline is ended then the charity event status shows "Waiting for NFTs release". At that moment, only the owner can view this auction page. And owner can finish the Auction and transfer the NFTs to won highest bidders by clicking "Distribute NFTs". It will ask for UP confirmation. After aporving it all the money will be transfered to the Event wallet address. And the Auction will be end. 

## User profile
https://<host>:3000/user/<address> 
Here address is the user wallet address. On this page user can see user details as well as NFTs owned by him. 

### NFTs
    Here user can see all his won NFTs from the charity events. Here has 2 types of NFTs. They are Own NFT and Gifted NFT. 
        Own NFT:
            He can send NFT as Giftcard to a recipient. On the Send as Gift Card modal, there has Recipient address, message, Font type, And the name. After changes this he can also preview the gift card and send his Gift card.
        Gifted NFT:
            If anyone has sent the Gift card, then he can see there a button called Unwrap gift card. And here he can see the Gift card in preview. After wraping it he got the authority to send it to another person as Gift card.


 