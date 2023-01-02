import firebaseAdmin from "./admin";

const bucket = firebaseAdmin.storage().bucket('gs://get-a-pet-85cb9.appspot.com')

export default bucket;