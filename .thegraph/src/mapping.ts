import { BigInt, ethereum } from "@graphprotocol/graph-ts"
import {
  Contract,
  BalancerPoked,
  BidReceived,
  ProceedsClaimed,
  Settled,
  TokenFracked,
  Contract__frackedTokensResult
} from "../generated/Fracker/Contract"
import { FrackedERC721 } from "../generated/schema"

function handleEvent(contractEntry: Contract__frackedTokensResult, entity: FrackedERC721 | null): void {
  if (entity == null) {
    return;
  }
  entity.nftContract = contractEntry.value0
  entity.nftId = contractEntry.value1
  entity.nftReceiver = contractEntry.value2
  entity.fracker = contractEntry.value3
  entity.frackTime = contractEntry.value4
  entity.token = contractEntry.value5
  entity.balancerPool = contractEntry.value6
  entity.balancerFlipDuration = contractEntry.value7
  entity.minAuctionBid = contractEntry.value8
  entity.minBidIncrease = contractEntry.value9
  entity.auctionDuration = contractEntry.value10
  entity.lastBidder = contractEntry.value11
  entity.lastBid = contractEntry.value12

  entity.save()
}

export function handleBalancerPoked(event: BalancerPoked): void {
  let entity = FrackedERC721.load(event.params.frackID.toString())
  if (entity == null) {
    entity = new FrackedERC721(event.params.frackID.toHex())
  }

  handleEvent(
    Contract.bind(event.address).frackedTokens(event.params.frackID),
    entity
  );
}

export function handleBidReceived(event: BidReceived): void {
  let entity = FrackedERC721.load(event.params.frackID.toString())
  if (entity == null) {
    entity = new FrackedERC721(event.params.frackID.toHex())
  }

  handleEvent(
    Contract.bind(event.address).frackedTokens(event.params.frackID),
    entity
  );
}

export function handleProceedsClaimed(event: ProceedsClaimed): void {
  let entity = FrackedERC721.load(event.params.frackID.toString())
  if (entity == null) {
    entity = new FrackedERC721(event.params.frackID.toHex())
  }

  handleEvent(
    Contract.bind(event.address).frackedTokens(event.params.frackID),
    entity
  );
}

export function handleSettled(event: Settled): void {
  let entity = FrackedERC721.load(event.params.frackID.toString())
  if (entity == null) {
    entity = new FrackedERC721(event.params.frackID.toHex())
  }

  handleEvent(
    Contract.bind(event.address).frackedTokens(event.params.frackID),
    entity
  );
}

export function handleTokenFracked(event: TokenFracked): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = FrackedERC721.load(event.params.frackID.toString())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (entity == null) {
    entity = new FrackedERC721(event.params.frackID.toHex())

    // Entity fields can be set using simple assignments
    // entity.count = BigInt.fromI32(0)
  }

  if (entity != null) {
    handleEvent(
      Contract.bind(event.address).frackedTokens(event.params.frackID),
      entity
    );
  }

}
