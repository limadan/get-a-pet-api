import db from "../../firebase/firestore";

interface CreatePetDTO {
    id?: string,
    user_id?: string,
    age: number,
    pet_image: string,
    weight: number,
    adopted?: boolean
}

export class PetRepository {
    public async create(pet: CreatePetDTO){
        const result = await db.pets.add(pet)
        return result.id
    }

    public async readOne(id: string) {
        const petRef = await db.pets.doc(id).get()
        if(!petRef.exists){
            return undefined
        }
        const pet = { id: petRef.id, ...petRef.data() }
        return pet
    }

    public async readAll() {
        const petsRef = await db.pets.get()
        const pets = petsRef.docs.map(doc=>{
            return {id: doc.id, ...doc.data()}
        })
        return pets
    }

    public async readByUserId(user_id: string){
        const petsRef = await db.pets.where('user_id', '==', user_id).get()
        const pets = petsRef.docs.map(doc=>{
            return {id: doc.id, ...doc.data()}
        })
        return pets
    }

    public async updateOne(pet: CreatePetDTO){
        const {id, ...petData} = pet
        if(!id){
            return undefined
        }

        await db.pets.doc(id).update(petData)
        
        return id
    }

    public async updatePetStatus(id: string){
        await db.pets.doc(id).update({adopted: true})
    }

    public async deleteOne(id: string){
        await db.pets.doc(id).delete()
    }
}