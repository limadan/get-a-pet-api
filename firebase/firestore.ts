import firebaseAdmin from "./admin";
import { User } from "../src/converters/User";
import { Pet } from "../src/converters/Pet";
import { Adoption } from "../src/converters/Adoption";


const userConverter = {
    toFirestore: (data: User) => data,
    fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => ({id: snap.id, ...snap.data()} as User)
}

const petConverter = {
    toFirestore: (data: Pet) => data,
    fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => ({id: snap.id, ...snap.data()} as Pet)
}

const adoptionConverter = {
    toFirestore: (data: Adoption) => data,
    fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => ({id: snap.id, ...snap.data()} as Adoption)
}


const db = {
    users: firebaseAdmin.firestore().collection('users').withConverter(userConverter),
    adoptions: firebaseAdmin.firestore().collection('adoptions').withConverter(adoptionConverter),
    pets: firebaseAdmin.firestore().collection('pets').withConverter(petConverter)
}

export default db;