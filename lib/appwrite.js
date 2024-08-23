import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.srijanid.aora',
    projectId: '66c71b01003164c42ebd',
    databaseId: '66c71e2a001ced7d22a8',
    userCollectionId: '66c71e76002ae4946cc7',
    videoCollectionId: '66c71ecf0035cda8fc07',
    storageId: '66c7216e001da14e6bdb'
}


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.
;
const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);


// Register User
export const createUser = async (email,password,username) => {
    try {
        const newAccount = await account.create(
          ID.unique(),
          email,
          password,
          username
        );
    
        if (!newAccount) throw Error;
    
        const avatarUrl = avatars.getInitials(username);
    
        await signIn(email, password);
    
        const newUser = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          ID.unique(),
          {
            accountId: newAccount.$id,
            email: email,
            username: username,
            avatar: avatarUrl,
          }
        );
    
        return newUser;
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
}

// Sign In
export async function signIn(email, password) {
    try {
      // Ensure no existing session is active
      const session = await account.getSession('current');
      if (session) {
        await account.deleteSession('current');
      }
      const newSession = await account.createEmailPasswordSession(email, password);
  
      return newSession;
    } catch (error) {
      throw new Error(error);
    }
  }

// Get Current User
export async function getCurrentUser() {
    try {
      const currentAccount = await account.get();
      if (!currentAccount) throw Error;
  
      const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );
  
      if (!currentUser) throw Error;
  
      return currentUser.documents[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  }

// Get all video Posts
export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get latest created video posts
export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get video posts that matches search query
export async function searchPosts(query) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("title", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}