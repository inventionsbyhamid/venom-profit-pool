async function main() {
  const signer = (await locklift.keystore.getSigner("0"))!;
  console.log("Starting contract deployment...");

  const { contract: sample, tx } = await locklift.factory.deployContract({
    contract: "ProfitPool",
    publicKey: signer.publicKey,
    initParams: {
      _nonce: locklift.utils.getRandomNonce(),
    },
    constructorParams: {
      ownerPubkey: "0x" + signer.publicKey,
    },
    value: locklift.utils.toNano(0.3),
  });

  console.log(`Deployed at: ${sample.address.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
