import db from '../../firebase/firestore'
import { User } from '../converters/User'

interface CreateUserDTO {
    id?: string,
    email: string,
    name: string,
    password: string,
    profile_image?: string
}

interface UpdateUserDTO {
    id: string,
    name: string,
    email: string,
    profile_image?: string
}

export class UserRepository {
    public async create(user: CreateUserDTO){
        const result = await db.users.add(user as User)
        return result.id
    }

    public async readOne(id: string) {
        const userRef = await db.users.doc(id).get()
        if(!userRef.exists){
            return undefined
        }
        const user = { id: userRef.id, ...userRef.data() }
        return user as User
    }

    public async readByEmail(email: string) {
        const user = (await db.users.where('email', '==', email).get()).docs[0]
    
        if(!user){
            return undefined
        }

        return {id: user.id, ...user.data() }
    }


    public async readAll() {
        const usersRef = await db.users.get()
        const users = usersRef.docs.map(doc=>{
            return {id: doc.id, ...doc.data()}
        })
        return users
    }

    public async updateOne(user:UpdateUserDTO){
        const {id, ...userData} = user
        if(!id){
            return undefined
        }

        await db.users.doc(id).update(userData)
        
        return id
    }

    public async deleteOne(id: string){
        await db.users.doc(id).delete()
    }
}