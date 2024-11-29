export const GENERATE_KEYS = `
mutation{
    generateKeys{
      publicKey,
      privateKey
    }
  }
`;


export const POST_TRANSACTION = (metadata, asset) => {
  // Return the mutation
  return `mutation {
    postTransaction(data: {
      operation: "CREATE",
      amount: 1,
      signerPublicKey: "${metadata?.signerPublicKey}",
      signerPrivateKey: "${metadata?.signerPrivateKey}",
      recipientPublicKey: "${metadata?.recipientPublicKey}",
      asset: """{
        "data": ${asset}    
      }"""
    }) {
      id
    }
  }`;
};

export const FETCH_TRANSACTION = (signerPublicKey, recipientPublicKey) => `query { 
  getFilteredTransactions(filter: {
  ownerPublicKey:"${signerPublicKey}"
  recipientPublicKey:"${recipientPublicKey}"
  }){
  asset
  }
}`;


export const FETCH_ALL_TRANSACTIONS = () => `query { 
  getFilteredTransactions(filter: {
  ownerPublicKey:""
  recipientPublicKey:""
  }){
  id
  asset
  }
}`;

export const FETCH_ELECTION_BY_ID = (electionId) => `
  query {
    getTransaction(id: "${electionId}") {
      asset
    }
  }
`;

export const FETCH_ELECTIONS = () => `query {
  getSpecificDataStructure(
    filter: { ownerPublicKey: "", recipientPublicKey: "" },
    requiredKeys: ["title", "dates"]
  ) {
    id
    asset
    }
}`; 


export const FETCH_VOTES = (currentElectionId) => `query {
  getTransactionsByElectionId (
    filter: { ownerPublicKey: "", recipientPublicKey: "" },
    electionId: "${currentElectionId}"
  ) {
     id 
    asset
    }
}`;

