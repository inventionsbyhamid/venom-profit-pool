import { expect, use } from "chai";
import { Address, Contract, Signer, WalletTypes, lockliftChai, toNano } from "locklift";
import { FactorySource } from "../build/factorySource";
import { EverWalletAccount, WalletV3Account } from "everscale-standalone-client/nodejs";
import exp from "constants";
import { trace } from "console";

let profitPool: Contract<FactorySource["ProfitPool"]>;
let stakingHelper: Contract<FactorySource["StakingHelper"]>;
let signer: Signer;
let address1: Address;
let address2: Address;
use(lockliftChai);

describe("Test ProfitPool contract", async function () {
  before(async () => {
    signer = (await locklift.keystore.getSigner("0"))!;
    const { account: account1 } = await locklift.factory.accounts.addNewAccount({
      type: WalletTypes.EverWallet,
      publicKey: signer.publicKey,
      value: locklift.utils.toNano(5),
    });
    const { account: account2 } = await locklift.factory.accounts.addNewAccount({
      type: WalletTypes.WalletV3,
      publicKey: signer.publicKey,
      value: locklift.utils.toNano(5),
    });
    address1 = account1.address;
    address2 = account2.address;
  });
  describe("Contracts", async function () {
    it("Load contract factory", async function () {
      const ProfitPool = await locklift.factory.getContractArtifacts("ProfitPool");

      expect(ProfitPool.code).not.to.equal(undefined, "Code should be available");
      expect(ProfitPool.abi).not.to.equal(undefined, "ABI should be available");
      expect(ProfitPool.tvc).not.to.equal(undefined, "tvc should be available");
    });

    it("Deploy contract", async function () {
      const INIT_STATE = 0;
      const { contract, tx } = await locklift.factory.deployContract({
        contract: "ProfitPool",
        publicKey: signer.publicKey,
        initParams: {
          _nonce: locklift.utils.getRandomNonce(),
        },
        constructorParams: {
          ownerPubkey: "0x" + signer.publicKey,
        },
        value: locklift.utils.toNano(0.4),
      });
      profitPool = contract;

      expect(await locklift.provider.getBalance(profitPool.address).then(balance => Number(balance))).to.be.above(0);
    });

    it("Deploy StakingHelper and set it to ProfitPool", async function () {
      const { contract, tx } = await locklift.factory.deployContract({
        contract: "StakingHelper",
        publicKey: signer.publicKey,
        initParams: {
          _nonce: locklift.utils.getRandomNonce(),
        },
        constructorParams: {
          poolAddress: profitPool.address,
        },
        value: locklift.utils.toNano(0.3),
      });
      stakingHelper = contract;
      console.log("StakingHelper address: ", stakingHelper.address.toString());
      await profitPool.methods
        .setStakingHelper({ addr: stakingHelper.address })
        .sendExternal({ publicKey: signer.publicKey });
      console.log("StakingHelper address: ", (await profitPool.fields.stakingHelper()).toString());
      expect((await profitPool.fields.stakingHelper()).toString()).to.equal(stakingHelper.address.toString());
    });

    it("Deposit to contract", async function () {
      console.log(
        "Balance before deposit: ",
        await locklift.provider.getBalance(profitPool.address).then(balance => Number(balance)),
      );
      await profitPool.methods.deposit().send({ bounce: true, amount: locklift.utils.toNano(1.01), from: address1 });
      await profitPool.methods.deposit().send({ bounce: true, amount: locklift.utils.toNano(1.01), from: address2 });
      console.log("Balance after deposit: ", await locklift.provider.getBalance(profitPool.address));
      expect(parseInt(await locklift.provider.getBalance(profitPool.address))).to.be.above(2e9);
    });

    it("should initiateStake", async function () {
      console.log(
        "Balance before initiateStake: ",
        await locklift.provider.getBalance(profitPool.address).then(balance => Number(balance)),
      );
      await profitPool.methods
        .initiateStake()
        .send({ bounce: true, amount: locklift.utils.toNano(0.1), from: address1 });

      console.log("Balance after initiateStake: ", await locklift.provider.getBalance(profitPool.address));
      expect(parseInt(await locklift.provider.getBalance(profitPool.address))).to.be.below(1e9);
    });

    it("should initiateUnStake", async function () {
      console.log(
        "StakingHelper Balance before initiateUnStake: ",
        await locklift.provider.getBalance(stakingHelper.address).then(balance => Number(balance)),
      );
      console.log(
        "ProfitPool Balance before initiateUnStake: ",
        await locklift.provider.getBalance(profitPool.address),
      );
      console.log("Address1 Balance before initiateUnStake: ", await locklift.provider.getBalance(address1));
      const { traceTree } = await locklift.tracing.trace(
        profitPool.methods.initiateUnStake().send({ bounce: true, amount: locklift.utils.toNano(0.1), from: address1 }),
      );
      await traceTree?.beautyPrint();
      console.log(
        "StakingHelper Balance after initiateUnStake: ",
        await locklift.provider.getBalance(stakingHelper.address),
      );
      console.log("ProfitPool Balance after initiateUnStake: ", await locklift.provider.getBalance(profitPool.address));
      console.log("Address1 Balance after initiateUnStake: ", await locklift.provider.getBalance(address1));
      expect(parseInt(await locklift.provider.getBalance(stakingHelper.address))).to.be.below(1e9);
    });

    this.afterAll(function () {
      console.log(`contract address: ${profitPool.address.toString()}`);
    });
  });
});
